from rest_framework import routers

from .views import *

router = routers.SimpleRouter()
router.register('make-order', OrderAPI, basename='order')

urlpatterns = []

urlpatterns += router.urls
