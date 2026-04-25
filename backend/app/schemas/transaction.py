from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional
from pydantic import BaseModel


class CategoryOut(BaseModel):
    id: str
    name: str
    type: Literal["income", "expense"]
    icon_color: str

    model_config = {"from_attributes": True}


class TransactionOut(BaseModel):
    id: str
    account_id: str
    title: str
    amount: Decimal
    direction: Literal["credit", "debit"]
    status: Literal["completed", "pending", "failed"]
    transacted_at: datetime
    created_at: datetime
    category: CategoryOut

    model_config = {"from_attributes": True}


class TransactionListResponse(BaseModel):
    data: list[TransactionOut]
    total: int
    limit: int
    offset: int
