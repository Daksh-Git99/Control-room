from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent.orchestrator import run_control_room


app = FastAPI(
    title="Control Room API",
    description="Autonomous Internet Control System",
    version="1.0"
)


# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GoalRequest(BaseModel):
    goal: str


@app.get("/")
def home():
    return {
        "status": "Control Room Online"
    }


@app.post("/api/run")
def run_agent(request: GoalRequest):

    result = run_control_room(request.goal)

    return {
        "status": "completed",
        "goal": request.goal,
        "tasks": result["tasks"],
        "tool_plan": result["tool_plan"],
        "results": result["results"],
        "verification": result["verification"],
        "recovery": result["recovery"]
    }