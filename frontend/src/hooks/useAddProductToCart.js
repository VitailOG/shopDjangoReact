import { useState } from "react";
import { addProductToCartAPI } from "../http/api/cart";
import { mutate } from "swr";
import { cartCustomer } from "../components/router/urls";
import { useChangeProductInCart } from "./useChangeProductInCart";


export function useAddProductToCart(changeLists = true) {
    const [idProduct, setIdProduct] = useState([])
    const updateProduct = useChangeProductInCart(false)

    const addToCart = (obj, products, setProducts) => {
        setIdProduct(idProduct => [...idProduct, obj.id])
        addProductToCartAPI(obj.id).then(() => {
            if (changeLists) {
                updateProduct.updateFieldProductInCart(obj, products, setProducts)
            }
            mutate(cartCustomer)
            setIdProduct(idProduct => idProduct.filter(e => e !== obj.id))
        }).catch(() => {
            console.log('error')
        })
    }

    return {
        addToCart, idProduct
    }
}
