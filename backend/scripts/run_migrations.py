"""
Run all SQL migration scripts against the DATABASE_URL in backend/.env.
Works with both local Docker MySQL and remote Aliyun RDS.

Usage:
  cd backend && python scripts/run_migrations.py
"""

import os
import re
import sys
from pathlib import Path

import pymysql
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in backend/.env")
    sys.exit(1)

# Parse mysql+pymysql://user:pass@host:port/dbname
m = re.match(r"mysql\+pymysql://([^:]+):([^@]+)@([^:/]+)(?::(\d+))?/(.+)", DATABASE_URL)
if not m:
    print(f"ERROR: Cannot parse DATABASE_URL: {DATABASE_URL}")
    sys.exit(1)

user, password, host, port_str, dbname = m.groups()
# URL-decode password
from urllib.parse import unquote
password = unquote(password)
port = int(port_str) if port_str else 3306

ssl_ca = os.getenv("SSL_CA")
ssl_args = {"ssl_ca": ssl_ca} if ssl_ca else {"ssl": {"check_hostname": False, "verify_mode": 0}}

SCRIPTS_DIR = Path(__file__).parent
MIGRATIONS = [
    SCRIPTS_DIR / "init_db.sql",
    SCRIPTS_DIR / "migrate_merchant.sql",
]

print(f"Connecting to {host}:{port}/{dbname} as {user}...")
conn = pymysql.connect(
    host=host, port=port, user=user, password=password,
    charset="utf8mb4", **ssl_args,
)

try:
    for script in MIGRATIONS:
        print(f"  -> {script.name}")
        sql = script.read_text()
        with conn.cursor() as cur:
            # Split on semicolons, skip empty statements
            for stmt in sql.split(";"):
                stmt = stmt.strip()
                if stmt and not stmt.startswith("--"):
                    try:
                        cur.execute(stmt)
                    except pymysql.err.OperationalError as e:
                        # Ignore "database exists" / "table exists" errors
                        if e.args[0] not in (1007, 1050):
                            raise
        conn.commit()
    print("All migrations applied successfully.")
finally:
    conn.close()
