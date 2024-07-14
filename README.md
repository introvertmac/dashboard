# Solana Dashboard

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

- **Network Overview**: Provides real-time data on Solana network including TPS (Transactions Per Second), active validators, current epoch, and current slot.
- **Token Metrics**: Displays top Solana tokens with information on current price, market cap, and 24h price change.
- **DeFi Analytics**: Shows analytics of top DeFi protocols on the Solana network.
- **Yield Pools**: Lists the top yield pools on the Solana network with details on TVL (Total Value Locked) and APY (Annual Percentage Yield).
- **Recent Activity**: Shows recent transactions on the Solana network.
- **Search**: Provides a search bar for users to query specific information about the Solana network.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v6.0.0 or higher recommended) or [yarn](https://yarnpkg.com/) (v1.22.0 or higher recommended) or [pnpm](https://pnpm.io/) or [bun](https://bun.sh/)

### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```env
NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
NEXT_PUBLIC_DEFILLAMA_API_URL=https://api.llama.fi
```

Replace `YOUR_API_KEY` with your actual API key.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/introvertmac/dashboard.git
   cd solana-dashboard
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Running the Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.
















