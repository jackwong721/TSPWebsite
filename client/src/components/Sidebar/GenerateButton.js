import React, { useContext, useEffect, useState } from 'react';
import '../../styles/GenerateButton.css';
import LoadingScreen from '../LoadingScreen';
import GenerateRoute from '../../util/generateRoute';
import { LocationContext } from '../../store/locations-context';


export default function GenerateButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  
  const LocationCtx = useContext(LocationContext)

  async function retrieveRoute(){
    LocationCtx.closeRouteModal()
    setIsLoading((prevState)=> !prevState)

    const locationStructure = {
      startingPoint: LocationCtx.startingPoint,
      dropPoints: LocationCtx.dropPoints
    }
    
    const resultFromBackend = await GenerateRoute(locationStructure)
    setIsLoading((prevState)=> !prevState)
    LocationCtx.updateBackendResult(resultFromBackend)
    props.toggleSidebar()
    LocationCtx.toggleRouteModal()
  }


  if (isLoading) {
    return <LoadingScreen />;
  }

  // Checking whether all box have input: coordinate & address
  function validateUserInput(){
    let allGoodtoGo = false

    if (LocationCtx.startingPoint.address && LocationCtx.startingPoint.coordinate){
      allGoodtoGo = true
    } else {
      allGoodtoGo = false
      return false
    }

    for (let i = 0; i < LocationCtx.dropPoints.length; i++){
      if (LocationCtx.dropPoints[i].coordinate && LocationCtx.dropPoints[i].address){
        allGoodtoGo = true
      } else {
        allGoodtoGo = false
        return false
      }
    }
    // If all have value, it will return true
    return true
  }

  return (
    <div className={!validateUserInput() ? "disable-GenerateButton-container": "GenerateButton-container"}>
      <div onClick={retrieveRoute} className={!validateUserInput() ? 'disable-button-generate' :'button-generate pulse' }>
        GENERATE
      </div>
    </div>
    
  );
}

