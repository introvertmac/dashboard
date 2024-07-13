'use client'

import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface NFTCollection {
  name: string;
  logo: string;
  floor: number;
  floor_marketcap: number;
  floor_marketcap_pretty: string;
  on_sale: number;
  holders: number;
  items: number;
}

const fetchNFTTrends = async (): Promise<NFTCollection[]> => {
  const response = await axios.get('https://api.howrare.is/v0.1/collections');
  return response.data.result.data.slice(0, 10); // Get top 10 collections
};

export default function NFTTrends() {
  const { data, isLoading, error } = useQuery<NFTCollection[], Error>('nftTrends', fetchNFTTrends, {
    refetchInterval: 3600000, // Refetch every hour (3600000 ms)
    staleTime: 3600000, // Consider data fresh for an hour
  });

  if (isLoading) return <NFTTrendsSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Top Solana NFT Collections</h2>
      <div className="space-y-4">
        {data?.map((collection) => (
          <div key={collection.name} className="flex items-center space-x-4">
            <Image 
              src={`https://howrare.is${collection.logo}`}
              alt={collection.name}
              width={64}
              height={64}
              className="rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">{collection.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Floor Price: {collection.floor} SOL
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Market Cap: {collection.floor_marketcap_pretty}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Items: {collection.items.toLocaleString()} | Holders: {collection.holders.toLocaleString()} | On Sale: {collection.on_sale.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NFTTrendsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      ))}
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