import React, { useContext } from "react";
import "../../styles/InfoModal.css";
import { LocationContext } from '../../store/locations-context';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function InfoModal() {

  const LocationCtx = useContext(LocationContext)
  if(LocationCtx.infoPageModal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      {LocationCtx.infoPageModal && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-content">
            <div className="introduction-container">
                <h3 style={{textAlign: "center"}}>Welcome to the beta version of Travel Genius!</h3>
                <p className="introduction-paragraph">
                    Travel Genius is the website which built upon travel sales problem theory, which provide a solution for calculating the shortest route among drop points.
                    It is very good and effective tool for route planning.
                </p>
                <p style={{textIndent: 50, lineHeight: 2.0}}>                    
                    Please login first before using this tool.
                    Please be noted that the starting point will always be the ending point. 
                    Maximum total 10 locations is only allowed per query (inclusive of both starting and drop points). 
                    "GENERATE" button becomes clickable only when all tick icons transition to green &#x2705;. 
                    <br/>
                </p>
                <p style={{textIndent: 50, lineHeight: 2.0}}>We value your input for suggestions on the improvement. So, feel free to reach out with suggestions at <a className="email-link" href="mailto:jackwong721@gmail.com">jackwong721@gmail.com</a>.</p>
            </div>
            <div onClick={LocationCtx.toggleInfoPageModal} className='close-modal'>
                    <FontAwesomeIcon icon={faXmark}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}