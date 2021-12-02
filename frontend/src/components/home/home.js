import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Cart from "./inc/cart";
import HeaderContent from "./inc/headerContent";
import LoaderProduct from "./inc/loaderProduct";
import { useSelector } from "react-redux";
import { productOnHomePageAPI } from "../../http/api/product";
import { useAddProductToCart } from "../../hooks/useAddProductToCart";
import { useAddInPending } from "../../hooks/useAddProductInPending";

function Home() {

    const [products, setProducts] = useState([])
    const [load, setLoad] = useState(true)

    const isAuth = useSelector(state => state.auth.isAuth)

    const addProductToCartCustomer = useAddProductToCart()
    const addProductInPending = useAddInPending()

    useEffect(() => {
        productOnHomePageAPI().then(response => {
            setProducts(response)
            setLoad(false)
        })
    }, [isAuth]);

    function addToCart(obj) {
        addProductToCartCustomer.addToCart(obj, products, setProducts)
    }

    let addInPending = (slug_product) => {
        addProductInPending.addInPending(slug_product)
    }

    return (
        <div className="App">
            <HeaderContent />
            <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">

                    {
                        load ?
                            <LoaderProduct />
                            :
                            <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                                {products.map(e => (
                                    <Cart data={e}
                                        addToCart={addToCart}
                                        addInPending={addInPending}
                                        idProduct={addProductToCartCustomer.idProduct}
                                        isAuth={isAuth}
                                    />
                                ))}
                            </div>
                    }

                </div>
            </section>
        </div>
    );
}

export default Home;