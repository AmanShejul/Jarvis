from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import FRONTEND_ORIGIN
from services.command_router import route_command
from services.system_monitor import get_system_stats

app = FastAPI(title="J.A.R.V.I.S. Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class CommandRequest(BaseModel):
    command: str = Field(min_length=1, max_length=200)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "online", "assistant": "J.A.R.V.I.S."}


@app.get("/api/system")
def system() -> dict[str, int | None]:
    return get_system_stats()


@app.post("/api/command")
def command(request: CommandRequest) -> dict:
    result = route_command(request.command)
    response = {"success": result.success, "message": result.message, "action": result.action}
    if result.data is not None:
        response["data"] = result.data
    return response
