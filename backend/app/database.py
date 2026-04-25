import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/brisval_db",
)

# Build SSL connect args — if SSL_CA is provided, verify against the cert;
# otherwise enable SSL without cert verification (still encrypted).
_ssl_ca = os.getenv("SSL_CA")
if _ssl_ca:
    _ssl_args = {"ssl": {"ca": _ssl_ca}}
else:
    _ssl_args = {"ssl": {"check_hostname": False, "verify_mode": 0}}

engine = create_engine(DATABASE_URL, connect_args=_ssl_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
