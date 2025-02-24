import React from 'react';
import { useQuery } from 'react-query';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface Protocol {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  tvl: number;
}

const fetchDeFiData = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_DEFILLAMA_API_URL}/protocols`);
  if (!response.ok) {
    throw new Error('Failed to fetch DeFi data');
  }
  const data = await response.json();
  return data;
};

const DeFiAnalytics = () => {
  const { data, isLoading, error } = useQuery<Protocol[], Error>('defiData', fetchDeFiData, {
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return <DeFiAnalyticsSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const solanaProtocols = data?.filter((protocol) => protocol.chain === 'Solana') || [];
  const top7Protocols = solanaProtocols
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, 7);

  const chartData = top7Protocols.map(protocol => ({
    name: protocol.name,
    tvl: protocol.tvl
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">DeFi Analytics</h2>
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart 
            data={chartData} 
            margin={{ left: 0, right: 20, top: 20, bottom: 20 }}
          >
            <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
            <YAxis 
              tick={{ fill: '#6B7280' }} 
              width={100}
              tickFormatter={(value) => {
                if (value >= 1000000000) {
                  return `$${(value / 1000000000).toFixed(1)}B`;
                }
                return `$${(value / 1000000).toFixed(0)}M`;
              }}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#F3F4F6' }}
              itemStyle={{ color: '#F3F4F6' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'TVL']}
            />
            <Area type="monotone" dataKey="tvl" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800 dark:text-white">Top DeFi Protocols</h3>
      {top7Protocols.map((protocol, index) => (
        <motion.div
          key={protocol.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
        >
          <div>
            <p className="font-medium text-gray-800 dark:text-white">{protocol.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{protocol.symbol}</p>
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            ${protocol.tvl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

const DeFiAnalyticsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
    {[...Array(7)].map((_, i) => (
      <div key={i} className="flex justify-between items-center mb-4 pb-2">
        <div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    ))}
  </div>
);

const ErrorDisplay = ({ error }: { error: { message: string } }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline"> {error.message}</span>
  </div>
);

export default DeFiAnalytics;