export function useChangeProductInCart() {
    const updateFieldProductInCart = (obj, products, setProducts) => {
        if(Array.isArray(products)){
            let newProductsList = [...products],
                idProductInList = newProductsList.indexOf(obj)
            newProductsList[idProductInList].in_cart = true
            setProducts(products => newProductsList)
        }else{
            let updateProduct = products
            updateProduct.in_cart = true
            setProducts(prev => updateProduct)
        }
    }
    return {
        updateFieldProductInCart
    }
}