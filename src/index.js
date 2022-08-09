const cityDiv = document.querySelector('#city');
const cityInput = document.querySelector('input');
const button = document.querySelector('button');
const descriptionDiv = document.querySelector('#description');
const tempDiv = document.querySelector('#temp')
const windDiv = document.querySelector('#wind')
const imgDiv = document.querySelector('#icon')
const timeDiv = document.querySelector('#time')
const sunriseDiv = document.querySelector('#sunrise')
const sunsetDiv = document.querySelector('#sunset')
const dayLengthDiv = document.querySelector('#day-length')
const humidityDiv = document.querySelector('#humidity')
const pressureDiv = document.querySelector('#pressure')
const feelLikeDiv = document.querySelector('#feel')
const changeUnitBtn = document.querySelector('#change-unit')
const cloudsDiv = document.querySelector('#cloud')
const maxTempDiv = document.querySelector('#temp-max')
const minTempDiv = document.querySelector('#temp-min')
const forecastDiv = document.querySelector('.forecast-weather')


const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


//get local time and day
const getTime = () => {
    const date = new Date((new Date().getTime())+1000*cityData.timezone-7200000);
    const day = date.getDay()
    console.log(day)
    const today = date.toLocaleDateString()
    const time = date.toLocaleTimeString(units.time, {
        hour: '2-digit',
        minute: '2-digit',
      });

      console.log(today)

    const localTime = `${weekday[day]}, ${today} ${time}`;
    return localTime
}

const getDay = (date) => {
    const dateDay = new Date((date-7200) * 1000);
    const foreDay = dateDay.getDay()
    console.log(foreDay)
    const forecastDay = weekday[foreDay].slice(0,3)

    return forecastDay;
}

const getSunTime = (date, timezone) => {
    return new Date((date-7200+timezone) * 1000).toLocaleString(units.time, {
        hour: '2-digit',
        minute: '2-digit',
      });
}

const getDayLength = (sunrise, sunset) => {
    let hours = Math.floor((sunset-sunrise)/3600)
    let minutes = Math.round(((sunset-sunrise)/3600-Math.floor((sunset-sunrise)/3600))*60)
    return `${hours}h ${minutes}min`
}

//set variables for fetch and display data in specific units

let metricUnits = true;

let units = {}

const setUnits = () => {
    if(metricUnits === true) {
       units = {
            url: '&units=metric',
            temp: '°C',
            speed: 'm/s',
            time: 'en-GB'
       } 
    } else {
        units = {
            url: '&units=imperial',
            temp: '°F',
            speed: 'mph',
            time: 'en-US'
       }
    }
}
setUnits()


let cityData;
let forecastData;
let apiKey = 'https://api.openweathermap.org/data/2.5/weather?q=london&appid=23eeb4ff69ee56c19923f99c28274d0f' + units.url
let forecastApi = 'https://api.openweathermap.org/data/2.5/forecast?q=london&appid=23eeb4ff69ee56c19923f99c28274d0f' + units.url

const getData = async () => {
    try {
      const response = await fetch(apiKey, {mode: 'cors'})
      const tempData = await response.json()
      cityData = tempData;
      setData()
      setBackgroundImg()
      const forecastResponse = await fetch(forecastApi, {mode: 'cors'})
      const foreData = await forecastResponse.json()
      forecastData = foreData;
      setForecast()
    }
    catch (error){
      alert('Enter valid city name please!')
    }
  }

// button for getting the input city name

changeUnitBtn.addEventListener('click', () => {
    console.log()
    if(metricUnits === true) {
        metricUnits = false
    } else {
        metricUnits = true
    }
  setUnits()
  apiKey = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityData.name + '&appid=23eeb4ff69ee56c19923f99c28274d0f' + units.url 
  console.log(apiKey)
  getData()  
})

button.addEventListener('click', () => {
    console.log(cityInput.value)
    if(cityInput.value === '') return alert('Enter valid city name please!')
    apiKey = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput.value + '&appid=23eeb4ff69ee56c19923f99c28274d0f' + units.url 
    getData()
})

window.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        if(cityInput.value === '') return alert('Enter valid city name please!')
        apiKey = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput.value + '&appid=23eeb4ff69ee56c19923f99c28274d0f' + units.url 
        getData()
    }
})

