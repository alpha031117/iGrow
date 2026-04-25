from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionListResponse

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=TransactionListResponse)
def list_transactions(
    account_id: Optional[str] = Query(None, description="Filter by account ID"),
    direction: Optional[str] = Query(None, description="Filter by direction: credit or debit"),
    status: Optional[str] = Query(None, description="Filter by status: completed, pending, or failed"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    db: Session = Depends(get_db),
):
    query = db.query(Transaction).options(joinedload(Transaction.category))

    if account_id:
        query = query.filter(Transaction.account_id == account_id)
    if direction:
        query = query.filter(Transaction.direction == direction)
    if status:
        query = query.filter(Transaction.status == status)

    total = query.count()
    transactions = (
        query.order_by(Transaction.transacted_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return TransactionListResponse(
        data=transactions,
        total=total,
        limit=limit,
        offset=offset,
    )
