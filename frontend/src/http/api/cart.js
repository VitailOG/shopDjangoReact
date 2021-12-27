import $axios from "../index";
import {cartCustomer, createOrder} from "../../components/router/urls";

export function addProductToCartAPI(id) {
    return $axios.post(`shop/cart/add-to-cart/${id}/`, {})
}

export function changeCountProductOnCartAPI(cproduct_id, value) {
    return $axios.patch(`/shop/cart/change-count-cart-product/${cproduct_id}/${value}/`)
}

export function deleteFromCartAPI(id) {
    return $axios.post(`/shop/cart/delete-from-cart/${id}/`, {})
}

export function getCartProductAPI() {
    return $axios.get(cartCustomer).then(response => response.data)
}

export function createOrderAPI(values) {
    return $axios.post(createOrder, values).then(response => response.data)
}
