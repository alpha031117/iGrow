from typing import Optional, Literal
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.financing import FinancingProduct, FinancingPackage
from app.schemas.financing import FinancingPlanListResponse

router = APIRouter(prefix="/financing-plans", tags=["financing"])


@router.get("", response_model=FinancingPlanListResponse)
def list_financing_plans(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    repayment_type: Optional[Literal["revenue_based", "fixed_instalment"]] = Query(
        None, description="Filter by repayment type"
    ),
    db: Session = Depends(get_db),
):
    query = db.query(FinancingProduct).options(
        joinedload(FinancingProduct.packages).joinedload(FinancingPackage.deduction_tiers)
    )

    if is_active is not None:
        query = query.filter(FinancingProduct.is_active == is_active)
    if repayment_type is not None:
        query = query.filter(FinancingProduct.repayment_type == repayment_type)

    query = query.order_by(FinancingProduct.tier_number)

    products = query.all()

    return FinancingPlanListResponse(data=products, total=len(products))
