import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from "yup";
import {Formik, Field} from "formik";
import {useHistory} from "react-router-dom";
import {mutate} from "swr";
import Toast from 'react-bootstrap/Toast'
import {Col, Form, InputGroup, Button} from "react-bootstrap";
import {cartCustomer} from "../router/urls";
import $axios from "../../http";

function Order(props) {

    props.setCurrentUrl(window.location.href)

    const history = useHistory();
    const [error, setError] = useState('')
    const [show, setShow] = useState(false);

    const schema = yup.object().shape({
        firstName: yup.string().required("Ім'я є обов'язковим полем"),
        lastName: yup.string().required("Прізвище є обов'язковим полем"),
        date: yup.date().min(new Date(Date.now() - 86400000), "Дата не може бути меншою за сьогодні")
            .required("Дата є обов'язковим полем"),
        phone: yup.number().positive("Поле не можу бути негативним").min(8).required("Номер телефону є обов'язковим полем"),
        address: yup.string().required("Адрес є обов'язковим полем"),
        typeDelivery: yup.string().required(),

        promoCode: yup.string(),
    });

    let makeOrder = (data) => {
        console.log(data)
        $axios.post('/order/make-order/order/', data).then(res => {
            console.log(res.data)
            if(res.data.error){
                setError(res.data.error)
                setShow(true)
            }else if(res.data.success){
                mutate(cartCustomer)
                history.push("/")
            }
        }).catch(() => {
            console.log('order error')
        })
    }

    return (
        <div className="App">
            <section id="cover" className="min-vh-100">
                <div id="cover-caption-registration">
                    <div className="container">
                        <div className="row text-white">
                            <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4"
                                 id="login__block">

                            <Toast show={show} positive="top-left" onClose={() => setShow(false)}>
                                <Toast.Header>
                                    <strong className="me-auto">{error}</strong>
                                </Toast.Header>
                            </Toast>

                                <h2 className="display-5 py-2 text-muted">Оформлення замовлення</h2>

                                <div className="px-2">
                                    <Formik
                                        validationSchema={schema}
                                        onSubmit={values => makeOrder(values)}
                                        initialValues={{
                                            firstName: '',
                                            lastName: '',
                                            phone: '',
                                            date: '',
                                            typeDelivery: 'Доставка',
                                            promoCode: '',
                                        }}
                                    >
                                        {({
                                              handleSubmit,
                                              handleChange,
                                              handleBlur,
                                              values,
                                              touched,
                                              isValid,
                                              errors,
                                              dirty
                                          }) => (
                                            <Form noValidate onSubmit={handleSubmit} className="justify-content-center">

                                                <Form.Group as={Col} md="9" className="mx-auto"
                                                            controlId="validationFormikFirstName">
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text id="inputGroupPrepend">
                                                            <strong>N</strong>
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Ім'я"
                                                            aria-describedby="inputGroupPrepend"
                                                            name="firstName"
                                                            value={values.firstName}
                                                            onChange={handleChange}
                                                            isInvalid={!!errors.firstName}
                                                        />
                                                        <Form.Control.Feedback type="invalid" tooltip>
                                                            {errors.firstName}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>

                                                <br/>
                                                <Form.Group as={Col} md="9" className="mx-auto"
                                                            controlId="validationFormikLastName">
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text id="inputGroupPrepend">
                                                            <strong>L</strong>
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Прізвище"
                                                            aria-describedby="inputGroupPrepend"
                                                            name="lastName"
                                                            value={values.lastName}
                                                            onChange={handleChange}
                                                            isInvalid={!!errors.lastName}
                                                        />
                                                        <Form.Control.Feedback type="invalid" tooltip>
                                                            {errors.lastName}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>

                                                <br/>
                                                <Form.Group as={Col} md="9" className="mx-auto"
                                                            controlId="validationFormikPhone">
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text id="inputGroupPrepend">
                                                            <strong>&#9990;</strong>
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="phone"
                                                            placeholder="Телефон"
                                                            aria-describedby="inputGroupPrepend"
                                                            name="phone"
                                                            value={values.phone}
                                                            onChange={handleChange}
                                                            isInvalid={!!errors.phone}
                                                        />
                                                        <Form.Control.Feedback type="invalid" tooltip>
                                                            {errors.phone}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>

                                                <br/>
                                                <Form.Group as={Col} md="9" className="mx-auto"
                                                            controlId="validationFormikAddress">
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text id="inputGroupPrepend">
                                                            <strong>A</strong>
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="address"
                                                            placeholder="Адрес"
                                                            aria-describedby="inputGroupPrepend"
                                                            name="address"
                                                            value={values.address}
                                                            onChange={handleChange}
                                                            isInvalid={!!errors.address}
                                                        />
                                                        <Form.Control.Feedback type="invalid" tooltip>
                                                            {errors.address}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>

                                                <br/>
                                                <Form.Group as={Col} md="9" className="mx-auto"
                                                            controlId="validationFormikDate">
                                                    <InputGroup hasValidation>
                                                        <Form.Control
                                                            type="date"
                                                            aria-describedby="inputGroupPrepend"
                                                            name="date"
                                                            value={values.date}
                                                            onChange={handleChange}
                                                            isInvalid={!!errors.date}
                                                        />
                                                        <Form.Control.Feedback type="invalid" tooltip>
                                                            {errors.date}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>


                                                <br/>
                                                <Form.Group as={Col} md="9" className="mx-auto"
                                                            controlId="validationFormikTypeDelivery">

                                                    <InputGroup hasValidation>

                                                        <Field name="typeDelivery"
                                                               className="form-select"
                                                               as="select"
                                                               aria-describedby="inputGroupPrepend"
                                                               value={values.typeDelivery}
                                                               onChange={handleChange}
                                                        >
                                                            <option value="Доставка">Доставка</option>
                                                            <option value="Самовивоз">Самовивоз</option>
                                                        </Field>

                                                        <Form.Control.Feedback type="invalid" tooltip>
                                                            {errors.typeDelivery}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>

                                                <br/>

                                                <Form.Group as={Col} md="9" className="mx-auto"
                                                            controlId="validationFormikPromoCode">
                                                    <InputGroup hasValidation>
                                                        <InputGroup.Text id="inputGroupPrepend">
                                                            <strong>P</strong>
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Промо код"
                                                            aria-describedby="inputGroupPrepend"
                                                            name="promoCode"
                                                            value={values.promoCode}
                                                            onChange={handleChange}
                                                            isInvalid={!!errors.promoCode}
                                                        />
                                                        <Form.Control.Feedback type="invalid" tooltip>
                                                            {errors.promoCode}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>


                                                <br/>
                                                <button type="submit"
                                                        disabled={!isValid || !dirty}
                                                        onClick={() => console.log('add')}
                                                        className="btn btn-primary btn-lg">Оформити замовлення
                                                </button>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

    </div>
    );
}

export default Order;