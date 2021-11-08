from rest_framework import routers

from .views import *

router = routers.SimpleRouter()
router.register('categories', CategoryAPI, basename='category')
router.register('cart', CartAPI, basename='cart')

router.register('product', ProductAPI, basename='product')
router.register('in-pending', InPendingAPI, basename='in_pending')

router.register('review', ReviewAPI, basename='review')
router.register('specification', SpecificationValueAPI, basename='specification')

router.register('reminder', ReminderAPI, basename='reminder')

urlpatterns = []

urlpatterns += router.urls
