'use client';
import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { useSearchParams } from 'next/navigation';
import { toast } from "sonner";

const CryptoDetails = () => {
  const { cryptoData, livePrices, fetchCrypto } = useStore();
  const searchParams = useSearchParams();
  const coinId = searchParams.get('coin');
  const [priceFlash, setPriceFlash] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);

  useEffect(() => {
    if (!cryptoData || Object.keys(cryptoData).length === 0) {
      fetchCrypto();
    }
  }, [cryptoData, fetchCrypto]);

  useEffect(() => {
    if (!coinId) return;
    
    const currentPrice = livePrices[coinId];
    if (previousPrice && currentPrice !== previousPrice) {
      setPriceFlash(currentPrice > previousPrice ? 'green' : 'red');
      setTimeout(() => setPriceFlash(null), 1000);
    }
    setPreviousPrice(currentPrice);
  }, [livePrices, coinId]);

  if (!coinId || !cryptoData[coinId]) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Invalid cryptocurrency selected</h1>
      </div>
    );
  }

  const coin = cryptoData[coinId];
  const currentPrice = livePrices[coinId] || coin.current_price;

  return (
    <div className="p-8 max-w-7xl mx-auto h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-10 border-b pb-6">
          <img 
            src={coin.image} 
            alt={coin.name} 
            className="w-20 h-20"
            onError={() => toast.error(`Failed to load ${coin.name} image`)}
          />
          <div>
            <h1 className="text-4xl font-bold">{coin.name}</h1>
            <p className="text-xl text-gray-500 uppercase">{coin.symbol}</p>
          </div>
          <div className={`ml-auto text-right transition-colors duration-500 ${
            priceFlash === 'green' ? 'text-green-600' : 
            priceFlash === 'red' ? 'text-red-600' : ''
          }`}>
            <p className="text-5xl font-bold">
              ${Number(currentPrice).toLocaleString()}
            </p>
            <div className="flex items-center gap-2 justify-end mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${coin.price_change_percentage_24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </span>
              <span className="text-gray-500">24h</span>
            </div>
          </div>
        </div>

        {/* Market Stats Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Market Statistics</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Market Cap</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">${Number(coin.market_cap).toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">24h Volume</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">${Number(coin.total_volume).toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">24h High</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-green-600">${Number(coin.high_24h).toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">24h Low</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-red-600">${Number(coin.low_24h).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Supply Information</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Circulating Supply</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {Number(coin.circulating_supply).toLocaleString()} {coin.symbol.toUpperCase()}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Total Supply</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {Number(coin.total_supply).toLocaleString()} {coin.symbol.toUpperCase()}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Max Supply</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {coin.max_supply ? `${Number(coin.max_supply).toLocaleString()} ${coin.symbol.toUpperCase()}` : 'Unlimited'}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Market Cap Rank</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">#{coin.market_cap_rank}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* All Time Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600" colSpan="2">All Time High</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Price</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-green-600">${Number(coin.ath).toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Date</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">{new Date(coin.ath_date).toLocaleDateString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Change</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-red-600">{coin.ath_change_percentage.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600" colSpan="2">All Time Low</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Price</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-red-600">${Number(coin.atl).toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Date</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">{new Date(coin.atl_date).toLocaleDateString()}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">Change</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-green-600">{coin.atl_change_percentage.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;
