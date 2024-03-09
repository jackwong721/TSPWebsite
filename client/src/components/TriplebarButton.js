import React from 'react';
import '../styles/triplebarButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function TriplebarButton(props) {
  return (
    <div className="triplebarButton" onClick={props.handleClick}>
      <FontAwesomeIcon icon={props.buttonName}/>
    </div>
  );
}

export default TriplebarButton;