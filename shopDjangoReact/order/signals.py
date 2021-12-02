from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import PromoCode
from customer.models import Customer
from .tasks import send_promo_code_on_email


@receiver(post_save, sender=PromoCode)
def send_message_about_new_promo_code(sender, instance, created, **kwargs):
    if created:
        customer = Customer.random.get_random_customer()
