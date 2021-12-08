from rest_framework.pagination import LimitOffsetPagination


class CategoryProductsPagination(LimitOffsetPagination):
    default_limit = 3
