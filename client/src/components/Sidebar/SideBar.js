import React, {useContext} from 'react';
import InputLocationBox from './InputLocationBox';
import GenerateButton from './GenerateButton';
import '../../styles/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { LocationContext } from '../../store/locations-context';

export default function Sidebar(props) {
    const LocationCtx = useContext(LocationContext)

    const locationBox = LocationCtx.dropPoints.map((item, index) =>{
        return(
            
            <div className='box-container' key={item.index}>
                <InputLocationBox 
                    locationName={item.locationName} 
                    address={item.address} 
                    index={item.index}
                    coordinate={item.coordinate}
                    dropPointNo={index}
                />
            </div>
        )
        
    })
    
    function renderRequestToLoginPage(){
        return (
            <div>
                    <div className='sidebarTopContainer'>
                        <div onClick={props.handleClick} className='closeButton'>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                    </div>
                <div className='request-login-container'>
                    <div>
                        <p style={{fontWeight: "bold", color: '#273D63'}}>Please log in first before to use this</p>
                        <div className='loginSettingInfoButton-sidebar'>
                            <a href='/auth/google'>LOGIN</a>
                        </div>
                    </div>

                </div>
            </div>
        )

    }

    return (
      <div className="sidebar-container">
        <div className={`sidebar ${props.isOpen ? 'open' : ''}`}>
            {LocationCtx.userProfile ? (
                <>
                    <div className='sidebarTopContainer'>
                        <div onClick={props.handleClick} className='closeButton'>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                    </div>
                    {/* Starting Point */}
                        <InputLocationBox 
                            locationName={LocationCtx.startingPoint.locationName} 
                            address={LocationCtx.startingPoint.address} 
                            index={LocationCtx.startingPoint.index} 
                            coordinate={LocationCtx.startingPoint.coordinate}
                        />
                    {/* Drop Points */}
                    {locationBox}

                    {/* Limit the drop points */}
                    {LocationCtx.index < 9 && (
                        <div className='addButtonContainer'>
                        <div onClick={LocationCtx.addDropPoints} className='addButton'>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                    </div>
                    )}

                    <GenerateButton handleClick={LocationCtx.generateFunction} toggleSidebar={props.toggleSidebar}/>
                </>
            ) : renderRequestToLoginPage()}
        </div>
      </div>
    );
}
