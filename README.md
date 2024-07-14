# Solana Dashboard

This project is a Solana blockchain dashboard that provides various metrics and information about the Solana ecosystem. It includes components for network overview, token metrics, DeFi analytics, recent activity, Solana information, and top yield pools.

## Components

1. **NetworkOverview.tsx**
   - Displays key metrics about the Solana network, such as current TPS (Transactions Per Second) and SOL price.
   - Uses the Helius RPC for real-time Solana network data.

2. **TokenMetrics.tsx**
   - Shows information about top tokens in the Solana ecosystem.
   - Fetches data from the CoinGecko API to display token prices and 24-hour price changes.

3. **DeFiAnalytics.tsx**
   - Provides an overview of DeFi (Decentralized Finance) activity on Solana.
   - Uses the DeFi Llama API to fetch and display TVL (Total Value Locked) data for Solana DeFi protocols.

4. **RecentActivity.tsx**
   - Displays recent transactions or activities on the Solana blockchain.
   - Utilizes the Helius RPC to fetch recent transaction data.

5. **SolanaInfo.tsx**
   - Shows general information about Solana, potentially including market cap, circulating supply, etc.
   - May use a combination of CoinGecko and Solana-specific APIs for data.

6. **TopYieldPools.tsx**
   - Displays information about the top-yielding liquidity pools or staking opportunities in the Solana ecosystem.
   - Likely uses a combination of DeFi Llama and other Solana DeFi protocol-specific APIs.

## Environment Variables

This project uses the following environment variables:

- `NEXT_PUBLIC_HELIUS_RPC_URL`: Helius RPC URL for Solana network data
  - Format: `https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY`
- `NEXT_PUBLIC_COINGECKO_API_URL`: CoinGecko API URL for token data
  - Value: `https://api.coingecko.com/api/v3`
- `NEXT_PUBLIC_DEFILLAMA_API_URL`: DeFi Llama API URL for DeFi data
  - Value: `https://api.llama.fi`

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone [your-repo-url]
   cd [your-repo-name]
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```
   NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
   NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
   NEXT_PUBLIC_DEFILLAMA_API_URL=https://api.llama.fi
   ```
   Replace `YOUR_API_KEY` with your actual Helius API key.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To build the application for production, run:

```
npm run build
```

Then, you can start the production server with:

```
npm start
```

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- Axios
- Recharts (for charts and graphs)

## API Dependencies

- Helius RPC (Solana network data)
- CoinGecko API (Token data)
- DeFi Llama API (DeFi protocol data)

Ensure you have the necessary API keys and permissions to access these services.


If you need any help, feel free to reach out to Manish at [https://x.com/0x7manish](https://x.com/0x7manish).
