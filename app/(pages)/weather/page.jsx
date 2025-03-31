'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const WeatherDetails = () => {
  const { weatherData, fetchWeather } = useStore();
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const [weatherHistory, setWeatherHistory] = useState([]);

  useEffect(() => {
    if (!city) return;

    // Fetch current weather and 7 day forecast
    fetchWeather(city, 7);

  }, [city, fetchWeather]);

  if (!city || !weatherData[city]) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Invalid city selected</h1>
      </div>
    );
  }

  const cityData = weatherData[city];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-10 border-b pb-6">
          {cityData?.weather[0]?.icon && (
            <img
              src={cityData.weather[0].icon}
              alt={cityData.weather[0].main}
              className="w-20 h-20"
              onError={() => toast.error(`Failed to load weather icon for ${city}`)}
            />
          )}
          <div>
            <h1 className="text-4xl font-bold">{city}</h1>
            <p className="text-xl text-gray-500">{cityData.weather[0].main}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-5xl font-bold">{cityData.main.temp}°C</p>
            <p className="text-gray-500 mt-2">Feels like {cityData.main.feels_like}°C</p>
          </div>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Wind</h3>
            <p className="text-3xl font-bold mt-2">{cityData.wind.speed} km/h</p>
            <p className="text-gray-600 mt-1">Direction: {cityData.wind.dir}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Humidity</h3>
            <p className="text-3xl font-bold mt-2">{cityData.main.humidity}%</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Air Quality</h3>
            <p className="text-3xl font-bold mt-2">
              {Math.round(cityData.air_quality?.pm2_5 || 0)} PM2.5
            </p>
          </div>
        </div>

        {/* Weather Forecast Chart */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">7-Day Weather Forecast</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cityData.forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avg_temp" 
                  stroke="#8884d8" 
                  name="Temperature (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#82ca9d" 
                  name="Humidity (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="rain_chance" 
                  stroke="#ffc658" 
                  name="Rain Chance (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Forecast Table */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Forecast Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature (°C)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Humidity (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rain Chance (%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cityData.forecast.map((day, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{day.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{day.avg_temp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{day.humidity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{day.rain_chance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
