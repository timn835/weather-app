import openWeatherMapKey from '../variables.js';
let weather = {
    apiKey:openWeatherMapKey,
    getWeather: function(city) {
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + this.apiKey)
            .then(coord => coord.json())
            .then(coord => {
                const latitude = coord[0].lat;
                const longitude = coord[0].lon;
                fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=" + this.apiKey)
                .then(weather => weather.json())
                .then(data => this.showWeather(data))
            })
    },
    showWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        //console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").textContent = "Weather in " + name;
        document.querySelector(".temp").textContent = Math.round(temp) + '°C';
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").textContent = description;
        document.querySelector(".humidity").textContent = 'Humidity: ' + humidity + '%';
        document.querySelector(".wind").textContent = "Wind speed: " + Math.round(speed) + ' km/h';
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/random/1600×900/?" + name + "')"
    },
    search: function() {
        this.getWeather(document.querySelector(".search-bar").value);
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

weather.getWeather("Montreal")