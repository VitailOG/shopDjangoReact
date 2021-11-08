from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import ProductInPending, Product, Reminder
from customer.models import Customer


@receiver(post_save, sender=Customer)
def create_basket_for_product_in_pending(sender, instance, created, **kwargs):
    if created:
        ProductInPending.objects.create(customer=instance)


@receiver(post_save, sender=Product)
def create_reminder(sender, instance, created, **kwargs):
    if instance.count_on_stock != 0:
        products_in_pending = ProductInPending.objects.filter(product=instance)
        for i in products_in_pending:
            Reminder.objects.create(customer=i.customer)
