from celery import shared_task
from .services.order import new_promo_code


@shared_task
def send_promo_code_on_email(customer, name, interest):
    new_promo_code(customer=customer, name=name, interest=interest)

