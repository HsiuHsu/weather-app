import React, { useState, useEffect, useCallback } from 'react';
import './App.css'
import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';
import dayjs from 'dayjs';

function App() {
  const [currentTheme,setCurrentTheme] = useState('dark');
  const [weatherElement,setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    confortability: '',
    weatherCode: 0,
    isLoading: true,
  })
  const AUTHORIZATION_KEY = 'CWB-C34FA0A8-072B-4C81-AFDE-6AA6A9349561';
  const LOCATION_NAME = '臺北';
  const LOCATION_NAME_FOREST = '臺北市';
  const {observationTime,locationName,description,windSpeed,temperature,rainPossibility, confortability,isLoading} = weatherElement;
  const fetchCurrentWeather = () =>{

    // handleClick被觸發時，透過fetch向中央氣象局發送請求
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
    ) 
      .then((response)=>response.json())
      .then((data)=>{
        const locationData = data.records.location[0];
        const weatherElements =  locationData.weatherElement.reduce(
          (neededElements, item) => {
            if(['WDSD', 'TEMP'].includes(item.elementName)){
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        );
        return{
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          windSpeed: weatherElements.WDSD,
          temperature: weatherElements.TEMP,
        }
      });  
  };
  const fetchWeatherForecast = () =>{
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FOREST}`
    ) 
      .then((response)=>response.json())
      .then((data)=>{
        const locationData = data.records.location[0];
        const weatherElements =  locationData.weatherElement.reduce(
          (neededElements, item) => {
            if(['Wx', 'PoP', 'CI'].includes(item.elementName)){
              neededElements[item.elementName] = item.time[0].parameter;
            }
            return neededElements;
          },
          {}
        );
        return{
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          confortability: weatherElements.CI.parameterName,
        }
      });
  }

  //定義 async function來等待資料回應
  const fetchData = useCallback(async () =>{
    setWeatherElement((prevState =>({
      ...prevState,
      isLoading: true,
    })));
    const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather(), fetchWeatherForecast()]);
    // 資料狀態更新
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  },[]);
  useEffect(() => {
    fetchData();
  },[fetchData]);

  return (
    <div className = {`container ${currentTheme==='dark' && 'dark-bgcolor'}`}>
      <div className = {`weather-card ${currentTheme==='dark' && 'dark-weatherBgColor'}`}> 
        <div className = {`location ${currentTheme==='dark' && 'dark-location'}`}>
          {locationName}
        </div>
        <div className = "description">
        {description}{confortability}
        </div>
        <div className = "current-weather">
          <div className = {`temperature ${currentTheme==='dark' && 'dark-temperature'}`}>
          {Math.round(temperature)}
            <div className = "celsius">°C</div>
          </div>
          <DayCloudyIcon className="daycloudyicon" />
        </div>
        <div className = "air-flow">
          <AirFlowIcon className="airflow-rain-icon" />
          {windSpeed}
        </div>
        <div className = {`rain ${currentTheme==='dark' && 'dark-rain'}`}>
          <RainIcon className="airflow-rain-icon" />
          {rainPossibility}
        </div>
        <div className = "refresh" onClick={fetchData} isLoading={isLoading}>
          最後觀測時間 : 
          {new Intl.DateTimeFormat('zh-Tw', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(dayjs(observationTime))}
          {' '}
          {isLoading ? <LoadingIcon className="loading-refresh-icon" />:<RefreshIcon className="loading-refresh-icon" />}
        </div>
      </div>
    </div>
  );
}

export default App;
