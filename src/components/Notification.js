import React from 'react';

function Notification({ message }) {
    return (
        <div className="notification">
            <span className="material-icons">check_circle</span>
            <span>{message}</span>
        </div>
    );
}

export default Notification;
