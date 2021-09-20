import React from 'react';

import { ReactComponent as RainIcon } from '../images/rain.svg';
import { ReactComponent as AirFlowIcon } from '../images/airFlow.svg';
import { ReactComponent as RefreshIcon } from '../images/refresh.svg';
import { ReactComponent as LoadingIcon } from '../images/loading.svg';
import { ReactComponent as CogIcon } from '../images/cog.svg';
import dayjs from 'dayjs';
import WeatherIcon from '../components/WeatherIcon';

const WeatherCard = ({weatherElement,moment,fetchData,currentTheme,handleCurrentPageChange,cityName}) => {
    const {observationTime,description,windSpeed,temperature,rainPossibility,confortability,isLoading,weatherCode} = weatherElement;
    
    return(
      <div className = {`weather-card ${currentTheme==='dark' && 'dark-weatherBgColor'}`}> 
        <CogIcon className = "cogicon" onClick={()=>handleCurrentPageChange('WeatherSetting')}/>
        <div className = {`location ${currentTheme==='dark' && 'dark-location'}`}>
          {cityName}
        </div>
        <div className = "description">
          {description}{confortability}
        </div>
        <div className = "current-weather">
          <div className = {`temperature ${currentTheme==='dark' && 'dark-temperature'}`}>
            {Math.round(temperature)}
            <div className = "celsius">°C</div>
          </div>
          <WeatherIcon className="daycloudyicon" weatherCode={weatherCode} moment={moment}/>
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
    )
};

export default WeatherCard;