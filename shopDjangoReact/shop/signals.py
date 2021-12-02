import channels.layers

from django.dispatch import receiver
from django.db.models.signals import post_save, pre_save
from asgiref.sync import async_to_sync

from .models import ProductInPending, Product, Reminder
from customer.models import Customer


@receiver(post_save, sender=Customer)
def create_basket_for_product_in_pending(sender, instance, created, **kwargs):
    if created:
        ProductInPending.objects.create(customer=instance)


@receiver(pre_save, sender=Product)
def change_status_on_stock(sender, instance, **kwargs):
    count_on_stock = Product.objects.filter(id=instance.id).first().count_on_stock
    instance.status_on_stock = False if count_on_stock else True


@receiver(post_save, sender=Product)
def create_reminder(sender, instance, created, **kwargs):
    if instance.count_on_stock != 0 and instance.status_on_stock:
        products_in_pending = ProductInPending.objects.filter(product=instance)
        
        for i in products_in_pending:
            Reminder.objects.create(customer=i.customer)
            layer = channels.layers.get_channel_layer()
            
            async_to_sync(layer.group_send)(
                f'user_{i.customer.username}',
                {
                    'type': 'reminder',
                    'data': 1
                }
            )
            