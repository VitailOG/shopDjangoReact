from rest_framework.filters import OrderingFilter
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from shop.services.cart import get_customer_cart
from .models import Order
from .serializers import OrderSerializers
from .services.order import CreateOrderSevice


class OrderAPI(ModelViewSet):

    queryset = Order.objects.all()
    serializer_class = OrderSerializers

    @action(methods=['post'], detail=False)
    def order(self, *args, **kwargs):
        cart = get_customer_cart(self.request.user)
        try:
            CreateOrderSevice(self.request.user, cart, **self.request.data)()
        except ValueError:
            error_message = "Промокода не існує або термін його дії завершився =("
            return Response({"error": error_message})
        return Response({"success": True}, status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=False)
    def get_all_order_customer(self, *args, **kwargs):
        self.filter_backends = (OrderingFilter,)
        self.ordering_fields = ('id', 'cart__all_price')
        orders = Order.objects.exclude(cart__all_product=0)\
            .prefetch_related('cart__products__product')\
            .select_related('cart')\
            .filter(customer=self.request.user)
        queryset = self.filter_queryset(orders)
        data = OrderSerializers(queryset, many=True).data
        return Response(data)
