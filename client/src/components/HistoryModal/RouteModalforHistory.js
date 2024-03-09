import { useContext, useState, useEffect } from "react"
import { LocationContext } from "../../store/locations-context"
import  LocationBox from "../RouteModal/LocationBox"
import "../../styles/RouteModal.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function RouteModalforHistory(props){

    let intervalID
    const LocationCtx = useContext(LocationContext)
    const [activeIndex, setActiveIndex] = useState(-1);
    const [hoverOverRouteContainer, setHoverOverRouteContainer] = useState(false)

    useEffect(()=>{
        if (hoverOverRouteContainer){
            intervalID = setInterval(()=>{
                setActiveIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    return nextIndex < LocationCtx.currentViewHistory.calculatedRoute.length ? nextIndex : -1;
                  });
            }, 500)
        } 

        return () => {
            setActiveIndex(-1)
            clearInterval(intervalID);
        };


    }, [hoverOverRouteContainer])


    function hoverOut(){
        setHoverOverRouteContainer(false)
        
    }

    function hoverIn(){
        setHoverOverRouteContainer(true)
    }


    if (LocationCtx.routeModalAtHistory){
    
        function renderAllpoint(){
           return LocationCtx.currentViewHistory.calculatedRoute.map((location, indexInArray) => {   
                return (
                    <LocationBox
                        key={location.index}
                        sequence={indexInArray + 1}
                        locationName={location.locationName}
                        address={location.address}
                        active={activeIndex === indexInArray}
                    />
            )
                
            })
        }
    
        
        return (
        <div className='routeModalContainer'>
            <div>
                <div className='routeModal-content' onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                <div onClick={LocationCtx.toggleRouteModalAtHistory} className='close-modal'>
                        <FontAwesomeIcon icon={faXmark}/>
                </div>
                    <div className='route-location-box'>
                        {renderAllpoint()}
                    </div>
                    <div className="route-information">
                        <p className="text"><b>Distance:</b> {LocationCtx.currentViewHistory.totalDistance/1000} km</p>
                        <p className="text"><b>Duration:</b> {LocationCtx.currentViewHistory.totalDuration}s</p>
                    </div>
                </div>

            </div>
            

            
        </div>
        )
    }

}
