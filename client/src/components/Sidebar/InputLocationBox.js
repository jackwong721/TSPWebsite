import React, { useContext, useEffect } from 'react';
import '../../styles/InputLocationBox.css';
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete"
import {Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption} from "@reach/combobox"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import { LocationContext } from '../../store/locations-context';
import "@reach/combobox/styles.css"

const greenlightStyle = {
  border: '2px solid rgb(122, 193, 66, 0.5)',
  backgroundColor: "rgb(122, 193, 66, 0.5)"
}

export default function InputLocationBox(props) {
  const LocationCtx = useContext(LocationContext)
  
  const hrStyle = {
    borderTop: '2px solid grey', /* add a border on the top */
    width: "97%",
  };


  function placesAutoCompleteComponentRendering(){
    if (LocationCtx.GoogleMapAPIReady){
      return(
        <PlacesAutocomplete 
          updateAddressCoordinateInput={LocationCtx.updateAddressCoordinateInput} 
          index={props.index}
          address={props.address}
          handleDropAddressInputChange={LocationCtx.handleDropAddressInputChange}
          handleStartAddressInputChange={LocationCtx.handleStartAddressInputChange}
          coordinate={props.coordinate}
          countryCode={LocationCtx.countryCode}
        />
        )
      } else {
        return(
          <div>Loading...</div>
        )
      }
    }

    function tickMarkRendering(){
      if (props.coordinate !== ''){
        return(
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="10" cy="10" r="10" fill="none"/>
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          )
      } else {
        return (
          <svg className="checkmark_grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle_grey" cx="10" cy="10" r="10" fill="none"/>
            <path className="checkmark__check_grey" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        )
      }
      
    }
    
    return (
      <div className='locationBox'>
        <div className='location-box-top-level'>
          {props.index === 0 ? <p className='pointsFont'>Starting Point</p>: <p className='pointsFont'>Drop Point {props.dropPointNo + 1}</p>}
          {props.index !== 0 ? 
            <div className='removeLocationButton' onClick={() => LocationCtx.deleteLocation(props.index)}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </div>:
            <div></div>
          }
        </div>
        
        {/* Location Name Input */}
        {LocationCtx.showCustomLocationName === "ON" && (
          <>
            <input
              type="text" 
              value={props.locationName} 
              name="locationName" 
              onChange={props.index === 0 ? LocationCtx.handleStartLocationNameInputChange : LocationCtx.handleDropLocationNameInputChange}
              id={props.index} 
              placeholder='Customize your location name'
              autoComplete="off"
            />
            <hr style={hrStyle}/>
          </>
        )}

        {/* Address Input and the tick mark*/}
        <div className='address-tickmark-container'>

          {/* Address Input */}
          <div className='address-input-container'>
            {placesAutoCompleteComponentRendering()}
          </div>
          
          {/* Tick Mark */}
          {tickMarkRendering()}
        </div>
      </div>
    );
  
}


const PlacesAutocomplete = (props) => {
  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete({requestOptions: { componentRestrictions: { country: props.countryCode } }})
  async function handleSelect(address){
    setValue(address, false);
    clearSuggestions()
    const results = await getGeocode({address});
    const {lat, lng} = await getLatLng(results[0]);
    props.updateAddressCoordinateInput(props.index, address, {lat, lng})
  }
 
  function handleInput(event, index){
    // Value of Places Auto Complete
    setValue(event.target.value)

    // Value in the location context
    if (index !== 0){
      props.handleDropAddressInputChange(index, event.target.value)
    } else {
      props.handleStartAddressInputChange(event.target.value)
    }
  }

 
  return (
  <Combobox onSelect={handleSelect}>
    <ComboboxInput value={props.address} disabled={!ready} onChange={(event) => handleInput(event, props.index)} className="combobox-input" placeholder="Search an address" style={props.coordinate !== ''? greenlightStyle : null}/>
    <ComboboxPopover style={{zIndex: 151515}}>
      <ComboboxList>
        {
        status === "OK" && 
        data.map(({place_id, description}) => (
          <ComboboxOption key={place_id} value={description}/>
        ))}
      </ComboboxList>
    </ComboboxPopover>

  </Combobox>
  )
}
