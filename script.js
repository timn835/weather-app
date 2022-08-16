import openWeatherMapKey from '../variables.js';
let weather = {
    apiKey:openWeatherMapKey,
    getPlaces: function(city) {
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + this.apiKey)
            .then(cities => cities.json())
            .then(cities => {
                this.createCityButtons(cities)
            })
    },
    createCityButtons: function(cities) {
        let citiesDiv = document.querySelector('.cities');
        let cityButtons = document.querySelector('.city-buttons');
        let weather = document.querySelector('.weather');
        weather.classList.add('hide')
        citiesDiv.classList.remove('hide');
        while (cityButtons.firstChild) {
            cityButtons.firstChild.remove()
        }
        if(cities.length === 0) {
            citiesDiv.firstElementChild.textContent = 'No places found, please try again';
            return;
        }
        citiesDiv.firstElementChild.textContent = 'Choose a place';
        for(let city of cities) {
            let name = city.name;
            if('state' in city) name += ', ' + city.state;
            if('country' in city) name += ', ' + city.country;
            let button = document.createElement('button');
            button.classList.add('place');
            button.textContent = name;
            button.dataset.lat = city.lat
            button.dataset.lon = city.lon
            button.addEventListener("click", this.getWeather);
            cityButtons.appendChild(button)
        }
    },
    getWeather: function(button) {
        fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + button.target.dataset.lat + "&lon=" + button.target.dataset.lon + "&units=metric&appid=" + weather.apiKey)
        .then(weather => weather.json())
        .then(data => weather.showWeather(data))
    },
    showWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").textContent = "Weather in " + name;
        document.querySelector(".temp").textContent = Math.round(temp) + '°C';
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").textContent = description;
        document.querySelector(".humidity").textContent = 'Humidity: ' + humidity + '%';
        document.querySelector(".wind").textContent = "Wind speed: " + Math.round(speed) + ' km/h';
        document.querySelector(".weather").classList.remove("loading");
        document.querySelector('.weather').classList.remove("hide");
        document.querySelector('.cities').classList.add("hide");
        document.querySelector('.search-bar').value = '';
        document.body.style.backgroundImage = "url('https://source.unsplash.com/random/1600×900/?" + name + "')"
    },
    search: function() {
        this.getPlaces(document.querySelector(".search-bar").value);
    }
};
document.querySelector(".search button").addEventListener("click", () => {
    weather.search();
})
document.querySelector(".search-bar").addEventListener("keyup", ev => {
    if(ev.key === 'Enter') {
        weather.search();
    }
})

let initial_button = document.querySelector('.city-buttons .place')
initial_button.addEventListener("click", weather.getWeather);
initial_button.click();

// weather.getWeather("Montreal")
//lat":45.5031824,"lon":-73.5698065