-- ============================================
-- Migration 001: RBF Financing Schema
-- TNG Business Launchpad — Revenue-Based Financing
-- ============================================

USE brisval_db;

-- --------------------------------------------
-- Table: financing_products
-- Represents a financing product tier (e.g. Tier 1: Starter Track — RBF)
-- --------------------------------------------
CREATE TABLE financing_products (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  name           VARCHAR(200) NOT NULL,
  tier_number    TINYINT      NOT NULL,
  tier_name      VARCHAR(100) NOT NULL,
  description    TEXT         NULL,
  repayment_type ENUM('revenue_based', 'fixed_instalment') NOT NULL DEFAULT 'revenue_based',
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: financing_packages
-- A loan package within a product (e.g. Package A — Solo Operator)
-- --------------------------------------------
CREATE TABLE financing_packages (
  id                      CHAR(36)       NOT NULL DEFAULT (UUID()),
  product_id              CHAR(36)       NOT NULL,
  name                    VARCHAR(100)   NOT NULL,
  eligible_criteria       TEXT           NULL,
  loan_min                DECIMAL(15, 2) NOT NULL,
  loan_max                DECIMAL(15, 2) NOT NULL,
  repayment_cap_months    TINYINT        NOT NULL,
  min_txn_history_months  TINYINT        NOT NULL DEFAULT 6,
  is_active               TINYINT(1)     NOT NULL DEFAULT 1,
  created_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                         ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_packages_product
    FOREIGN KEY (product_id) REFERENCES financing_products (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: deduction_rate_tiers
-- Tiered revenue deduction rates per loan amount bracket
-- --------------------------------------------
CREATE TABLE deduction_rate_tiers (
  id              CHAR(36)       NOT NULL DEFAULT (UUID()),
  package_id      CHAR(36)       NOT NULL,
  loan_amount_min DECIMAL(15, 2) NOT NULL,
  loan_amount_max DECIMAL(15, 2) NOT NULL,
  deduction_rate  DECIMAL(5, 2)  NOT NULL,
  created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_tiers_package
    FOREIGN KEY (package_id) REFERENCES financing_packages (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_tier_package (package_id)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: loan_applications
-- A user's loan application under a specific package
-- --------------------------------------------
CREATE TABLE loan_applications (
  id                  CHAR(36)       NOT NULL DEFAULT (UUID()),
  user_id             CHAR(36)       NOT NULL,
  package_id          CHAR(36)       NOT NULL,
  requested_amount    DECIMAL(15, 2) NOT NULL,
  approved_amount     DECIMAL(15, 2) NULL,
  outstanding_balance DECIMAL(15, 2) NULL,
  status              ENUM('pending', 'approved', 'rejected', 'active', 'settled', 'defaulted')
                                     NOT NULL DEFAULT 'pending',
  applied_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at         DATETIME       NULL,
  settled_at          DATETIME       NULL,
  created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_loan_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_loan_package
    FOREIGN KEY (package_id) REFERENCES financing_packages (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_loan_user (user_id),
  INDEX idx_loan_status (status)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: loan_repayments
-- Monthly revenue-based deduction records per loan
-- --------------------------------------------
CREATE TABLE loan_repayments (
  id                  CHAR(36)       NOT NULL DEFAULT (UUID()),
  loan_application_id CHAR(36)       NOT NULL,
  period_start        DATE           NOT NULL,
  period_end          DATE           NOT NULL,
  monthly_revenue     DECIMAL(15, 2) NOT NULL,
  deduction_rate      DECIMAL(5, 2)  NOT NULL,
  deduction_amount    DECIMAL(15, 2) NOT NULL,
  status              ENUM('pending', 'collected', 'failed', 'waived')
                                     NOT NULL DEFAULT 'pending',
  collected_at        DATETIME       NULL,
  created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_repayment_loan
    FOREIGN KEY (loan_application_id) REFERENCES loan_applications (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_repayment_loan (loan_application_id),
  INDEX idx_repayment_status (status),
  INDEX idx_repayment_period (loan_application_id, period_start)
) ENGINE=InnoDB;

-- ============================================
-- Seed Data: TNG Business Launchpad
-- ============================================

SET @product_id = UUID();
SET @package_a_id = UUID();

INSERT INTO financing_products (id, name, tier_number, tier_name, description, repayment_type) VALUES
  (@product_id,
   'TNG Business Launchpad',
   1,
   'Starter Track',
   'Borrowers repay through automatic percentage deductions from their TNG merchant revenue. No fixed monthly instalments. If revenue drops, repayment drops proportionally.',
   'revenue_based');

INSERT INTO financing_packages
  (id, product_id, name, eligible_criteria, loan_min, loan_max, repayment_cap_months, min_txn_history_months)
VALUES
  (@package_a_id,
   @product_id,
   'Package A — Solo Operator',
   'Sole proprietors, hawkers, informal traders with minimum 6 months TNG transaction history',
   1000.00,
   5000.00,
   18,
   6);

INSERT INTO deduction_rate_tiers (id, package_id, loan_amount_min, loan_amount_max, deduction_rate) VALUES
  (UUID(), @package_a_id, 1000.00, 2000.00, 3.00),
  (UUID(), @package_a_id, 2001.00, 3500.00, 4.00),
  (UUID(), @package_a_id, 3501.00, 5000.00, 5.00);
