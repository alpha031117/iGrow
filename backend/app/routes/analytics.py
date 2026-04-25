from datetime import date, datetime, timedelta
from typing import Optional
import calendar

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter(prefix="/analytics", tags=["analytics"])

# Only merchant income categories — excludes legacy non-merchant seed credits
MERCHANT_INCOME_CATS = ("c-010", "c-011")

DAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
HOUR_LABELS = [
    "4–5 PM", "5–6 PM", "6–7 PM", "7–8 PM",
    "8–9 PM", "9–10 PM", "10–11 PM", "11–12 AM",
]
HOURS_START = 16  # 4 PM
HOUR_RANGE = range(HOURS_START, 24)


def _week_range(ref: date) -> tuple[datetime, datetime]:
    """Return (Mon 00:00, Sun 23:59:59) for the ISO week containing ref."""
    mon = ref - timedelta(days=ref.weekday())
    sun = mon + timedelta(days=6)
    return (
        datetime(mon.year, mon.month, mon.day, 0, 0, 0),
        datetime(sun.year, sun.month, sun.day, 23, 59, 59),
    )


def _period_ranges(period: str) -> tuple[tuple[datetime, datetime], tuple[datetime, datetime]]:
    """Return (current_range, comparison_range) as datetime pairs."""
    today = date.today()

    if period == "thisWeek":
        cur = _week_range(today)
        prev_mon = today - timedelta(days=today.weekday() + 7)
        cmp = _week_range(prev_mon)
    elif period == "lastWeek":
        prev_mon = today - timedelta(days=today.weekday() + 7)
        cur = _week_range(prev_mon)
        prev2_mon = prev_mon - timedelta(days=7)
        cmp = _week_range(prev2_mon)
    elif period == "thisMonth":
        first = date(today.year, today.month, 1)
        cur = (
            datetime(first.year, first.month, first.day, 0, 0, 0),
            datetime(today.year, today.month, today.day, 23, 59, 59),
        )
        prev_month = today.month - 1 or 12
        prev_year = today.year if today.month > 1 else today.year - 1
        prev_first = date(prev_year, prev_month, 1)
        last_day = calendar.monthrange(prev_year, prev_month)[1]
        prev_last = date(prev_year, prev_month, last_day)
        cmp = (
            datetime(prev_first.year, prev_first.month, prev_first.day, 0, 0, 0),
            datetime(prev_last.year, prev_last.month, prev_last.day, 23, 59, 59),
        )
    elif period == "lastMonth":
        prev_month = today.month - 1 or 12
        prev_year = today.year if today.month > 1 else today.year - 1
        prev_first = date(prev_year, prev_month, 1)
        last_day = calendar.monthrange(prev_year, prev_month)[1]
        prev_last = date(prev_year, prev_month, last_day)
        cur = (
            datetime(prev_first.year, prev_first.month, prev_first.day, 0, 0, 0),
            datetime(prev_last.year, prev_last.month, prev_last.day, 23, 59, 59),
        )
        pp_month = prev_month - 1 or 12
        pp_year = prev_year if prev_month > 1 else prev_year - 1
        pp_first = date(pp_year, pp_month, 1)
        pp_last_day = calendar.monthrange(pp_year, pp_month)[1]
        pp_last = date(pp_year, pp_month, pp_last_day)
        cmp = (
            datetime(pp_first.year, pp_first.month, pp_first.day, 0, 0, 0),
            datetime(pp_last.year, pp_last.month, pp_last.day, 23, 59, 59),
        )
    else:
        raise HTTPException(status_code=400, detail=f"Unknown period: {period}")

    return cur, cmp


def _fmt_rm(value: float) -> str:
    return f"RM {value:,.0f}"


def _hero_stats(db: Session, account_id: str, start: datetime, end: datetime) -> dict:
    row = db.execute(
        text("""
            SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS cnt
            FROM transactions
            WHERE account_id = :aid
              AND direction = 'credit'
              AND status = 'completed'
              AND category_id IN ('c-010', 'c-011')
              AND transacted_at BETWEEN :start AND :end
        """),
        {"aid": account_id, "start": start, "end": end},
    ).fetchone()
    total = float(row.total)
    cnt = int(row.cnt)
    avg = total / cnt if cnt else 0.0
    return {"total": total, "cnt": cnt, "avg": avg}


