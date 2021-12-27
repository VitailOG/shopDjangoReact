import React from 'react';

function Price({
                   minPrice,
                   setMinPrice,
                   maxPrice,
                   setPrice,
                   setMaxPrice
}) {

    return (
        <div className="col-md-6">
            <input type="number"
                   placeholder="Від"
                   className="form-control mt-3" min={minPrice} value={minPrice}
                   onChange={event => setMinPrice(event.target.value)}
            />
            <input type="number"
                   placeholder="До"
                   className="form-control mt-1" value={maxPrice}
                   onChange={event => setMaxPrice(event.target.value)}
            />
            <button type="button"
                    className="btn btn-primary mt-2"
                    onClick={() => setPrice()}
            >Встановити ціну</button>
        </div>
    );
}

export default React.memo(Price);
