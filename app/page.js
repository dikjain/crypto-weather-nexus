'use client';
import React, { useEffect } from 'react';
import { useStore } from './store/store';
import NewsComponent from './components/NewsComponents';
import CryptoComponent from './components/CryptoComopnent';
import WeatherComponent from './components/WeatherComponent';
import { DialogDemo } from './components/DialougeContent';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const headerVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-4 md:p-8 bg-gray-50"
    >
      <motion.div 
        variants={headerVariants}
        className="flex justify-between items-center mb-8"
      >
        <motion.h1 
          className="text-4xl font-bold text-gray-900"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          CryptoWeather Nexus
        </motion.h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <DialogDemo />
        </motion.div>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}>
          <WeatherComponent />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CryptoComponent />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NewsComponent />
        </motion.div>
      </motion.div>
    </motion.main>
  );
}