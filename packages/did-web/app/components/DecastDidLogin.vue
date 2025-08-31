<template>
  <button class="login-btn" @click="connectDid">
    <div class="did-icon-wrapper-btn">
      <DidIcon />
    </div> Login with a&nbsp;<span>DecastID</span>
    <InstallExtensionModal v-if="shownInstallExtensionModal" :title="''" @close="closeInstallExtensionModal"/>
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import DidIcon from '~/icons/DidIcon.vue'
import InstallExtensionModal from '~/components/InstallExtensionModal.vue'

const config = useRuntimeConfig()
const EXTENSION_ID = config.public.extensionId
const DID_BASE_URL = config.public.didBaseUrl

const authStore = useAuthStore()

// Reactive state
const isConnected = ref(false)
const isLoading = ref(false)
const isAuthenticating = ref(false)
const error = ref('')
const selectedDid = ref('')
const password = ref('')
const shownInstallExtensionModal = ref(false)

// Computed
const shortDid = computed(() => {
  if (!selectedDid.value) return ''
  const parts = selectedDid.value.split(':')
  if (parts.length >= 3) {
    const identifier = parts[2]
    return `${identifier.slice(0, 6)}...${identifier.slice(-4)}`
  }
  return selectedDid.value.slice(0, 10) + '...'
})

// Check if Chrome extension is available
const checkExtension = () => {
  return typeof window !== 'undefined' && window.chrome && chrome.runtime
}

// Connect to DID extension
const connectDid = async () => {
  try {
    isLoading.value = true
    error.value = ''

    console.log('Connecting to Decast DID', EXTENSION_ID)

    // Send message to extension to open DID popup
    chrome.runtime.sendMessage(
      EXTENSION_ID,
      { action: 'open-did-popup' },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Extension error:', chrome.runtime.lastError.message)
          error.value = 'Extension not available'
          isLoading.value = false
          openInstallExtensionModal()
          return
        }
        console.log('✅ Extension response:', response)
      }
    )

    // Listen for DID selection
    window.removeEventListener('message', handleDidSelected)
    window.addEventListener('message', handleDidSelected)
  } catch (err) {
    console.error('❌ Connect DID error:', err)
    error.value = err.message || 'Failed to connect DID'
    isLoading.value = false
  }
}

// Handle DID selection from extension
const handleDidSelected = (event) => {
  if (event.data?.action !== 'did-selected') return

  window.removeEventListener('message', handleDidSelected)
  console.log('DID selected', event)

  try {
    const { did, password: didPassword } = event.data
    selectedDid.value = did.did
    password.value = didPassword
    isConnected.value = true
    isLoading.value = false
    authenticate()
  } catch (err) {
    error.value = err.message || 'Failed to select DID'
    isLoading.value = false
  }
}

// Get nonce from API
const getNonce = async (did) => {
  try {
    const response = await $fetch(`${DID_BASE_URL}/api/v1/auth/did/nonce`, {
      method: 'POST',
      body: { did }
    })
    return response
  } catch (err) {
    throw new Error('Failed to get nonce: ' + err.message)
  }
}

// Sign nonce with extension
const signNonce = async (nonce, did, password, token) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      EXTENSION_ID,
      { action: 'sign-nonce', nonce, did, password },
      (response) => {
        console.log('Sign nonce response', response)
        console.log('Sign nonce error', chrome.runtime.lastError)
        if (chrome.runtime.lastError) {
          reject(new Error('Error communicating with extension: ' + chrome.runtime.lastError.message))
        } else {
          resolve(response)
        }
      }
    )
    window.addEventListener('message', (e) => handleNonceSigned(e, nonce, token));
  })
}

const handleNonceSigned = async (event, nonce, token) => {
  if (event.data.action !== 'nonce-signed') return;
  console.log('handleNonceSigned', event)
  const { signature } = event.data

  // Step 3: Create DID document
  const didDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: selectedDid.value,
    verificationMethod: [{
      id: `${selectedDid.value}#keys-1`,
      type: 'Ed25519VerificationKey2018',
      controller: selectedDid.value,
      publicKeyBase58: selectedDid.value.split(':').pop(),
    }],
    authentication: [`${selectedDid.value}#keys-1`],
  }

  // Step 4: Login with signature
  const loginResponse = await loginWithSignature(signature, nonce, token, didDocument)

  // Step 5: Save tokens to store
  authStore.setTokens(loginResponse.token, loginResponse.refreshToken, selectedDid.value)
}

// Login with signature
const loginWithSignature = async (signature, nonce, token, didDocument) => {
  try {
    const response = await $fetch(`${DID_BASE_URL}/api/v1/auth/did/login`, {
      method: 'POST',
      body: {
        token,
        signature,
        didDocument
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
    const nonceResponse = await getNonce(selectedDid.value)
    const { nonce, token } = nonceResponse

    // Step 2: Sign the nonce with extension
    const signResponse = await signNonce(nonce, selectedDid.value, password.value, token)



    // Success - user is now logged in
    console.log('Successfully logged in with DID!')

  } catch (err) {
    error.value = err.message || 'Authentication failed'
  } finally {
    isLoading.value = false
    isAuthenticating.value = false
  }
}

const openInstallExtensionModal = () => {
  shownInstallExtensionModal.value = true
}

const closeInstallExtensionModal = () => {
  shownInstallExtensionModal.value = false
}

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener('message', handleDidSelected)
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
.decast-did-login {
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

.did-icon {
  margin-bottom: 16px;
}

.connect-button,
.login-button {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1B1D29 0%, #242632 100%);
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
  box-shadow: 0 4px 12px rgba(27, 29, 41, 0.3);
}

.connect-button:disabled,
.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.did-info {
  text-align: center;
}

.did-address {
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
  background: #1B1D29;
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