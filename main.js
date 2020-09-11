self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.url){
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(newtorkFirst(req));
    }
});

async function cacheFirst(req){
    const cachedResponse = caches.match(req);
    return cachedResponse || fetch(req);
}

async function newtorkFirst(req){
    const cache = await caches.open('dynamic-cache');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}

const api = {
    Key: "3bee504aefd425491a5ea17260aa1c40",
    baseurl: "https://api.openweathermap.org/data/2.5/"
};

document.addEventListener('DOMContentLoaded', getStorageData());

window.onload = () => {  
    'use strict';     
    if ('serviceWorker' in navigator) {     
    navigator.serviceWorker  
    .register('./sw.js'); 
    } 
    }

function getStorageData()
{
 // Get data
 let data = localStorage.getItem('weatherData');
 let returnedStorage = JSON.parse(data);
 if (returnedStorage !== null)
 {
       displayResults(returnedStorage);
 }
}
    


            
//Set up a event listener on the searchbox form when we press a key
    const searchbox = document.getElementById("search");
searchbox.addEventListener("keypress", setQuery);
   



//If enter button/ key is pressed ,pass the value to the getresults function
  function setQuery(evt){ 
      if (evt.keyCode === 13 )
      {
         localStorage.removeItem('weatherData');
          getResults(searchbox.value);
      }
 }


function getResults(query){
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.Key}`)
    .then(weather => {
        return weather.json();
    }).then(someData);
}

function someData(information)
{
    let storeData = JSON.stringify(information)
    // Store data
    localStorage.setItem('weatherData', storeData);
          displayResults(information);
}



  
//Display weather
function displayResults(weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span`;

    let weather_Element = document.querySelector('.current .weather');
    weather_Element.innerText  = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder(inputDate)
{
    let months = ["January", "February", "March", "April", "May", "June",
                 "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
                "Friday", "Saturday"];
    
    let day = days[inputDate.getDay()];
    let date = inputDate.getDate();
    let month = months[inputDate.getMonth()];
    let year = inputDate.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}


