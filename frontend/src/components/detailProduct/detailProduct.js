import React, { useState, useEffect, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpecificationProduct from "./specificationProduct";
import NavBar from "./inc/nav";
import Main from "./main";
import { productDetailAPI } from "../../http/api/product";


function DetailProduct({ match }) {

    const [product, setProduct] = useState({})
    const [productImg, setProductImg] = useState([])
    const [productSpec, setProductSpec] = useState([])

    const [commonRatingProduct, setCommonRatingProduct] = useState(0)
    const [countRating, setCountRating] = useState(0)
    const [userRating, setUserRating] = useState(0)

    const productSlug = match.params.slug;

    useEffect(() => {
        productDetailAPI(productSlug).then(response => {
            localStorage.setItem('num', response.rating_value.user_exists_rating)
            // rating 
            setCommonRatingProduct(response.rating_value.all_rating)
            setUserRating(response.rating_value.user_exists_rating)
            setCountRating(response.rating_value.count)
            // product
            setProduct(response)
            setProductImg(response.product_image)
            setProductSpec(response.specification)
        })
    }, [productSlug]);

    return (
        <div className="container mt-5">
            <NavBar
                productSlug={productSlug}
                productId={product.id}
            />

            {
                window.location.pathname.startsWith('/product/') ?
                    <Main
                        // for product
                        productImg={productImg}
                        productName={product.title}
                        productPrice={product.price}
                        productImg={productImg}

                        // for rating
                        // value
                        commonRatingProduct={commonRatingProduct}
                        userRating={userRating}
                        productId={product.id}
                        countRating={countRating}
                        // change
                        setCountRating={setCountRating}
                        setCommonRatingProduct={setCommonRatingProduct}
                        setUserRating={setUserRating}
                    />
                    :
                    <SpecificationProduct productSpec={productSpec} />
            }

        </div>
    );
}

export default DetailProduct;