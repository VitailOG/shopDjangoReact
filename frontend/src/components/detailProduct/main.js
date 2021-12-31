import React, { useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CarouselImage from "./inc/carousel";
import {createRatingAPI} from "../../http/api/product";
import InfoProduct from "./inc/infoProduct";


function Main({
                  commonRatingProduct,
                  setCommonRatingProduct,
                  countRating,
                  setCountRating,
                  userRating,
                  setUserRating,
                  product,
                  setProduct
}) {

    let changeRating = (rating) => {
        createRatingAPI(product.id, { value: rating }).then(res => {
            if (res.status === 201) {
                setProduct({...product, rating_value: {
                        count: product.rating_value.count + 1,
                        all_rating: product.rating_value.all_rating + rating,
                        user_exists_rating: rating
                    }
                })

            } else if (res.status === 204) {
                setProduct({...product, rating_value: {
                        ...product.rating_value,
                        all_rating: (product.rating_value.all_rating - product.rating_value.user_exists_rating) + rating,
                        user_exists_rating: rating
                    }
                })
            }
        }).catch(e => {
            console.log('error')
        })
    }

    let ratingProduct = useMemo(() => {
        return commonRatingProduct / countRating
    }, [commonRatingProduct, countRating])

    return (
        <>

            <div className="row mt-5">

                <div className="col-5">
                    <CarouselImage productImg={product.product_image} />
                </div>

                <div className="col-6">
                    <InfoProduct changeRating={changeRating}
                                 ratingProduct={ratingProduct}
                                 product={product}
                                 setProduct={setProduct}
                                 userRating={userRating}
                    />
                </div>

            </div>
        </>
    );
}

export default Main;
