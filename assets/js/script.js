const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-btn');
const forecastCards = document.querySelector('.forecast-cards');
const currentForecast = document.querySelector('.current-forecast');

const APIKey = "12488781b90169baf6f1e863fa04e059";

const createCard = (cityName, weatherItem, index) => {
    if(index === 0) { //Main Weather card
return `<div class="details">
<h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
<h4>Temprature: ${weatherItem.main.temp}°F</h4>
<h4>Wind: ${weatherItem.wind.speed} M/S</h4>
<h4>Humidity: ${weatherItem.main.humidity} %</h4>
</div>
<div class="weather-icon">
<img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-image">
<h3>${weatherItem.weather[0].description}</h3>
</div>`;
    } else { //5 day forecast cards
    return `<li class="cards">
            <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-image">
            <h4>Temprature: ${weatherItem.main.temp}°F</h4>
            <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }
}

const getWeatherData = (cityName, lat, lon) => {
    //Change units=imperial to get fahrenheit instead of cel
    const weather_forecast_api_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
    //fetch forecast api url
    fetch(weather_forecast_api_url).then(res => res.json()).then(data => {

        ////filter forecast to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDayForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        //erase previous weather data
        cityInput.value = "";
        forecastCards.innerHTML = "";
        currentForecast.innerHTML = "";


        // Creating weather cards and adding them to the DOM
        fiveDayForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentForecast.insertAdjacentHTML("beforeend", createCard(cityName, weatherItem, index));
            } else {
                forecastCards.insertAdjacentHTML("beforeend", createCard(cityName, weatherItem, index));
            }
            

        });

    }).catch(() => {
        alert('error occured while fetching weather forecast');
    });
}
//get city coordinates function
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;
    //fetch geocoding api url
    fetch(geocodingApiUrl).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherData(name, lat, lon);
    }).catch(() => {
        alert("error occured while fetching coordinates");
    });

}
searchButton.addEventListener("click", getCityCoordinates);


