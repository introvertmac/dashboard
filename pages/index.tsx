'use client'

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import NetworkOverview from '../components/NetworkOverview';
import TokenMetrics from '../components/TokenMetrics';
import DeFiAnalytics from '../components/DeFiAnalytics';
import SolanaInfo from '../components/SolanaInfo';
import RecentActivity from '../components/RecentActivity';
import TopYieldPools from '../components/TopYieldPools';

const queryClient = new QueryClient();

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex-grow dark:bg-gray-900 dark:text-white">
          <nav className="flex justify-between items-center py-4 px-6">
            <h1 className="text-2xl font-bold">Solana Dashboard</h1>
            <button
              className="px-4 py-2 rounded transition-colors focus:outline-none"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <SunIcon className="w-8 h-8 text-yellow-500" />
              ) : (
                <MoonIcon className="w-8 h-8 text-gray-500" />
              )}
            </button>
          </nav>
          
          {/* SolanaInfo (search bar) centered below navbar */}
          <div className="flex justify-center my-6">
            <SolanaInfo />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <NetworkOverview />
              <TokenMetrics />
              <DeFiAnalytics />
              <TopYieldPools />
            </div>
            <RecentActivity />
          </motion.div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © 2024 | Built with <span role="img" aria-label="robot">🤖</span> by {' '}
            <a 
              href="https://x.com/0x7manish" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Manish
            </a>
          </p>
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default Home;
