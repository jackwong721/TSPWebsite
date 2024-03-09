import React, { useContext } from "react";
import "../../styles/SettingModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { LocationContext } from '../../store/locations-context';
import SettingBar from "./SettingBar";

export default function SettingModal() {


  const LocationCtx = useContext(LocationContext)
  if(LocationCtx.settingModal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      {LocationCtx.settingModal && (
        <div className="setting-modal">
          <div className="overlay"></div>
          <div className="setting-modal-content">
            <div className="navbar-modal">
              <p style={{fontWeight: "bold", marginLeft: '15px', color: 'rgb(88, 119, 146)', fontSize: 22}}>SETTING</p>
              <div onClick={LocationCtx.toggleSettingModal} className='closeButton'>
                    <FontAwesomeIcon icon={faXmark}/>
              </div>
            </div>
            <div className="setting-child-modal">
              <p style={{fontWeight: "bold", color: 'rgb(120, 120, 120)', fontSize: 18}}>Preference</p>
              <SettingBar content='kmMiles'/>
              <SettingBar content='toggleLocationName'/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}