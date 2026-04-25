from sqlalchemy import Column, String, Numeric, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class TransactionCategory(Base):
    __tablename__ = "transaction_categories"

    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    type = Column(Enum("income", "expense"), nullable=False)
    icon_color = Column(String(7), nullable=False, default="#000000")

    transactions = relationship("Transaction", back_populates="category")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True)
    account_id = Column(String(36), ForeignKey("accounts.id"), nullable=False)
    category_id = Column(String(36), ForeignKey("transaction_categories.id"), nullable=False)
    title = Column(String(255), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    direction = Column(Enum("credit", "debit"), nullable=False)
    status = Column(Enum("completed", "pending", "failed"), nullable=False, default="completed")
    transacted_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False)

    category = relationship("TransactionCategory", back_populates="transactions")
