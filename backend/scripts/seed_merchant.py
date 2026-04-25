"""
Seed realistic merchant transaction data for the iGrow demo.

Generates ~500 credit/debit transactions from 2026-03-03 to 2026-04-26
(Mon–Sun weeks) so that the analytics endpoint returns numbers that match
the frontend mock data for all four period keys:
  thisWeek / lastWeek / thisMonth / lastMonth

Usage:
  cd backend
  python scripts/seed_merchant.py
"""

import os
import random
import uuid
from datetime import date, datetime, timedelta
from decimal import Decimal
from urllib.parse import unquote, urlparse

import pymysql
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/brisval_db",
)

parsed_url = urlparse(DATABASE_URL)
user = unquote(parsed_url.username or "")
password = unquote(parsed_url.password or "")
host = parsed_url.hostname or "localhost"
port = parsed_url.port or 3306
dbname = unquote(parsed_url.path.lstrip("/"))

if not user or not dbname:
    raise ValueError("DATABASE_URL must include a username and database name")

ACCOUNT_ID = "a-001"
CAT_FOOD = "c-010"
CAT_BEV = "c-011"
CAT_INGR = "c-012"

# Day-of-week weights derived from mock thisWeek (Mon-Sun: 145,180,195,210,342,305,63)
# Normalised so the weights sum to 1
_raw = [145, 180, 195, 210, 342, 305, 63]
_total = sum(_raw)
DAY_WEIGHT = [v / _total for v in _raw]  # index 0=Mon … 6=Sun

# Weekly base totals (RM) that drive the per-day target
# Matches mock: thisMonth weeks [980,1120,1260,1440], lastMonth weeks [920,1040,1020,980]
WEEK_TARGETS = {
    # (year, iso_week): target_total_RM
    # March 2026
    (2026, 10): 920,   # Mar 3–9
    (2026, 11): 1040,  # Mar 10–16
    (2026, 12): 1020,  # Mar 17–23
    (2026, 13): 980,   # Mar 24–30
    # April 2026
    (2026, 14): 980,   # Mar 31–Apr 6  (April week 1 is split; counted in thisMonth)
    (2026, 15): 1120,  # Apr 7–13
    (2026, 16): 1260,  # Apr 14–20
    (2026, 17): 1440,  # Apr 21–26 (partial; seeder generates through Sun 26)
}

# Hour weights: mirrors mock hours pct [8,15,55,90,100,70,35,10] for hours 16–23
_hour_pcts = [8, 15, 55, 90, 100, 70, 35, 10]
_hour_sum = sum(_hour_pcts)
HOUR_WEIGHTS = [p / _hour_sum for p in _hour_pcts]
HOURS_START = 16  # 4 PM


def weighted_hour() -> int:
    """Return a random hour (16–23) weighted toward peak at 20 (8 PM)."""
    return random.choices(range(HOURS_START, HOURS_START + 8), weights=HOUR_WEIGHTS)[0]


def random_minute() -> int:
    return random.randint(0, 59)


def gen_txns_for_day(day: date, target_rm: float) -> list[dict]:
    """Generate individual credit transactions that sum ~target_rm for one day."""
    txns = []
    remaining = target_rm

    while remaining > 1:
        # Pick transaction size RM 5–25, cap at remaining
        size = min(round(random.uniform(5.0, 25.0), 2), round(remaining, 2))
        size = max(size, 1.0)

        hour = weighted_hour()
        minute = random_minute()
        second = random.randint(0, 59)
        ts = datetime(day.year, day.month, day.day, hour, minute, second)

        # Category: 70% food, 25% beverage, 5% food again
        cat = random.choices([CAT_FOOD, CAT_BEV], weights=[70, 30])[0]
        title = "Nasi Lemak Set" if cat == CAT_FOOD else "Teh Tarik / Milo"

        txns.append({
            "id": str(uuid.uuid4()),
            "account_id": ACCOUNT_ID,
            "category_id": cat,
            "title": title,
            "amount": Decimal(str(round(size, 2))),
            "direction": "credit",
            "transacted_at": ts,
        })
        remaining -= size

    # Add 1 ingredient purchase per day (~10% of daily spend)
    if target_rm > 20:
        ingr_amount = round(target_rm * random.uniform(0.08, 0.12), 2)
        ingr_time = datetime(day.year, day.month, day.day,
                             random.randint(8, 11),
                             random_minute(), 0)
        txns.append({
            "id": str(uuid.uuid4()),
            "account_id": ACCOUNT_ID,
            "category_id": CAT_INGR,
            "title": "Wet Market Purchase",
            "amount": Decimal(str(ingr_amount)),
            "direction": "debit",
            "transacted_at": ingr_time,
        })

    return txns


def main():
    random.seed(42)

    start_date = date(2026, 3, 3)   # Monday of week 10
    end_date   = date(2026, 4, 26)  # today (Sunday)

    all_txns: list[dict] = []

    current = start_date
    while current <= end_date:
        iso_year, iso_week, iso_dow = current.isocalendar()  # dow: 1=Mon … 7=Sun
        week_target = WEEK_TARGETS.get((iso_year, iso_week), 1100)

        # Per-day target based on day weight (dow: 1=Mon → index 0)
        day_idx = iso_dow - 1  # 0=Mon … 6=Sun
        day_target = week_target * DAY_WEIGHT[day_idx]

        txns = gen_txns_for_day(current, day_target)
        all_txns.extend(txns)
        current += timedelta(days=1)

    print(f"Generated {len(all_txns)} transactions across {(end_date - start_date).days + 1} days")

    ssl_args: dict = {}
    ssl_ca = os.getenv("SSL_CA")
    if ssl_ca:
        ssl_args = {"ssl_ca": ssl_ca}
    else:
        ssl_args = {"ssl": {"check_hostname": False, "verify_mode": 0}}

    conn = pymysql.connect(
        host=host, port=port, user=user, password=password, db=dbname,
        charset="utf8mb4", **ssl_args,
    )

    try:
        with conn.cursor() as cur:
            sql = """
                INSERT IGNORE INTO transactions
                  (id, account_id, category_id, title, amount, direction, status, transacted_at, created_at)
                VALUES
                  (%s, %s, %s, %s, %s, %s, 'completed', %s, %s)
            """
            rows = [
                (
                    t["id"], t["account_id"], t["category_id"],
                    t["title"], t["amount"], t["direction"],
                    t["transacted_at"], t["transacted_at"],
                )
                for t in all_txns
            ]
            cur.executemany(sql, rows)
        conn.commit()
        print(f"Inserted {len(all_txns)} rows into transactions table.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
