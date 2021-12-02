import React, { useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $axios from "../../http/index";
import CarouselImage from "./inc/carousel"
import InfoProduct from "./inc/infoProduct"

function Main(props) {

    // refactoring
    let changeRating = (rating) => {
        const url = `http://127.0.0.1:8000/shop/product/create-rating/${props.productId}/`;
        $axios.post(url, { value: rating }).then(res => {
            if (res.status === 201) {
                props.setCountRating(prev => props.countRating + 1)
                props.setCommonRatingProduct(prev => props.commonRatingProduct + rating)
                props.setUserRating(prev => rating)
            } else if (res.status === 204) {
                props.setCommonRatingProduct(prev => (props.commonRatingProduct - props.userRating) + rating)
                props.setUserRating(prev => rating)
                console.log((props.commonRatingProduct - props.userRating) + rating)
            }
        }).catch(e => {
            console.log('error')
        })
    }

    let ratingProduct = useMemo(() => {
        return props.commonRatingProduct / props.countRating
    }, [props.commonRatingProduct, props.countRating])

    return (
        <div className="App">
            <div className="row mt-5">
                <div className="col-5">
                    <CarouselImage productImg={props.productImg} />
                </div>

                <div className="col-6">
                    <InfoProduct productName={props.productName}
                        productPrice={props.productPrice}
                        changeRating={changeRating}
                        userRating={props.userRating}
                        ratingProduct={ratingProduct}
                    />
                </div>
            </div>
        </div>
    );
}

export default Main;