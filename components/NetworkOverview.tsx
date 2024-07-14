'use client';

import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CACHE_KEY = 'coinGeckoData';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchCoinGeckoData = async () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const coingeckoResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_COINGECKO_API_URL}/coins/solana?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );

    const {
      market_data: { current_price, price_change_percentage_24h, market_cap, total_volume },
    } = coingeckoResponse.data;

    const historicalDataResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_COINGECKO_API_URL}/coins/solana/market_chart?vs_currency=usd&days=1`
    );

    const priceData = historicalDataResponse.data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }));

    const data = {
      price: current_price.usd,
      priceChange: price_change_percentage_24h,
      marketCap: market_cap.usd,
      volume24h: total_volume.usd,
      priceData,
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    throw error;
  }
};

const fetchSolanaData = async () => {
  try {
    const tpsResponse = await axios.post(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getRecentPerformanceSamples',
      params: [1],
    });
    const tps = tpsResponse.data.result[0].numTransactions / tpsResponse.data.result[0].samplePeriodSecs;

    const validatorsResponse = await axios.post(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getVoteAccounts',
    });

    const activeValidators = validatorsResponse.data.result.current.length;

    const supplyResponse = await axios.post(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getSupply',
    });

    const circulatingSupply = supplyResponse.data.result.value.circulating;
    const totalSupply = supplyResponse.data.result.value.total;

    const epochInfoResponse = await axios.post(process.env.NEXT_PUBLIC_HELIUS_RPC_URL!, {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getEpochInfo',
    });

    const currentEpoch = epochInfoResponse.data.result.epoch;
    const slotHeight = epochInfoResponse.data.result.slotIndex;

    return {
      tps,
      activeValidators,
      circulatingSupply,
      totalSupply,
      currentEpoch,
      slotHeight,
    };
  } catch (error) {
    console.error('Error fetching Solana data:', error);
    throw error;
  }
};

export default function NetworkOverview() {
  const {
    data: coinGeckoData,
    isLoading: isCoinGeckoLoading,
    error: coinGeckoError,
  } = useQuery('coinGeckoData', fetchCoinGeckoData, {
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 300000, // Consider data stale after 5 minutes
    cacheTime: 600000, // Keep unused data in cache for 10 minutes
  });

  const {
    data: solanaData,
    isLoading: isSolanaLoading,
    error: solanaError,
  } = useQuery('solanaData', fetchSolanaData, {
    refetchInterval: 60000, // Refetch every minute
  });

  if (isCoinGeckoLoading || isSolanaLoading) return <NetworkOverviewSkeleton />;
  if (coinGeckoError || solanaError) {
    const error = coinGeckoError || solanaError;
    if (error instanceof Error) {
      return <ErrorDisplay error={error} />;
    } else {
      return <ErrorDisplay error={new Error('An unknown error occurred')} />;
    }
  }

  const chartData = {
    labels: coinGeckoData.priceData.map((d: { timestamp: number }) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'SOL Price (USD)',
        data: coinGeckoData.priceData.map((d: { price: number }) => d.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'SOL Price (24h)',
      },
    },
    scales: {
      x: {
        display: false,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Network Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">SOL Price</p>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">${coinGeckoData.price.toFixed(2)}</p>
          <p className={`flex items-center ${coinGeckoData.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {coinGeckoData.priceChange >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
            {Math.abs(coinGeckoData.priceChange).toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current TPS</p>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{solanaData?.tps?.toFixed(0) ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">${(coinGeckoData.marketCap / 1e9).toFixed(2)}B</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Validators</p>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{solanaData?.activeValidators ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Epoch</p>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{solanaData?.currentEpoch ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Slot</p>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{solanaData?.slotHeight ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Network Status</p>
          <p className="text-xl font-semibold text-green-600">Operational</p>
        </div>
      </div>
      <div className="mt-6">
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
}

function NetworkOverviewSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}

function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {error.message}</span>
    </div>
  );
}