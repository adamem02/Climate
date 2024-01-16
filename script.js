const apiKey = 'dd59e13a2e388ff05fd33063e8e7c7d4'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

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

// Function to get the day of the week
function getDayOfWeek(dayIndex) {
    // Convert the day index to the corresponding day of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
}

// Function to fetch weather data based on the city
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

// Function to update the current weather display
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

// Define a variable to store the search history
let searchHistory = [];

// Function to add a city to the search history
function addToSearchHistory(city) {
    // Check if the city already exists in the search history
    if (searchHistory.includes(city)) {
        // Display a confirmation message
        const isConfirmed = confirm(`"${city}" is already in the search history. Do you want to add it again?`);

        if (!isConfirmed) {
            return; // Exit the function if the user cancels
        }
    }

    // Add the city to the search history array
    searchHistory.push(city);

    // Save the updated search history to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Call a function to update the search history display
    updateSearchHistoryDisplay();

    // Call a function to fetch weather data based on the city
    getWeatherData(city);
}

// Function to update the search history display
function updateSearchHistoryDisplay() {
    // Get the search history element
    const searchHistoryElement = document.getElementById('searchHistoryButtons');

    // Clear the existing content
    searchHistoryElement.innerHTML = '<h2>Search History</h2>';

    // Update the UI with the search history buttons
    searchHistory.forEach((city) => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => {
            // Call a function to fetch weather data based on the clicked city
            getWeatherData(city);
        });
        searchHistoryElement.appendChild(button);
    });
}

// Function to clear the search history
function clearSearchHistory() {
    // Clear the search history array
    searchHistory = [];

    // Save the updated search history to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Call a function to update the search history display
    updateSearchHistoryDisplay();
}

// Function to load search history from localStorage on page load
function loadSearchHistory() {
    const storedSearchHistory = localStorage.getItem('searchHistory');
    searchHistory = storedSearchHistory ? JSON.parse(storedSearchHistory) : [];
    updateSearchHistoryDisplay();
}

// Load search history on page load
loadSearchHistory();

// Add an event listener for the form submission
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the city input value
    const city = document.getElementById('cityInput').value;

    // Optional: Add the city to the search history
    addToSearchHistory(city);
});