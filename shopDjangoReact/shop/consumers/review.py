import json

from typing import Tuple
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from ..models import Review
from customer.models import Customer


class ReviewConsumer(AsyncWebsocketConsumer):
    """ Consumer for create review to product
    """
    async def connect(self):
        self.product_id = self.scope['url_route']['kwargs']['product_id'] 
        
        self.product_group_name = f'product_{self.product_id}'
        
        await self.channel_layer.group_add(
            self.product_group_name,
            self.channel_name
        )
        await self.accept()
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.product_group_name,
            self.channel_name
        )

    async def build_data(self, new_review, user):
        data = {
            'customer': user.username,
            'review': new_review.review,
            'parent': new_review.parent,
            'formated_date': new_review.date.strftime('%m/%d/%Y, %H:%M:%S')
        }
        return data
    
    async def receive(self, text_data):
        text_data_js = json.loads(text_data)
        review = text_data_js['value']
        
        new_review, user = await self.create_review(review)
        
        data = await self.build_data(new_review, user)   
        
        await self.channel_layer.group_send(
            self.product_group_name,
            {
                'type': 'new_review',
                'message': data
            }
        )

    async def new_review(self, event):
        message = event['message']
        
        await self.send(
            text_data=json.dumps({
                'message': message
            })
        )

    @database_sync_to_async
    def create_review(self, message) -> Tuple[Review, Customer]:       
        review = Review.objects.create(
            customer_id=1,
            review=message,
            product_id=self.product_id,
        )
        
        return (review, review.customer)
