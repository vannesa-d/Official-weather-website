function searchCity() {
    const cityInput = document.getElementById('city-input').value.trim();
    const apiKey = '26b5oa4b2td3604ab8fffbc930cb662b'; 
    const currentWeatherUrl = `https://api.shecodes.io/weather/v1/current?query=${cityInput}&key=${apiKey}&units=metric`;
    const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityInput}&key=${apiKey}&units=metric`;

    if (cityInput) {
        document.getElementById('city-name').textContent = 'Loading...';
        document.getElementById('temperature').textContent = '--°C';
        document.getElementById('description').textContent = '--';
        document.getElementById('humidity').innerHTML = `<strong>Humidity:</strong> --%`;
        document.getElementById('wind-speed').innerHTML = `<strong>Wind Speed:</strong> -- km/h`;
        document.getElementById('pressure').innerHTML = `<strong>Pressure:</strong> -- hPa`;
        document.getElementById('feels-like').innerHTML = `<strong>Feels Like:</strong> --°C`;
        document.getElementById('weather-icon').style.display = 'none';
        document.getElementById('forecast').innerHTML = '';

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                document.getElementById('city-name').textContent = data.city;
                document.getElementById('temperature').textContent = `${Math.round(data.temperature.current)}°C`;
                document.getElementById('description').textContent = data.condition.description;

                const iconPath = `./weather/${data.condition.icon}.png`;
                const weatherIcon = document.getElementById('weather-icon');
                weatherIcon.src = iconPath;
                weatherIcon.alt = data.condition.description;
                weatherIcon.style.display = 'inline';

                document.getElementById('humidity').innerHTML = `<strong>Humidity:</strong> ${data.temperature.humidity}%`;
                document.getElementById('wind-speed').innerHTML = `<strong>Wind Speed:</strong> ${Math.round(data.wind.speed * 3.6)} km/h`;
                document.getElementById('pressure').innerHTML = `<strong>Pressure:</strong> ${data.temperature.pressure} hPa`;
                document.getElementById('feels-like').innerHTML = `<strong>Feels Like:</strong> ${Math.round(data.temperature.feels_like)}°C`;

                const date = new Date(data.time * 1000);
                document.getElementById('datetime').textContent = `Weather data updated on ${date.toLocaleString()}`;
            })
            .catch(() => alert('City not found!'));

        fetch(forecastUrl)
            .then(response => response.json())
            .then(forecastData => {
                const forecastContainer = document.getElementById('forecast');
                forecastData.daily.forEach(day => {
                    const forecastDate = new Date(day.time * 1000);
                    const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
                    const iconPath = `./weather/${day.condition.icon}.png`;

                    const forecastDay = document.createElement('div');
                    forecastDay.className = 'forecast-day';

                    forecastDay.innerHTML = `
                        <div class="forecast-date">${dayName}</div>
                        <img class="forecast-icon" src="${iconPath}" alt="${day.condition.description}">
                        <div class="forecast-temp">${Math.round(day.temperature.minimum)}°C / ${Math.round(day.temperature.maximum)}°C</div>
                    `;

                    forecastContainer.appendChild(forecastDay);
                });
            })
            .catch(() => alert('Error fetching forecast data.'));
    } else {
        alert('Please enter a city name!');
    }
}
