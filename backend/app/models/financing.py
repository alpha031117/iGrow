from sqlalchemy import Column, String, Numeric, Enum, DateTime, Date, Text, SmallInteger, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class FinancingProduct(Base):
    __tablename__ = "financing_products"

    id = Column(String(36), primary_key=True)
    name = Column(String(200), nullable=False)
    tier_number = Column(SmallInteger, nullable=False)
    tier_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    repayment_type = Column(Enum("revenue_based", "fixed_instalment"), nullable=False, default="revenue_based")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    packages = relationship("FinancingPackage", back_populates="product")


class FinancingPackage(Base):
    __tablename__ = "financing_packages"

    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("financing_products.id"), nullable=False)
    name = Column(String(100), nullable=False)
    eligible_criteria = Column(Text, nullable=True)
    loan_min = Column(Numeric(15, 2), nullable=False)
    loan_max = Column(Numeric(15, 2), nullable=False)
    repayment_cap_months = Column(SmallInteger, nullable=False)
    min_txn_history_months = Column(SmallInteger, nullable=False, default=6)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    product = relationship("FinancingProduct", back_populates="packages")
    deduction_tiers = relationship("DeductionRateTier", back_populates="package")
    loan_applications = relationship("LoanApplication", back_populates="package")


class DeductionRateTier(Base):
    __tablename__ = "deduction_rate_tiers"

    id = Column(String(36), primary_key=True)
    package_id = Column(String(36), ForeignKey("financing_packages.id"), nullable=False)
    loan_amount_min = Column(Numeric(15, 2), nullable=False)
    loan_amount_max = Column(Numeric(15, 2), nullable=False)
    deduction_rate = Column(Numeric(5, 2), nullable=False)
    created_at = Column(DateTime, nullable=False)

    package = relationship("FinancingPackage", back_populates="deduction_tiers")


class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    package_id = Column(String(36), ForeignKey("financing_packages.id"), nullable=False)
    requested_amount = Column(Numeric(15, 2), nullable=False)
    approved_amount = Column(Numeric(15, 2), nullable=True)
    outstanding_balance = Column(Numeric(15, 2), nullable=True)
    status = Column(
        Enum("pending", "approved", "rejected", "active", "settled", "defaulted"),
        nullable=False,
        default="pending",
    )
    applied_at = Column(DateTime, nullable=False)
    approved_at = Column(DateTime, nullable=True)
    settled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    package = relationship("FinancingPackage", back_populates="loan_applications")
    repayments = relationship("LoanRepayment", back_populates="loan_application")


class LoanRepayment(Base):
    __tablename__ = "loan_repayments"

    id = Column(String(36), primary_key=True)
    loan_application_id = Column(String(36), ForeignKey("loan_applications.id"), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    monthly_revenue = Column(Numeric(15, 2), nullable=False)
    deduction_rate = Column(Numeric(5, 2), nullable=False)
    deduction_amount = Column(Numeric(15, 2), nullable=False)
    status = Column(Enum("pending", "collected", "failed", "waived"), nullable=False, default="pending")
    collected_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    loan_application = relationship("LoanApplication", back_populates="repayments")
