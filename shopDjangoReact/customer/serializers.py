from djoser.serializers import UserCreateSerializer

from .models import Customer


class UserRegistrationSerializer(UserCreateSerializer):
    class Meta:
        model = Customer
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'customer_phone')
