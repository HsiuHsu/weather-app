import { useState, useEffect, useCallback } from 'react';

export const useWeatherAPI = ({locationName, cityName, authorizationKey}) =>{
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
    });

    //定義 async function來等待資料回應
    const fetchData = useCallback(async () =>{
        setWeatherElement((prevState =>({
          ...prevState,
          isLoading: true,
        })));
        const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather({authorizationKey, locationName}), fetchWeatherForecast({authorizationKey, cityName})]);
        // 資料狀態更新
        setWeatherElement({
          ...currentWeather,
          ...weatherForecast,
          isLoading: false,
        });
    },[locationName, cityName, authorizationKey]);

    useEffect(() => { fetchData(); },[fetchData]);

    const fetchCurrentWeather = ({authorizationKey, locationName}) =>{

        // handleClick被觸發時，透過fetch向中央氣象局發送請求
        return fetch(
          `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
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
    const fetchWeatherForecast = ({authorizationKey, cityName}) =>{
        return fetch(
          `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
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

    return [weatherElement, fetchData];

};