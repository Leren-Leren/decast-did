<template>
  <BaseModal :title="'Google verification'" @close="closeModal">
    <template #modalContent>
      <div class="google-service">
        <div class="service-header">
          <h3 class="service-title">Google Account Verification</h3>
          <p class="service-description">Connect your Google account to verify your identity</p>
        </div>

        <div class="service-content">
          <div v-if="!isVerified" class="verification-section">
            <div class="google-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  fill="#FFC107" />
                <path
                  d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                  fill="#FF3D00" />
                <path
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                  fill="#4CAF50" />
                <path
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                  fill="#1976D2" />
              </svg>
            </div>

            <!-- <button class="google-login-button" @click="handleGoogleLogin" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Connecting...' : 'Sign in with Google' }}
            </button> -->
            <div id="google-btn"></div>
          </div>

          <div v-else class="verified-section">
            <div class="success-status">
              <div class="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <span class="success-text">Google account verified successfully!</span>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import BaseModal from '~/common/BaseModal.vue'

// Props from parent (to close modal)
defineProps({
  closeModal: {
    type: Function,
    required: true
  }
})

const authStore = useAuthStore()

// Reactive state
const isLoading = ref(false)
const isVerified = ref(false)
const error = ref('')

// Google Sign-In configuration
const config = useRuntimeConfig()
const GOOGLE_CLIENT_ID = config.public.googleClientId
const DID_BASE_URL = config.public.didBaseUrl

// Initialize Google Sign-In
const initializeGoogleSignIn = () => {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      ux_mode: 'popup',
    })
    // Render the real button
    window.google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      {
        theme: 'filled_blue',     // outline or filled_blue
        size: 'large',        // small | medium | large
        type: 'standard',     // standard = rectangle with text + logo
        text: 'continue_with', // or 'signin_with'
        shape: 'rectangular', // rectangular | pill | circle | square
        width: '100%'         // makes it full width
      }
    );
  }
}

// Handle Google credential response
const handleCredentialResponse = async (response) => {
  try {
    isLoading.value = true
    error.value = ''

    console.log('Google response:', response)

    // Send the ID token to your API
    const apiResponse = await $fetch(`${DID_BASE_URL}/api/v1/auth/google/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        idToken: response.credential
      }
    })

    console.log('API response:', apiResponse)

    // Mark as verified
    isVerified.value = true

    const googleAccountData = apiResponse.socials.find(
      (social) => social.provider === 'google'
    )

    // Emit success event to parent
    emit('verification-complete', {
      service: 'google-account',
      success: true,
      data: googleAccountData
    })

  } catch (err) {
    console.error('Google verification error:', err)
    error.value = err.message || 'Failed to verify Google account'

    // Emit error event to parent
    emit('verification-error', {
      service: 'google-account',
      error: error.value
    })
  } finally {
    isLoading.value = false
  }
}

// Handle Google login button click 
// ---- THIS METHOD IS NOT WORKING ----
// const handleGoogleLogin = () => {
//   if (typeof window !== 'undefined' && window.google) {
//     window.google.accounts.id.prompt()
//   } else {
//     error.value = 'Google Sign-In is not available'
//   }
// }

// Initialize on mount
onMounted(() => {
  // Load Google Sign-In script if not already loaded
  if (typeof window !== 'undefined' && !window.google) {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      initializeGoogleSignIn()
    }
    document.head.appendChild(script)
  } else {
    initializeGoogleSignIn()
  }
})

// Clean up on unmount
onUnmounted(() => {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.cancel()
  }
})

// Define emits
const emit = defineEmits(['verification-complete', 'verification-error'])
</script>

<style scoped>
.google-service {
  padding: 24px;
  border-radius: 12px;
  background: transparent;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.service-header {
  text-align: center;
  margin-bottom: 24px;
}

.service-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.service-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.service-content {
  margin-bottom: 16px;
}

.verification-section {
  text-align: center;
}

.google-icon {
  margin-bottom: 16px;
}

.google-login-button {
  width: 100%;
  padding: 12px 24px;
  background: #4285f4;
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

.google-login-button:hover:not(:disabled) {
  background: #3367d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.google-login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.verified-section {
  text-align: center;
}

.success-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #166534;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-text {
  font-size: 16px;
  font-weight: 500;
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