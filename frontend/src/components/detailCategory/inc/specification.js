import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import './autocomplete.css'
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

function Specification(props) {

    const nameSpec = {
        1: {
            'phone': 'Тип екрану',
            'pc': 'Модель відеокарти',
            'notebook': 'Діагональ дисплея',
            'tablet': 'Діагональ дисплея',
        },
        2: {
            'phone': 'Процесор',
            'pc': "Об`єм пам'яті відеокарти",
            'notebook': 'Кількість ядер',
            'tablet': 'Роздільна здатність дисплея',
        }
    }
    console.log("start detail category")

    const [specification, setSpecification] = useState([])
    const [nameProducts, setNameProducts] = useState([])

    const [search, setSearch] = useState(props.search)
    const [minPrice, setMinPrice] = useState(props.minPrice)
    const [maxPrice, setMaxPrice] = useState(props.maxPrice)

    const [autoCompleteActive, setAutoCompleteActive] = useState(false)

    const dispatch = useDispatch()

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
        specificationNameProductsAPI(props.slug).then(response => {
            setNameProducts(response)
        })
    }, [props.slug]);

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

    let filterNameProduct = nameProducts.filter(name => {
        return name.title.toLowerCase().includes(search.toLowerCase())
    })

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
                        autoCompleteActive && search ?
                            <React.Fragment>
                                <ul className="autocomplete">
                                    {filterNameProduct.map(e => (
                                        <li className="autocomplete__item" key={e}
                                            onClick={event => choiceProduct(event.target.textContent)}
                                        >{e.title}</li>
                                    ))}
                                </ul>
                            </React.Fragment>
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
                                        e.name_spec === "Модель відеокарти" && props.slug == 'pc' ?
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
                <div className="col-md-6">
                    <input type="number"
                        placeholder="Від"
                        className="form-control mt-3" min={minPrice} value={minPrice}
                        onChange={event => setMinPrice(event.target.value)}
                    />
                    <input type="number"
                        placeholder="До"
                        className="form-control mt-1" min={props.maxPrice} value={maxPrice}
                        onChange={event => setMaxPrice(event.target.value)}
                    />
                    <button type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => setPrice()}
                    >Встановити ціну</button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Specification);
