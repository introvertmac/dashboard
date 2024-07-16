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
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'} overflow-x-hidden`}>
        <div className="flex-grow">
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
            <div className="mt-8">
              <RecentActivity />
            </div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <footer className={`py-4 text-center ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          <p>
            © 2024 | Built with <span role="img" aria-label="robot">🤖</span> by {' '}
            <a 
              href="https://x.com/0x7manish" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
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