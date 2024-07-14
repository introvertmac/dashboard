'use client'

import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';

const CACHE_KEY = 'solanaTokenData';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchTokenData = async () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&category=solana-ecosystem`
    );
    const data = response.data;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
};

const TokenMetrics = () => {
  const { data, isLoading, error } = useQuery('solanaTokenData', fetchTokenData, {
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 300000, // Consider data stale after 5 minutes
    cacheTime: 600000, // Keep unused data in cache for 10 minutes
  });

  if (isLoading) return <TokenMetricsSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Top Solana Tokens</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((token, index) => (
          <motion.div
            key={token.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <Image src={token.image} alt={token.name} width={40} height={40} className="w-10 h-10 mr-4" />
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-gray-800 dark:text-white">{token.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{token.symbol.toUpperCase()}</p>
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-white">${token.current_price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                <p className={`text-sm ${token.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {token.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(token.price_change_percentage_24h).toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  MCap: ${(token.market_cap / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const TokenMetricsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full mr-4"></div>
          <div className="flex-grow">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline"> {error.message}</span>
  </div>
);

export default TokenMetrics;
