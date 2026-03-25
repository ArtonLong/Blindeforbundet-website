from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager

from src.backend.routers import websocket
from src.backend.database import Database

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     app.state.db = Database()
#     yield

db = Database()

app = FastAPI()
app.mount("/static", StaticFiles(directory="src/frontend/static"), name="static")
app.include_router(websocket.router)

templates = Jinja2Templates(directory="src/frontend/html")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    print(await db.instanceiate_courses())
    return templates.TemplateResponse(request=request, name="index.html")