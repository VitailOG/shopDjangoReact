from autoslug import AutoSlugField

from mptt.models import MPTTModel, TreeForeignKey
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from customer.models import Customer
from PIL import Image
from urllib.request import urlopen 

class ProductManager(models.Manager):

    def get_four_new_product(self):
        return super().get_queryset().order_by('-id')[:4]


class Category(models.Model):
    """ Categories products
    """
    name = models.CharField(
        max_length=255,
        verbose_name="Ім'я"
    )
    slug = models.SlugField(
        unique=True
    )

    def __str__(self):
        return self.slug

    class Meta:
        verbose_name = "Категорія"
        verbose_name_plural = "Категорії"


class Product(models.Model):
    """ Product
    """
    category = models.ForeignKey(
        Category,
        verbose_name="Категорії",
        related_name='product',
        on_delete=models.CASCADE
    )
    
    title = models.CharField(
        max_length=100,
        db_index=True,
        verbose_name="Ім'я"
    )
    
    main_img = models.URLField(
        null=True,
        blank=True
    )
    
    img = models.ImageField(
        upload_to='product/',
        null=True,
        blank=True
    )
    
    count_on_stock = models.PositiveIntegerField(default=0)
    
    slug = AutoSlugField(
        max_length=255,
        populate_from='title',
        unique=True,
        editable=True,
        allow_unicode=True
    )
    
    price = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        verbose_name="Ціна"
    )
    
    date = models.DateTimeField(
        verbose_name="Дата",
        auto_now_add=True
    )
    
    objects = ProductManager()

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукти"

    def __str__(self):
        return f'Продукт {self.title} Категорії {self.category.name}'

    def save(self, *args, **kwargs):
        #image = Image.open(urlopen(self.main_img))
        #image.show()
        #size = (251, 212)
        #self.img = image
        super().save(*args, **kwargs)


class SpecificationProduct(models.Model):
    """ Specification product
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="specification"
    )
    name_spec = models.CharField(
        max_length=100
    )
    value_spec = models.CharField(
        max_length=100
    )

    class Meta:
        verbose_name = 'Специфікація'
        verbose_name_plural = 'Специфікації'


class ShortImgProduct(models.Model):
    """ Images product
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="product_image"
    )
    img = models.URLField(
        verbose_name="Фото"
    )

    def __str__(self):
        return str(self.img)

    class Meta:
        verbose_name = 'Кадр товара'
        verbose_name_plural = 'Кадри товарів'


class CartProduct(models.Model):
    """ Cart product
    """
    cart = models.ForeignKey(
        'Cart',
        on_delete=models.CASCADE,
        verbose_name="Корзина",
        related_name="related_products"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='product'
    )
    count = models.PositiveIntegerField(
        default=1
    )
    all_price = models.DecimalField(
        max_digits=9,
        default=0,
        decimal_places=2,
        verbose_name="Вся сума"
    )

    def __str__(self):
        return f"{self.id} - {self.product.id} - {self.product.count_on_stock}"

    def save(self, *args, **kwargs):
        self.all_price = self.count * self.product.price
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Карта Продукта"
        verbose_name_plural = "Карта Продуктів"


class Cart(models.Model):
    """ Basket
    """
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        verbose_name="Покупець"
    )
    products = models.ManyToManyField(
        CartProduct,
        blank=True,
        related_name="related_cart"
    )
    all_product = models.PositiveIntegerField(
        default=0,
        null=True,
        blank=True
    )
    all_price = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="Вся сума"
    )
    discount = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        default=0,
        verbose_name="Сума із знижкою"
    )
    in_order = models.BooleanField(
        default=False
    )

    def __str__(self):
        return f"{self.customer} - {self.id}"

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзина"


class Review(MPTTModel):
    """ Review product
    """
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    review = models.TextField(
        verbose_name="Відгук"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="review"
    )
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    date = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.review

    class Meta:
        verbose_name = "Відгук"
        verbose_name_plural = "Відгуки"
        
            
class ProductInPending(models.Model):
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    product = models.ManyToManyField(
        Product,
        related_name='product_in_pending'
    )

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = "Очікування"
        verbose_name_plural = "Очікування"


class RatingProduct(models.Model):
    """ Add rating to product
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="rating"
    )
    value = models.IntegerField(
        verbose_name="Значення",
        validators=[
            MinValueValidator(
                limit_value=1,
                message="не менше 1"
            ),
            MaxValueValidator(
                limit_value=5,
                message="не більше 5"
            )
        ])
    ip_address_user = models.GenericIPAddressField(
        verbose_name="IP адрес користувача",
        protocol="both"
    )

    class Meta:
        verbose_name = "Рейтинг продуктів"
        verbose_name_plural = "Рейтинг продукту"


class Reminder(models.Model):
    """ Reminder form customer
    """
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )
    is_read = models.BooleanField(
        default=False
    )

    def __str__(self):
        return f"{self.customer.username} - {self.is_read}"

    class Meta:
        verbose_name = "Нагадування"
        verbose_name_plural = "Нагадування"
