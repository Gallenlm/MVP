# Minimal Terminal Calculator (FastAPI)

A minimal locally-hosted web app with:
- Terminal input panel (parse/reset/load template)
- Calculator output panel (read-only metrics + PLAY/PASS verdict)

## Requirements

- Python 3.9+
- `pip`

## Install

```bash
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn jinja2
```

## Run (important: from this project folder)

Your `main.py` is inside this repo. If you run `uvicorn` from another directory (for example `C:\Users\theal`), Uvicorn cannot import `main`.

### Windows PowerShell

```powershell
cd C:\path\to\MVP
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

### macOS/Linux

```bash
cd /path/to/MVP
source .venv/bin/activate
uvicorn main:app --reload
```

Then open `http://127.0.0.1:8000/`.

## VS Code quick run

1. Open the `MVP` folder in VS Code.
2. Open **Terminal > New Terminal**.
3. Make sure terminal path is the project root (contains `main.py`).
4. Activate venv and run:

```bash
uvicorn main:app --reload
```

## Troubleshooting: `Error loading ASGI app. Could not import module "main"`

- Confirm you are in the folder containing `main.py`.
- Confirm file name is exactly `main.py`.
- Run this command to verify location:

```bash
python -c "import os; print(os.getcwd())"
```

- If needed, run with explicit app directory:

```bash
uvicorn main:app --reload --app-dir .
```

## Supported terminal format

```text
TEAM_A TEAM_B | SCORE_A-SCORE_B | Q{quarter} {M:SS} | FGA x-y | FTA x-y | TOV x-y | ODDS oa ob
```

Example:

```text
IND WAS | 90-90 | Q4 9:32 | FGA 68-79 | FTA 25-16 | TOV 16-7 | ODDS +105 -125
```
