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

## Run

```bash
uvicorn main:app --reload
```

Then open `http://127.0.0.1:8000/`.

## Supported terminal format

```text
TEAM_A TEAM_B | SCORE_A-SCORE_B | Q{quarter} {M:SS} | FGA x-y | FTA x-y | TOV x-y | ODDS oa ob
```

Example:

```text
IND WAS | 90-90 | Q4 9:32 | FGA 68-79 | FTA 25-16 | TOV 16-7 | ODDS +105 -125
```
