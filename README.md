# ClimaTempo Web

## About the Project

ClimaTempo Web is a full-stack application for checking weather conditions in a city. The interface displays current weather and a seven-day forecast using data from the Open-Meteo API.

The backend looks up the city's location, retrieves weather data, and formats it for the frontend. Responses are cached for 15 minutes to reduce repeated external requests.

## Features

- **City search:** looks up cities by name and reports when a city cannot be found.
- **Current conditions:** displays temperature, feels-like temperature, humidity, wind speed, and a weather description.
- **Seven-day forecast:** shows the weather description and daily high and low temperatures.
- **Weather icons:** represents weather conditions with icons.
- **Search validation:** validates the city name on the backend before querying weather services.
- **Caching and rate limiting:** caches data for 15 minutes and limits API requests to 30 per minute.

## Technologies

**Frontend**

- React 19
- Vite 8
- Tailwind CSS 4
- TanStack Query
- Axios
- Lucide React

**Backend**

- Node.js
- Express 5
- Axios
- Zod
- NodeCache
- CORS
- express-rate-limit

**Weather data:** [Open-Meteo](https://open-meteo.com/) — geocoding and weather forecast APIs.

## Project Structure

```text
clima_tempo/
├── backend/
│   └── src/
│       ├── routes/
│       │   └── weatherRoutes.js
│       ├── services/
│       │   └── weatherService.js
│       └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── services/
│       │   └── api.js
│       ├── utils/
│       │   └── weatherIcons.jsx
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
└── README.md
```

## Prerequisites

- Node.js compatible with Vite 8
- npm
- Internet access to query the Open-Meteo services

## Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/vitor-nery11/clima_tempo.git
cd clima_tempo
```

Install the backend dependencies:

```bash
cd backend
npm install
```

Then install the frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

Start the backend and frontend in separate terminals.

**Backend**

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3001`. You can change the port with the `PORT` environment variable.

**Frontend**

```bash
cd frontend
npm run dev
```

Vite will print the local application URL in the terminal, usually `http://localhost:5173`.

## API

The weather endpoint accepts the city name through the `city` query parameter:

```http
GET http://localhost:3001/api/weather?city=São%20Paulo
```

The response includes the data source (`api` or `cache`) and weather information under `data`, including the location, current conditions, hourly data, and daily forecast.

## Frontend Checks

Run the linter:

```bash
cd frontend
npm run lint
```

Create a production build:

```bash
cd frontend
npm run build
```

## Author

**Vitor Nery**
