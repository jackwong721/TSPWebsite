import React, { useContext } from "react";
import "../../styles/LoginModal.css";
import { LocationContext } from '../../store/locations-context';

export default function LoginModal() {


  const LocationCtx = useContext(LocationContext)
  if(LocationCtx.loginModal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      {LocationCtx.loginModal && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="modal-content">
            <h2>THIS IS A LOGIN PAGE</h2>
            <p>
                Hello sir. How are you today?
            </p>
            <button className="close-modal" onClick={LocationCtx.toggleLoginModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}