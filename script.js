const apiKey = 'dd59e13a2e388ff05fd33063e8e7c7d4'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';


document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the city input value
    const city = document.getElementById('cityInput').value;

    // Call the function to fetch weather data based on the city
    getWeatherData(city);
});


async function getWeatherData(city) {
    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        // Handle the data as needed
        console.log(data);

        // Call functions to update the UI with the received data
        updateCurrentWeather(data.list[0].main, data.list[0].wind);
        updateHourlyForecast(data.list);
        updateFiveDayForecast(data.list);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }
}

function updateCurrentWeather(mainData, windData) {
    // Extract data from the API response
    const temperature = mainData.temp;
    const humidity = mainData.humidity;
    const windSpeed = windData.speed;

    // Update the current weather UI elements
    const currentWeatherElement = document.getElementById('currentWeather');
    currentWeatherElement.innerHTML = `
        <h2>Current Weather</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

function updateHourlyForecast(hourlyData) {
    // Extract relevant data from the API response for the first hour
    const time = hourlyData[0].dt_txt;
    const temperature = hourlyData[0].main.temp;
    const humidity = hourlyData[0].main.humidity;
    const windSpeed = hourlyData[0].wind.speed;

    // Update the hourly forecast UI elements for the first hour
    const hourlyForecastElement = document.getElementById('hourlyForecast');
    hourlyForecastElement.innerHTML = `
        <h2>${time} - Hourly Forecast</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;


}
// Function to handle displaying a five day forecast
function updateFiveDayForecast(forecastData) {
    // Assuming the API returns data for every 3 hours, select one data point per day
    const dailyDataPoints = forecastData.filter((data, index) => index % 8 === 0);

    // Update the UI for the next five days
    const fiveDayForecastElement = document.getElementById('fiveDayForecast');
    fiveDayForecastElement.innerHTML = '<h2>Next Five Days Forecast</h2>';

    dailyDataPoints.slice(1, 6).forEach((dayData, dayIndex) => {
        // Extract relevant data from the API response
        const date = new Date(dayData.dt_txt);
        const temperature = dayData.main.temp;
        const humidity = dayData.main.humidity;
        const windSpeed = dayData.wind.speed;

        // Update the UI for each day
        fiveDayForecastElement.innerHTML += `
            <div class="day">
                <h3>${getDayOfWeek(date.getDay())}</h3>
                <p>Date: ${date.toDateString()}</p>
                <p>Temperature: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
    });
}