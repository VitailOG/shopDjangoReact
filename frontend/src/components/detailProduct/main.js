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
                setCountRating(prev => countRating + 1)
                setCommonRatingProduct(prev => commonRatingProduct + rating)
                setUserRating(prev => rating)
            } else if (res.status === 204) {
                setCommonRatingProduct(prev => (commonRatingProduct - userRating) + rating)
                setUserRating(prev => rating)
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

// export default Main;


// import React, { useMemo } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import CarouselImage from "./inc/carousel"
// import InfoProduct from "./inc/infoProduct"
// import {createRatingAPI} from "../../http/api/product";

// function Main(props) {
//
//     let changeRating = (rating) => {
//         createRatingAPI(props.productId, { value: rating }).then(res => {
//             if (res.status === 201) {
//                 props.setCountRating(prev => props.countRating + 1)
//                 props.setCommonRatingProduct(prev => props.commonRatingProduct + rating)
//                 props.setUserRating(prev => rating)
//             } else if (res.status === 204) {
//                 props.setCommonRatingProduct(prev => (props.commonRatingProduct - props.userRating) + rating)
//                 props.setUserRating(prev => rating)
//             }
//         }).catch(e => {
//             console.log('error')
//         })
//     }
//
//     let ratingProduct = useMemo(() => {
//         return props.commonRatingProduct / props.countRating
//     }, [props.commonRatingProduct, props.countRating])
//
//     return (
//         <div className="App">
//             <div className="row mt-5">
//                 <div className="col-5">
//                     <CarouselImage productImg={props.productImg} />
//                 </div>
//
//                 <div className="col-6">
//                     <InfoProduct changeRating={changeRating}
//                                  ratingProduct={ratingProduct}
//                                  product={props.product}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

export default Main;