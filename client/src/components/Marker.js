import React, {useContext} from "react"
import { LocationContext } from '../store/locations-context';
import truckIcon from '../images/cargo-truck.png'; 
import {Marker, InfoWindow} from "@react-google-maps/api"

export function StartingPointMarker (){
    const LocationCtx = useContext(LocationContext)

    // Not rendering if the coordinate is empty at start
    if (LocationCtx.startingPoint['coordinate'] !== ''){
      return (
        <Marker 
          position={LocationCtx.startingPoint['coordinate']}
          animation={window.google.maps.Animation.DROP}
          onMouseOver={() => LocationCtx.toggleInfoWindow(0, true)}
          onMouseOut={() =>LocationCtx.toggleInfoWindow(0, false)}
          icon={{
            url: truckIcon,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: { x: 20, y: 20 },
          }}
        >
        
          {/* INFOR Window */}
          {LocationCtx.startingPoint.infoWindowVisible && (
            <InfoWindow position={LocationCtx.startingPoint['coordinate']}>
                <div>
                    <h3>STARTING POINT</h3>
                    <p><strong>Name:</strong> {LocationCtx.startingPoint['locationName']}</p>
                    <p><strong>Address:</strong> {LocationCtx.startingPoint['address']}</p>
                    <p><strong>Coordinate:</strong> {`${LocationCtx.startingPoint['coordinate']['lat']}, ${LocationCtx.startingPoint['coordinate']['lng']}`}</p>
                </div>
            </InfoWindow>
          )}

        </Marker>
       )
    }
  }

export function DropPointMarker(){
    const LocationCtx = useContext(LocationContext)

    return (
      // Not rendering if the coordinate is empty at start
      LocationCtx.dropPoints.map((item) => {
        if (Object.keys(item.coordinate).length===0){
          return null
        } else {
          return (
          <Marker
           key={item.index} 
           position={item.coordinate}
           animation={window.google.maps.Animation.DROP}
           onMouseOver={()=>LocationCtx.toggleInfoWindow(item.index, true)}
           onMouseOut={()=>LocationCtx.toggleInfoWindow(item.index, false)}
          //  label={LocationCtx.backendResult && LocationCtx.backendResult['suggestRoute'] && {text: `${LocationCtx.backendResult['suggestRoute'].indexOf(item.index)}`, fontWeight: "bold"}}
          > 
          
            {/* INFOR Window */}

            {item.infoWindowVisible && (
              <InfoWindow position={item.coordinate}>
                <div>
                    <h3>DROP POINT {item.index}</h3>
                    <p><strong>Name:</strong> {item['locationName']}</p>
                    <p><strong>Address:</strong> {item['address']}</p>
                    <p><strong>Coordinate:</strong> {`${item['coordinate']['lat']}, ${item['coordinate']['lng']}`}</p>
                </div>
              </InfoWindow>
            )}

          </Marker>
          )
        }
        
      })
    )
  }
