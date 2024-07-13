// src/components/SearchBar.tsx

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const SearchBar: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    let url = 'https://solscan.io/';
    
    // Simple regex patterns
    const txPattern = /^[A-Za-z0-9]{88}$/;
    const addressPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    if (txPattern.test(searchInput)) {
      url += `tx/${searchInput}`;
    } else if (addressPattern.test(searchInput)) {
      url += `account/${searchInput}`;
    } else {
      // If it doesn't match tx or address pattern, default to account search
      url += `account/${searchInput}`;
    }

    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          className="w-full p-4 pr-12 text-sm border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Search transaction, address, or token"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200 focus:outline-none dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-500"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;