import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cart from "../home/inc/cart";
import Paginator from "./inc/paginator";
import LoaderProduct from "../home/inc/loaderProduct";
import { Link } from "react-router-dom";
import Specification from "./inc/specification";
import { cartCustomer } from "../router/urls";
import { mutate } from "swr";
import { useDispatch, useSelector } from "react-redux";
import { limitAction, offsetAction, removeSpecAction, sortAction } from "../../store/actionCreators";
import { addProductToCartAPI } from "../../http/api/cart";
import { useChangeProductInCart } from "../../hooks/useChangeProductInCart";
import { categoriesProductsAPI } from "../../http/api/product";
import { useAddProductToCart } from "../../hooks/useAddProductToCart";
import { useAddInPending } from "../../hooks/useAddProductInPending";


function DetailCategory({ match, setCurrentUrl }) {
    setCurrentUrl(window.location.href)

    const sortParams = {
        "-id": "Нові",
        "id": "Старіші",
        "price": "Від дешевих до дорогих",
        "-price": "Від дорогих до дешевих"
    }

    const nameCategory = {
        'phone': 'Телефони',
        'tablet': 'Планшети',
        'pc': 'Копм`ютери',
        'notebook': 'Нотбуки',
    }

    const limitNumbers = ['3', '6', '9'];

    const slug = match.params.slug;

    const dispatch = useDispatch()

    const [categoryProducts, setCategoryProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)

    const [idProduct, setIdProduct] = useState([])

    const [load, setLoad] = useState(true)

    const [openPage, setOpenPage] = useState('')

    const sort = useSelector(state => state.filterProduct.sort)

    const isAuth = useSelector(state => state.auth.isAuth)

    const limit = useSelector(state => state.filterProduct.limit)
    const offset = useSelector(state => state.filterProduct.offset)
    const currentPage = useSelector(state => state.filterProduct.currentPage)

    const search = useSelector(state => state.filterProduct.search)

    const minPrice = useSelector(state => state.filterProduct.minPrice)
    const maxPrice = useSelector(state => state.filterProduct.maxPrice)

    const specs = useSelector(state => state.filterProduct.specifications)

    const addProductToCartCustomer = useAddProductToCart()
    const addProductInPending = useAddInPending()


    useEffect(() => {
        categoriesProductsAPI(slug, limit, offset, sort, search, minPrice, maxPrice, specs).then(response => {
            setOpenPage(slug)
            setCategoryProducts(response.data.results)
            setTotalProducts(response.data.count)
            setLoad(false)
        })
    }, [openPage, offset, limit, slug, specs, maxPrice, minPrice, search, sort, currentPage]);

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

                        data={specs}

                        setOpenPage={setOpenPage}
                    />
                </div>
                <div className="col-8">
                    {load ?
                        <LoaderProduct />
                        :
                        <React.Fragment>

                            <nav className="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link style={{ 'textDecoration': 'none' }}
                                            to={{ pathname: `/`, fromDashboard: false }}>Домашня</Link>
                                    </li>
                                    <li className="breadcrumb-item active"
                                        onClick={() => setOpenPage(!openPage)}
                                        aria-current="page">{nameCategory[slug]}</li>
                                </ol>
                            </nav>

                            <div className="row">
                                <p className="fs-2">{nameCategory[slug]}
                                    <p className="fs-5 mt-2" style={{ width: "27%" }}>
                                        <select className="form-select"
                                            onChange={event => sortProducts(event.target.value)}
                                        >
                                            <option value={sort}>{sortParams[sort]}</option>
                                            {Object.keys(sortParams).map(e => (
                                                sort !== e ?
                                                    <option value={e}>{sortParams[e]}</option>
                                                    :
                                                    ""
                                            ))}
                                        </select>

                                        <select className="form-select"
                                            onChange={event => setLimit(event.target.value)}>
                                            <option value={limit}>{limit}</option>
                                            {limitNumbers.map(e => (
                                                limit.toString() !== e ?
                                                    <option value={e}>{e}</option>
                                                    :
                                                    ""
                                            ))}
                                        </select>

                                    </p>
                                </p>
                            </div>

                            <div className="mb-3">
                                {
                                    specs && specs.map(e => (
                                        <span className="badge badge-success"
                                            style={{ background: "#29c329", display: "inlineBlock", marginLeft: "5px" }}
                                            key={e}>
                                            {e}<span className="badge badge-light"
                                                style={{ cursor: "pointer", padding: "4px" }}
                                                onClick={() => removeSpec(e)}
                                            >&#10006;</span>
                                        </span>
                                    ))
                                }
                            </div>

                            <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3">
                                {
                                    categoryProducts.length !== 0 ?
                                        categoryProducts.map(e => (
                                            <Cart data={e}
                                                addToCart={addToCart}
                                                idProduct={addProductToCartCustomer.idProduct}
                                                addInPending={addInPending}
                                                isAuth={isAuth}
                                            />
                                        ))
                                        :
                                        <p>Товару - {search} не знайдено</p>
                                }
                            </div>

                            {
                                limit < totalProducts ?
                                    <React.Fragment>
                                        <Paginator
                                            slug={slug}

                                            totalNumber={totalNumber}
                                            listNumber={listNumber}
                                            currentPage={currentPage}
                                            totalProducts={totalProducts}
                                            limit={limit}
                                            offset={offset}
                                        />
                                    </React.Fragment> :
                                    ''
                            }

                        </React.Fragment>
                    }

                </div>
            </div>
        </div>
    );
}

export default DetailCategory;
