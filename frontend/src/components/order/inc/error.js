import React from 'react';
import {Alert} from "react-bootstrap";


function Error({incorrectProduct, error, hideBadProduct}) {

    return (
        <>
            {
                incorrectProduct.length > 0 ?
                    incorrectProduct.map(obj =>(
                        <Alert key={obj.id} variant="danger" onClick={hideBadProduct}>
                            {obj.title}: на складі - {obj.countOnStock}, обрали Ви - {obj.cartProduct}
                        </Alert>
                    ))
                    :
                    error ?
                        <Alert variant="danger" onClick={hideBadProduct}>
                            {error}
                        </Alert>
                        :
                        ""
            }

        </>
    );
}

export default Error;