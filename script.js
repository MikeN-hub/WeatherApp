// CONSTANTS AND VARS
const API = {
    key: '381ed0ccc713dbfd31425691b8b95337',
    base: 'https://api.openweathermap.org/data/2.5/weather?'
}
const KELVIN = 273;
let now = moment().format('DD MMMM YYYY');

// SELECT ELEMENTS
let weatherNotice = document.querySelector('.weatherNotice');
let weatherIcon = document.querySelector('.weatherIcon');
let weatherTemp = document.querySelector('.weatherTemp p');
let weatherDiscription = document.querySelector('.weatherDiscription p');
let weatherLocation = document.querySelector('.weatherLocation p');
let weatherData = document.querySelector('.weatherData p');

// APP DATA
let weather = {};
weather.temp = {
    unit: 'celsius',
}

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ( 'geolocation' in navigator ) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
} else {
    weatherNotice.style.display = 'block';
    weatherNotice.innerHTML = "<p>Browser Doesn't Support Geolocation.</p>";
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    showWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVISE
function showError(error){
    weatherNotice.style.display = 'block';
    weatherNotice.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function showWeather(lat, long){
    fetch(`${API.base}lat=${lat}&lon=${long}&appid=${API.key}`)
        .then(function (resolve){
            let data = resolve.json();
            console.log(data);
            return data;
        })
        .then(data => {
            weather.temp.value = Math.round(data.main.temp - KELVIN);
            weather.iconId = `<img src=https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png>`;
            weather.description = data.weather[0].description;
            weather.location = {
                city: data.name,
                country: data.sys.country,
            }
        })
        .then(() => displayWeather());
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    weatherIcon.innerHTML = weather.iconId;
    weatherDiscription.innerHTML = weather.description;
    weatherTemp.innerHTML = `${weather.temp.value} &deg<span>C</span>`;
    weatherLocation.innerHTML = `${weather.location.city}, ${weather.location.country}`;
    weatherData.innerHTML = now;
}

// C TO F
function celsiusToFarenheit(temp){
    return (temp * 9 / 5) + 32;
}

// CHANGE TEMP SYSTEM ON CLICK
weatherTemp.addEventListener("click", () => {
    if ( weather.temp.value === undefined ) return;

    if (weather.temp.unit == 'celsius'){
        let farenheit = celsiusToFarenheit(weather.temp.value);
        farenheit = Math.floor(farenheit);
        weather.temp.unit = 'farenheit';
        weatherTemp.innerHTML = `${farenheit} &deg<span>F</span>`;
    }else{
        weatherTemp.innerHTML = `${weather.temp.value} &deg<span>C</span>`;
        weather.temp.unit = 'celsius';
    }
})