import {useState} from "react";
import {addProductToCartAPI} from "../http/api/cart";
import {mutate} from "swr";
import {cartCustomer} from "../components/router/urls";
import {useChangeProductInCart} from "./useChangeProductInCart";


export function useAddProductToCart(){
    const [idProduct, setIdProduct] = useState([])
    const updateProduct = useChangeProductInCart()

    const addToCart = (obj, products, setProducts) =>{
        setIdProduct(idProduct => [...idProduct, obj.id])
        addProductToCartAPI(obj.id).then(() => {
            updateProduct.updateFieldProductInCart(obj, products, setProducts)
            mutate(cartCustomer)
        }).catch(() =>{
            console.log('error')
        })
    }

    return {
        addToCart, idProduct
    }
}
