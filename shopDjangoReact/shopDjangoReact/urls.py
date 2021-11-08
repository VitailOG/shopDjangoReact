import debug_toolbar

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('grappelli/', include('grappelli.urls')),
    path('__debug__/', include(debug_toolbar.urls)),

    path('auth/', include('djoser.urls')),
    path('auth/jwt/', include('djoser.urls.jwt')),

    path('shop/', include('shop.urls')),
    path('profile/', include('customer.urls')),
    path('order/', include('order.urls'))
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)