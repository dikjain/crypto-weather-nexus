'use client';
import React, { useEffect } from 'react';
import { useStore } from '../store/store';
import { toast } from "sonner";
import Link from 'next/link';
import { motion } from "framer-motion";

const STAGGER_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

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
    <motion.section 
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      viewport={{ once: true }}
    >
      <motion.h2 
        className="text-2xl font-semibold mb-4"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        Weather Dashboard
      </motion.h2>
      <div className="space-y-4">
        {['New York', 'London', 'Tokyo'].map((city, index) => (
          <motion.div
            key={city}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: index * STAGGER_DELAY }}
          >
            <Link href={`/weather?city=${city}`}>
              <motion.div 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">{city}</h3>
                  {weatherData[city]?.weather[0]?.icon ? (
                    <motion.img
                      src={weatherData[city].weather[0].icon}
                      alt={weatherData[city].weather[0].main}
                      className="w-12 h-12"
                      whileHover={{ scale: 1.1, rotate: 5 }}
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
                  <motion.div 
                    className="mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-baseline gap-2">
                      <motion.span 
                        className="text-3xl font-bold"
                        whileHover={{ scale: 1.05 }}
                      >
                        {weatherData[city].main.temp}°C
                      </motion.span>
                      <span className="text-gray-500">
                        Feels like {weatherData[city].main.feels_like}°C
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <motion.div 
                        className="bg-blue-50 p-2 rounded"
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-blue-700">
                          Humidity: {weatherData[city].main.humidity}%
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-blue-50 p-2 rounded"
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-blue-700">
                          Wind: {weatherData[city].wind.speed} km/h
                        </p>
                      </motion.div>

                      <motion.div 
                        className="bg-blue-50 p-2 rounded"
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-blue-700">
                          Direction: {weatherData[city].wind.dir}
                        </p>
                      </motion.div>

                      {weatherData[city].air_quality && (
                        <motion.div 
                          className="bg-blue-50 p-2 rounded"
                          whileHover={{ scale: 1.02 }}
                        >
                          <p className="text-blue-700">
                            AQI: {Math.round(weatherData[city].air_quality.pm2_5)}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <motion.p 
                      className="mt-2 text-gray-600"
                      whileHover={{ x: 3 }}
                    >
                      {weatherData[city].weather[0].main}
                    </motion.p>
                  </motion.div>
                ) : (
                  <div className="mt-3 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                    <span>Loading weather data...</span>
                  </div>
                )}
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default WeatherComponent;
