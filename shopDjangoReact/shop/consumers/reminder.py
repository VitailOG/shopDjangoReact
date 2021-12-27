import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from django.contrib.auth import get_user_model

from shop.models import Reminder

User = get_user_model()


class ReminderConsumer(AsyncWebsocketConsumer):
    """ Consumer for reminders customers about available product on stock
    """
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']   
        self.group_name = f'user_{self.username}'
        
        self.user = await self.get_current_user(self.scope['user']['user_id'])
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
                
        await self.accept()

    @database_sync_to_async
    def get_current_user(self, id):
        return User.objects.get(id=id)

    @database_sync_to_async
    def read_reminder(self):
        return Reminder.objects.read_all(customer=self.user)

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        await self.read_reminder()

    async def reminder(self, event):
        num = event['data']
        
        await self.send(
            text_data=json.dumps({
                'data': num
            })
        )
        