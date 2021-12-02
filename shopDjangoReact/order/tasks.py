from celery import shared_task
from .services.order import send_message_after_make_order, new_promo_code


@shared_task
def send_email(customer):
    send_message_after_make_order(customer=customer)


@shared_task
def send_promo_code_on_email(customer, instance):
    new_promo_code(customer=customer, instance=instance)

