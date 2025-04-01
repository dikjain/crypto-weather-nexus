'use client';
import React, { useEffect } from 'react';
import { useStore } from './store/store';
import NewsComponent from './components/NewsComponents';
import CryptoComponent from './components/CryptoComopnent';
import WeatherComponent from './components/WeatherComponent';
import { DialogDemo } from './components/DialougeContent';
import { motion, useScroll, useSpring } from 'framer-motion';

const STAGGER_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const { 
    fetchWeather,
    fetchCrypto, 
    fetchNews,
    startCryptoWebSocket,
    closeCryptoWebSocket
  } = useStore();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const cities = ['New York', 'London', 'Tokyo'];
    const fetchAllData = () => {
      cities.forEach(city => fetchWeather(city));
      fetchCrypto();
      fetchNews();
    };

    fetchAllData();
    startCryptoWebSocket();

    const interval = setInterval(fetchAllData, 60000);

    return () => {
      clearInterval(interval);
      closeCryptoWebSocket();
    };
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="min-h-screen relative z-40 bg-background"
    >
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left bg-primary"
        style={{ scaleX }}
      />

      <main className="container mx-auto p-4 md:p-8">
        <motion.section
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="py-8"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              className="text-4xl font-bold"
              whileHover={{ scale: 1.02 }}
              style={{ fontFamily: "var(--font-orbitron)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              CryptoWeather Nexus
            </motion.h1>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <DialogDemo />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <WeatherComponent />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CryptoComponent />
            </motion.div>

            <motion.div
              variants={fadeInUp} 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <NewsComponent />
            </motion.div>
          </div>
        </motion.section>
      </main>

      <div className="fixed bottom-4 right-4 text-sm text-gray-500">
        <a 
          href="https://portfolio-web-seven-beta.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 transition-colors"
        >
          Submitted by Dikshit Mahanot
        </a>
      </div>
    </motion.div>
  );
}