const setData = () => {
    console.log(cityData)
    cityDiv.innerHTML = cityData.name
    descriptionDiv.innerHTML = cityData.weather[0].description
    tempDiv.innerHTML = Math.round(Number(cityData.main.temp)) + ' ' + units.temp
    windDiv.innerHTML = cityData.wind.speed + ' ' + units.speed;
    imgDiv.src = `https://openweathermap.org/img/w/${cityData.weather[0].icon}.png`
    timeDiv.innerHTML = getTime()
    sunriseDiv.innerHTML = getSunTime(cityData.sys.sunrise, cityData.timezone)
    sunsetDiv.innerHTML = getSunTime(cityData.sys.sunset, cityData.timezone)
    dayLengthDiv.innerHTML = getDayLength(cityData.sys.sunrise, cityData.sys.sunset)
    humidityDiv.innerHTML = `${cityData.main.humidity}%`
    pressureDiv.innerHTML = cityData.main.pressure + ' ' + 'hPa'
    feelLikeDiv.innerHTML = Math.round(Number(cityData.main.feels_like)) + ' ' + units.temp
    cloudsDiv.innerHTML = `${cityData.clouds.all}%`
    maxTempDiv.innerHTML = Math.round(Number(cityData.main.temp_max)) + ' ' + units.temp
    minTempDiv.innerHTML = Math.round(Number(cityData.main.temp_min)) + ' ' + units.temp
}


const setForecast = () => {
    console.log(forecastData)
    forecastDiv.innerHTML = ''
    for(let i = 0; i < 27; i+=2) {
        const dayDiv = document.createElement('h2')
        dayDiv.innerHTML = getDay(forecastData.list[i].dt)
        const foreDiv = document.createElement('div')
        const foreTimeDiv = document.createElement('p')
        foreTimeDiv.innerHTML = getSunTime(forecastData.list[i].dt, 0)
        const iconDiv = document.createElement('img')
        iconDiv.src = `https://openweathermap.org/img/w/${forecastData.list[i].weather[0].icon}.png`
        const foreTempDiv = document.createElement('p')
        foreTempDiv.innerHTML = Math.round(Number(forecastData.list[i].main.temp)) + ' ' + units.temp
        const weatherDiv = document.createElement('p')
        weatherDiv.innerHTML = forecastData.list[i].weather[0].main
        foreDiv.append(dayDiv, foreTimeDiv, iconDiv, foreTempDiv, weatherDiv)
        forecastDiv.appendChild(foreDiv)
    }
}

const setBackgroundImg = () => {
    switch(cityData.weather[0].icon) {
        case '01d':
            document.body.style.backgroundImage = "url('./img/clear-day.jpg')";
            break;
        case '01n':
            document.body.style.backgroundImage = "url('./img/clear-night.jpg')";
            break;
        case '02d':
            document.body.style.backgroundImage = "url('./img/fewcloud-day.jpg')";
            break;
        case '02n':
            document.body.style.backgroundImage = "url('./img/fewcloud-night.jpg')";
            break;
        case '03d':
                document.body.style.backgroundImage = "url('./img/scatteredcloud-day.jpg')";
                break;
        case '03n':
                document.body.style.backgroundImage = "url('./img/scatteredcloud-night.jpg')";
                break;
        case '04d': 
                document.body.style.backgroundImage = "url('./img/brokencloud-day.jpg')";
                break;
        case '04n': 
            document.body.style.backgroundImage = "url('./img/brokencloud-night.jpg')";
            break;
        case '09d': 
            document.body.style.backgroundImage = "url('./img/showerrain-day.jpg')";
            break;
        case '09n': 
            document.body.style.backgroundImage = "url('./img/showerrain-night.jpg')";
            break;
        case '10d': 
            document.body.style.backgroundImage = "url('./img/rain-day.jpg')";
            break;
        case '10n': 
            document.body.style.backgroundImage = "url('./img/rain-night.jpg')";
            break;
        case '11d': 
            document.body.style.backgroundImage = "url('./img/thunderstorm-day.jpg')";
            break;
        case '11n': 
            document.body.style.backgroundImage = "url('./img/thunderstorm-night.jpg')";
            break;
        case '13d': 
            document.body.style.backgroundImage = "url('./img/snow-day.jpg')";
            break;
        case '13n': 
            document.body.style.backgroundImage = "url('./img/snow-night.jpg')";
            break;
        case '50d': 
            document.body.style.backgroundImage = "url('./img/mist-day.jpg')";
            break;
        case '50n': 
            document.body.style.backgroundImage = "url('./img/mist-night.jpg')";
            break;

    }
}

getData()








