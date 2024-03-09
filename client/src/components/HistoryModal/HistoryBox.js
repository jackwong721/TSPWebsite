import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';
import DeteleRoute from '../../util/DeleteRoute';
import ConfirmationDeleteModal from "./ConfirmationDeleteModal";

import { LocationContext } from '../../store/locations-context';

export default function HistoryBox(props){

    const LocationCtx = useContext(LocationContext)

    const [isHovered, setIsHovered] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const calculatedRoute = props.route
    function renderSquareBox(){
        return calculatedRoute.map(eachPlace => {
            return(
                <div className="history-square-box" key={uuidv4()}>
                    {eachPlace.address}
                </div>
            )
        })

    }

    function handleMouseEnter(){
        setIsHovered(true);
      };
    
    function handleMouseLeave(){
        setIsHovered(false);
      };

    async function deleteRoute(queryID){
        const response = await DeteleRoute(queryID)

        if (response){
            props.deleteRoute(queryID)
        }

    }

    function handleDeleteClick(){
        setShowConfirmation(true);
      };
    
    function handleConfirmDelete(){
        deleteRoute(props.queryID)
        setShowConfirmation(false);
      };
    
    function handleCancelDelete(){
        setShowConfirmation(false);
      };

    return (
        <>
            <div className="main-history-box">
                <div className="history-box" onClick={()=> LocationCtx.toggleRouteModalAtHistory(calculatedRoute, props.totalDistance, props.totalDuration)}>
                    {renderSquareBox()}
                </div>
                <div className="history-text-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <p className="history-text"><b>Date:</b> {props.dateCalculated}</p>
                    <p className="history-text"><b>Total Distance: </b>{props.totalDistance/1000} km</p>
                    <p className="history-text"><b>Total Duration: </b>{props.totalDuration}s</p>
                </div>
                {isHovered && 
                <div className='history-delete' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div style={{fontSize: 14}} className='trash-delete-button'>
                        <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick}/>
                    </div>
                </div>
                }
            </div>
            {showConfirmation && (
                <ConfirmationDeleteModal
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />)}
        </>

    )

}