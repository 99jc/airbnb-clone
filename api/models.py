from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import DateTime, text, Boolean, ForeignKey, JSON, FLOAT, Enum as SQLEnum
from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from enum import Enum
import datetime
import uuid

class RoomTypeEnum(str, Enum):
    EntireSpace = "EntireSpace"
    Room = "Room"
    SharedRoom = "SharedRoom"

class Base(DeclarativeBase):
    pass

"""
Mapped은 타입스크립트처럼 타입을 정할 수 있음
"""
class Account(Base):
    __tablename__ = "Account"
    id: Mapped[str] = mapped_column(String(36), primary_key = True, default = lambda: str(uuid.uuid4()))
    email: Mapped[Optional[str]] = mapped_column(String(30), nullable = True)
    picture: Mapped[Optional[str]] = mapped_column(String(255), nullable = True)
    name: Mapped[str] = mapped_column(String(30))
    familyName: Mapped[str] = mapped_column(String(10))
    password: Mapped[Optional[str]] = mapped_column(String(255), nullable = True)
    birthDay: Mapped[Optional[datetime]] = mapped_column(DateTime,nullable = True)
    personalInformation: Mapped[bool] = mapped_column(Boolean)
    receiveEmail: Mapped[bool] = mapped_column(Boolean)
    disabled: Mapped[bool] = mapped_column(Boolean)
    google: Mapped[str] = mapped_column(String(255), unique=True, nullable = True)

class Place(Base):
    __tablename__ = "Place"
    id: Mapped[str] = mapped_column(String(36), primary_key = True, default = lambda: str(uuid.uuid4()))
    host: Mapped[str] = mapped_column(String(36), ForeignKey(Account.id), nullable = False)
    tag: Mapped[str] = mapped_column(String(10), nullable = True)
    roomType: Mapped[str] = mapped_column(SQLEnum(RoomTypeEnum), nullable = True)
    pictures: Mapped[list[str]] = mapped_column(JSON, nullable = False, default = list)
    stars: Mapped[float] = mapped_column(FLOAT, nullable = False, default = 0.0)

    account = relationship("Account", backref="places")