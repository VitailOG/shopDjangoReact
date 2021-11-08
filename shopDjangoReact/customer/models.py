import random

from phonenumber_field.modelfields import PhoneNumberField

from django.db import models
from django.contrib.auth.models import User, AbstractUser, UserManager


class CustomerManager(models.Manager):

    def get_random_customer(self):
        queryset = Customer.objects.all()
        return random.choice(queryset)


class Customer(AbstractUser):
    """ Custom model `User`
    """
    customer_phone = PhoneNumberField(verbose_name="Номер покупця")
    email = models.EmailField(unique=True)
    objects = UserManager()
    random = CustomerManager()

    def __str__(self):
        return self.username
