import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // useEffect(() => {
  //   location();
  // });

  const [locationSet, setLocationSet] = useState(false);
  const [firstLat, setFirstLat] = useState(0);
  const [firstLong, setFirstLong] = useState(0);
  const [firstTime, setFirstTime] = useState(0);
  const [speed, setSpeed] = useState(0);
  // const [firstAlt, setFirstAlt] = useState(0);
  const successLoc = (setLat: any, setLong: any, setTime: any) => (pos: GeolocationPosition) => {
    console.log(pos);
    setLocationSet(true);
    // setFirstAlt(pos.coords.altitude);
    setLat(pos.coords.latitude);
    setLong(pos.coords.longitude);
    setTime(pos.timestamp);
    setSpeed(pos.coords.speed ? pos.coords.speed : speed);
  }
  const failureLoc = (err: GeolocationPositionError) => {
    setLocationSet(false);
    console.log(err);
  }

  const getLocation = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(successLoc(setFirstLat, setFirstLong, setFirstTime), failureLoc, {
      enableHighAccuracy: true,
    });
  };

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header> */}
      <button onClick={getLocation}>
        Press for location
      </button>
        {
          locationSet && 
          <ul>
            <li>Latitude: {firstLat}</li>
            <li>Longitude: {firstLong}</li>
          </ul>
        }
    </div>
  );
}

export default App;
