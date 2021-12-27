import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './inc/review.css'
import NavBar from "./inc/nav";
import { reviewProductAPI } from "../../http/api/product";
import Message from "./inc/message";
import Form from "./inc/form";

function ReviewProduct() {

    const location = useLocation()
    const { id } = useParams();
    const [reviews, setReviews] = useState([])
    const [countReviews, setCountReviews] = useState(0)

    const [value, setValue] = useState('')

    const socketReview = useRef();

    const isAuth = useSelector(state => state.auth.isAuth)

    useEffect(() => {
        reviewProductAPI(id).then(response => {
            setReviews(response)
            setCountReviews(response.length)
        })
    }, [id]);


    useEffect(() => {
        if (isAuth) {
            socketReview.current = new WebSocket(`ws://127.0.0.1:8000/product/${id}/`)

            socketReview.current.onopen = () => {
                console.log('start')
            }

            socketReview.current.onmessage = (event) => {
                let data = event['data']
                let message = JSON.parse(data)['message']

                setReviews(reviews => [...reviews, message])
                setCountReviews(countReviews => countReviews + 1)
            }

            socketReview.current.onclose = () => {
                console.log('close')
            }

            socketReview.current.onerror = () => {
                console.log('error')
            }

        }
    }, [isAuth])

    let sendMessage = () => {
        if (value.trim()) {
            const data = {
                value: value
            }
            socketReview.current.send(JSON.stringify(data))

            setValue('')
        } else {
            console.log('no send')
        }
    }

    return (
        <div className="container mt-5">
            <NavBar productSlug={localStorage.getItem('productSlug')}
                    location={location}
            />

            <div className="container">
                <h3 className=" text-center">Відгуки ({countReviews})</h3>
                <div className="messaging">
                    <div className="inbox_msg">
                        <div className="mesgs">
                            <div className="msg_history">

                                {reviews.map(e => (
                                    <Message key={e.id} review={e.review} formated_date={e.formated_date}/>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Form setValue={setValue} value={value} sendMessage={sendMessage}/>

        </div>
    );
}

export default ReviewProduct;
