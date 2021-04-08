import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Cookies from 'js-cookie'
function Home() {
    return (
        <>
            <div className="home">
                <h1>Hello {(Cookies.get('user')) ? Cookies.get('user') : "Stranger"}</h1>
            </div>
        </>
    )
}

export default Home
