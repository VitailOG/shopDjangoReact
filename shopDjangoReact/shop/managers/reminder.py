from django.db import models

from customer.models import Customer


class ReminderManager(models.Manager):
    
    def reminder_count(self, customer: Customer):
        return super().filter(customer=customer, is_read=False).count()
    
    def read_all(self, customer: Customer):
        return super().filter(customer=customer).update(is_read=True)
