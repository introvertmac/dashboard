import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const fetchRecentTransactions = async () => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_HELIUS_RPC_URL,
    {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getSignaturesForAddress',
      params: [
        'Vote111111111111111111111111111111111111111', // Solana vote program address
        { limit: 5 }
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.result;
};

const RecentActivity = () => {
  const { data, isLoading, error } = useQuery('recentTransactions', fetchRecentTransactions, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) return <RecentActivitySkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recent Transactions</h2>
      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((tx, index) => (
            <motion.div
              key={tx.signature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <a
                  href={`https://solscan.io/tx/${tx.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(tx.blockTime * 1000).toLocaleString()}
                </p>
              </div>
              {tx.err ? (
                <XCircleIcon className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent transactions found.</p>
        )}
      </div>
    </motion.div>
  );
};

const RecentActivitySkeleton = () => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
        </div>
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
      </div>
    ))}
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline"> {error.message}</span>
  </div>
);

export default RecentActivity;
