-- ============================================
-- iGrow Merchant Profile Migration
-- ============================================

USE brisval_db;

CREATE TABLE IF NOT EXISTS merchant_profiles (
  id              CHAR(36)     NOT NULL DEFAULT (UUID()),
  account_id      CHAR(36)     NOT NULL,
  business_name   VARCHAR(255) NOT NULL,
  category        VARCHAR(100) NOT NULL DEFAULT 'Food & Drinks',
  ssm_registered  TINYINT(1)   NOT NULL DEFAULT 0,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_merchant_account
    FOREIGN KEY (account_id) REFERENCES accounts (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO merchant_profiles (id, account_id, business_name, category, ssm_registered)
VALUES ('mp-001', 'a-001', 'Kak Siti Nasi Lemak', 'Food & Drinks', 1);

-- Merchant-specific transaction categories
INSERT IGNORE INTO transaction_categories (id, name, type, icon_color) VALUES
  ('c-010', 'Food Sales',          'income',  '#10B981'),
  ('c-011', 'Beverage Sales',      'income',  '#3B82F6'),
  ('c-012', 'Ingredient Purchase', 'expense', '#F59E0B'),
  ('c-013', 'Platform Fee',        'expense', '#6366F1');
