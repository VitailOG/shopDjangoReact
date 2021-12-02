# import jwt

from django.utils.deprecation import MiddlewareMixin

# from django.conf import settings
# from django.contrib.auth import get_user_model
# from django.contrib.auth.models import AnonymousUser
# from django.db import close_old_connections

# User = get_user_model()


class CsrfDisableCheckMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if not getattr(request, '_dont_enforce_csrf_checks', False):
            setattr(request, '_dont_enforce_csrf_checks', True)


# class JwtMiddleware(MiddlewareMixin):
#     def process_request(self, request):
        
#         auth = request.META.get('HTTP_AUTHORIZATION')
#         try:
#             token = auth.split(' ')[-1]
#             payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#             user_id = payload.get('user_id', None) 
#             try: 
#                 user = User.objects.get(id=user_id)
#             except User.DoesNotExist:
#                 user = AnonymousUser()
#         except (AttributeError, jwt.exceptions.DecodeError, jwt.exceptions.ExpiredSignatureError):
#             print('no atuh')
#             user = AnonymousUser()