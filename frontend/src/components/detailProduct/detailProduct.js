import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Tabs, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import SpecificationProduct from "./specificationProduct";
import ReviewProduct from "./reviewProduct";
import NavBar from "./inc/nav";
import Main from "./main";
import { categoryDetailAPI } from "../../http/api/product";

function DetailProduct({ match, setCurrentUrl }) {
    setCurrentUrl(window.location.href)

    const [product, setProduct] = useState({})
    const [productImg, setProductImg] = useState([])
    const [productSpec, setProductSpec] = useState([])
    const productSlug = match.params.slug;

    useEffect(() => {
        categoryDetailAPI(productSlug).then(response => {
            setProduct(response)
            setProductImg(response.product_image)
            setProductSpec(response.specification)
        })
    }, [productSlug]);

    return (
        <div className="container mt-5">
            <NavBar productSlug={productSlug} />

            {
                window.location.pathname.startsWith('/product/') ?
                    <Main productImg={productImg}
                        productName={product.title}
                        productPrice={product.price}
                    />
                    :
                    <SpecificationProduct productSpec={productSpec} />
            }

        </div>
    );
}

export default DetailProduct;