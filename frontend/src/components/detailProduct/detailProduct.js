import React, { useState, useEffect } from 'react';
import {useLocation} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import SpecificationProduct from "./specificationProduct";
import NavBar from "./inc/nav";
import Main from "./main";


function DetailProduct({ match, product, setProduct, finishFetch }) {

    const location = useLocation()

    const [commonRatingProduct, setCommonRatingProduct] = useState(0)
    const [countRating, setCountRating] = useState(0)
    const [userRating, setUserRating] = useState(0)

    const productSlug = match.params.slug;

    useEffect(() =>{
        setCommonRatingProduct(product.rating_value.all_rating)
        setCountRating(product.rating_value.count)
        setUserRating(product.rating_value.user_exists_rating)
    }, [product])

    useEffect(() =>{
        finishFetch()
    }, [])

    return (
        <div className="container mt-5">
            <NavBar
                location={location}
                productSlug={productSlug}
                productId={product.id}
            />

            {
                location.pathname.startsWith('/product/') ?
                    <Main commonRatingProduct={commonRatingProduct}
                          setCommonRatingProduct={setCommonRatingProduct}

                          countRating={countRating}
                          setCountRating={setCountRating}

                          userRating={userRating}
                          setUserRating={setUserRating}

                          product={product}
                          setProduct={setProduct}
                    />
                    :
                    <SpecificationProduct productSpec={product.specification} />
            }

        </div>
    );
}

export default DetailProduct;