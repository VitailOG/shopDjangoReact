import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SpecificationProduct(props) {

    return (
        <div className="App">
            <h1 className="text-center fs-3 mt-4 mb-4">Характеристики</h1>
            <div className="row justify-content-center">
                <table className="table w-75">
                    <tbody>
                        {props.productSpec && props.productSpec.map((e, i) =>(
                            <tr key={i}>
                                <td className="col-md-2">{ e.name_spec }</td>
                                <td className="col-md-2">{ e.value_spec }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SpecificationProduct;