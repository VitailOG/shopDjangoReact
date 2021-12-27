import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from "react-bootstrap";


function CarouselImage(props) {

    return (
        <Carousel style={{ 'width': '50%', 'marginLeft': '103px', 'color': 'red' }} nextLabel={""} prevLabel={""}>
            {props.productImg && props.productImg.map((e => (
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={e.img}
                        alt="First slide"
                    />
                </Carousel.Item>
            )))}

        </Carousel>
    );
}

export default React.memo(CarouselImage);