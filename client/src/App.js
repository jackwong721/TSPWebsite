import React, {  useState } from 'react';
import NavBar from './components/NavBar';
import TriplebarButton from './components/TriplebarButton';
import HistoryButton from './components/HistoryButton'
import Sidebar from './components/Sidebar/SideBar';
import { faBars } from '@fortawesome/free-solid-svg-icons'
import './styles/App.css';
import { MapComponent } from './components/MapComponent';
import SettingModal from './components/SettingModal/SettingModal';
import LoginModal from './components/LoginModal/LoginModal';
import RouteModal from './components/RouteModal/RouteModal';
import  LocationContextProvider  from './store/locations-context'
import HistoryModal from './components/HistoryModal/HistoryModal';
import RouteModalforHistory from './components/HistoryModal/RouteModalforHistory';
import InfoModal from './components/InfoModal/InfoModal';


export default function App() {

  const [isOpen, setIsOpen] = useState(false);

  //Toggle sidebar
  function toggleSidebar() {
    setIsOpen(!isOpen);
  }


  return (
    <div className='app'>
      <LocationContextProvider>
        <NavBar/>
        <div className='buttonContainer'> 
          <div className='tripleBarButton'>
            <TriplebarButton buttonName={faBars} handleClick={toggleSidebar}/>
          </div>
          <div className='historyButton'>
            <HistoryButton/>
          </div>
        </div>
        <RouteModal/>
        <RouteModalforHistory/>
        <Sidebar 
          isOpen={isOpen}
          handleClick={toggleSidebar}
          toggleSidebar={toggleSidebar}
        />
        <MapComponent/>
        <SettingModal/>
        <LoginModal />
        <HistoryModal/>
        <InfoModal/>
      </LocationContextProvider>
    </div>
  );
}
