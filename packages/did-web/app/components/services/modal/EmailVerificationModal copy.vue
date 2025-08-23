<template>
  <BaseModal :title="'E-Mail verification'" @close="closeModal">
    <template #modalContent>
      <div class="email-service">
        <div class="service-header">
          <h3 class="service-title">Email Verification</h3>
          <p class="service-description">Verify your email address with a one-time code</p>
        </div>

        <div class="service-content">
          <!-- Step 1: Email Input -->
          <div v-if="step === 'email'" class="email-step">
            <div class="input-group">
              <label for="email" class="input-label">Email Address</label>
              <input id="email" v-model="email" type="email" placeholder="Enter your email address" class="email-input"
                :disabled="isLoading" />
            </div>

            <button class="send-otp-button" @click="sendOTP" :disabled="isLoading || !isValidEmail">
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Sending...' : 'Send Verification Code' }}
            </button>
          </div>

          <!-- Step 2: OTP Input -->
          <div v-else-if="step === 'otp'" class="otp-step">
            <div class="otp-info">
              <p class="otp-message">
                We've sent a verification code to <strong>{{ email }}</strong>
              </p>
              <p class="otp-hint">Enter the 6-digit code from your email</p>
            </div>

            <div class="otp-input-group">
              <div class="otp-inputs">
                <input v-for="(digit, index) in 6" :key="index" v-model="otpDigits[index]" type="text" maxlength="1"
                  class="otp-digit" :disabled="isLoading" @input="handleOtpInput($event, index)"
                  @keydown="handleOtpKeydown($event, index)" @paste="handleOtpPaste" ref="otpInputs" />
              </div>
            </div>

            <div class="otp-actions">
              <button class="verify-otp-button" @click="verifyOTP" :disabled="isLoading || !isOtpComplete">
                <span v-if="isLoading" class="loading-spinner"></span>
                {{ isLoading ? 'Verifying...' : 'Verify Code' }}
              </button>

              <button class="resend-button" @click="resendOTP" :disabled="isLoading || resendCooldown > 0">
                {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
              </button>
            </div>
          </div>

          <!-- Step 3: Success -->
          <div v-else-if="step === 'success'" class="success-step">
            <div class="success-status">
              <div class="success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <span class="success-text">Email verified successfully!</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import BaseModal from '~/layouts/BaseModal.vue'

// Props from parent (to close modal)
defineProps({
  closeModal: {
    type: Function,
    required: true
  }
})

const config = useRuntimeConfig()
const DID_BASE_URL = config.public.didBaseUrl

const authStore = useAuthStore()

// Reactive state
const step = ref('email') // 'email', 'otp', 'success'
const email = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const isLoading = ref(false)
const error = ref('')
const resendCooldown = ref(0)
const resendTimer = ref(null)
const token = ref('')

// Computed
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

const otpCode = computed(() => {
  return otpDigits.value.join('')
})

// Send OTP
const sendOTP = async () => {
  console.log('authStore', authStore.token);
  if (!isValidEmail.value) return

  try {
    isLoading.value = true
    error.value = ''

    const response = await $fetch(`${DID_BASE_URL}/api/v1/dids/email/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        email: email.value
      }
    })

    token.value = response.token;
    console.log('OTP sent:', response)
    step.value = 'otp'

    // Start resend cooldown
    startResendCooldown()

  } catch (err) {
    console.error('Failed to send OTP:', err)
    error.value = err.message || 'Failed to send verification code'
  } finally {
    isLoading.value = false
  }
}

// Verify OTP
const verifyOTP = async () => {
  if (!isOtpComplete.value) return

  try {
    isLoading.value = true
    error.value = ''

    const response = await $fetch(`${DID_BASE_URL}/api/v1/dids/email/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        email: email.value,
        otp: otpCode.value,
        token: token.value
      }
    })

    console.log('Email verification successful:', response)
    step.value = 'success'

    // Emit success event to parent
    emit('verification-complete', {
      service: 'email-verification',
      success: true,
      data: {
        email: email.value,
        verifiedAt: new Date().toISOString(),
        status: 'verified'
      }
    })

  } catch (err) {
    console.error('Failed to verify OTP:', err)
    error.value = err.message || 'Invalid verification code'
    // Clear OTP on error
    otpDigits.value = ['', '', '', '', '', '']
  } finally {
    isLoading.value = false
  }
}

