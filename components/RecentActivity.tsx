'use client';

import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { format, formatDistanceToNow } from 'date-fns';

interface Transaction {
  signature: string;
  blockTime: number;
  err: any;
  signer: string;
  fee: number;
}

const fetchRecentTransactions = async (): Promise<Transaction[]> => {
  const heliusRpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;
  if (!heliusRpcUrl) {
    throw new Error('NEXT_PUBLIC_HELIUS_RPC_URL is not defined');
  }

  const response = await axios.post(
    heliusRpcUrl,
    {
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getSignaturesForAddress',
      params: [
        'Vote111111111111111111111111111111111111111',
        { limit: 5 },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const transactions = response.data.result;

  // Fetch transaction details for signer and fee
  const detailedTransactions = await Promise.all(transactions.map(async (tx: any) => {
    const txDetails = await axios.post(
      heliusRpcUrl,
      {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getTransaction',
        params: [tx.signature],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { meta, transaction } = txDetails.data.result;
    const signer = transaction.message.accountKeys[0];
    const fee = meta.fee / 1_000_000_000; // Convert lamports to SOL

    return {
      ...tx,
      signer,
      fee,
    };
  }));

  return detailedTransactions;
};

const RecentActivity: React.FC = () => {
  const { data, isLoading, error } = useQuery<Transaction[], Error>('recentTransactions', fetchRecentTransactions, {
    refetchInterval: 30000,
  });

  if (isLoading) return <RecentActivitySkeleton />;
  if (error) {
    const typedError = error instanceof Error ? error : new Error('An unknown error occurred');
    return <ErrorDisplay error={typedError} />;
  }

  const truncateAddress = (address: string): string => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 w-full"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recent Transactions</h2>
      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((tx: Transaction, index: number) => {
            const blockTime = new Date(tx.blockTime * 1000);
            return (
              <motion.div
                key={tx.signature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <a
                    href={`https://solscan.io/tx/${tx.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    <span className="hidden md:inline">{tx.signature}</span>
                    <span className="md:hidden">{truncateAddress(tx.signature)}</span>
                  </a>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <p className="font-bold">Timestamp:</p>
                    <p>
                      {formatDistanceToNow(blockTime, { addSuffix: true })} -{' '}
                      {format(blockTime, "MMMM dd, yyyy HH:mm:ss 'UTC'")}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Signer:{" "}
                      <a
                        href={`https://solscan.io/account/${tx.signer}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span className="hidden md:inline">{tx.signer}</span>
                        <span className="md:hidden">{truncateAddress(tx.signer)}</span>
                      </a>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fee: {tx.fee.toFixed(6)} SOL</p>
                  </div>
                </div>
                <div className="ml-4">
                  {tx.err ? (
                    <XCircleIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent transactions found.</p>
        )}
      </div>
    </motion.div>
  );
};

const RecentActivitySkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 w-full animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

interface ErrorDisplayProps {
  error: Error;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline"> {error.message}</span>
  </div>
);

export default RecentActivity;
