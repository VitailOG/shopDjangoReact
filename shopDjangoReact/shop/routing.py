from django.urls import re_path
from .consumers.review import ReviewConsumer
from .consumers.reminder import ReminderConsumer


websocket_urlpatterns = [
    re_path(r'^(?P<username>\w+)/$', ReminderConsumer.as_asgi()),
    re_path(r'product/(?P<product_id>\d+)/$', ReviewConsumer.as_asgi()),
]
