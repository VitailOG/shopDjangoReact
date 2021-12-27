import React from 'react';


function Form({setValue, value, sendMessage}) {
    return (
        <div className="type_msg">
            <div className="input_msg_write">
                <input type="text"
                       className="write_msg"
                       placeholder="Type a message"
                       value={value}
                       onChange={event => setValue(event.target.value)}
                />
                <button
                    className="msg_send_btn"
                    type="button"
                    onClick={sendMessage}>
                    <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                </button>

            </div>
        </div>
    );
}

export default Form;
