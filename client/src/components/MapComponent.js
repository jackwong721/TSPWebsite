import React, {useState, useContext, useEffect, useLayoutEffect} from 'react'
import { getCode } from 'iso-3166-1-alpha-2';
import '../styles/MapComponent.css';
import { GoogleMap, useJsApiLoader, Polyline} from "@react-google-maps/api"
import { LocationContext } from '../store/locations-context';
import { StartingPointMarker } from './Marker';
import { DropPointMarker} from './Marker';


const secretkey = 'AIzaSyAdyCPMwKiV1QZzdYSVlEaFWA_6RRIIV2g'
const libraries = ['places']


export function MapComponent(){

  const LocationCtx = useContext(LocationContext)

  const [center, setCenter] = useState(null)
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))

  async function fetchUserCountry () {
    navigator.geolocation.getCurrentPosition(

      // When Success
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCenter({lat: position.coords.latitude, lng: position.coords.longitude})

        // Call the reverse geocoding service to get user's country
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${secretkey}`
        )
          .then(response => response.json())
          .then(data => {
            const country = data.results[0].address_components.find(
              component => component.types.includes('country')
            );
            LocationCtx.setSearchBoundary(getCode(country.long_name))// Convert country name to ISO code and set it inside the context.
          })
          .catch(error => {
            console.log('Cannot catch up the country')
            console.error(error);
          });
      },

      // When fail of getting user's current coordinate
      function (error) {
        setCenter({lat: 3.1536282702050173, lng: 101.67911591589043})
        console.error(error);
      }
    );
  };

  // Get the position of user and center to it
  useLayoutEffect(() => {
    
      fetchUserCountry();
  }, []);

  //Load the API
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: secretkey,
    libraries
  })

  function centerMapToTarget(){
    const targetCoordinate = LocationCtx.latestConfirmCoordinate
    if (map && targetCoordinate) {
      map.panTo(targetCoordinate);
    }
  }

  useEffect(() => {
    centerMapToTarget();
  }, [LocationCtx.latestConfirmCoordinate]);


  
  // Set up the map
  if (!isLoaded){
    return <div>Loading...</div>
  } else {
    LocationCtx.updateGoogleApiStatus()
    return (
    <GoogleMap 
      zoom={9} 
      center={center}
      mapContainerClassName="map-container"
      options={{
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }}
      onLoad={map => setMap(map)}
    >
      {/* Rendering all the markers */}
      <StartingPointMarker />
      <DropPointMarker />
      {LocationCtx.directions && (
        <>
          <Polyline
            path={LocationCtx.directions.routes[0].overview_path}
            options={{ strokeColor: "blue", strokeOpacity: 0.8, strokeWeight: 4 }}
          />
        </>
      )}
    </GoogleMap>
      )
  }

}
