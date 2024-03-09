import React, { useContext, useState, useEffect } from "react";
import "../../styles/HistoryModal.css";
import { LocationContext } from '../../store/locations-context';
import GetHistory from '../../util/getHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import HistoryBox from "./HistoryBox";
import EmptyBox from "./EmptyBox";



export default function HistoryModal() {

  const LocationCtx = useContext(LocationContext)
  const [isLoading, setIsLoading] = useState(false)

  const [historyRoute, setHistoryRoute] = useState([])

  // HistoryRoute Structure
  // 0 : {route: Array(4), date: '2023-08-10', totalDistance: 50784, totalDuration: '0 hr 56 minute'}
  // 1: {route: Array(3), date: '2023-08-14', totalDistance: 300202, totalDuration: '4 hr 28 minute'}
  // route:  
// {index: 0, locationName: '', address: 'Shah Alam, Selangor, Malaysia', coordinate: {…}, infoWindowVisible: false}
// {index: 2, locationName: '', address: 'Subang Jaya, Selangor, Malaysia', coordinate: {…}, infoWindowVisible: false}
// {index: 1, locationName: '', address: 'Bukit Raja, Klang, Selangor, Malaysia', coordinate: {…}, infoWindowVisible: false}
// {index: 0, locationName: '', address: 'Shah Alam, Selangor, Malaysia', coordinate: {…}, infoWindowVisible: false}


  if(LocationCtx.historyModal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  function deleteRoute(queryId){
    setHistoryRoute(prevState => prevState.filter(route=> route.queryID !== queryId))
  }

  function categorizeByDate(data) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight for accurate comparison
  
    const categorizedData = {
      today: [],
      yesterday: [],
      older: []
    };
  
    data.forEach(item => {
      const itemDate = new Date(item.date);
      const itemDateWithoutTime = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
  
      if (itemDateWithoutTime.getTime() === currentDate.getTime()) {
        categorizedData.today.push(item);
      } else if (itemDateWithoutTime.getTime() === currentDate.getTime() - 24 * 60 * 60 * 1000) {
        categorizedData.yesterday.push(item);
      } else {
        categorizedData.older.push(item);
      }
    });
  
    return categorizedData;
  }

  async function frontendGetHistory(){
    if (LocationCtx.historyModal) {
      setIsLoading(true)
      
      const response = await GetHistory()

      if (response) {
        setHistoryRoute(response[0].historyRoute)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
      }
  }

  function renderBox(day, categorizedHistory){
    if (day === "Today"){ 
      if (categorizedHistory.today.length !== 0){
        
        return categorizedHistory.today.map(eachHistory => {
          return <HistoryBox key={eachHistory.queryID} queryID={eachHistory.queryID} route={eachHistory.route} dateCalculated={eachHistory.date} totalDistance={eachHistory.totalDistance} totalDuration={eachHistory.totalDuration} deleteRoute={deleteRoute}/> 
        })
      } else {
        return <EmptyBox />
      }

    } else if (day === "Yesterday") {
      if (categorizedHistory.yesterday.length !== 0){
        return categorizedHistory.yesterday.map(eachHistory => {
          return <HistoryBox key={eachHistory.queryID} queryID={eachHistory.queryID} route={eachHistory.route} dateCalculated={eachHistory.date} totalDistance={eachHistory.totalDistance} totalDuration={eachHistory.totalDuration} deleteRoute={deleteRoute}/>
        })
      } else {
        return <EmptyBox />
      }

    } else if (day === "Older"){
      if (categorizedHistory.older.length !== 0) {
        return categorizedHistory.older.map(eachHistory => {
          return <HistoryBox key={eachHistory.queryID} queryID={eachHistory.queryID} route={eachHistory.route} dateCalculated={eachHistory.date} totalDistance={eachHistory.totalDistance} totalDuration={eachHistory.totalDuration} deleteRoute={deleteRoute}/> 
        })
      } else {
        return <EmptyBox />
      }

    }
  }

  function renderingHistory(){
    if (historyRoute) {
      const categorized = categorizeByDate(historyRoute)
      return (
        <div className="history-box-container">
          <p className="history-subtitle">Today</p>
          {renderBox("Today", categorized)}

          <p className="history-subtitle">Yesterday</p>
          {renderBox("Yesterday", categorized)}

          <p className="history-subtitle">Older</p>
          {renderBox("Older", categorized)}
        </div>
  
      )
    } else {
      return (
        <div className="please-log-in">
          <p style={{fontWeight: "bold"}}>Please log in first to view this</p>
        </div>
      )
    }

  }
  useEffect(()=>{
    frontendGetHistory()
  }, [LocationCtx.historyModal])
  
  return (
    <>
      {LocationCtx.historyModal && (
        <div className="modal">
          <div className="overlay"></div>
          <div className="history-modal-content">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              renderingHistory()
            )
            }
              <div onClick={LocationCtx.toggleHistoryModal} className='close-modal'>
                    <FontAwesomeIcon icon={faXmark}/>
              </div>
          </div>
        </div>
      )}

    </>
  );
}