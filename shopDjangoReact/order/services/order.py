from django.utils import timezone
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework import status 

from customer.models import Customer
from order.models import Order, PromoCode
from order.serializers import WrongProductsSerializers
from shop.models import Cart
from shop.services.cart import BaseCartService


class CreateOrderService:
    
    error_message = "Промокода не існує або термін його дії завершився =("
    
    def __init__(self, request) -> None:
        
        self.cart = BaseCartService(request=request).get_only_present_products_on_stock()
        self.choice_price = {
            'discount': self.cart.discount,
            'all_price': self.cart.all_price,
        }
        self.data = request.data
        self.customer = request.user
        self.promo_code_value = request.data.get('promoCode').strip()
        
    def __call__(self):
        return self._create_order()

    @staticmethod
    def _validate(cart: Cart):
        """ return False if is incorrect product in cart 
        """
        error = []
        for product in cart.products.all():
            if product.count > product.product.count_on_stock:

                obj = {
                    "title": product.product.title,
                    "cartProduct": product.count,
                    "countOnStock": product.product.count_on_stock,
                    "id": product.id,
                }

                error.append(obj)
        
        if len(error) > 0:
            return error
        return False
            
    def _create_order(self) -> None:
        correct_cart = self._validate(self.cart)
        
        if isinstance(correct_cart, list):
            data = WrongProductsSerializers(correct_cart, many=True).data
            return Response({'incorrect_product': data})
       
        order = Order(
            customer=self.customer,
            first_name=self.data['firstName'],
            last_name=self.data['lastName'],
            phone=self.data['phone'],
            address=self.data['address'],
            type_delivery=self.data['typeDelivery'],
            order_date=self.data['date'],
            cart=self.cart,
        )
            
        if self.promo_code_value != '':
            promocode = self._add_promo_code_to_order(order=order)
            if not promocode:
                return Response({"error": self.error_message})  

        order.save()
        self._new_count_on_stock(self.cart.products.all())
        self.cart.in_order = True
        self.cart.save()
        return Response({'success': True}, status=status.HTTP_201_CREATED)
    
    def _add_promo_code_to_order(self, order: Order) -> None:
        promo_code = PromoCode.objects.filter(name=self.promo_code_value)
        if not promo_code.first() or \
           not promo_code.first().end_of_action > timezone.now():
            return False

        price = 'discount' if self.cart.discount != 0.00 else 'all_price'
        price_with_promo_code = self.choice_price[price] - self.choice_price[price] * promo_code.first().interest / 100

        order.promo_code = promo_code.first()
        order.price_with_promo_code = price_with_promo_code
        return True
        
    @staticmethod
    def _new_count_on_stock(cart_products: list) -> None:
        for cart_product in cart_products:
            cart_product.product.count_on_stock -= cart_product.count
            cart_product.product.save()

    
def new_promo_code(customer: Customer, name: str, interest: int) -> None:
    send_mail(
        'Вітаємо з новим промокодом',
        f'За промокодом {name} - {interest}',
        'vzaharkiv28@gmail.com',
        [customer.email],
        fail_silently=False
    )
