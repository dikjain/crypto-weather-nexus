'use client';
import React, { useEffect } from 'react';
import { useStore } from './store/store';
import NewsComponent from './components/NewsComponents';
import CryptoComponent from './components/CryptoComopnent';
import WeatherComponent from './components/WeatherComponent';
import { DialogDemo } from './components/DialougeContent';

export default function Home() {
  const { 
    fetchWeather,
    fetchCrypto,
    fetchNews,
    startCryptoWebSocket, 
    closeCryptoWebSocket
  } = useStore();

  useEffect(() => {
    const cities = ['New York', 'London', 'Tokyo'];
    const fetchAllData = () => {
      cities.forEach(city => fetchWeather(city));
      fetchCrypto();
      fetchNews();
    };

    // Initial data fetch
    fetchAllData();
    startCryptoWebSocket();

    // Periodic refresh
    const interval = setInterval(fetchAllData, 60000);

    return () => {
      clearInterval(interval);
      closeCryptoWebSocket();
    };
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">CryptoWeather Nexus</h1>
        <DialogDemo />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeatherComponent />
        <CryptoComponent />
        <NewsComponent />
      </div>
    </main>
  );
}