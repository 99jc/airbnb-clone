from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pymysql

pymysql.install_as_MySQLdb()
MYSQL_URL = "mysql+mysqldb://root:q07060706@localhost:3306/airbnb_clone"

engine = create_engine(MYSQL_URL)

SessionLocal = sessionmaker(bind=engine)

"""
Python의 yield는 **제너레이터(generator)**를 만드는 역할을 함.
yield가 호출되면 함수 실행이 멈추고, 값을 반환함.
다음에 다시 호출되면 이전 상태에서 실행을 계속함.
"""

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()