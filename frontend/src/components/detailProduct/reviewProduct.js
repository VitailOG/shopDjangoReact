import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './inc/review.css'

import NavBar from "./inc/nav";
import { reviewProductAPI } from "../../http/api/product";


function ReviewProduct() {

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
                console.log(message)
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

            console.log('send')
            setValue('')
        } else {
            console.log('no send')
        }
    }

    return (
        <div className="container mt-5">
            <NavBar productSlug={id} />


            <div className="container">
                <h3 className=" text-center">Відгуки ({countReviews})</h3>
                <div className="messaging">
                    <div className="inbox_msg">
                        <div className="mesgs">
                            <div className="msg_history">

                                {reviews.map(e => (
                                    <div className="incoming_msg" key={e.id}>
                                        <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                        <div className="received_msg">
                                            <div className="received_withd_msg">
                                                <p>{e.review}</p>
                                                <span className="time_date">{e.formated_date}</span></div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="type_msg">
                <div class="input_msg_write">
                    <input type="text"
                        class="write_msg"
                        placeholder="Type a message"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                    />
                    <button
                        class="msg_send_btn"
                        type="button"
                        onClick={sendMessage}>
                        <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
                    </button>

                </div>
            </div>

        </div>
    );
}

export default ReviewProduct;
