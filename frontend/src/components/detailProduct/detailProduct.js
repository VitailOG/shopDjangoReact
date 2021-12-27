import React, { useState, useEffect } from 'react';
import {useLocation} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import SpecificationProduct from "./specificationProduct";
import NavBar from "./inc/nav";
import Main from "./main";
import { productDetailAPI } from "../../http/api/product";


function DetailProduct({ match }) {

    const location = useLocation()

    const [product, setProduct] = useState({})

    const [commonRatingProduct, setCommonRatingProduct] = useState(0)
    const [countRating, setCountRating] = useState(0)
    const [userRating, setUserRating] = useState(0)

    const productSlug = match.params.slug;

    useEffect(() => {
        productDetailAPI(productSlug).then(response => {
            setProduct(response)

            setCommonRatingProduct(response.rating_value.all_rating)
            setUserRating(response.rating_value.user_exists_rating)
            setCountRating(response.rating_value.count)
        })
    }, [productSlug]);

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