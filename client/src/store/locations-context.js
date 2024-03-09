import { createContext, useState } from "react";

export const LocationContext = createContext({
    index: Number,
    startingPoint: {},
    dropPoints: [],
    GoogleMapAPIReady: Boolean,
    settingModal: Boolean,
    loginModal: Boolean,
    infoPageModal: Boolean,
    routeModal: Boolean,
    historyModal: Boolean,
    routeModalAtHistory: Boolean,
    currentViewHistory: {},
    unit: '',
    showCustomLocationName: '',
    countryCode: '',
    latestConfirmCoordinate: '',
    suggestRoute: [],
    directions: [],
    backendResult: [],
    userProfile: '',
    addDropPoints: () => {},
    handleStartAddressInputChange: () => {},
    handleDropAddressInputChange: () => {},
    updateAddressCoordinateInput: () => {},
    updateGoogleApiStatus: () => {},
    handleStartLocationNameInputChange: () => {},
    handleDropLocationNameInputChange: () => {},
    toggleInfoWindow: (index, status) => {},
    toggleSettingModal: () => {},
    toggleLoginModal: () => {},
    toggleInfoPageModal: () => {},
    toggleRouteModal: () =>{},
    toggleHistoryModal: () => {},
    toggleRouteModalAtHistory: () => {},
    handleUnitToggle: () => {},
    handleLocationNameToggle: () => {},
    setSearchBoundary:(center) => {},
    deleteLocation: (deleteLocationIndex) => {},
    updateBackendResult: (routeGetFromBackend) => {},
    updateUserProfile: () => {},
    resetAll: () => {},
    closeRouteModal: () => {}
})

