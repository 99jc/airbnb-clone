from fastapi import APIRouter, Depends, Response, status, HTTPException, Request
from fastapi.responses import HTMLResponse
from datetime import datetime, timedelta, timezone
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import or_
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from ..schema import Email, Account, Credential, Login, Token, User, TokenData
from fastapi.responses import RedirectResponse
from .. import models
from ..database import get_db
import os
import jwt
import requests
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env.local"
load_dotenv(env_path)
SECRET_KEY = os.getenv("SECRET_KEY", "default_value")
GOOGLE_CLIENT_ID = os.getenv("NEXT_PUBLIC_GOOGLE_CLIENT_ID", "default_value")
GOOGLE_CLIENT_SECRET = os.getenv("NEXT_PUBLIC_GOOGLE_CLIENT_SECRET", "default_value")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + expires_delta(minutes = 15)
    to_encode.update({ "exp": expire })
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt
"""
파이썬은 기본값이 있는 매개변수를 항상 뒤에 배치해야 한다.
"""
@router.post("/email", status_code=status.HTTP_200_OK)
async def searchAccountByEmail(request: Email, response: Response, db: Session=Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.email == request.email).first()
    if not account:
        response.status_code = status.HTTP_404_NOT_FOUND
        return { "detail": f"Account with {request.email} not Exist!" }
    return { "message": "Account is Exist!" }

@router.post("/signUp/credential", status_code=status.HTTP_201_CREATED, response_model=Credential)
async def credentialSignUp(request: Account, db: Session=Depends(get_db)):
    birthDay = f"{request.birthYear}-{request.birthMonth}-{request.birthDay}"
    hashedPassword = get_password_hash(request.password)
    new_account = models.Account(email=request.email, name=request.name, familyName=request.familyName, password=hashedPassword, birthDay=birthDay, personalInformation=request.personalInformation, receiveEmail=request.receiveEmail, disabled=False, google=None)
    db.add(new_account)
    db.commit()
    return request

@router.post("/token")
async def login_for_access_token(response: Response, request: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    account = db.query(models.Account).filter(models.Account.email == request.username).first()
    if not account:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f"Invalid Credentials")
    if verify_password(request.password, account.password) == False:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f"Incorrect Password")

    access_token_expires = timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data = { "sub": account.id }, expires_delta = access_token_expires
    )

    response.set_cookie(
        key = "access_token",
        value = access_token,
        httponly = True,
        secure = False,
        samesite = "Lax"
    )
    return { "message": "Login Successfull" }

async def get_current_account(db: Annotated[Session, Depends(get_db)], token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload.get("sub")
        if id is None:
            raise credentials_exception
        token_data = TokenData(id=id)
    except InvalidTokenError:
        raise credentials_exception
    account = db.query(models.Account).filter(or_(models.Account.id == id, models.Account.google == id)).first()
    if account is None:
        raise credentials_exception
    return account

async def get_current_active_user(
    current_account: Annotated[models.Account, Depends(get_current_account)],
):
    if current_account.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_account

@router.get("/me", response_model = User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user

@router.post("/logout")
async def logout(response: Response, request: Request):
    response.delete_cookie("access_token", path="/")
    return { "message": "Logged out" }


@router.get("/google/callback")
async def google_callback(code: str, response: Response, db:Annotated[Session, Depends(get_db)]):
    if not code:
        raise HTTPException(status_code = 400, detail = "Code not found")
    token_res = requests.post("https://oauth2.googleapis.com/token", data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "redirect_uri": "http://localhost:3000/api/auth/google/callback",
        "grant_type": "authorization_code"
    },).json()

    access_token = token_res.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token")
    
    # Google에서 유저 정보 가져오기
    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()

    account = db.query(models.Account).filter(models.Account.email == user_info["email"]).first()

    if account:
        if user_info["id"] != account.google:
            account.google = user_info["id"]
            account.image = user_info["picture"]
            db.commit()
    else:
        googleUser = models.Account(email=user_info["email"], picture=user_info["picture"], name=user_info["given_name"], familyName=user_info["family_name"], password=None, birthDay=None, personalInformation=True, receiveEmail=False, disabled=False, google=user_info["id"])
        db.add(googleUser)
        db.commit()

    access_token_expires = timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data = { "sub": user_info["id"] }, expires_delta = access_token_expires
    )

    redirect = RedirectResponse(url="/")
    redirect.set_cookie(
        key = "access_token",
        value = access_token,
        httponly = True,
        secure = False,
        samesite = "Lax",
    )
    return redirect