<template>
  <BaseModal :title="'Google verification'" @close="closeModal">
    <template #modalContent>
      <div class="liveness-service">
        <div class="service-header">
          <h3 class="service-title">Liveness Check</h3>
          <p class="service-description">Hold your face at the center of the frame for 5 seconds</p>
        </div>

        <div class="service-content">
          <div v-if="!isVerified" class="verification-section">
            <div class="video-container">
              <video ref="videoRef" autoplay muted playsinline width="400" height="300" class="camera-video" />
              <div v-if="state.faceVisible" class="face-overlay">
                <div class="face-indicator">🙂</div>
              </div>
            </div>

            <div class="status-message">
              <p v-if="isInitializing">⏳ Initializing camera and models...</p>
              <p v-else>{{ statusMessage }}</p>
            </div>
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
              <span class="success-text">Liveness check completed successfully!</span>
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
import { ref, shallowRef, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import BaseModal from '~/common/BaseModal.vue'

const props = defineProps({
  closeModal: {
    type: Function,
    required: true
  }
})
const authStore = useAuthStore()
const config = useRuntimeConfig()
const DID_BASE_URL = config.public.didBaseUrl
const emit = defineEmits(['verification-complete', 'verification-error'])

// refs & state
const isVerified = ref(false)
const videoRef = ref(null)
const streamRef = ref(null)
const animationRef = ref(null)
const intervalRef = ref(null)
const hasVerified = ref(false)
const faceWasVisible = ref(false)
const error = ref('')
const isInitializing = ref(true)
const humanRef = shallowRef(null) // ✅ use shallowRef for Human instance

const state = reactive({
  verified: false,
  faceVisible: false,
  countdown: null
})

// lifecycle
onMounted(() => {
  startCamera()
})

onBeforeUnmount(() => {
  stopAll()
})

// methods
// Initialize Human library
const initializeHuman = async () => {
  try {
    console.log('Initializing Human library...')
    const { Human } = await import('@vladmandic/human')
    console.log('Human library imported successfully')

    humanRef.value = new Human({
      modelBasePath: 'https://vladmandic.github.io/human/models',
      face: {
        enabled: true,
        detector: { enabled: true },
        mesh: { enabled: false },
        iris: { enabled: false },
        emotion: { enabled: false }
      },
      body: { enabled: false },
      hand: { enabled: false }
    })

    console.log('Human instance created')

    console.log('Loading models...')
    await humanRef.value.load()
    await humanRef.value.warmup()
    console.log('Models loaded successfully')
  } catch (err) {
    console.error('Failed to initialize Human library:', err)
    error.value = 'Failed to initialize face detection'
    humanRef.value = null
  }
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    streamRef.value = stream
    videoRef.value.srcObject = stream

    await initializeHuman()
    isInitializing.value = false

    detectLoop()
  } catch (err) {
    console.error('Camera or model load error:', err)
    error.value = 'Failed to access camera'
    isInitializing.value = false
  }
}

async function detectLoop() {
  if (!humanRef.value) return
  if (hasVerified.value) return

  if (videoRef.value?.readyState === 4) {
    const result = await humanRef.value.detect(videoRef.value)
    const face = result.face?.[0]
    const faceNowVisible = !!face

    if (faceNowVisible && !faceWasVisible.value) {
      faceWasVisible.value = true
      state.faceVisible = true
      startCountdown()
    } else if (!faceNowVisible && faceWasVisible.value) {
      faceWasVisible.value = false
      state.faceVisible = false
      cancelCountdown()
    }
  }

  animationRef.value = requestAnimationFrame(detectLoop)
}

function startCountdown() {
  if (intervalRef.value) {
    clearInterval(intervalRef.value)
    intervalRef.value = null
  }

  let timeLeft = 5
  state.countdown = timeLeft
  intervalRef.value = setInterval(() => {
    timeLeft -= 1
    state.countdown = timeLeft
    if (timeLeft <= 0) {
      clearInterval(intervalRef.value)
      intervalRef.value = null
      verifyUser()
    }
  }, 1000)
}

function cancelCountdown() {
  if (intervalRef.value) {
    clearInterval(intervalRef.value)
    intervalRef.value = null
  }
  state.countdown = null
}

async function verifyUser() {
  if (hasVerified.value) return
  hasVerified.value = true

  state.verified = true
  isVerified.value = true
  stopAll()

  const serviceData = {
    timestamp: new Date().toISOString(),
    faceDetected: true,
    verificationDuration: '5 seconds',
    status: 'verified',
    verificationMethod: 'camera-liveness-check',
    confidence: 0.95,
    deviceInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language
    }
  }

  console.log('Liveness check verification data:', serviceData)

  try {
    const response = await $fetch(`${DID_BASE_URL}/api/v1/dids/liveness-check`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: { serviceData }
    })

    console.log('Liveness check API response:', response)

    emit('verification-complete', {
      service: 'liveness-check',
      success: true,
      data: serviceData,
      apiResponse: response
    })
  } catch (apiError) {
    console.error('Failed to send liveness check data to API:', apiError)
    error.value = 'Verification completed but failed to save data'

    emit('verification-complete', {
      service: 'liveness-check',
      success: true,
      data: serviceData,
      apiError: apiError.message
    })
  }
}

function stopAll() {
  cancelCountdown()
  if (animationRef.value) cancelAnimationFrame(animationRef.value)
  if (streamRef.value) {
    streamRef.value.getTracks().forEach((t) => t.stop())
  }
}

const statusMessage = computed(() => {
  if (isInitializing.value) return '⏳ Initializing camera and models...'
  if (state.verified) return '✅ User verified!'
  if (state.countdown !== null) return `🙂 Face detected. Verifying... (${state.countdown}s)`
  if (state.faceVisible) return '🙂 Face detected. Hold still...'
  return '❌ No face detected'
})
</script>

<style scoped>
.liveness-service {
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
  margin-top: 0px;
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

.video-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.camera-video {
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.face-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.face-indicator {
  font-size: 48px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.status-message {
  margin-bottom: 16px;
}

.status-message p {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, .6);
  margin: 0;
}

.manual-trigger-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.manual-trigger-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
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
  background: #1B1D29;
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