let index = 1
export default function LocationContextProvider({children}){

    const [startingPoint, setStartingPoint] = useState({index: 0, locationName: '', address:'', coordinate: '', infoWindowVisible: false})
    const [dropPoints, setDropPoint] = useState([{index: 1, locationName: '', address:'', coordinate:'', infoWindowVisible: false}])
    const [GoogleMapAPIReady, setGoogleMapAPIReady] = useState(false)
    const [settingModal, setSettingModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [infoPageModal, setInfoPageModal] = useState(false)
    const [routeModal, setRouteModal] = useState(false)
    const [historyModal, setHistoryModal] = useState(false)
    const [routeModalAtHistory, setRouteModalAtHistory] = useState(false)
    const [unit, setUnit] = useState('km'); // Initial state is "km"
    const [showCustomLocationName, setShowCustomLocationName] = useState('OFF')
    const [countryCode, setCountryCode] = useState(null)
    const [latestConfirmCoordinate, setLatestConfirmCoordinate] = useState(null)
    const [backendResult, saveBackendResult] = useState(null)
    const [currentViewHistory, setCurrentViewHistroy] = useState(null)
    const [directions, setDirections] = useState(null);
    const [userProfile, setUserProfile] = useState(null)


    function addDropPoints(){
        index += 1
        console.log(index)
        setDropPoint(prevDropPoints=>{
            return(
                [
                  ...prevDropPoints, 
                  {index: index, locationName:'', address:'', coordinate: '', infoWindowVisible: false}
                ]
            )
        })

    }

    function handleStartAddressInputChange(address){
        setStartingPoint((prevStartingPoint)=>{
          return{
            ...prevStartingPoint,
            ["address"]: address,
            ["coordinate"]: ''
          }
        })
      }
    
    function handleDropAddressInputChange(index, text){
      setDropPoint(prevDropPoint => {
        return prevDropPoint.map(item => {
          if (item.index == index) {
            return {
              ...item,
              ['address']: text,
              ["coordinate"]: ''
            };
          } else {
            // keep the other objects unchanged
            return item;
          }
        });
      });
    }

    function handleStartLocationNameInputChange(event){
      setStartingPoint((prevStartingPoint)=>{
        return{
          ...prevStartingPoint,
          [event.target.name]: event.target.value
        }
      })
    }

    function handleDropLocationNameInputChange(event){
      setDropPoint(prevDropPoint => {
        return prevDropPoint.map(item => {
          if (item.index == event.target.id) {
            return {
              ...item,
              [event.target.name]: event.target.value,
            };
          } else {
            // keep the other objects unchanged
            return item;
          }
        });
      });
    }


    function updateAddressCoordinateInput(index, address, coordinate){
      setLatestConfirmCoordinate(coordinate)
      if (index === 0){
        setStartingPoint((prevStartingPoint)=>{
          return{
            ...prevStartingPoint,
            ['address']: address,
            ['coordinate']: coordinate
          }
        })
      } else {
        setDropPoint(prevDropPoint => {
          return prevDropPoint.map(item => {
            if (item.index == index) {
              return {
                ...item,
                ['address']: address,
                ['coordinate']: coordinate
              };
            } else {
              // keep the other objects unchanged
              return item;
            }
          });
        });
      }
      }

 
    function updateGoogleApiStatus(){
      setGoogleMapAPIReady(true)
    }

    function toggleInfoWindow(index, status){
      if (index === 0){
        setStartingPoint((prevStartingPoint)=>{
          return {
            ...prevStartingPoint,
            ['infoWindowVisible']: status
          }
        })
      } else {
        setDropPoint(prevDropPoint => {
          return prevDropPoint.map(item => {
            if (item.index == index) {
              return {
                ...item,
                ['infoWindowVisible']: status
              };
            } else {
              // keep the other objects unchanged
              return item;
            }
          });
        });
      }
      
    };
    
    function toggleSettingModal(){
      setSettingModal(prevState => !prevState);
    };

    function toggleLoginModal(){
      setLoginModal(prevState => !prevState);
    };

    function toggleInfoPageModal(){
      setInfoPageModal(prevState => !prevState)
    }

    function toggleRouteModal(){
      setRouteModal(prevState => !prevState)
    }

    function toggleHistoryModal(){
      setHistoryModal(prevState=> !prevState)
    }

    function toggleRouteModalAtHistory(calculatedRoute, totalDistance, totalDuration){
      
      setRouteModalAtHistory(prevState => {
        if (prevState){
          setCurrentViewHistroy(null)
          return false
        } else {
          setCurrentViewHistroy({calculatedRoute: calculatedRoute, totalDistance: totalDistance, totalDuration: totalDuration})
          setHistoryModal(prevState=> !prevState)
          return true
        }
      })
    }

    function handleUnitToggle () {
      setUnit(unit === 'km' ? 'miles' : 'km'); // Toggle between "km" and "miles"
    };

    function handleLocationNameToggle(){
        setShowCustomLocationName(showCustomLocationName === 'ON' ? 'OFF' : 'ON')
    }

    function setSearchBoundary(countrycode){
      if (countrycode){
        setCountryCode(countrycode)
      }
    }

    function deleteLocation(deleteLocationIndex) {
      setDropPoint(prevDropPoints => {
        const finalDropPointsArray = prevDropPoints.filter(item => item.index !== deleteLocationIndex);
        return finalDropPointsArray;
      });
    }
    
    function updateBackendResult(routeGetFromBackend){
      saveBackendResult(routeGetFromBackend)

      // routeGetFromBackend: {suggestRoute: Array(3), totalDistance: 25405, totalDuration: '0 hr 29 minute'}
    }

    function updateUserProfile(profile){
      setUserProfile(profile)
    }

    function resetAll(){
      setStartingPoint({index: 0, locationName: '', address:'', coordinate: '', infoWindowVisible: false})
      setDropPoint([{index: 1, locationName: '', address:'', coordinate:'', infoWindowVisible: false}])
      setLatestConfirmCoordinate(null)
      saveBackendResult(null)
      setRouteModal(false)
      index = 1
      // setDirections(null);
    }
    // Direction API
    // function directionsCallBack(response){
    //   if (response !== null){
    //     if (response.status === "OK"){
    //       setDirections(response)
    //     } else {
    //       console.log("Directions request failed:", response.status)
    //     }
    //   }
    // }

    // useEffect(() => {
    //   // Make a request to the Directions Service
    //   if (GoogleMapAPIReady && backendResult){
    //     const directionsService = new window.google.maps.DirectionsService();
    //     const waypoints = backendResult.suggestRoute.slice(1, backendResult.suggestRoute.length - 1).map(routeIndex => ({ location: (dropPoints.filter(point => point.index == routeIndex)[0].coordinate), stopover: true }));
        
    //     directionsService.route(
    //       {
    //         origin: startingPoint.coordinate,
    //         destination: startingPoint.coordinate,
    //         waypoints: waypoints,
    //         travelMode: "DRIVING"
    //       },
    //       directionsCallBack
    //     );
    //   }
    // }, [backendResult]);

    function closeRouteModal(){
      setRouteModal(false)
    }

    const value = {
        index: index,
        startingPoint: startingPoint,
        dropPoints: dropPoints,
        GoogleMapAPIReady: GoogleMapAPIReady,
        settingModal: settingModal,
        loginModal: loginModal,
        infoPageModal: infoPageModal,
        routeModal: routeModal,
        historyModal: historyModal,
        routeModalAtHistory: routeModalAtHistory,
        unit: unit,
        showCustomLocationName: showCustomLocationName,
        countryCode: countryCode,
        latestConfirmCoordinate: latestConfirmCoordinate,
        directions: directions,
        backendResult: backendResult,
        currentViewHistory: currentViewHistory,
        userProfile: userProfile,
        addDropPoints: addDropPoints,
        handleStartAddressInputChange: handleStartAddressInputChange,
        handleDropAddressInputChange: handleDropAddressInputChange,
        handleStartLocationNameInputChange: handleStartLocationNameInputChange,
        handleDropLocationNameInputChange: handleDropLocationNameInputChange,
        updateAddressCoordinateInput: updateAddressCoordinateInput,
        updateGoogleApiStatus: updateGoogleApiStatus,
        toggleInfoWindow: toggleInfoWindow,
        toggleSettingModal: toggleSettingModal,
        toggleLoginModal: toggleLoginModal,
        toggleRouteModal: toggleRouteModal,
        toggleInfoPageModal: toggleInfoPageModal,
        toggleHistoryModal: toggleHistoryModal,
        toggleRouteModalAtHistory: toggleRouteModalAtHistory,
        handleUnitToggle: handleUnitToggle,
        handleLocationNameToggle: handleLocationNameToggle,
        setSearchBoundary:setSearchBoundary,
        deleteLocation: deleteLocation,
        updateBackendResult: updateBackendResult,
        updateUserProfile: updateUserProfile,
        resetAll: resetAll,
        closeRouteModal: closeRouteModal,
      
        
    }

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    )
}

