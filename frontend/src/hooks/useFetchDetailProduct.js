import {useState} from "react";
import {productDetailAPI} from "../http/api/product";
import {useHistory} from "react-router-dom";

export function useFetchDetailProduct(ref) {

    const [product, setProduct] = useState({})

    const history = useHistory()

    let fetchProductDetail = async (slug) =>{

        ref.current.continuousStart()

        const res = await productDetailAPI(slug)
        setProduct(res)
        history.push(`/product/${slug}`)
    }

    return {fetchProductDetail, product, setProduct}
}
