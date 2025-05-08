import uvicorn

from fastapi import FastAPI, Depends, Response, status
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .router import auth, hosting

app = FastAPI(
    prefix="/api"
)

models.Base.metadata.create_all(engine)

app.include_router(auth.router)
app.include_router(hosting.router)
