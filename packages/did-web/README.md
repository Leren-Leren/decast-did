# DID Web Application

A Nuxt.js application for decentralized identity verification and management.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=1054183103777-7eqm2ddpdo6ok9b1cq4c350132mmiusr.apps.googleusercontent.com

# DID Service Configuration
DID_BASE_URL=http://localhost:3000

# Chrome Extension Configuration
EXTENSION_ID=algkhhfaciplhfnkmecpmdfampkppndj
```

## Features

- **DID Management**: View and manage your decentralized identity services
- **Service Verification**: Verify various identity services (email, Google, MetaMask, liveness check)
- **Condition-based Verification**: Advanced verification with custom conditions
- **Proof Generation**: Generate DID-JWT proofs for verified services
- **Chrome Extension Integration**: Connect with Decast DID Chrome extension
- **Google OAuth Integration**: Google account verification
- **MetaMask Integration**: Wallet-based authentication

## Architecture

- **Nuxt.js 3**: Vue.js framework with SSR support
- **Pinia**: State management
- **TypeScript**: Type-safe development
- **Environment Variables**: Configurable via `.env` file

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
