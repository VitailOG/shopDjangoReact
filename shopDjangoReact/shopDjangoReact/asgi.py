import os
import shop.routing

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

from .middleware import UserAuthMiddleware


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopDjangoReact.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": UserAuthMiddleware(
        URLRouter(
            shop.routing.websocket_urlpatterns
        )
    )
})
