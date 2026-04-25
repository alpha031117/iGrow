# iGlow API

Backend API for iGlow, built with FastAPI.

## Requirements

- Python 3.8+
- pip

## Setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt
```

## Running

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

Interactive docs: `http://localhost:8000/docs`

## Endpoints

| Method | Path      | Description   |
|--------|-----------|---------------|
| GET    | `/health` | Health check  |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   └── main.py         # FastAPI app and route definitions
└── requirements.txt
```