// Resend OTP
const resendOTP = async () => {
  if (resendCooldown.value > 0) return

  try {
    isLoading.value = true
    error.value = ''

    const response = await $fetch(`${DID_BASE_URL}/api/v1/auth/email/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: {
        email: email.value
      }
    })

    console.log('OTP resent:', response)
    startResendCooldown()

  } catch (err) {
    console.error('Failed to resend OTP:', err)
    error.value = err.message || 'Failed to resend verification code'
  } finally {
    isLoading.value = false
  }
}

// Start resend cooldown
const startResendCooldown = () => {
  resendCooldown.value = 60 // 60 seconds
  resendTimer.value = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer.value)
      resendTimer.value = null
    }
  }, 1000)
}

// Handle OTP input
const handleOtpInput = (event, index) => {
  const value = event.target.value

  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    event.target.value = ''
    return
  }

  otpDigits.value[index] = value

  // Move to next input if value entered
  if (value && index < 5) {
    const nextInput = document.querySelector(`input[data-index="${index + 1}"]`)
    if (nextInput) nextInput.focus()
  }
}

// Handle OTP keydown
const handleOtpKeydown = (event, index) => {
  // Move to previous input on backspace if current input is empty
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    const prevInput = document.querySelector(`input[data-index="${index - 1}"]`)
    if (prevInput) prevInput.focus()
  }
}

// Handle OTP paste
const handleOtpPaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  const numbers = pastedData.replace(/\D/g, '').slice(0, 6)

  if (numbers.length === 6) {
    otpDigits.value = numbers.split('')
  }
}

// Clean up on unmount
onUnmounted(() => {
  if (resendTimer.value) {
    clearInterval(resendTimer.value)
  }
})

// Define emits
const emit = defineEmits(['verification-complete', 'verification-error'])
</script>

<style scoped>
.email-service {
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

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
}

.email-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #444551;
  background-color: #15161F;
  color: #FFFFFF;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.email-input:focus {
  outline: none;
  border-color: #D3CA57;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.email-input:disabled {
  background-color: #15161F;
  cursor: not-allowed;
}

.send-otp-button,
.verify-otp-button {
  width: 100%;
  padding: 12px 24px;
  background: #D3CA57;
  color: #000000;
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

.send-otp-button:hover:not(:disabled),
.verify-otp-button:hover:not(:disabled) {
  background: #D3CA57;
  transform: translateY(-1px);
}

.send-otp-button:disabled,
.verify-otp-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.otp-info {
  text-align: center;
  margin-bottom: 24px;
}

.otp-message {
  font-size: 16px;
  color: #374151;
  margin-bottom: 8px;
}

.otp-hint {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.otp-input-group {
  margin-bottom: 24px;
}

.otp-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.otp-digit {
  width: 48px;
  height: 48px;
  text-align: center;
  border: 2px solid #444551;
  background-color: #15161F;
  color: #FFFFFF;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.otp-digit:focus {
  outline: none;
  border-color: #D3CA57;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.otp-digit:disabled {
  cursor: not-allowed;
}

.otp-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resend-button {
  padding: 8px 16px;
  background: transparent;
  color: #D3CA57;
  border: 1px solid #D3CA57;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.resend-button:hover:not(:disabled) {
  background: #D3CA57;
  color: #000000;
}

.resend-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  color: #6b7280;
  border-color: #d1d5db;
}

.success-step {
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