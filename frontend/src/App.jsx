// frontend/src/App.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';
import { fetchWeather, fetchWeatherByCoords } from './services/api';
import { getWeatherInfo } from './utils/weatherIcons';
import { HourlyChart } from './components/HourlyChart';

export default function App() {
  const [cityInput, setCityInput] = useState('');
  const [searchParams, setSearchParams] = useState({ type: 'city', value: 'São Paulo' });
  const [isLocating, setIsLocating] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['weather', searchParams],
    queryFn: () => searchParams.type === 'city'
      ? fetchWeather(searchParams.value)
      : fetchWeatherByCoords(searchParams.value.lat, searchParams.value.lon),
    retry: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setSearchParams({ type: 'city', value: cityInput.trim() });
    }
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      window.alert('Seu navegador não suporta geolocalização.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchParams({
          type: 'coords',
          value: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
        setIsLocating(false);
      },
      () => {
        window.alert('Não foi possível obter sua localização. Verifique a permissão do navegador e tente novamente.');
        setIsLocating(false);
      }
    );
  };

  const weather = data?.data;
  const currentInfo = weather ? getWeatherInfo(weather.current.weatherCode) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Cabeçalho e Barra de Busca */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">ClimaTempo Web</h1>
          
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              placeholder="Buscar cidade..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium flex items-center gap-2 cursor-pointer transition"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
            <button
              type="button"
              onClick={handleGeoLocation}
              disabled={isLocating}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-xl font-medium flex items-center gap-2 cursor-pointer transition"
              aria-label="Usar minha localização"
            >
              <MapPin className="w-4 h-4" />
              {isLocating ? 'Localizando...' : 'Usar localização'}
            </button>
          </form>
        </header>

        {/* Estado de Carregamento */}
        {isLoading && (
          <div className="text-center py-12 text-blue-200 animate-pulse">
            Buscando dados meteorológicos...
          </div>
        )}

        {/* Tratamento de Erro (vindo lá do nosso Zod ou 404 do Back-end) */}
        {isError && (
          <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-4 text-center text-red-200">
            {error.response?.data?.error || 'Erro ao conectar com o servidor.'}
          </div>
        )}

        {/* Card Principal do Clima Atual */}
        {weather && !isLoading && (
          <>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-blue-300 uppercase tracking-wider">Agora em</p>
                  <h2 className="text-3xl font-bold mt-1">
                    {weather.location.name}, {weather.location.state}
                  </h2>
                  <p className="text-gray-300 text-sm">{weather.location.country}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-6xl font-extrabold">{weather.current.temp}°C</span>
                    <div>
                      {currentInfo.icon}
                      <p className="text-lg font-medium mt-1">{currentInfo.label}</p>
                    </div>
                  </div>
                </div>

                {/* Detalhes extras (Sensação, Umidade e Vento) */}
                <div className="grid grid-cols-3 sm:grid-cols-1 gap-3 w-full sm:w-auto bg-black/20 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <span>Sensação: <strong>{weather.current.feelsLike}°C</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span>Umidade: <strong>{weather.current.humidity}%</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <span>Vento: <strong>{weather.current.windSpeed} km/h</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <HourlyChart data={weather.hourly} />

            {/* Previsão para os próximos 7 dias */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6">
              <h3 className="text-lg font-semibold mb-4">Próximos 7 dias</h3>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
                {weather.daily.map((day) => {
                  const dayInfo = getWeatherInfo(day.weatherCode);
                  return (
                    <div
                      key={day.date}
                      className="bg-black/20 rounded-2xl p-3 flex flex-col items-center text-center"
                    >
                      <span className="text-xs text-gray-300 capitalize">
                        {new Date(day.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </span>
                      <div className="my-2 scale-75">{dayInfo.icon}</div>
                      <div className="text-sm">
                        <span className="font-bold">{day.maxTemp}°</span>{' '}
                        <span className="text-gray-400">{day.minTemp}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}