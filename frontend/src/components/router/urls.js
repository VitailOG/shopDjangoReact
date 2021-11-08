const scheme = 'http://'
const host = '127.0.0.1:8000/'

export const baseUrl = scheme + host

export const categoryUrl = baseUrl + 'shop/categories/'
export const homeListProduct = baseUrl + 'shop/product/home/'
export const categoryListProduct = baseUrl + `/shop/product/category/`
export const cartCustomer = baseUrl + 'shop/cart/get_current_cart_customer/'
export const addToCart = baseUrl + 'shop/cart/add-to-cart/'
export const deleteFromCart = baseUrl + 'shop/cart/delete-from-cart/'
export const changeCountCartProduct = baseUrl + 'shop/cart/change-count-cart-product/'
export const getAllOrdersCustomer = baseUrl + 'order/make-order/get_all_order_customer/'
export const inPendingProduct = baseUrl + 'shop/in-pending/get_products_in_pending_customer/'

export const loginUrl = baseUrl + 'auth/jwt/jwt/create/'
export const refreshToken = baseUrl + 'auth/jwt/jwt/refresh/'
export const registrationUrl = baseUrl + 'auth/users/'
export const userActivated = baseUrl + 'auth/users/activation/'

export const reminder = baseUrl + 'shop/reminder/show_reminder_for_customer/'
export const viewAllProductInPending = baseUrl + 'shop/reminder/view_all_products/'

