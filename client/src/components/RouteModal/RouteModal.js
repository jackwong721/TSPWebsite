import { useContext, useState, useEffect } from "react"
import { LocationContext } from "../../store/locations-context"
import  LocationBox from "./LocationBox"
import SaveRoute from "../../util/SaveRoute"
import "../../styles/RouteModal.css"

export default function RouteModal(){
    let suggestRoute = null
    let intervalID
    const LocationCtx = useContext(LocationContext)
    const [activeIndex, setActiveIndex] = useState(-1);
    const [hoverOverRouteContainer, setHoverOverRouteContainer] = useState(false)
    const [suggestRouteWithFullInfo, setSuggestRouteWithFullInfo] = useState([])
    
    function sortedRouteInformation(){
        if (LocationCtx.backendResult){
            setSuggestRouteWithFullInfo([])
            for (let i = 0; i < LocationCtx.backendResult.suggestRoute.length; i++){
                let targetIndex = LocationCtx.backendResult.suggestRoute[i] 
                
                if (targetIndex == 0){
                    setSuggestRouteWithFullInfo((prevState) => [...prevState, LocationCtx.startingPoint])
                } else {
                    setSuggestRouteWithFullInfo((prevState) => [...prevState, LocationCtx.dropPoints.filter(point => point.index == targetIndex)[0]])
                }
            }
            
        }

    }

    useEffect(()=>{
        if (hoverOverRouteContainer){
            intervalID = setInterval(()=>{
                setActiveIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    return nextIndex < suggestRoute.length ? nextIndex : -1;
                  });
            }, 500)
        } 

        return () => {
            setActiveIndex(-1)
            clearInterval(intervalID);
        };


    }, [hoverOverRouteContainer])

    useEffect(()=>{
        sortedRouteInformation()
    }, [LocationCtx.updateBackendResult])
    

    function hoverOut(){
        setHoverOverRouteContainer(false)
        
    }

    function hoverIn(){
        setHoverOverRouteContainer(true)
    }

    async function saveRoute(){
        const response = await SaveRoute(LocationCtx.backendResult, suggestRouteWithFullInfo)

        if (response){
            LocationCtx.resetAll()
        }

    }

    if (LocationCtx.routeModal){
        suggestRoute = LocationCtx.backendResult.suggestRoute
        
    
        function renderWaypoint(){
           return suggestRoute.map((routeIndex, indexInArray) => {   
                if (indexInArray !== 0 && indexInArray !== suggestRoute.length - 1){
                    const matchedDropPoint = LocationCtx.dropPoints.filter(point => point.index == routeIndex)[0]
                    return (
                        <LocationBox
                            key={matchedDropPoint.index}
                            sequence={indexInArray + 1}
                            locationName={matchedDropPoint.locationName}
                            address={matchedDropPoint.address}
                            active={activeIndex === indexInArray}
                        />
                )
                }
                
            })
        }
    
        
        return (
        <div className='routeModalContainer'>
            <div>
                <div className='routeModal-content' onMouseEnter={hoverIn} onMouseLeave={hoverOut} >
                    <div className='route-location-box'>
                        {/* Origin */}
                        <LocationBox
                            sequence={1}
                            locationName={LocationCtx.startingPoint.locationName}
                            address={LocationCtx.startingPoint.address}
                            active={activeIndex === 0}
                        />
                        {renderWaypoint()}

                        {/* Destination */}
                        <LocationBox
                            sequence={suggestRoute.length}
                            locationName={LocationCtx.startingPoint.locationName}
                            address={LocationCtx.startingPoint.address}
                            active={activeIndex === suggestRoute.length - 1}
                        />

                    </div>
                    <div className="route-information">
                        <p className="text"><b>Distance:</b> {LocationCtx.backendResult.totalDistance/1000} km</p>
                        <p className="text"><b>Duration:</b> {LocationCtx.backendResult.totalDuration}s</p>
                    </div>
                </div>

                {/* Save Button and Reset Button */}
                <div className={'save-reset-link-button-container visible'}>
                    {/* <div className="link-button" onClick={()=> console.log('link button is clicked')}>LINK</div> */}
                    <div className="save-button" onClick={saveRoute}>SAVE</div>
                    <div className="reset-button" onClick={LocationCtx.resetAll}>CLEAR</div>
                </div>
            </div>
            

            
        </div>
        )
    }

}