def _daily_breakdown(db: Session, account_id: str, start: datetime, end: datetime, monthly: bool) -> list[dict]:
    if monthly:
        # Aggregate per weekday across the whole period
        rows = db.execute(
            text("""
                SELECT DAYOFWEEK(transacted_at) AS dow,
                       COALESCE(SUM(amount), 0) AS total
                FROM transactions
                WHERE account_id = :aid
                  AND direction = 'credit'
                  AND status = 'completed'
                  AND category_id IN ('c-010', 'c-011')
                  AND transacted_at BETWEEN :start AND :end
                GROUP BY dow
                ORDER BY dow
            """),
            {"aid": account_id, "start": start, "end": end},
        ).fetchall()
        # MySQL DAYOFWEEK: 1=Sun, 2=Mon, ..., 7=Sat → map to Mon-first index
        dow_map = {r.dow: float(r.total) for r in rows}
        # Build Mon–Sun array: MySQL dow 2=Mon…7=Sat,1=Sun
        mysql_order = [2, 3, 4, 5, 6, 7, 1]
        result = []
        for i, mysql_dow in enumerate(mysql_order):
            result.append({"d": DAY_ABBR[i], "v": round(dow_map.get(mysql_dow, 0))})
        return result
    else:
        # One entry per calendar day in the range
        rows = db.execute(
            text("""
                SELECT DATE(transacted_at) AS day,
                       DAYOFWEEK(transacted_at) AS dow,
                       COALESCE(SUM(amount), 0) AS total
                FROM transactions
                WHERE account_id = :aid
                  AND direction = 'credit'
                  AND status = 'completed'
                  AND category_id IN ('c-010', 'c-011')
                  AND transacted_at BETWEEN :start AND :end
                GROUP BY day, dow
                ORDER BY day
            """),
            {"aid": account_id, "start": start, "end": end},
        ).fetchall()
        mysql_to_abbr = {2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat", 1: "Sun"}
        return [{"d": mysql_to_abbr.get(r.dow, "?"), "v": round(float(r.total))} for r in rows]


def _hourly_breakdown(db: Session, account_id: str, start: datetime, end: datetime) -> list[dict]:
    rows = db.execute(
        text("""
            SELECT HOUR(transacted_at) AS hr, COUNT(*) AS cnt
            FROM transactions
            WHERE account_id = :aid
              AND direction = 'credit'
              AND status = 'completed'
              AND category_id IN ('c-010', 'c-011')
              AND transacted_at BETWEEN :start AND :end
              AND HOUR(transacted_at) BETWEEN 16 AND 23
            GROUP BY hr
            ORDER BY hr
        """),
        {"aid": account_id, "start": start, "end": end},
    ).fetchall()
    hr_map = {r.hr: int(r.cnt) for r in rows}
    max_cnt = max(hr_map.values(), default=1)
    result = []
    for i, hr in enumerate(HOUR_RANGE):
        pct = round(hr_map.get(hr, 0) / max_cnt * 100) if max_cnt else 0
        result.append({"t": HOUR_LABELS[i], "pct": pct})
    return result


def _peak_info(hours: list[dict]) -> tuple[str, str, str]:
    if not hours:
        return ("8–9 PM", "60%", "7:30 PM")
    peak_idx = max(range(len(hours)), key=lambda i: hours[i]["pct"])
    peak_label = hours[peak_idx]["t"]

    total_pct = sum(h["pct"] for h in hours)
    peak_pct = round(hours[peak_idx]["pct"] / total_pct * 100) if total_pct else 0
    peak_share = f"{peak_pct}%"

    # arrive_by = 30 min before peak hour start
    hour_start = HOURS_START + peak_idx
    arrive_hr = hour_start if hour_start > 0 else 23
    arrive_min = 30
    suffix = "PM" if arrive_hr < 24 else "AM"
    disp_hr = arrive_hr if arrive_hr <= 12 else arrive_hr - 12
    arrive_by = f"{disp_hr}:{arrive_min:02d} {suffix}"

    return (peak_label, peak_share, arrive_by)


def _weekly_trend(db: Session, account_id: str, start: datetime, end: datetime) -> list[dict]:
    rows = db.execute(
        text("""
            SELECT YEARWEEK(transacted_at, 1) AS yw,
                   MIN(DATE(transacted_at)) AS week_start,
                   COALESCE(SUM(amount), 0) AS total
            FROM transactions
            WHERE account_id = :aid
              AND direction = 'credit'
              AND status = 'completed'
              AND category_id IN ('c-010', 'c-011')
              AND transacted_at BETWEEN :start AND :end
            GROUP BY yw
            ORDER BY yw
        """),
        {"aid": account_id, "start": start, "end": end},
    ).fetchall()
    result = []
    for i, r in enumerate(rows):
        label = f"Week {i + 1}" if i < len(rows) - 1 else f"Week {i + 1} (now)"
        result.append({"w": label, "v": round(float(r.total))})
    return result


@router.get("/period")
def get_period_analytics(
    account_id: str = Query(..., description="Account ID"),
    period: str = Query("thisWeek", description="One of: thisWeek, lastWeek, thisMonth, lastMonth"),
    db: Session = Depends(get_db),
):
    is_monthly = period in ("thisMonth", "lastMonth")
    cur_range, cmp_range = _period_ranges(period)

    cur = _hero_stats(db, account_id, *cur_range)
    cmp = _hero_stats(db, account_id, *cmp_range)

    vs_prev = round(((cur["total"] - cmp["total"]) / cmp["total"] * 100), 1) if cmp["total"] else 0.0

    days = _daily_breakdown(db, account_id, *cur_range, monthly=is_monthly)
    hours = _hourly_breakdown(db, account_id, *cur_range)
    peak_hour, peak_share, arrive_by = _peak_info(hours)

    # Best day
    best = max(days, key=lambda x: x["v"], default={"d": "—", "v": 0})
    best_day_str = f"{best['d']} — {_fmt_rm(best['v'])}"

    # Daily average
    num_days = (cur_range[1].date() - cur_range[0].date()).days + 1
    daily_avg = cur["total"] / num_days if num_days else 0
    daily_avg_str = f"RM {round(daily_avg):,} / day"

    # Month progress (only for monthly views)
    today = date.today()
    month_earned = _fmt_rm(cur["total"]) if is_monthly else _fmt_rm(cur["total"])
    month_pct = 0
    month_pace = None
    month_label = ""
    week_trend_label = ""
    weeks: list[dict] = []

    if is_monthly:
        weeks = _weekly_trend(db, account_id, *cur_range)
        month_name = cur_range[0].strftime("%B")
        week_trend_label = f"{month_name} Weekly Trend"

        if period == "thisMonth":
            days_in_month = calendar.monthrange(today.year, today.month)[1]
            days_elapsed = today.day
            pace = (cur["total"] / days_elapsed * days_in_month) if days_elapsed else cur["total"]
            month_pct = min(round(days_elapsed / days_in_month * 100), 100)
            month_pace = _fmt_rm(round(pace))
            month_label = f"earned so far in {month_name}"
        else:
            month_pct = 100
            month_pace = None
            yr = cur_range[0].year
            mo = cur_range[0].month
            month_label = f"total for {cur_range[0].strftime('%B %Y')}"
    else:
        # For weekly views, carry month progress from current month stats
        first = date(today.year, today.month, 1)
        month_start = datetime(first.year, first.month, first.day)
        month_end = datetime(today.year, today.month, today.day, 23, 59, 59)
        month_stats = _hero_stats(db, account_id, month_start, month_end)
        days_in_month = calendar.monthrange(today.year, today.month)[1]
        days_elapsed = today.day
        pace = (month_stats["total"] / days_elapsed * days_in_month) if days_elapsed else 0
        month_pct = min(round(days_elapsed / days_in_month * 100), 100)
        month_pace = _fmt_rm(round(pace))
        month_label = f"earned so far in {today.strftime('%B')}"
        month_earned = _fmt_rm(round(month_stats["total"]))
        weeks = _weekly_trend(db, account_id, month_start, month_end)
        week_trend_label = f"{today.strftime('%B')} Weekly Trend"

    # Labels
    if period == "thisWeek":
        period_label, hero_label = "This Week", "Weekly Sales"
        vs_prev_label = "vs last week"
    elif period == "lastWeek":
        period_label, hero_label = "Last Week", "Weekly Sales"
        vs_prev_label = "vs week before"
    elif period == "thisMonth":
        period_label = cur_range[0].strftime("%B %Y")
        hero_label = "Monthly Sales"
        vs_prev_label = f"vs {cmp_range[0].strftime('%B')}"
    else:
        period_label = cur_range[0].strftime("%B %Y")
        hero_label = "Monthly Sales"
        vs_prev_label = f"vs {cmp_range[0].strftime('%B')}"

    return {
        "period_label": period_label,
        "hero_label": hero_label,
        "hero_sales": round(cur["total"], 2),
        "hero_txn": cur["cnt"],
        "hero_avg": round(cur["avg"], 2),
        "vs_prev": vs_prev,
        "vs_prev_label": vs_prev_label,
        "best_day": best_day_str,
        "daily_avg": daily_avg_str,
        "days": days,
        "hours": hours,
        "peak_hour": peak_hour,
        "peak_share": peak_share,
        "arrive_by": arrive_by,
        "weeks": weeks,
        "week_trend_label": week_trend_label,
        "month_earned": month_earned,
        "month_pace": month_pace,
        "month_pct": month_pct,
        "month_label": month_label,
    }
