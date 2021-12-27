import React from 'react';

function SpecsList({specifications,  removeSpec}) {

    return (
        <div className="mb-3">
            {
                specifications && specifications.map(e => (
                    <span className="badge badge-success"
                          style={{ background: "#29c329", display: "inlineBlock", marginLeft: "5px" }}
                          key={e}>
                        {e}
                        <span className="badge badge-light"
                                 style={{ cursor: "pointer", padding: "4px" }}
                                 onClick={() => removeSpec(e)}
                            >&#10006;</span>
                    </span>
                ))
            }
        </div>
    );
}

export default React.memo(SpecsList);
