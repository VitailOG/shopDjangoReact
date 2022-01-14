import React, { useRef, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from "./components/navigation/navbar";
import Footer from "./components/footer/footer";
import Home from "./components/home/home";
import DetailCategory from "./components/detailCategory/detailCategory";
import Basket from "./components/basket/basket";
import DetailProduct from "./components/detailProduct/detailProduct";
import Login from "./components/login/login";
import Registration from "./components/registration/registration";
import Profile from "./components/profile/profile";
import Order from "./components/order/order";
import InPending from "./components/profile/inPending";
import ReviewProduct from "./components/detailProduct/reviewProduct";
import Activation from "./components/registration/activation";
import EmailLetter from "./components/registration/emailLetter"

import LoadingBar from "react-top-loading-bar";
import { IsAuth } from "./hoc/IsAuth"
import {useSelector} from "react-redux";
import {useFetchDetailProduct} from "./hooks/useFetchDetailProduct";


function App() {
    const username = useSelector(state => state.auth.username)

    const socket = useRef();

    socket.current = new WebSocket(`ws://127.0.0.1:8000/${username}/?token=${localStorage.getItem('token')}`)

    const ref = useRef();
    const {fetchProductDetail, product, setProduct} = useFetchDetailProduct(ref)

    let finishFetch = () =>{
        ref.current.complete()
    }

    return (
        <div className="wrapper">
             {/*https://codesandbox.io/s/react-loading-forked-nr9uf?file=/src/Menu.js */}
                <Navbar socket={socket.current}/>
                <LoadingBar color="#808080" ref={ref} height={3}/>

                <Switch>
                    {/*Private route*/}
                    <Route path="/profile/" render={() =>
                        <IsAuth>
                            <Profile />
                        </IsAuth>
                    } />

                    <Route path="/in-pending/" render={() =>
                        <IsAuth>
                            <InPending socket={socket.current}/>
                        </IsAuth>
                    } />

                    <Route path="/order/" render={() =>
                        <IsAuth>
                            <Order />
                        </IsAuth>
                    } />

                    <Route path="/" exact render={() => <Home fetchProductDetail={fetchProductDetail}/>} />

                    <Route path="/category/:slug" exact
                        render={({ match }) =>
                            <DetailCategory
                                match={match}
                                fetchProductDetail={fetchProductDetail}
                            />}
                    />

                    <Route path="/cart/" render={() => <Basket />} />

                    <Route path={["/product/:slug", "/specification/:slug"]} exact
                        render={({ match }) =>
                            <DetailProduct
                                match={match}
                                product={product}
                                setProduct={setProduct}
                                finishFetch={finishFetch}
                            />}
                    />

                    <Route path="/review/:id" exact render={() => <ReviewProduct />} />

                    <Route path="/registration/" exact component={Registration} />
                    <Route path="/login/" exact component={Login} />
                    <Route path="/auth/activate/:uid/:token/" exact component={Activation} />
                    <Route path="/email-letter/" exact component={EmailLetter} />

                </Switch>
                <Footer />
        </div>
    );
}

export default App;
