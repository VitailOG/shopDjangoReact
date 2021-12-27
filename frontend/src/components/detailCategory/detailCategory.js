import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cart from "../home/inc/cart";
import Paginator from "./inc/paginator";
import Specification from "./inc/specification";
import { useDispatch, useSelector } from "react-redux";
import { limitAction, offsetAction, removeSpecAction, sortAction } from "../../store/actionCreators";
import { categoriesProductsAPI } from "../../http/api/product";
import { useAddProductToCart } from "../../hooks/useAddProductToCart";
import { useAddInPending } from "../../hooks/useAddProductInPending";
import { sortParams, nameCategory, limitNumbers } from "../../core/config"
import BreadCrumb from "./inc/breadCrumb";
import SpecsList from "./inc/specsList";
import SelectsForFilters from "./inc/selectsForFilters";
import CartLoader from "../home/inc/cartLoader";

function DetailCategory({ match }) {

    const slug = match.params.slug;

    const dispatch = useDispatch()

    const [categoryProducts, setCategoryProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)

    const [load, setLoad] = useState(true)

    const [openPage, setOpenPage] = useState('')

    const {minPrice, maxPrice, search, sort, limit, offset, currentPage, specifications} = useSelector(
        state => state.filterProduct
    )

    const addProductToCartCustomer = useAddProductToCart()
    const addProductInPending = useAddInPending()

    useEffect(() => {
        setLoad(true)
        categoriesProductsAPI(slug, limit, offset, sort, search, minPrice, maxPrice, specifications).then(response => {
            setOpenPage(slug)
            setCategoryProducts(response.data.results)
            setTotalProducts(response.data.count)
            setLoad(false)
        })
    }, [openPage, offset, limit, slug, specifications, maxPrice, minPrice, search, sort, currentPage]);

    function addToCart(obj) {
        addProductToCartCustomer.addToCart(obj, categoryProducts, setCategoryProducts)
    }

    let addInPending = (slug_product) => {
        addProductInPending.addInPending(slug_product)
    }

    let setLimit = (limit) => {
        dispatch(limitAction(limit))
        dispatch(offsetAction(0, 1))
    }

    let removeSpec = (e) => {
        dispatch(removeSpecAction(e))
        dispatch(offsetAction(0, 1))
    }

    let sortProducts = (e) => {
        dispatch(sortAction(e))
    }

    const totalNumber = Math.ceil(totalProducts / limit)
    const listNumber = [...Array(totalNumber).keys()].map(i => i + 1)

    return (
        <div className="container mt-4">
            <div className="row justify-content-start">
                <div className="col-3">
                    <Specification slug={slug}
                                   search={search}
                                   minPrice={minPrice}
                                   maxPrice={maxPrice}
                                   categoryProducts={categoryProducts}
                                   data={specifications}
                                   setOpenPage={setOpenPage}
                    />
                </div>
                <div className="col-8">

                        <>
                            <BreadCrumb openPage={openPage}
                                        setOpenPage={setOpenPage}
                                        nameCategory={nameCategory[slug]}
                            />

                            <SelectsForFilters nameCategory={nameCategory[slug]}
                                               sort={sort}
                                               slug={slug}
                                               setLimit={setLimit}
                                               sortProducts={sortProducts}
                                               limit={limit}
                                               limitNumbers={limitNumbers}
                                               sortParams={sortParams}
                            />

                            <SpecsList specifications={specifications}
                                       removeSpec={removeSpec}
                            />

                            <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3">
                            {
                                load ?
                                    <>
                                        {Array(Number(limit)).fill(
                                            <CartLoader/>
                                        )}
                                    </>
                                    :
                                    <>
                                        {
                                            categoryProducts.length !== 0 ?
                                                categoryProducts.map(e => (
                                                    <Cart data={e}
                                                          addToCart={addToCart}
                                                          idProduct={addProductToCartCustomer.idProduct}
                                                          addInPending={addInPending}
                                                    />
                                                ))
                                                :
                                                <p>Товару - {search} не знайдено</p>
                                        }
                                    </>

                            }
                            </div>

                            {
                                limit < totalProducts ?
                                    <>
                                        <Paginator
                                            slug={slug}

                                            totalNumber={totalNumber}
                                            listNumber={listNumber}
                                            currentPage={currentPage}
                                            totalProducts={totalProducts}
                                            limit={limit}
                                            offset={offset}
                                        />
                                    </> :
                                    ''
                            }

                        </>

                </div>
            </div>
        </div>
    );
}

export default DetailCategory;
