import $axios from "../index";
import { categoryUrl, homeListProduct, reminder } from "../../components/router/urls";
import { getParams } from "../../utils";
import axios from "axios";

export function productOnHomePageAPI() {
    return $axios({
        method: "GET",
        url: homeListProduct
    }).then(response => response.data)
}

export function specificationProductsAPI(slug) {
    return $axios({
        method: "GET",
        url: `/shop/specification/${slug}/`
    }).then(response => response.data)
}

export function specificationNameProductsAPI(slug) {
    return $axios({
        method: "GET",
        url: `/shop/specification/name/${slug}/`
    }).then(response => response.data)
}

export function categoriesProductsAPI(slug, limit, offset, sort, search, minPrice, maxPrice, specs) {
    return $axios({
        method: "GET",
        url: `/shop/product/category/${slug}/`,
        params: {
            limit: limit, offset: offset, ordering: sort,
            title: search, price_min: minPrice,
            price_max: maxPrice, specification__value_spec: getParams(specs)
        },
    })
}

export function categoryDetailAPI(slug) {
    return $axios({
        method: "GET",
        url: `/shop/product/${slug}/`
    }).then(response => response.data)
}

export function reviewProductAPI(slug) {
    return $axios({
        method: "GET",
        url: `/shop/review/${slug}/`
    }).then(response => response.data)
}

export function categoriesAPI() {
    return axios({
        method: "GET",
        url: categoryUrl
    }).then(response => response.data)
}

export function reminderCountAPI() {
    return $axios({
        method: "GET",
        url: reminder
    }).then(response => response.data)
}

