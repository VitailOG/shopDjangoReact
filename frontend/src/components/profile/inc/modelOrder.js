import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Image, Table, Modal } from "react-bootstrap";
import TableDetailProduct from "./table";

function ModelOrder(props) {
    return (
        <div className="modal-dialog modal-xl">
            <Modal
                show={props.show}
                onHide={props.handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Деталізація замовлення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TableDetailProduct obj={props.obj} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default ModelOrder;