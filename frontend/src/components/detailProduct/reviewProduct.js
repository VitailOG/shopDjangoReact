import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import NavBar from "./inc/nav";
import {reviewProductAPI} from "../../http/api/product";

function ReviewProduct({ match }) {
    const productSlug = match.params.slug;
    const [reviews, setReviews] = useState([])

    useEffect(()  => {
        reviewProductAPI(productSlug).then(response => {
           setReviews(response)
        })
    }, [productSlug]);

    console.log(reviews)

    return (
        <div className="container mt-5">
            <NavBar productSlug={productSlug}/>
        </div>
    );
}

export default ReviewProduct;