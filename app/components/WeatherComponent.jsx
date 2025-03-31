'use client';
import React, { useEffect } from 'react';
import { useStore } from '../store/store';
import { toast } from "sonner";
import Link from 'next/link';

const WeatherComponent = () => {
  const { weatherData, fetchWeather } = useStore();

  // Check for weather alerts based on conditions
  useEffect(() => {
    console.log(weatherData);
    if (!weatherData) {
      toast.error("Failed to load weather data", {
        type: 'weather_alert',
        description: 'Weather data unavailable'
      });
      return;
    }

    Object.entries(weatherData).forEach(([city, data]) => {
      // Temperature alerts
      if (data?.main?.temp > 35) {
        toast.warning(`Extreme heat warning for ${city}`, {
          type: 'weather_alert',
          description: `Temperature is ${data.main.temp}°C`
        });
      }
      if (data?.main?.temp < 0) {
        toast.warning(`Freezing temperature alert for ${city}`, {
          type: 'weather_alert', 
          description: `Temperature is ${data.main.temp}°C`
        });
      }

      // Wind alerts
      if (data?.wind?.speed > 50) {
        toast.warning(`High wind alert for ${city}`, {
          type: 'weather_alert',
          description: `Wind speed is ${data.wind.speed} km/h`
        });
      }

      // Air quality alerts
      if (data?.air_quality?.pm2_5 > 100) {
        toast.error(`Poor air quality alert for ${city}`, {
          type: 'weather_alert',
          description: `AQI (PM2.5) is ${Math.round(data.air_quality.pm2_5)}`
        });
      }
    });
  }, [weatherData]);

  useEffect(() => {
    ['New York', 'London', 'Tokyo'].forEach(city => {
      fetchWeather(city);
    });
  }, [fetchWeather]);

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Weather Dashboard</h2>
      <div className="space-y-4">
        {['New York', 'London', 'Tokyo'].map(city => (
          <Link href={`/weather?city=${city}`} key={city}>
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">{city}</h3>
                {weatherData[city]?.weather[0]?.icon ? (
                  <img
                    src={weatherData[city].weather[0].icon}
                    alt={weatherData[city].weather[0].main}
                    className="w-12 h-12"
                    onError={() => toast.error(`Failed to load weather icon for ${city}`, {
                      type: 'weather_alert',
                      description: 'Icon loading failed'
                    })}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                )}
              </div>

              {weatherData[city] ? (
                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {weatherData[city].main.temp}°C
                    </span>
                    <span className="text-gray-500">
                      Feels like {weatherData[city].main.feels_like}°C
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-blue-700">
                        Humidity: {weatherData[city].main.humidity}%
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-blue-700">
                        Wind: {weatherData[city].wind.speed} km/h
                      </p>
                    </div>

                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-blue-700">
                        Direction: {weatherData[city].wind.dir}
                      </p>
                    </div>

                    {weatherData[city].air_quality && (
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-blue-700">
                          AQI: {Math.round(weatherData[city].air_quality.pm2_5)}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-gray-600">
                    {weatherData[city].weather[0].main}
                  </p>
                </div>
              ) : (
                <div className="mt-3 text-center text-gray-500">
                  Loading weather data...
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default WeatherComponent;
