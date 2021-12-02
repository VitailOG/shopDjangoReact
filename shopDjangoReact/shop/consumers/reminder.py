import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ReminderConsumer(AsyncWebsocketConsumer):
    """ Consumer for reminders customers about available product on stock
    """
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']   
        self.group_name = f'user_{self.username}'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
                
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def reminder(self, event):
        num = event['data']
        
        await self.send(
            text_data=json.dumps({
                'data': num
            })
        )
        