from datetime import datetime
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel


class DeductionRateTierOut(BaseModel):
    id: str
    loan_amount_min: Decimal
    loan_amount_max: Decimal
    deduction_rate: Decimal

    model_config = {"from_attributes": True}


class FinancingPackageOut(BaseModel):
    id: str
    name: str
    eligible_criteria: str | None
    loan_min: Decimal
    loan_max: Decimal
    repayment_cap_months: int
    min_txn_history_months: int
    is_active: bool
    deduction_tiers: list[DeductionRateTierOut]

    model_config = {"from_attributes": True}


class FinancingPlanOut(BaseModel):
    id: str
    name: str
    tier_number: int
    tier_name: str
    description: str | None
    repayment_type: Literal["revenue_based", "fixed_instalment"]
    is_active: bool
    created_at: datetime
    packages: list[FinancingPackageOut]

    model_config = {"from_attributes": True}


class FinancingPlanListResponse(BaseModel):
    data: list[FinancingPlanOut]
    total: int
