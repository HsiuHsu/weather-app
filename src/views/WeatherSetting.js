import React, {useState} from 'react';
import '../Css/WeatherSettingCss.css';
import { availableLocations } from '../utils/helpers';

export const WeatherSetting = ({currentTheme,handleCurrentPageChange,cityName,handleCurrentCityChange}) =>{

    const [locationName, setLocationName] = useState(cityName);
    const handleChange=(e)=>{
        setLocationName(e.target.value);
    }
    const handleSave = () => {
        localStorage.setItem('cityName', locationName)
        handleCurrentCityChange(locationName);
        handleCurrentPageChange('WeatherCard');
    }

    return(
        <div className = {`weatherSettingWrapper ${currentTheme==='dark' && 'dark-weatherBgColor'}`}>
            <div className = {`title ${currentTheme==='dark' && 'dark-text'}`}>設定</div>
            <div className = {`styledLabel ${currentTheme==='dark' && 'dark-text'}`} htmlFor="location">地區</div>
            <select className = {`styledSelect ${currentTheme==='dark' && 'dark-styledselect'}`} id="location" name="location" onChange={handleChange} value={locationName}>
                {availableLocations.map(({cityName}) => (
                    <option value={cityName} key={cityName}>
                        {cityName}
                    </option>
                ))}
                <option></option>
            </select>
            <div className = {`buttonGroup`}>
                <button className = {`back button ${currentTheme==='dark' && 'dark-back'}`} onClick={()=>handleCurrentPageChange('WeatherCard')}>返回</button>
                <button className = "save button" onClick={handleSave} >儲存</button>
            </div>
        </div>
    );
};