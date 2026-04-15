# TipPost

A pay-to-like social dApp where users post images with captions and others tip the creator with 0.0001 ETH per like. Built on Ethereum (Sepolia testnet).

## Deployed URL Links

- **Frontend:** https://blockchain-midterms-ten.vercel.app/
- **Sepolia Deployed Contact Address:** 0xeD880f69f348289BDE11FFEdEb51285a58b1dB4c

## Tech Stack

- **Smart Contract:** Solidity 0.8.20, Hardhat, ethers.js
- **Frontend:** React, TypeScript, Vite, ethers.js v6
- **Testnet:** Sepolia
- **Wallet:** MetaMask

## Features

- Create posts with an image URL and caption
- Like/tip posts for 0.0001 ETH (sent directly to the creator)
- Real-time feed updates via contract event listeners
- Wallet auto-reconnect on page reload
- Image preview before posting
- Broken image fallback with placeholder
- Dark theme UI
- Network guard (prompts to switch to Sepolia)
- Transaction status toasts with Etherscan links

## Local Setup

### Prerequisites

- Node.js v18+
- MetaMask browser extension
- Sepolia testnet ETH ([Sepolia Faucet](https://sepoliafaucet.com/) | [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) | [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia))

### Smart Contract

```bash
# Install dependencies
npm install

# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia (fill .env first)
npx hardhat run scripts/deploy.ts --network sepolia

# Verify on Etherscan (optional)
npx hardhat verify --network sepolia DEPLOYED_ADDRESS
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

### Root `.env`

| Variable | Description |
|----------|-------------|
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint (e.g. from Infura or Alchemy) |
| `PRIVATE_KEY` | Deployer wallet private key |
| `ETHERSCAN_API_KEY` | Etherscan API key for contract verification |

### Frontend `.env`

| Variable | Description |
|----------|-------------|
| `VITE_CONTRACT_ADDRESS` | Deployed TipPost contract address |
| `VITE_CHAIN_ID` | Chain ID (`11155111` for Sepolia) |

## Project Structure

```
contracts/
  TipPost.sol            # Smart contract
scripts/
  deploy.ts              # Deployment script
test/
  TipPost.test.ts        # 11 contract tests
frontend/
  src/
    abi/                  # Contract ABI
    components/           # React components
    hooks/                # useWallet, useContract, usePosts
    types/                # TypeScript interfaces
    utils/                # Error parsing utility
    App.tsx               # Root layout
    index.css             # Dark theme styles
```

## Deployment

### Contract (Sepolia)

1. Copy `.env.example` to `.env` and fill in your keys
2. Get Sepolia ETH from a faucet
3. Run `npx hardhat run scripts/deploy.ts --network sepolia`
4. Copy the deployed contract address

### Frontend (Vercel)

1. Push the repo to GitHub
2. Import the repo in Vercel
3. Set root directory to `frontend`
4. Set build command to `npm run build` and output directory to `dist`
5. Add environment variables: `VITE_CONTRACT_ADDRESS` and `VITE_CHAIN_ID=11155111`
6. Deploy
