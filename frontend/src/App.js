import React, { useRef } from 'react';
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


function App() {

    const ref = useRef(null);
    return (
        <div className="wrapper">
            {/* https://codesandbox.io/s/react-loading-forked-nr9uf?file=/src/Menu.js */}
            <Router>
                <Navbar />
                <LoadingBar color="#f11946" ref={ref} />
                <Switch>
                    <Route path="/" exact render={() => <Home />} />
                    <Route path="/category/:slug" exact
                        render={({ match }) => <DetailCategory match={match} />} />

                    {/* <Route path="/cart/" render={() =>
                        <IsAuth>
                            <Basket />
                        </IsAuth>
                    } /> */}
                    <Route path="/cart/" render={() => <Basket />} />

                    <Route path="/profile/" exact render={() => <Profile />} />
                    <Route path="/in-pending/" exact render={() => <InPending />} />
                    <Route path="/order/" exact render={() => <Order />} />

                    <Route path={["/product/:slug", "/specification/:slug"]} exact
                        render={({ match }) => <DetailProduct match={match} />} />

                    <Route path="/review/:id" exact render={() => <ReviewProduct sss />} />

                    <Route path="/registration/" exact component={Registration} />
                    <Route path="/login/" exact component={Login} />
                    <Route path="/auth/activate/:uid/:token/" exact component={Activation} />
                    <Route path="/email-letter/" exact component={EmailLetter} />

                </Switch>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
