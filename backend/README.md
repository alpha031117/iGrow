# iGlow API

Backend API for iGlow, built with FastAPI.

## Requirements

- Python 3.8+
- pip
- MySQL (or AWS RDS MySQL instance)

## Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=mysql+pymysql://user:password@your-rds-host:3306/brisval_db
```

### Database Initialisation

```bash
mysql -h <host> -u <user> -p brisval_db < scripts/init_db.sql
```

## Running

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

Interactive docs: `http://localhost:8000/docs`

## Endpoints

| Method | Path             | Description                        |
|--------|------------------|------------------------------------|
| GET    | `/health`        | Health check                       |
| GET    | `/transactions`  | List transactions (paginated)      |

### GET /transactions

Returns a paginated list of transactions with category details.

**Query Parameters**

| Parameter    | Type   | Default | Description                              |
|--------------|--------|---------|------------------------------------------|
| `account_id` | string | —       | Filter by account ID                     |
| `direction`  | string | —       | Filter by direction: `credit` or `debit` |
| `status`     | string | —       | Filter by status: `completed`, `pending`, or `failed` |
| `limit`      | int    | 20      | Results per page (1–100)                 |
| `offset`     | int    | 0       | Number of results to skip                |

**Response**

```json
{
  "data": [
    {
      "id": "t-001",
      "account_id": "a-001",
      "title": "Freelance Payment",
      "amount": "850.00",
      "direction": "credit",
      "status": "completed",
      "transacted_at": "2024-01-01T00:00:00",
      "created_at": "2024-01-01T00:00:00",
      "category": {
        "id": "c-001",
        "name": "Freelance",
        "type": "income",
        "icon_color": "#10B981"
      }
    }
  ],
  "total": 5,
  "limit": 20,
  "offset": 0
}
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py             # FastAPI app entry point
│   ├── database.py         # SQLAlchemy engine and session
│   ├── models/
│   │   └── transaction.py  # ORM models
│   ├── routes/
│   │   └── transactions.py # Route handlers
│   └── schemas/
│       └── transaction.py  # Pydantic response schemas
├── scripts/
│   └── init_db.sql         # Database schema and seed data
└── requirements.txt
```
