import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import {
    addSpecAction,
    maxPriceAction,
    minPriceAction,
    offsetAction,
    removeSpecAction,
    searchAction
} from "../../../store/actionCreators";
import { specificationNameProductsAPI, specificationProductsAPI } from "../../../http/api/product";
import Price from "../inc/spec/price";
import {nameSpec} from "../../../core/config";

import 'bootstrap/dist/css/bootstrap.min.css';
import './autocomplete.css';
import LoaderProduct from "../../home/inc/loaderProduct";


function Specification(props) {

    const [specification, setSpecification] = useState([])

    const [nameProducts, setNameProducts] = useState([])
    const [loadProductsName, setLoadProductsName] = useState(false)

    const [search, setSearch] = useState(props.search)
    const [minPrice, setMinPrice] = useState(props.minPrice)
    const [maxPrice, setMaxPrice] = useState(props.maxPrice)

    const [autoCompleteActive, setAutoCompleteActive] = useState(false)

    const dispatch = useDispatch()

    const correctSearch = search.trim().length > 3

    let addOrRemoveSpecification = (value) => {
        if (props.data.indexOf(value) !== -1) {
            dispatch(removeSpecAction(value))
            dispatch(offsetAction(0, 1))
        } else {
            dispatch(addSpecAction(value))
            dispatch(offsetAction(0, 1))
        }
    }

    useEffect(() => {
        if (correctSearch){
            setLoadProductsName(true)
            specificationNameProductsAPI(props.slug, search).then(response => {
                setNameProducts(response)
                setLoadProductsName(false)
            })
        }
    }, [search]);

    useEffect(() => {
        specificationProductsAPI(props.slug).then(response => {
            setSpecification(response)
            setSearch(props.search)
            setMinPrice(props.minPrice)
            setMaxPrice(props.maxPrice)
        })
    }, [props.slug]);

    function setSearchValue() {
        dispatch(searchAction(search))
        dispatch(offsetAction(0, 1))
        setAutoCompleteActive(false)
    }

    let setPrice = () => {
        dispatch(maxPriceAction(maxPrice))
        dispatch(minPriceAction(minPrice))
        dispatch(offsetAction(0, 1))
    }

    let choiceProduct = (e) => {
        setSearch(e)
        setAutoCompleteActive(false)
    }

    return (
        <div className="App">

            <div>

                <form className="search__form">

                    <div className="input-group mb-3">
                         <input type="text"
                            className="form-control"
                            placeholder="Введіть назву товару"
                            value={search}
                            onFocus={() => setAutoCompleteActive(true)}
                            onChange={event => setSearch(event.target.value)}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setSearchValue()}
                            >Знайти</button>
                        </div>
                    </div>

                    {
                         correctSearch && autoCompleteActive ?
                             <>
                                 {
                                     !loadProductsName ?

                                         nameProducts.length > 0 ?
                                             <ul className="autocomplete">
                                                {nameProducts.map(e => (
                                                    <li className="autocomplete__item" key={e}
                                                        onClick={event => choiceProduct(event.target.textContent)}
                                                    >{e.title}</li>
                                                ))}
                                            </ul>
                                             :

                                             <ul className="autocomplete">
                                                <li style={{ padding: '10px' }}>Товарів не знайдено {search}</li>
                                             </ul>

                                         :
                                         <ul className="autocomplete">
                                             <LoaderProduct/>
                                        </ul>
                                 }
                            </>
                            :
                            ""
                     }


                </form>
            </div>

            <div className="accordion" id="accordionPanelsStayOpenExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseOne">
                            Бренд
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse"
                        aria-labelledby="panelsStayOpen-headingOne">
                        <div className="accordion-body">
                            {
                                specification.map(e => (
                                    e.name_spec === "Бренд" ?
                                        <React.Fragment>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                    onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                    id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                <label className="form-check-label" for={e.value_spec}>
                                                    {e.value_spec}
                                                </label>
                                            </div>
                                        </React.Fragment>
                                        :
                                        ''
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseTwo">
                            {nameSpec[1][props.slug]}
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse"
                        aria-labelledby="panelsStayOpen-headingTwo">
                        <div className="accordion-body">
                            {
                                specification.map(e => (
                                    e.name_spec === "Тип екрану" && props.slug == 'phone' ?
                                        <>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                    onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                    id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                <label className="form-check-label" for={e.value_spec}>
                                                    {e.value_spec}
                                                </label>
                                            </div>
                                        </>
                                        :
                                        e.name_spec === "Модель відеокарти" && props.slug == 'pc' ?
                                            <>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                        onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                        id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                    <label className="form-check-label" for={e.value_spec}>
                                                        {e.value_spec}
                                                    </label>
                                                </div>
                                            </>
                                            : e.name_spec === "Діагональ дисплея" && props.slug == 'tablet' ?
                                                <React.Fragment>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                            onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                            id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                        <label className="form-check-label" for={e.value_spec}>
                                                            {e.value_spec}
                                                        </label>
                                                    </div>
                                                </React.Fragment>
                                                : e.name_spec === "Діагональ дисплея" && props.slug == 'notebook' ?
                                                    <React.Fragment>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                                onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                                id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                            <label className="form-check-label" for={e.value_spec}>
                                                                {e.value_spec}
                                                            </label>
                                                        </div>
                                                    </React.Fragment> : ""
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseThree">
                            {nameSpec[2][props.slug]}
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse"
                        aria-labelledby="panelsStayOpen-headingThree">
                        <div className="accordion-body">

                            {
                                specification.map(e => (
                                    e.name_spec === "Процесор" && props.slug == 'phone' ?
                                        <React.Fragment>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                    onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                    id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                <label className="form-check-label" for={e.value_spec}>
                                                    {e.value_spec}
                                                </label>
                                            </div>
                                        </React.Fragment>
                                        :
                                        e.name_spec === "Об`єм пам'яті відеокарти" && props.slug == 'pc' ?
                                            <React.Fragment>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                        onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                        id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                    <label className="form-check-label" for={e.value_spec}>
                                                        {e.value_spec}
                                                    </label>
                                                </div>
                                            </React.Fragment>
                                            : e.name_spec === "Роздільна здатність дисплея" && props.slug == 'tablet' ?
                                                <React.Fragment>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                            onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                            id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                        <label className="form-check-label" for={e.value_spec}>
                                                            {e.value_spec}
                                                        </label>
                                                    </div>
                                                </React.Fragment>
                                                : e.name_spec === "Кількість ядер" && props.slug == 'notebook' ?
                                                    <React.Fragment>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" value={e.value_spec}
                                                                onClick={() => addOrRemoveSpecification(e.value_spec)}
                                                                id={e.value_spec} checked={props.data.indexOf(e.value_spec) !== -1} />
                                                            <label className="form-check-label" for={e.value_spec}>
                                                                {e.value_spec}
                                                            </label>
                                                        </div>
                                                    </React.Fragment> : ""
                                ))
                            }

                        </div>
                    </div>
                </div>

                <Price minPrice={minPrice}
                       setMinPrice={setMinPrice}
                       maxPrice={maxPrice}
                       setPrice={setPrice}
                       setMaxPrice={setMaxPrice}
                />

            </div>
        </div>
    );
}

export default React.memo(Specification);
