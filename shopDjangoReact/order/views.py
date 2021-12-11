from rest_framework.filters import OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Order
from .serializers import OrderSerializers
from .services.order import CreateOrderSevice


class OrderAPI(ModelViewSet):

    queryset = Order.objects.all()
    serializer_class = OrderSerializers

    @action(methods=['post'], detail=False)
    def order(self, *args, **kwargs):
        order = CreateOrderSevice(self.request)()
        return order

    @action(methods=['get'], detail=False)
    def get_all_order_customer(self, *args, **kwargs):
        self.filter_backends = (OrderingFilter,)
        self.ordering_fields = ('id', 'cart__all_price')
        orders = Order.objects.get_all_order_customer(customer=self.request.user)
    
        queryset = self.filter_queryset(orders)
        data = OrderSerializers(queryset, many=True).data
        return Response(data)
