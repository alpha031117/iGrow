-- ============================================
-- Brisval Transaction Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS brisval_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE brisval_db;

-- --------------------------------------------
-- Table: users
-- --------------------------------------------
CREATE TABLE users (
  id           CHAR(36)      NOT NULL DEFAULT (UUID()),
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(255)  NOT NULL UNIQUE,
  phone_number VARCHAR(20)   NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: accounts
-- --------------------------------------------
CREATE TABLE accounts (
  id             CHAR(36)       NOT NULL DEFAULT (UUID()),
  user_id        CHAR(36)       NOT NULL,
  account_number VARCHAR(20)    NOT NULL UNIQUE,
  balance        DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  currency       CHAR(3)        NOT NULL DEFAULT 'MYR',
  created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_accounts_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: transaction_categories
-- --------------------------------------------
CREATE TABLE transaction_categories (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  name       VARCHAR(100) NOT NULL,
  type       ENUM('income', 'expense') NOT NULL,
  icon_color VARCHAR(7)   NOT NULL DEFAULT '#000000',
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Table: transactions
-- --------------------------------------------
CREATE TABLE transactions (
  id            CHAR(36)       NOT NULL DEFAULT (UUID()),
  account_id    CHAR(36)       NOT NULL,
  category_id   CHAR(36)       NOT NULL,
  title         VARCHAR(255)   NOT NULL,
  amount        DECIMAL(15, 2) NOT NULL,
  direction     ENUM('credit', 'debit') NOT NULL,
  status        ENUM('completed', 'pending', 'failed') NOT NULL DEFAULT 'completed',
  transacted_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_transactions_account
    FOREIGN KEY (account_id) REFERENCES accounts (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_transactions_category
    FOREIGN KEY (category_id) REFERENCES transaction_categories (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_account_transacted (account_id, transacted_at DESC),
  INDEX idx_direction (direction),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- Seed Data
-- ============================================

INSERT INTO users (id, name, email, phone_number) VALUES
  ('u-001', 'Brisval User', 'user@brisval.com', '+60123456789');

INSERT INTO accounts (id, user_id, account_number, balance, currency) VALUES
  ('a-001', 'u-001', 'ACC-0001', 103164.10, 'MYR');

INSERT INTO transaction_categories (id, name, type, icon_color) VALUES
  ('c-001', 'Freelance',     'income',  '#10B981'),
  ('c-002', 'Fuel',          'expense', '#1F2937'),
  ('c-003', 'Subscription',  'expense', '#6366F1'),
  ('c-004', 'Electronics',   'expense', '#6366F1'),
  ('c-005', 'Entertainment', 'expense', '#6366F1');

INSERT INTO transactions (id, account_id, category_id, title, amount, direction, transacted_at) VALUES
  ('t-001', 'a-001', 'c-001', 'Freelance Payment',    850.00, 'credit', NOW()),
  ('t-002', 'a-001', 'c-002', 'Petronas Station',     120.00, 'debit',  NOW()),
  ('t-003', 'a-001', 'c-003', 'Netflix Subscription',  54.90, 'debit',  NOW()),
  ('t-004', 'a-001', 'c-004', 'iPhone 17 Purchase',  1020.00, 'debit',  NOW()),
  ('t-005', 'a-001', 'c-005', 'Spotify Premium',       14.99, 'debit',  DATE_SUB(NOW(), INTERVAL 1 DAY));
