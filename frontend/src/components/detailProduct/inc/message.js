import React from 'react';


function Message({review, formated_date}) {
    return (
        <div className="incoming_msg">
            <div className="incoming_msg_img">
                <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
            </div>
            <div className="received_msg">
                <div className="received_withd_msg">
                    <p>{review}</p>
                    <span className="time_date">{formated_date}</span></div>
            </div>
        </div>
    );
}

export default React.memo(Message);
