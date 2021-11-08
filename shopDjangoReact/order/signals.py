from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import PromoCode
from customer.models import Customer


@receiver(post_save, sender=PromoCode)
def send_message_about_new_promo_code(sender, instance, created, **kwargs):
    if created:
        customer = Customer.random.get_random_customer()
        send_mail(
            'Вітаємо з новим промокодом',
            f'За промокодом {instance.name} - {instance.interest}',
            'vzaharkiv28@gmail.com',
            [customer.email],
            fail_silently=False
        )
