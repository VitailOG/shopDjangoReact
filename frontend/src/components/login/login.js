import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Col, InputGroup, Image, Button, Spinner } from 'react-bootstrap';
import { Formik } from "formik";
import * as yup from 'yup';
import { loginUrl } from '../router/urls'
import image from '../../eye (3).png';
import image2 from '../../eye (4).png';
import '../../App.css';

import { useAuth } from "../../hooks/useAuth";


function Login() {
    const [showPassword, setShowPassword] = useState(false)

    const auth = useAuth()

    const schema = yup.object().shape({
        username: yup.string().min(3, "Логін є коротким").required("Логін є обов'язковим полем"),
        password: yup.string().min(3, "Логін є коротким")
            .max(32, "Логін є надто довгим").required("Пароль є обов'язковим полем"),
    });

    let login = (e) => {
        auth.auth(e, loginUrl, '/')
    }

    return (
        <section id="cover" className="min-vh-100">
            <div id="cover-caption">
                <div className="container">
                    <div className="row text-white">
                        <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4"
                            id="login__block">
                            <h1 className="display-4 py-2 text-muted">Авторизація</h1>
                            <div className="px-2">

                                <Formik
                                    validationSchema={schema}
                                    onSubmit={values => login(values)}
                                    initialValues={{
                                        username: '',
                                        password: ''
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

                                            <br />
                                            <Form.Group as={Col} md="9" className="mx-auto"
                                                controlId="validationFormikPassword">

                                                <InputGroup hasValidation>
                                                    <InputGroup.Text id="inputGroupPrepend"
                                                        onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ?
                                                            <Image src={image} style={{ width: '16px' }} fluid />
                                                            :
                                                            <Image src={image2} style={{ width: '16px' }} fluid />
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

                                            <br />
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

                                                        className="btn btn-primary btn-lg">Увійти</button>
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
    );
}

export default Login;
