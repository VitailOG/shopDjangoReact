import jwt

from django.utils.deprecation import MiddlewareMixin
from django.conf import settings


class CsrfDisableCheckMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if not getattr(request, '_dont_enforce_csrf_checks', False):
            setattr(request, '_dont_enforce_csrf_checks', True)


class UserAuthMiddleware:
    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):

        token = False
        query = scope["query_string"]
  
        if query:
            query = query.decode()
  
        if query:
            query = query.split('=')
            if(query[0] == 'token'):
                token = query[1]
            
        if token:
            # jwt token let's decode it
            tokenData = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            
            # save it on user scop
            scope['user'] = tokenData

        return await self.app(scope, receive, send)