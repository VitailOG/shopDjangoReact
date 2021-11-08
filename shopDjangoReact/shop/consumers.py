import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class ReviewConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        pass

    async def disconnect(self, code):
        pass

    async def receive(self, text_data):
        pass

    async def new_review(self, text):
        pass

    @database_sync_to_async
    def create_review(self):
        pass
