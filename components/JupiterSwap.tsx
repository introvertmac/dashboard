import React, { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

declare global {
  interface Window {
    Jupiter: any;
  }
}

const JupiterSwap: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const wallet = useWallet();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main-v3.js';
    script.async = true;
    script.onload = initJupiter;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.Jupiter && window.Jupiter.syncProps) {
      window.Jupiter.syncProps({ passthroughWalletContextState: wallet });
    }
  }, [wallet.connected, wallet]);

  const initJupiter = () => {
    if (window.Jupiter) {
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
        endpoint: process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://api.mainnet-beta.solana.com",
        enableWalletPassthrough: true,
        onSuccess: ({ txid, swapResult }) => {
          console.log('Swap successful!', { txid, swapResult });
        },
        onSwapError: ({ error }) => {
          console.error('Swap failed:', error);
        },
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Jupiter Swap</h2>
      <div id="integrated-terminal" ref={terminalRef}></div>
    </div>
  );
};

export default JupiterSwap;