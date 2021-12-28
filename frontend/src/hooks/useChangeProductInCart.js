export function useChangeProductInCart() {
    const updateFieldProductInCart = (obj, products, setProducts) => {
        // check type products
        if(Array.isArray(products)){
            let idProductInList = products.indexOf(obj)
            products[idProductInList].in_cart = true
        }else{
            products.in_cart = true
        }

        setProducts(prev => products)
    }
    return {
        updateFieldProductInCart
    }
}