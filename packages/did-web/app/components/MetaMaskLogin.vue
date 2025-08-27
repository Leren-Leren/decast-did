<template>
  <button class="login-btn" @click="connectWallet">
    <div class="did-icon-wrapper-btn">
      <MetamaskLogo />
    </div> Login with a MetaMask
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { ethers } from "ethers";
import MetamaskLogo from '~/icons/MetamaskLogo.vue'

const config = useRuntimeConfig()
const DID_BASE_URL = config.public.didBaseUrl

const authStore = useAuthStore()

// Reactive state
const isConnected = ref(false)
const isLoading = ref(false)
const isAuthenticating = ref(false)
const error = ref('')
const walletAddress = ref('')

// Computed
const shortAddress = computed(() => {
  if (!walletAddress.value) return ''
  return `${walletAddress.value.slice(0, 6)}...${walletAddress.value.slice(-4)}`
})

// Check if MetaMask is installed
const checkMetaMask = () => {
  return typeof window !== 'undefined' && window.ethereum
}

// Connect to MetaMask
const connectWallet = async () => {
  if (!checkMetaMask()) {
    error.value = 'MetaMask is not installed. Please install MetaMask extension.'
    return
  }

  try {
    isLoading.value = true
    error.value = ''

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })

    if (accounts.length > 0) {
      walletAddress.value = accounts[0]
      isConnected.value = true
      authenticate();
    }
  } catch (err) {
    error.value = err.message || 'Failed to connect wallet'
  } finally {
    isLoading.value = false
  }
}

// Get nonce from API
const getNonce = async (address) => {
  try {
    const response = await $fetch(`${DID_BASE_URL}/api/v1/auth/wallet/nonce`, {
      method: 'POST',
      body: { address }
    })
    return response
  } catch (err) {
    throw new Error('Failed to get nonce: ' + err.message)
  }
}

// Sign message with MetaMask
const signMessage = async (message) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature
  } catch (err) {
    throw new Error('Failed to sign message: ' + err.message)
  }
}

// Login with signature
const loginWithSignature = async (signature, nonce, token) => {
  try {
    const response = await $fetch(`${DID_BASE_URL}/api/v1/auth/wallet/login`, {
      method: 'POST',
      body: {
        signature,
        nonce,
        token,
        address: walletAddress.value
      }
    })
    return response
  } catch (err) {
    throw new Error('Failed to login: ' + err.message)
  }
}

// Main authentication flow
const authenticate = async () => {
  try {
    isAuthenticating.value = true
    isLoading.value = true
    error.value = ''

    // Step 1: Get nonce
    const nonceResponse = await getNonce(walletAddress.value)
    console.log('nonceResponse', nonceResponse)
    const { nonce, token: nonceToken } = nonceResponse

    // Step 2: Sign the nonce
    const signature = await signMessage(nonce)

    // Step 3: Login with signature
    const loginResponse = await loginWithSignature(signature, nonce, nonceToken)
    const { token, refreshToken } = loginResponse

    // Step 4: Save tokens to store
    authStore.setTokens(token, refreshToken, `did:ethr:${walletAddress.value}`)

    // Success - user is now logged in
    console.log('Successfully logged in!')

  } catch (err) {
    error.value = err.message || 'Authentication failed'
  } finally {
    isLoading.value = false
    isAuthenticating.value = false
  }
}

// Initialize on mount
onMounted(() => {
  // Check if already connected
  if (checkMetaMask() && window.ethereum.selectedAddress) {
    walletAddress.value = window.ethereum.selectedAddress
    isConnected.value = true
  }
})
</script>

<style scoped>
*:not(i) {
  font-family: 'Rethink Sans' !important;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}

.login-btn {
  font-size: 14px;
  border-radius: 10px;
  color: #FFFFFF;
  padding: 0rem 0.85rem;
  width: 100%;
  height: 46px !important;
  outline: none;
  border: 1px solid #FFFFFF40;
  cursor: pointer;
  transition: transform 0.05s ease-in-out;
  position: relative;
  background-color: #1B1D29;
  display: flex;
  align-items: center;
  justify-content: center;
}

.did-icon-wrapper-btn {
  background-color: #1B1D29 !important;
  border: 1px solid #242632 !important;
  border-radius: 4px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: min-content;
  padding: 5px;
  margin-right: 8px;
}

.did-icon-wrapper-btn svg {
  height: 12px;
  width: 12px;
}
</style>

<style scoped>
.metamask-login {
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.login-content {
  margin-bottom: 16px;
}

.connect-section {
  text-align: center;
}

.metamask-icon {
  margin-bottom: 16px;
}

.connect-button,
.login-button {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f7931e 0%, #e2761b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.connect-button:hover:not(:disabled),
.login-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(247, 147, 30, 0.3);
}

.connect-button:disabled,
.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.wallet-info {
  text-align: center;
}

.wallet-address {
  margin-bottom: 20px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.address-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.address-value {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.auth-progress {
  text-align: left;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 6px;
}

.step-icon {
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.step-text {
  font-size: 14px;
  color: #374151;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
}
</style>