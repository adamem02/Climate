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