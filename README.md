# JARVIS

Personal desktop AI assistant interface with a React frontend and Python/FastAPI backend.

## Start the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The backend exposes `GET /api/health`, `GET /api/system`, and `POST /api/command` at `http://127.0.0.1:8000`.

Supported commands: `open vscode`, `open chrome`, `open spotify`, `open notepad`, `open calculator`, `open file explorer`, `open youtube`, `open google`, `open github`, `what time is it`, and `system status`.
