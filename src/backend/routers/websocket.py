from fastapi import APIRouter, WebSocket
from starlette.endpoints import WebSocketEndpoint
from starlette.routing import WebSocketRoute
import json

from src.backend.database import Database
    

class SocketEndpoint(WebSocketEndpoint):
    """
    Handles connection and requests from Frontend
    """

    def __init__(self, scope, receive, send):
        super().__init__(scope, receive, send)
        self.websocket = None

    # async def disconnect(self, websocket: WebSocket, text: str):
    #     self.websocket = websocket
    #     await websocket.close(1000, text)

    # async def on_disconnect(self, websocket: WebSocket, close_code: int):
    #     self.websocket = websocket
    #     print(f"Websocket disconnected with close code {close_code}")

    async def on_connect(self, websocket: WebSocket):
        """ 
        runs when connecting to websocket 
        """
        await websocket.accept()
        self.websocket = websocket

        self.db: Database = self.scope.get('app').state.db
        courses_json = await self.db.instanceiate_courses()
        await self.websocket.send_json(courses_json)

    # async def on_receive(self, websocket: WebSocket, data):
    #     """
    #     runs when reciving a message from websocket
    #     """
    #     self.websocket = websocket
    #     data = json.loads(data)

router = APIRouter(
    routes=[
        WebSocketRoute('/', SocketEndpoint)
    ]
)
