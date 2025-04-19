from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Email(BaseModel):
    email: str

class Account(BaseModel):
    email: str
    password: str
    name: str
    familyName: str
    birthYear: int
    birthMonth: int
    birthDay: int
    personalInformation: bool
    receiveEmail: bool

class Credential(BaseModel):
    email: str
    password: str
    class Config():
        from_attributes = True #orm_mode -> from_attributes

class Token(BaseModel) :
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: str

class Login(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: str
    email: Optional[str] = None
    picture: Optional[str] = None
    name: Optional[str] = None
    familyName: Optional[str] = None