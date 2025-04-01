'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import { toast } from "sonner";
import Link from 'next/link';
import { motion, useSpring } from "framer-motion";

const STAGGER_DELAY = 0.1;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const CryptoComponent = () => {
  const { cryptoData, livePrices, favorites, addFavorite, removeFavorite } = useStore();
  const [priceFlash, setPriceFlash] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Track price changes and trigger flash animation + notifications
  useEffect(() => {
    try {
      Object.keys(livePrices).forEach(id => {
        const currentPrice = Number(livePrices[id]);
        const previousPrice = previousPrices[id];
        
        if (previousPrice && currentPrice !== previousPrice) {
          const percentChange = ((currentPrice - previousPrice) / previousPrice) * 100;
          
          // Set flash state
          setPriceFlash(prev => ({
            ...prev,
            [id]: {
              color: currentPrice > previousPrice ? 'green' : 'red',
              active: true
            }
          }));

          if (Math.abs(percentChange) >= 5) {
            const direction = percentChange > 0 ? 'increased' : 'decreased';
            toast({
              title: `Significant Price Alert`,
              description: `${cryptoData[id]?.name || id} has ${direction} by ${Math.abs(percentChange).toFixed(2)}%`,
              type: 'price_alert',
              duration: 5000,
            });
          }

          // Clear flash after animation
          setTimeout(() => {
            setPriceFlash(prev => ({
              ...prev,
              [id]: {
                color: null,
                active: false
              }
            }));
          }, 1000);
        }

        setPreviousPrices(prev => ({
          ...prev,
          [id]: currentPrice
        }));
      });
    } catch (error) {
      toast.error("Error updating crypto prices");
      console.error("Price update error:", error);
    }
  }, [livePrices, cryptoData]);

  useEffect(() => {
    const checkWeatherImpact = () => {
      Object.entries(cryptoData).forEach(([id, data]) => {
        const random = Math.random();
        if (random > 0.95) {
          toast({
            title: "Weather Impact Alert",
            description: `Potential mining disruption for ${data?.name || id} due to severe weather conditions`,
            type: 'weather_alert',
            duration: 7000,
          });
        }
      });
    };

    const interval = setInterval(checkWeatherImpact, 300000);
    return () => clearInterval(interval);
  }, [cryptoData]);

  useEffect(() => {
    if (cryptoData && Object.keys(cryptoData).length > 0) {
      setIsLoading(false);
    } else if (!isLoading) {
      toast.error("No crypto data available");
    }
  }, [cryptoData]);

  if (isLoading) {
    return (
      <motion.section 
        className="bg-white rounded-lg shadow p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>Crypto Dashboard</h2>
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </motion.section>
    );
  }

  if (!cryptoData || Object.keys(cryptoData).length === 0) {
    return (
      <motion.section 
        className="bg-white rounded-lg shadow p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>Crypto Dashboard</h2>
        <div className="p-4 text-center text-gray-500">
          No crypto data available
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      className="bg-white rounded-lg shadow p-6"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-orbitron)" }}>Crypto Dashboard</h2>
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {Object.entries(cryptoData).map(([id, data], index) => {
          try {
            const currentPrice = livePrices[id] || data?.current_price || 0;
            const priceChange = data?.price_change_percentage_24h || 0;
            const volume = data?.total_volume || 0;
            const marketCap = data?.market_cap || 0;
            const name = data?.name || id;
            const image = data?.image || '';
            const isFavorite = favorites.cryptos.includes(id);

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * STAGGER_DELAY }}
                whileHover={{ scale: 1.01 }}
              >
                <Link href={`/crypto?coin=${id}`}>
                  <motion.div 
                    className={`
                      p-4 rounded-lg transition-colors duration-300 hover:bg-gray-100 hover:shadow-md
                      ${!priceFlash[id]?.active ? 'bg-gray-50' : ''}
                      ${priceFlash[id]?.active && priceFlash[id]?.color === 'green' ? 'bg-green-100' : ''}
                      ${priceFlash[id]?.active && priceFlash[id]?.color === 'red' ? 'bg-red-100' : ''}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">{name}</h3>
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            isFavorite ? removeFavorite('cryptos', id) : addFavorite('cryptos', id);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="focus:outline-none"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill={isFavorite ? "gold" : "none"}
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-6 h-6 text-gray-400 hover:text-gold transition-colors"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                      {image && (
                        <motion.img 
                          src={image} 
                          alt={name} 
                          className="w-8 h-8"
                          loading="lazy"
                          onError={() => toast.error(`Failed to load ${name} image`)}
                          whileHover={{ scale: 1.1 }}
                        />
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <motion.p 
                        className={`text-2xl font-bold ${priceFlash[id]?.active ? (priceFlash[id]?.color === 'green' ? 'text-green-600' : 'text-red-600') : ''}`}
                        animate={priceFlash[id]?.active ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        ${Number(currentPrice).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </motion.p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <motion.span 
                          className={`
                            px-2 py-1 rounded text-sm font-medium
                            ${priceChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          `}
                          whileHover={{ scale: 1.05 }}
                        >
                          {priceChange >= 0 ? '↑' : '↓'}
                          {Math.abs(priceChange).toFixed(2)}%
                        </motion.span>
                        <span className="text-gray-500 text-sm">24h</span>
                      </div>
                    </div>

                    <motion.div 
                      className="mt-2 text-sm text-gray-500"
                      whileHover={{ x: 3 }}
                    >
                      <p>Volume: ${Number(volume).toLocaleString()}</p>
                      <p>Market Cap: ${Number(marketCap).toLocaleString()}</p>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          } catch (error) {
            toast.error(`Error displaying ${id} data`);
            console.error(`Error rendering crypto card for ${id}:`, error);
            return null;
          }
        })}
      </motion.div>
    </motion.section>
  );
};

export default CryptoComponent;
