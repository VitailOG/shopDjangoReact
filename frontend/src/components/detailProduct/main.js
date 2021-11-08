import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Main(props) {

    return (
        <div className="App">
            <div className="row mt-5">
                <div className="col-5">

                </div>

                <div className="col-6">
                    <h3>{props.productName}</h3>
                    <br/>
                    <p>Ціна: <strong>{props.productPrice} грн.</strong></p>
                    <br/>
                    <button className="btn bg-secondary">Кнопка</button>
                </div>
            </div>
        </div>
    );
}

export default Main;