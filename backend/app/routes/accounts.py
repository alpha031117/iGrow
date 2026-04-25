from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Account

router = APIRouter(prefix="/accounts", tags=["accounts"])


class AccountOut(BaseModel):
    id: str
    account_number: str
    balance: Decimal
    currency: str

    model_config = {"from_attributes": True}


@router.get("/{account_id}", response_model=AccountOut)
def get_account(account_id: str, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account
