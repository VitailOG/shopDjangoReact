import React from 'react';
import {Button, Image} from "react-bootstrap";

function Item({e, changeCountProductOnCart, deleteFromCart}) {

    return (
        <>
            <tr key={e.id}>
                <td>{e.product.title}</td>
                <td>
                    <form>
                        <input className="form-control"
                               defaultValue={e.count}
                               onChange={event => changeCountProductOnCart(event.target.value, e.id)}
                               min="1"
                               max={e.product.count_on_stock}
                               style={{ width: "60px", margin: "0 auto" }}
                               type="number" />
                    </form>
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                    <Image src={e.product.main_img}
                           style={{ width: "200px", height: "auto" }} fluid />
                </td>
                <td>{e.product.price} грн.</td>
                <td>{e.all_price} грн.</td>
                <td>
                    <Button variant="danger"
                            size="md"
                            id={e.id}
                            onClick={() => deleteFromCart(e.id)}
                            block>Видалити</Button>
                </td>
            </tr>
        </>
    );
}

export default Item;
