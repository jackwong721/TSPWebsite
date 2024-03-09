import { useState, useContext } from "react";
import { LocationContext } from "../../store/locations-context";
import "../../styles/SettingModal.css"

export default function SettingBar(props){

    const LocationCtx = useContext(LocationContext)


    if (props.content === 'kmMiles'){
        return(
            <div className="setting-bar">
                <p>kilometer/ mileage</p>
                {/* toggle button for distance measurement */}
                    <div className="switch-container">
                        <label className="switch">
                            <input
                            type="checkbox"
                            checked={LocationCtx.unit === 'miles'}
                            onChange={LocationCtx.handleUnitToggle}
                            />
                            <span className="slider round"></span>
                        </label>
                        <span className="unit">{LocationCtx.unit}</span>
                    </div>
            </div>
        )
        
    } else if (props.content === 'toggleLocationName') {
        return(
            <div className="setting-bar">
                Customized location name
                {/* toggle button for location name */}
                <div className="switch-container">
                    <label className="switch">
                        <input
                        type="checkbox"
                        checked={LocationCtx.showCustomLocationName === 'ON'}
                        onChange={LocationCtx.handleLocationNameToggle}
                        />
                        <span className="slider-locationName round"></span>
                    </label>
                    <span className="unit">{LocationCtx.showCustomLocationName}</span>
                </div>
            </div>
        )
    }

}