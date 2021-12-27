import React from 'react';

function SelectsForFilters({
                               limitNumbers,
                               limit,
                               sortProducts,
                               nameCategory,
                               sortParams,
                               sort,
                               setLimit,
                               slug
}) {

    return (
        <div className="row">
            <p className="fs-2">{nameCategory[slug]}
                <p className="fs-5 mt-2" style={{ width: "27%" }}>
                    <select className="form-select"
                            onChange={event => sortProducts(event.target.value)}
                    >
                        <option value={sort}>{sortParams[sort]}</option>
                        {Object.keys(sortParams).map(e => (
                            sort !== e ?
                                <option value={e}>{sortParams[e]}</option>
                                :
                                ""
                        ))}
                    </select>

                    <select className="form-select"
                            onChange={event => setLimit(event.target.value)}>
                        <option value={limit}>{limit}</option>
                        {limitNumbers.map(e => (
                            limit.toString() !== e ?
                                <option value={e}>{e}</option>
                                :
                                ""
                        ))}
                    </select>

                </p>
            </p>
        </div>
    );
}

export default React.memo(SelectsForFilters);
