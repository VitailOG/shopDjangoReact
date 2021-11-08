from django.utils.deprecation import MiddlewareMixin


class CsrfDisableCheckMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if not getattr(request, '_dont_enforce_csrf_checks', False):
            setattr(request, '_dont_enforce_csrf_checks', True)
