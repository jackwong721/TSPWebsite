import React from "react";
import "../styles/LoadingScreen.css";
import load from "../images/spinner2.gif"

export default function LoadingScreen(){
    return (
        <div className="loading-modal">
            <div className="loading-overlay"></div>
            <div className="loading-modal-content">
                <img src={load} alt="Loading" />
            </div>
        </div>  
    )
}