from django.utils import timezone
from django.core.mail import send_mail

from customer.models import Customer
from order.models import Order, PromoCode
from shop.models import Cart


class CreateOrderSevice:

    def __init__(self, customer: Customer, cart: Cart, **kwargs) -> None:
        self.choice_price = {
            'discount': cart.discount,
            'all_price': cart.all_price,
        }
        self.data = kwargs
        self.cart = cart
        self.customer = customer
        self.promo_code_value = kwargs.get('promoCode').strip()

    def __call__(self):
        self._create_order()

    def _create_order(self) -> None:
        order = Order(customer=self.customer,
            first_name=self.data['firstName'],
            last_name=self.data['lastName'],
            phone=self.data['phone'],
            address=self.data['address'],
            type_delivery=self.data['typeDelivery'],
            order_date=self.data['date'],
            cart=self.cart,
        )
        
        if self.promo_code_value != '':
            self._add_promo_code_to_order(order=order)  

        order.save()
        self._new_count_on_stock(self.cart.products.all())
        self.cart.in_order = True
        self.cart.save()   
    
    def _add_promo_code_to_order(self, order: Order) -> None:
        promo_code = PromoCode.objects.filter(name=self.promo_code_value)
        if not promo_code.first() or \
           not promo_code.first().end_of_action > timezone.now():
            raise ValueError

        price = 'discount' if self.cart.discount != 0.00 else 'all_price'
        price_with_promo_code = self.choice_price[price] - self.choice_price[price] * promo_code.first().interest / 100

        order.promo_code = promo_code.first()
        order.price_with_promo_code = price_with_promo_code

    @staticmethod
    def _new_count_on_stock(cart_products: list) -> None:
        for _ in cart_products:
            _.product.count_on_stock -= _.count
            _.product.save()

    
def send_message_after_make_order(customer: Customer) -> None:
    send_mail(
        'Вітаємо з оформленим замовлення',
        'Менеджер з вами зв`яжеться',
        'vzaharkiv28@gmail.com',
        [customer.email],
        fail_silently=False
    )

def new_promo_code(customer: Customer, instance: PromoCode) -> None:
    send_mail(
        'Вітаємо з новим промокодом',
        f'За промокодом {instance.name} - {instance.interest}',
        'vzaharkiv28@gmail.com',
        [customer.email],
        fail_silently=False
    )
