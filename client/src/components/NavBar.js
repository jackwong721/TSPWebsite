import React, { useContext, useState, useEffect } from 'react';
import '../styles/NavBar.css';
import { LocationContext } from '../store/locations-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import GetUser from '../util/GetUser';


export default function NavBar() {

  const LocationCtx = useContext(LocationContext)

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  

  useEffect(() => {
    fetchData();
  }, []);

  function toggleProfileInfo(){
    setIsInfoVisible(prevState => !prevState)
  }

  function logout(){
    console.log('Logout!')
  }

  async function fetchData(){
    const response = await GetUser()
    LocationCtx.updateUserProfile(response)
    // response: [{userID: '109036592870849353440', username: 'jackwong721@gmail.com', __v: 14}]
  }

  return (
    <div className="navbar">
      <div className='maintitle'>
        <h1>Travel Genius</h1>
      </div>
      <div className='settingLoginInfoContainer'>
        {LocationCtx.userProfile ? (
          <div>
            <div className='profile-container' onClick={toggleProfileInfo}>
                <p className='profile-text'>{LocationCtx.userProfile[0].username}</p>
            </div>
            <div className={`info-div ${isInfoVisible ? 'visible' : ''}`}>
              <p style={{fontSize: 12, color:"#4d4d4d"}}>Total Query: <b>{LocationCtx.userProfile[0].totalTimeQuery}</b></p>
              <div className='logout-button-container' >
                <div className='logout-button' onClick={logout}>
                  <a href='/auth/logout'>LOGOUT</a>
                </div>
              </div>
            </div>
          </div>

        ): (
          <div className='loginSettingInfoButton'>
            <a href='/auth/google'>LOGIN</a>
          </div>
        )}
        {/* <div className='loginSettingInfoButton'>
          <FontAwesomeIcon icon={faGear} onClick={LocationCtx.toggleSettingModal}/>
        </div> */}
        <div className='loginSettingInfoButton'>
          <FontAwesomeIcon icon={faCircleInfo} onClick={LocationCtx.toggleInfoPageModal}/>
        </div>
      </div>

    </div>
  );
}

