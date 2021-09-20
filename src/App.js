import React, { useState, useEffect, useMemo } from 'react';
import './App.css'
import {getMoment, findLocation} from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import {WeatherSetting} from './views/WeatherSetting';
import {useWeatherAPI} from './hooks/useWeatherAPI';


const AUTHORIZATION_KEY = 'CWB-C34FA0A8-072B-4C81-AFDE-6AA6A9349561';
// const LOCATION_NAME = '臺北';
// const LOCATION_NAME_FOREST = '臺北市';
  
function App() {
  const storageCity = localStorage.getItem('cityName') || '臺北市'
  
  const [currentTheme,setCurrentTheme] = useState();
  const [currentPage,setCurrentPage] = useState('WeatherCard');
  const [currentCity,setCurrentCity] = useState(storageCity);


  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const {cityName, locationName, sunriseCityName} = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey : AUTHORIZATION_KEY,
  });

  useEffect(() => {
    setCurrentTheme(moment=== 'day'? 'light' :'dark');
  }, [moment]);

  const handleCurrentPageChange=(currentPage)=>{
    setCurrentPage(currentPage);
  }
  const handleCurrentCityChange=(currentCity)=>{
    setCurrentCity(currentCity);
  }

  return (
    <div className = {`container ${currentTheme==='dark' && 'dark-bgcolor'}`}>
      {currentPage === 'WeatherCard' && (<WeatherCard handleCurrentPageChange={handleCurrentPageChange} weatherElement={weatherElement} moment={moment} fetchData={fetchData} currentTheme={currentTheme} cityName={cityName}/>)}
      {currentPage === 'WeatherSetting' && (<WeatherSetting currentTheme={currentTheme} handleCurrentPageChange={handleCurrentPageChange} handleCurrentCityChange={handleCurrentCityChange} cityName={cityName}/>)}
    </div>
  );
}

export default App;
