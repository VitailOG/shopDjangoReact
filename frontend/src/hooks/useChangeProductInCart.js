export function useChangeProductInCart() {
    const updateFieldProductInCart = (obj, products, setProducts) => {
        let newProductsList = [...products],
            idProductInList = newProductsList.indexOf(obj)
        newProductsList[idProductInList].in_cart = true
        setProducts(products => newProductsList)
    }
    return {
        updateFieldProductInCart
    }
}