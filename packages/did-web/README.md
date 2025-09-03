# DID Web Application

A comprehensive Nuxt.js application for decentralized identity verification and management, built with modern web technologies and comprehensive testing.

## 🌐 Live Demo

**Try the application live:** [https://wid.decast.live](https://wid.decast.live)

Experience the full DID verification flow with MetaMask integration, Google OAuth, and comprehensive identity services.

## 🚀 Features

- **🔐 DID Management**: View and manage your decentralized identity services
- **✅ Service Verification**: Verify various identity services (email, Google, MetaMask, liveness check)
- **🎯 Condition-based Verification**: Advanced verification with custom conditions
- **🔒 Proof Generation**: Generate DID-JWT proofs for verified services
- **🔌 Chrome Extension Integration**: Connect with Decast DID Chrome extension
- **🌐 Google OAuth Integration**: Google account verification
- **💰 MetaMask Integration**: Wallet-based authentication and signing
- **📱 Responsive Design**: Mobile-first responsive UI
- **🧪 Comprehensive Testing**: Unit tests with Vitest and E2E tests with Playwright

## 🏗️ Architecture

- **Nuxt.js 3**: Vue.js framework with SSR support and modern development experience
- **Pinia**: State management with TypeScript support
- **TypeScript**: Type-safe development with strict type checking
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Vue 3 Composition API**: Modern Vue.js development patterns
- **Ethers.js**: Ethereum library for blockchain interactions
- **Environment Variables**: Configurable via `.env` file

## 📁 Project Structure

```
did-web/
├── app/                          # Application source code
│   ├── app.vue                  # Root application component
│   ├── components/              # Reusable Vue components
│   │   ├── DecastDidLogin.vue  # DecastID login component
│   │   ├── MetaMaskLogin.vue   # MetaMask login component
│   │   ├── InstallExtensionModal.vue  # Extension installation modal
│   │   └── services/           # Service-specific components
│   │       ├── EmailVerificationService.vue    # Email verification
│   │       ├── GoogleAccountService.vue        # Google OAuth service
│   │       └── LivenessCheckService.vue        # Biometric verification
│   ├── layouts/                 # Layout components
│   ├── pages/                   # Application pages
│   │   ├── index.vue           # Home page with service overview
│   │   └── verify.vue          # Service verification page
│   ├── plugins/                 # Nuxt plugins
│   ├── stores/                  # Pinia state stores
│   │   └── auth.ts             # Authentication state management
│   ├── common/                  # Common utilities and helpers
│   └── icons/                   # SVG icon components
├── assets/                       # Static assets
│   └── css/                     # Global CSS styles
│       └── main.css            # Main stylesheet with Tailwind
├── public/                       # Public static files
├── server/                       # Server-side API routes
├── test/                         # Testing files
│   ├── README.md                # Testing documentation
│   ├── setup.ts                 # Test environment setup
│   ├── unit/                    # Unit tests
│   │   └── stores/             # Store tests
│   │       └── auth.test.ts    # Authentication store tests
│   └── e2e/                     # End-to-end tests
│       └── metamask-login-flow.spec.ts  # MetaMask login flow tests
├── types/                        # TypeScript type definitions
├── nuxt.config.ts               # Nuxt configuration
├── vitest.config.ts             # Vitest testing configuration
├── playwright.config.ts         # Playwright E2E testing configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project dependencies and scripts
└── Dockerfile                   # Docker container configuration
```

## 🧪 Testing

This project includes comprehensive testing setup with both unit and end-to-end tests.

### Testing Stack
- **Unit Tests**: Vitest with jsdom environment
- **E2E Tests**: Playwright with multiple browser support
- **Component Testing**: Vue Test Utils and Testing Library Vue
- **Coverage**: Built-in coverage reporting

### Test Commands
```bash
# Unit Tests
pnpm test              # Run tests in watch mode
pnpm test:run          # Run tests once
pnpm test:ui           # Run tests with UI
pnpm test:coverage     # Generate coverage report

# E2E Tests
pnpm test:e2e          # Run all E2E tests
pnpm test:e2e:ui       # Run E2E tests with UI
pnpm test:e2e:debug    # Run E2E tests in debug mode
pnpm test:e2e:install  # Install Playwright browsers
```

📖 **For detailed testing information, see [Testing Guide](./test/README.md)**

## 🛣️ Application Routes

The DID Web application consists of two main routes that handle different aspects of the identity verification process.

### 📱 Index Page (`/`)

**Purpose**: Main dashboard for authenticated users to view and manage their DID services.

**Features**:
- **Authentication Gateway**: Login options for MetaMask and DecastID
- **DID Services Overview**: Display of all verified identity services
- **Service Management**: View service status and details
- **Responsive Design**: Mobile-first interface with modern UI

**User Flow**:
1. **Unauthenticated Users**: See login options (MetaMask or DecastID)
2. **Authenticated Users**: View dashboard with all DID services
3. **Service Display**: Grid layout showing service cards with status indicators
4. **Logout Functionality**: Secure session termination

**Key Components**:
- `MetaMaskLogin.vue` - Wallet-based authentication
- `DecastDidLogin.vue` - Extension-based authentication
- Service cards displaying verification status
- Responsive grid layout for service management

### 🔍 Verify Page (`/verify`)

**Purpose**: Service verification interface that accepts query parameters to define what data to verify and under what conditions.

**Query Parameters**:

#### **Required Parameters**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `service` | string | The type of service to verify | `email-verification` |
| `subjects` | array | Fields to be verified from the service | `["email", "verifiedAt"]` |
| `conditions` | array | Verification conditions to check | `[{"subject": "verifiedAt", "condition": "gte", "value": "2024-01-01"}]` |
| `callback_url` | string | URL to redirect after verification | `https://example.com/callback` |

#### **Supported Services**

- `email-verification` - Email address verification
- `google-account` - Google account verification
- `liveness-check` - Biometric verification
- `facebook-account` - Facebook account verification
- `apple-account` - Apple account verification
- `metamask-address` - MetaMask wallet address verification

#### **Supported Conditions**

| Condition | Operator | Description | Example |
|-----------|----------|-------------|---------|
| `eq` | Equals | Value must be exactly equal | `{"subject": "age", "condition": "eq", "value": 25}` |
| `gt` | Greater than | Value must be greater than | `{"subject": "balance", "condition": "gt", "value": 1000}` |
| `gte` | Greater than or equal | Value must be greater than or equal | `{"subject": "score", "condition": "gte", "value": 80}` |
| `lt` | Less than | Value must be less than | `{"subject": "age", "condition": "lt", "value": 65}` |
| `lte` | Less than or equal | Value must be less than or equal | `{"subject": "amount", "condition": "lte", "value": 500}` |
| `ne` | Not equal | Value must not be equal | `{"subject": "status", "condition": "ne", "value": "blocked"}` |
| `contains` | Contains | String must contain substring | `{"subject": "domain", "condition": "contains", "value": "decast"}` |
| `startsWith` | Starts with | String must start with | `{"subject": "email", "condition": "startsWith", "value": "admin@"}` |
| `endsWith` | Ends with | String must end with | `{"subject": "email", "condition": "endsWith", "value": "@company.com"}` |

#### **Example Query URLs**

**1. Basic Email Verification**
```
/verify?service=email-verification&subjects=["email"]&callback_url=https://example.com/callback
```

**2. Email with Verification Date Condition**
```
/verify?service=email-verification&subjects=["email","verifiedAt"]&conditions=[{"subject":"verifiedAt","condition":"gte","value":"2024-01-01"}]&callback_url=https://example.com/callback
```

**3. Google Account with Age Verification**
```
/verify?service=google-account&subjects=["email","age","name"]&conditions=[{"subject":"age","condition":"gte","value":18}]&callback_url=https://example.com/callback
```

**4. Liveness Check with Recent Verification**
```
/verify?service=liveness-check&subjects=["verifiedAt","confidence"]&conditions=[{"subject":"verifiedAt","condition":"gte","value":"2024-06-01"},{"subject":"confidence","condition":"gte","value":0.8}]&callback_url=https://example.com/callback
```

**5. Complex Multi-Condition Verification**
```
/verify?service=email-verification&subjects=["email","verifiedAt","domain"]&conditions=[{"subject":"verifiedAt","condition":"gte","value":"2024-01-01"},{"subject":"domain","condition":"contains","value":"company"},{"subject":"email","condition":"endsWith","value":"@company.com"}]&callback_url=https://example.com/callback
```

#### **Response Flow**

1. **Verification Request**: User visits verify page with query parameters
2. **Service Display**: Page shows requested data fields and conditions
3. **Authentication**: User logs in with MetaMask or DecastID
4. **Verification Check**: System checks if conditions are met
5. **Proof Generation**: If verified, generates DID-JWT proof
6. **Callback Redirect**: Redirects to callback URL with proof data

#### **Callback Response Parameters**

After successful verification, the callback URL receives:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `didJwt` | The generated DID-JWT proof | `eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ...` |
| `status` | Verification status | `success` |
| `message` | Status message | `Verification completed successfully` |
| `audience` | User's DID | `did:ethr:0x1234...` |

## 💡 Examples & Use Cases

- **Email Verification**: Securely verify an email address to ensure it's active and not a disposable one.
- **Google Account Linking**: Link a Google account to a DID for enhanced security and identity.
- **Liveness Check**: Use biometric verification to ensure the user is a real person.
- **Complex Conditions**: Combine multiple verification steps and conditions to build robust identity proofs.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=1054183103777-7eqm2ddpdo6ok9b1cq4c350132mmiusr.apps.googleusercontent.com

# DID Service Configuration
DID_BASE_URL=https://did.decast.live

# DID Resolver Configuration
DID_RESOLVER_BASE_URL=https://did.decast.live/api/v1/dids/resolver

# Chrome Extension Configuration
EXTENSION_ID=algkhhfaciplhfnkmecpmdfampkppndj
```

### Nuxt Configuration

The application uses Nuxt 3 with the following key configurations:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      didBaseUrl: process.env.DID_BASE_URL,
      extensionId: process.env.EXTENSION_ID
    }
  }
})
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 22.0.0
- **Package Manager**: pnpm >= 8.0.0 (recommended)
- **Browser**: Modern browser with MetaMask extension support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd decast/packages/did-web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

## 📱 Components

### Core Components

- **DecastDidLogin.vue**: Handles DecastID authentication flow
- **MetaMaskLogin.vue**: Manages MetaMask wallet connection and signing
- **InstallExtensionModal.vue**: Guides users to install the Chrome extension

### Service Components

- **EmailVerificationService.vue**: Email verification with OTP
- **GoogleAccountService.vue**: Google OAuth integration
- **LivenessCheckService.vue**: Biometric verification using device camera

## 🔐 Authentication & State Management

### Pinia Store

The application uses Pinia for state management with the following store:

- **auth.ts**: Manages authentication state, tokens, and user information

```typescript
// Example store usage
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
authStore.setTokens(token, refreshToken, did)
```

### Authentication Flows

1. **MetaMask Authentication**
   - Wallet connection
   - Message signing
   - JWT token generation

2. **Google OAuth**
   - Google account verification
   - Service linking to DID

3. **DecastID Authentication**
   - Extension-based authentication
   - Secure token exchange

## 🌐 Services

### DID Services

- **Email Verification**: Secure email verification with OTP
- **Google Account**: OAuth-based Google account verification
- **MetaMask Wallet**: Ethereum wallet-based identity verification
- **Liveness Check**: Biometric verification for enhanced security

### API Integration

The application integrates with:
- **DID Resolver API**: For DID document resolution
- **Authentication API**: For JWT token management
- **Verification API**: For service verification processes

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Theme**: Theme switching capability
- **Toast Notifications**: User feedback and status updates
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error handling with user feedback

## 🚀 Development

### Development Server

Start the development server:

```bash
pnpm dev
```

The server runs on `http://localhost:3000` with hot reload enabled.

### Building for Production

```bash
# Build the application
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate
```

### Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Type checking and IntelliSense
- **Prettier**: Code formatting (if configured)

## 🐳 Docker

The application includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t did-web .

# Run container
docker run -p 3000:3000 did-web
```

## 📊 Performance

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Automatic code splitting by routes
- **Image Optimization**: Optimized image loading
- **Caching**: Efficient caching strategies

## 🔒 Security

- **HTTPS Only**: Secure communication protocols
- **Token Management**: Secure JWT token handling
- **Input Validation**: Comprehensive input sanitization
- **CORS Configuration**: Proper cross-origin resource sharing

## 🌍 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines

- Follow Vue.js style guide
- Write comprehensive tests
- Use TypeScript for type safety
- Follow conventional commit messages

## 📚 Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs/getting-started/introduction)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Testing Guide](./test/README.md)

## 📄 License

This project is licensed under the [LICENSE](LICENSE) file.

## 🆘 Support

For support and questions:
- Check the [Testing Guide](./test/README.md) for testing-related issues
- Review the [Nuxt documentation](https://nuxt.com/docs)
- Open an issue in the repository

---

**Built with ❤️ using Nuxt 3, Vue 3, and modern web technologies**
