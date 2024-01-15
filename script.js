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

// Function to handle displaying a five-day forecast
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

function getDayOfWeek(dayIndex) {
    // Convert the day index to the corresponding day of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
}


// Define a variable to store the search history
let searchHistory = [];

// Function to add a city to the search history
function addToSearchHistory(city) {
    // Add the city to the search history array
    searchHistory.push(city);

    // Save the updated search history to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Call a function to update the search history display
    updateSearchHistoryDisplay();
}

// Function to update the search history display
function updateSearchHistoryDisplay() {
    // Get the search history element
    const searchHistoryElement = document.getElementById('searchHistory');

    // Clear the existing content
    searchHistoryElement.innerHTML = '<h2>Search History</h2>';

    // Update the UI with the search history
    searchHistory.forEach((city) => {
        searchHistoryElement.innerHTML += `<p>${city}</p>`;
    });
}

// Function to load search history from localStorage on page load
function loadSearchHistory() {
    const storedSearchHistory = localStorage.getItem('searchHistory');
    searchHistory = storedSearchHistory ? JSON.parse(storedSearchHistory) : [];
    updateSearchHistoryDisplay();
}

// Load search history on page load
loadSearchHistory();

document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the city input value
    const city = document.getElementById('cityInput').value;

    // Call a function to fetch weather data based on the city
    getWeatherData(city);

    // Optional: Add the city to the search history
    addToSearchHistory(city);
});
