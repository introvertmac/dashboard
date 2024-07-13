'use client'

import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

interface YieldPool {
  pool: string;
  project: string;
  chain: string;
  tvlUsd: number | null;
  apy: number | null;
  symbol: string;
}

const fetchTopYieldPools = async (): Promise<YieldPool[]> => {
  const response = await axios.get('https://yields.llama.fi/pools');
  const pools = response.data.data;
  return pools
    .filter((pool: YieldPool) => pool.chain === 'Solana')
    .sort((a: YieldPool, b: YieldPool) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
    .slice(0, 15);
};

const formatNumber = (value: number | null): string => {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(2) + '%';
};

const formatTVL = (value: number | null): string => {
  if (value === null || value === undefined) return 'N/A';
  return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

const TopYieldPools: React.FC = () => {
  const { data: pools, isLoading, error } = useQuery('topYieldPools', fetchTopYieldPools, {
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">Top 10 Solana Yield Pools</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pool</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TVL</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">APY</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {pools?.map((pool, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : ''}>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{pool?.symbol || 'N/A'}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{pool?.project || 'N/A'}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatTVL(pool?.tvlUsd)}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatNumber(pool?.apy)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TopYieldPools;