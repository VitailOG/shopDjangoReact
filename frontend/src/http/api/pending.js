import $axios from "../index";
import {inPendingProduct} from "../../components/router/urls";

export function addProductInPendingAPI(slug){
    return $axios.post(`shop/in-pending/product-in-pending/${slug}/`, {})
}

export function productInPendingAPI() {
    return $axios({
        method: "GET",
        url: inPendingProduct
    }).then(response => response.data)
}

export function deleteProductFromPendingAPI(slug) {
    return $axios.post(`/shop/in-pending/delete/${slug}/`)
}
