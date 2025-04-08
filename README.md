# StuKey - Student NFT Platform

## Overview

StuKey is a blockchain-based platform that allows students to verify their student status without sharing personal data. The platform uses NFTs (Non-Fungible Tokens) to represent a student's verified status and engagement score, which can be used to access student discounts and benefits from participating merchants.

## Features

- **Wallet Integration**: Connect with any EIP-6963 compatible wallet
- **Student Verification**: Verify student status through various credentials
- **Engagement Score**: Calculate an engagement score based on connected credentials
- **NFT Minting**: Mint an NFT representing your verified student status
- **Credential Management**: Connect and manage various credentials (GitHub, Email, etc.)
- **User Profiles**: View and manage your profile information

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v7
- **Blockchain**: Ethereum/EVM compatible chains (Monad Testnet)
- **Authentication**: Wallet-based authentication with signature verification
- **HTTP Client**: Axios
- **Icons**: FontAwesome

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A modern web browser with MetaMask or another EIP-6963 compatible wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devilcoder01/StuKey-Frontend.git
   cd StuKey-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
/
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── common/        # Shared components
│   │   ├── layout/        # Layout components
│   │   ├── page/          # Page components
│   │   └── ui/            # UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── routes/            # Routing configuration
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   ├── index.css          # Global styles
│   └── main.tsx           # Entry point
├── .env.example           # Example environment variables
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package.json           # Project dependencies and scripts
├── tsconfig.app.json      # TypeScript configuration for app
├── tsconfig.node.json     # TypeScript configuration for Node
└── vite.config.ts         # Vite configuration
```

## Key Features

### Wallet Connection

StuKey uses the EIP-6963 standard for wallet connections, providing a seamless experience with multiple wallet providers.

### Authentication

Authentication is handled through wallet signatures, verifying ownership without sharing private keys.

### Student Verification

Students can connect various credentials (GitHub, Email, etc.) to verify their student status and increase their engagement score.

### NFT Minting

Once verified, students can mint an NFT representing their student status and engagement score, which can be used to access benefits.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the built application locally

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/devilcoder01/StuKey-Frontend](https://github.com/devilcoder01/StuKey-Frontend)
