from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination


# class CategoryProductsPagination(PageNumberPagination):
#
#     page_size = 1
#     page_query_param = 'page'


class CategoryProductsPagination(LimitOffsetPagination):
    default_limit = 3

