import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from "axios";

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
import {useDispatch, useSelector} from "react-redux";


// if (localStorage.getItem('token')) {
//     axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token')
// }

function App() {
    const [currentUrl, setCurrentUrl] = useState('')

    return (
        <div className="wrapper">
            <Router>
                <Navbar currentUrl={currentUrl}/>
                <Switch>
                    <Route path="/" exact render={() => <Home setCurrentUrl={setCurrentUrl}/>}/>
                    <Route path="/category/:slug" exact
                           render={({match}) => <DetailCategory match={match} setCurrentUrl={setCurrentUrl}/>}/>
                    <Route path="/cart/" exact render={() => <Basket setCurrentUrl={setCurrentUrl}/>}/>
                    <Route path="/profile/" exact render={() => <Profile setCurrentUrl={setCurrentUrl}/>}/>
                    <Route path="/in-pending/" exact render={() => <InPending setCurrentUrl={setCurrentUrl}/>}/>
                    <Route path="/order/" exact render={() => <Order setCurrentUrl={setCurrentUrl}/>}/>


                    <Route  path={["/product/:slug", "/specification/:slug"]} exact
                           render={({match}) => <DetailProduct match={match} setCurrentUrl={setCurrentUrl}/>}/>
                    <Route path="/review/:slug" exact render={({match}) => <ReviewProduct match={match}/>}/>

                    <Route path="/registration/" exact component={Registration}/>
                    <Route path="/login/" exact component={Login}/>
                    <Route path="/auth/activate/:uid/:token/" exact component={Activation}/>
                    <Route path="/email-letter/" exact component={EmailLetter}/>

                </Switch>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;
