import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from "yup";
import {Formik} from "formik";
import {Button, Col, Form, Image, InputGroup, Spinner} from "react-bootstrap";
import image from "../../eye (3).png";
import image2 from "../../eye (4).png";
import '../../App.css';
import {registrationUrl} from "../router/urls";
import {useAuth} from "../../hooks/useAuth";

function Registration() {
    const [showPassword, setShowPassword] = useState(false)
    const auth = useAuth()

    let registration = (e) =>{
        auth.auth(e, registrationUrl, '/email-letter/')
    }

    const schema = yup.object().shape({
        username: yup.string().min(3, "Логін є коротким").required("Логін є обов'язковим полем"),
        first_name: yup.string().required("Ім'я є обов'язковим полем"),
        last_name: yup.string().required("Прізвище є обов'язковим полем"),
        email: yup.string().email('Введіть корректну пошту').required("Пошта є обов'язковим полем"),
        customer_phone: yup.string(),
        password: yup.string().min(3, "Логін є коротким").max(32, "Логін є надто довгим")
            .required("Пароль є обов'язковим полем"),
        password_confirm: yup.string().oneOf([yup.ref('password')], 'Паролі не співпадають')
            .required("Підтвердження пароля є обов'язковим полем"),
    });
    return (
        <div className="App">
            <section id="cover" className="min-vh-100">
            <div id="cover-caption-registration">
                <div className="container">
                    <div className="row text-white">
                        <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4"
                             id="login__block">
                            <h1 className="display-4 py-2 text-muted">Реєстрація</h1>
                            <div className="px-2">

                                <Formik
                                    validationSchema={schema}
                                    onSubmit={values => registration(values)}
                                    initialValues={{
                                        username: '',
                                        first_name: '',
                                        last_name: '',
                                        email: '',
                                        customer_phone: '',
                                        password: '',
                                        password_confirm: '',
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
                                                        controlId="validationFormikUsername">
                                                <InputGroup hasValidation>
                                                    <InputGroup.Text id="inputGroupPrepend">
                                                        <strong>U</strong>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Логін"
                                                        aria-describedby="inputGroupPrepend"
                                                        name="username"
                                                        value={values.username}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.username}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.username}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>

                                            <br/>
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
                                                        name="first_name"
                                                        value={values.first_name}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.first_name}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.first_name}
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
                                                        name="last_name"
                                                        value={values.last_name}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.last_name}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.last_name}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>

                                            <br/>
                                            <Form.Group as={Col} md="9" className="mx-auto"
                                                        controlId="validationFormikEmail">
                                                <InputGroup hasValidation>
                                                    <InputGroup.Text id="inputGroupPrepend">
                                                        <strong>@</strong>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Email"
                                                        aria-describedby="inputGroupPrepend"
                                                        name="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.email}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.email}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>


                                            <br/>
                                            <Form.Group as={Col} md="9" className="mx-auto"
                                                        controlId="validationFormikPhone">

                                                <InputGroup hasValidation>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Телефон"
                                                        aria-describedby="inputGroupPrepend"
                                                        name="customer_phone"
                                                        value={values.customer_phone}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.customer_phone}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.customer_phone}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>


                                            <br/>
                                            <Form.Group as={Col} md="9" className="mx-auto"
                                                        controlId="validationFormikPassword">
                                                <InputGroup hasValidation>
                                                    <InputGroup.Text id="inputGroupPrepend"
                                                                     onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ?
                                                            <Image src={image} style={{width: '16px'}} fluid/>
                                                            :
                                                            <Image src={image2} style={{width: '16px'}} fluid/>
                                                        }
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Пароль"
                                                        aria-describedby="inputGroupPrepend"
                                                        name="password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.password}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>

                                            <br/>
                                            <Form.Group as={Col} md="9" className="mx-auto"
                                                        controlId="validationFormikPasswordConfirm">
                                                <InputGroup hasValidation>
                                                    <InputGroup.Text id="inputGroupPrepend"
                                                                     onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ?
                                                            <Image src={image} style={{width: '16px'}} fluid/>
                                                            :
                                                            <Image src={image2} style={{width: '16px'}} fluid/>
                                                        }
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Повторіть пароль"
                                                        aria-describedby="inputGroupPrepend"
                                                        name="password_confirm"
                                                        value={values.password_confirm}
                                                        onChange={handleChange}
                                                        isInvalid={!!errors.password_confirm}
                                                    />
                                                    <Form.Control.Feedback type="invalid" tooltip>
                                                        {errors.password_confirm}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>

                                            <br/>
                                            {
                                                auth.loading ?
                                                    <Button className="btn btn-primary btn-lg">
                                                        <Spinner
                                                            as="span"
                                                            animation="grow"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                        Увійти
                                                    </Button>
                                                    :
                                                    <button type="submit"
                                                            disabled={!isValid || !dirty}
                                                            onClick={() => console.log('add')}

                                                            className="btn btn-primary btn-lg">Зараєструватись</button>
                                             }
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

export default Registration;
