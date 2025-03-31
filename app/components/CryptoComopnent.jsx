'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/store';
import { toast } from "sonner";
import Link from 'next/link';

const CryptoComponent = () => {
  const { cryptoData, livePrices, favorites, addFavorite, removeFavorite } = useStore();
  const [priceFlash, setPriceFlash] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});

  // Track price changes and trigger flash animation + notifications
  useEffect(() => {
    try {
      Object.keys(livePrices).forEach(id => {
        const currentPrice = Number(livePrices[id]);
        const previousPrice = previousPrices[id];
        
        if (previousPrice && currentPrice !== previousPrice) {
          // Calculate percentage change
          const percentChange = ((currentPrice - previousPrice) / previousPrice) * 100;
          
          setPriceFlash(prev => ({
            ...prev,
            [id]: currentPrice > previousPrice ? 'green' : 'red'
          }));

          // Notify on significant price changes (>= 5%)
          if (Math.abs(percentChange) >= 5) {
            const direction = percentChange > 0 ? 'increased' : 'decreased';
            toast({
              title: `Significant Price Alert`,
              description: `${cryptoData[id]?.name || id} has ${direction} by ${Math.abs(percentChange).toFixed(2)}%`,
              type: 'price_alert',
              duration: 5000,
            });
          }

          // Reset flash after animation
          setTimeout(() => {
            setPriceFlash(prev => ({
              ...prev,
              [id]: null
            }));
          }, 1000);
        }

        // Update previous price after comparison
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

  // Simulated weather impact alerts
  useEffect(() => {
    const checkWeatherImpact = () => {
      Object.entries(cryptoData).forEach(([id, data]) => {
        // Simulate weather impact on mining operations
        const random = Math.random();
        if (random > 0.95) { // 5% chance of weather alert
          toast({
            title: "Weather Impact Alert",
            description: `Potential mining disruption for ${data?.name || id} due to severe weather conditions`,
            type: 'weather_alert',
            duration: 7000,
          });
        }
      });
    };

    // Check every 5 minutes
    const interval = setInterval(checkWeatherImpact, 300000);
    return () => clearInterval(interval);
  }, [cryptoData]);

  if (!cryptoData || Object.keys(cryptoData).length === 0) {
    toast.error("No crypto data available");
    return (
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Crypto Dashboard</h2>
        <div className="p-4 text-center text-gray-500">
          Loading crypto data...
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Crypto Dashboard</h2>
      <div className="space-y-4 ">
        {Object.entries(cryptoData).map(([id, data]) => {
          try {
            // Safely access nested data with optional chaining
            const currentPrice = livePrices[id] || data?.current_price || 0;
            const priceChange = data?.price_change_percentage_24h || 0;
            const volume = data?.total_volume || 0;
            const marketCap = data?.market_cap || 0;
            const name = data?.name || id;
            const image = data?.image || '';
            const isFavorite = favorites.cryptos.includes(id);

            return (
              <Link 
                href={`/crypto?coin=${id}`}
                key={id}
              >
                <div 
                  className={`
                    p-4 bg-gray-50 rounded-lg transition-colors duration-500 hover:bg-gray-100
                    ${priceFlash[id] === 'green' ? 'bg-green-100' : ''}
                    ${priceFlash[id] === 'red' ? 'bg-red-100' : ''}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{name}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent link navigation
                          isFavorite ? removeFavorite('cryptos', id) : addFavorite('cryptos', id);
                        }}
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
                      </button>
                    </div>
                    {image && (
                      <img 
                        src={image} 
                        alt={name} 
                        className="w-8 h-8"
                        loading="lazy"
                        onError={() => toast.error(`Failed to load ${name} image`)}
                      />
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-2xl font-bold">
                      ${Number(currentPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className={`
                          px-2 py-1 rounded text-sm font-medium
                          ${priceChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        `}
                      >
                        {priceChange >= 0 ? '↑' : '↓'}
                        {Math.abs(priceChange).toFixed(2)}%
                      </span>
                      <span className="text-gray-500 text-sm">24h</span>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-500">
                    <p>Volume: ${Number(volume).toLocaleString()}</p>
                    <p>Market Cap: ${Number(marketCap).toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            );
          } catch (error) {
            toast.error(`Error displaying ${id} data`);
            console.error(`Error rendering crypto card for ${id}:`, error);
            return null;
          }
        })}
      </div>
    </section>
  );
};

export default CryptoComponent;
