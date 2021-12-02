from ..models import RatingProduct


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def create_rating(request, product_id, value):
    _, create = RatingProduct.objects.update_or_create(
        ip_address_user=get_client_ip(request),
        product_id=product_id,
        defaults={
            'value': value,
        }
    )
    return create
