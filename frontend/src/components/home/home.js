import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from "react-redux";
import {useHistory} from "react-router-dom";

import Cart from "./inc/cart";
import HeaderContent from "./inc/headerContent";
import CartLoader from "./inc/cartLoader";

import {productDetailAPI, productOnHomePageAPI} from "../../http/api/product";
import { useAddProductToCart } from "../../hooks/useAddProductToCart";
import { useAddInPending } from "../../hooks/useAddProductInPending";

import 'bootstrap/dist/css/bootstrap.min.css';
import withRouter from "react-router-dom/es/withRouter";


function Home({fetchProductDetail}) {

    const [products, setProducts] = useState([])
    const [load, setLoad] = useState(null)

    const isAuth = useSelector(state => state.auth.isAuth)

    const addProductToCartCustomer = useAddProductToCart()
    const addProductInPending = useAddInPending()

    useEffect(() => {
        setLoad(true)
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

    let fetchProduct = useCallback((slug) =>{
        fetchProductDetail(slug)
    }, [fetchProductDetail])

    return (
        <div className="App">
            <HeaderContent />
            <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">
                    <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">

                    {
                        load ?
                            <>
                                {Array(4).fill(
                                    <CartLoader/>
                                )}
                            </>
                            :
                            <>
                                {products.map(e => (
                                    <Cart data={e}
                                        addToCart={addToCart}
                                        addInPending={addInPending}
                                        idProduct={addProductToCartCustomer.idProduct}
                                        load={load}
                                        fetchProduct={fetchProduct}
                                    />
                                ))}
                            </>
                    }

                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;