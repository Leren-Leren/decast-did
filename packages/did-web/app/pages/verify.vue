<template>
  <div class="verify-page">
    <div class="verify-header">
      <h1 class="verify-title">Verify Your Identity</h1>
      <p class="verify-subtitle">Please complete the verification process to continue</p>
      <p class="verify-verifier"><b>{{ domainName }}</b> requests the following data</p>
    </div>
    
    <div class="verify-content">
      <div v-if="service" class="service-info">
        <h3 class="service-title">{{ getServiceDisplayName(service) }}</h3>
        <div v-if="service" class="claim-status">
          <span v-if="isClaimed === true" class="claim-tag claimed">Claimed</span>
          <button v-else-if="isClaimed === false" class="claim-tag claim-btn" @click="startVerification">Start Verification</button>
        </div>
        
        <!-- Generate Proof Button for Claimed Services -->
        <div v-if="isClaimed === true && callbackUrl" class="generate-proof-section">
          <div class="proof-info">
            <p class="proof-description">Your {{ getServiceDisplayName(service) }} is already verified. Generate a proof to share with <b>{{ domainName }}</b>.</p>
          </div>
          <button 
            class="generate-proof-button" 
            @click="generateProof"
            :disabled="isGeneratingProof"
          >
            <span v-if="isGeneratingProof" class="loading-spinner"></span>
            {{ isGeneratingProof ? 'Generating Proof...' : 'Generate Proof' }}
          </button>
        </div>
        
        <!-- Service verification component -->
        <div v-if="showServiceComponent" class="service-component">
          <GoogleAccountService 
            v-if="service === 'google-account'"
            @verification-complete="handleVerificationComplete"
            @verification-error="handleVerificationError"
          />
          <LivenessCheckService 
            v-if="service === 'liveness-check'"
            @verification-complete="handleVerificationComplete"
            @verification-error="handleVerificationError"
          />
          <EmailVerificationService 
            v-if="service === 'email-verification'"
            @verification-complete="handleVerificationComplete"
            @verification-error="handleVerificationError"
          />
        </div>
        
        <div v-if="subjects && subjects.length > 0" class="subjects-section">
          <h4 class="section-title">Data to be verified:</h4>
          <ul class="subjects-list">
            <li v-for="subject in subjects" :key="subject" class="subject-item">
              <span class="subject-label">View your {{ formatFieldLabel(subject) }}:</span>
              <span v-if="isClaimed && serviceData" class="subject-value">
                {{ getSubjectValue(subject) }}
              </span>
              <span v-else class="subject-value pending">
                {{ isClaimed === null ? 'Checking...' : 'Not verified' }}
              </span>
            </li>
          </ul>
        </div>
        
        <div v-if="conditions && conditions.length > 0" class="conditions-section">
          <h4 class="section-title">Verification conditions:</h4>
          <ul class="conditions-list">
            <li v-for="condition in conditions" :key="`${condition.subject}-${condition.condition}`" class="condition-item">
              <div class="condition-text">
                {{ formatCondition(condition) }}
              </div>
              <div v-if="isClaimed && serviceData" class="condition-status">
                <span class="status-icon">
                  <svg v-if="checkCondition(serviceData[condition.subject], condition.condition, condition.value)" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="status-text">
                  {{ checkCondition(serviceData[condition.subject], condition.condition, condition.value) ? 'Passed' : 'Failed' }}
                </span>
              </div>
              <div v-else class="condition-status">
                <span class="status-text pending">
                  {{ isClaimed === null ? 'Checking...' : 'Not verified' }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div v-else class="no-params">
        <p>No verification parameters provided</p>
      </div>
    </div>
    
    <div class="verify-footer">
      <!-- Show login options if not logged in, otherwise show logged-in status -->
      <div v-if="!authStore.isLoggedIn" class="login-section">
        <div class="login-options">
          <h3 class="login-options-title">Choose your login method:</h3>
          <div class="login-methods">
            <div class="login-method">
              <MetaMaskLogin />
            </div>
            <div class="login-divider">
              <span>or</span>
            </div>
            <div class="login-method">
              <DecastDidLogin />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="logged-in-section">
        <div class="logged-in-status">
          <div class="status-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="status-text">Logged in successfully</span>
          <span class="status-text">DID: {{ authStore.getDid }}</span>
          <!-- <span class="status-text">Token: {{ authStore.token }}</span> -->
          <!-- <span class="status-text">Refresh Token: {{ authStore.refreshToken }}</span> -->
        </div>
        <button class="logout-button" @click="handleLogout">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { computed, ref, watchEffect } from 'vue'
import { useAsyncData, useNuxtApp } from '#app'
import GoogleAccountService from '~/components/services/GoogleAccountService.vue'
import LivenessCheckService from '~/components/services/LivenessCheckService.vue'
import EmailVerificationService from '~/components/services/EmailVerificationService.vue'

const config = useRuntimeConfig()
const DID_BASE_URL = config.public.didBaseUrl 


definePageMeta({
  layout: 'verify'
})

const route = useRoute()
const authStore = useAuthStore()
const nuxtApp = useNuxtApp()
const isClaimed = ref(null)
const showServiceComponent = ref(false)
const isGeneratingProof = ref(false)
const serviceData = ref(null)

// Get query parameters
const service = computed(() => route.query.service)
const subjects = computed(() => {
  const subjectsParam = route.query.subjects
  if (typeof subjectsParam === 'string') {
    try {
      return JSON.parse(subjectsParam)
    } catch {
      return []
    }
  }
  return subjectsParam || []
})
const conditions = computed(() => {
  const conditionsParam = route.query.conditions
  if (typeof conditionsParam === 'string') {
    try {
      return JSON.parse(conditionsParam)
    } catch {
      return []
    }
  }
  return conditionsParam || []
})
const callbackUrl = computed(() => route.query.callback_url)

// Extract domain name from callback URL
const domainName = computed(() => {
  if (!callbackUrl.value) return 'decast.live'
  try {
    const url = new URL(callbackUrl.value)
    return url.hostname
  } catch {
    return 'decast.live'
  }
})

// Service display names mapping
const serviceDisplayNames = {
  'email-verification': 'Email Verification',
  'liveness-check': 'Liveness Check',
  'google-account': 'Google Account',
  'facebook-account': 'Facebook Account',
  'apple-account': 'Apple Account',
  'metamask-address': 'MetaMask Address'
}

const getServiceDisplayName = (serviceName) => {
  return serviceDisplayNames[serviceName] || serviceName
}

const formatCondition = (condition) => {
  const { subject, condition: conditionType, value } = condition
  
  // Format subject name
  const subjectName = formatFieldLabel(subject)
  
  // Format condition type
  const conditionText = getConditionText(conditionType)
  
  // Format value
  const formattedValue = formatValue(value)
  
  return `${subjectName} ${conditionText} ${formattedValue}`
}

const getConditionText = (conditionType) => {
  switch (conditionType) {
    case 'eq':
      return 'equals'
    case 'gt':
      return 'is greater than'
    case 'gte':
      return 'is greater than or equal to'
    case 'lt':
      return 'is less than'
    case 'lte':
      return 'is less than or equal to'
    case 'ne':
      return 'is not equal to'
    case 'contains':
      return 'contains'
    case 'startsWith':
      return 'starts with'
    case 'endsWith':
      return 'ends with'
    default:
      return conditionType
  }
}

const formatFieldLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const formatValue = (value) => {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') return value.toLocaleString()
  return String(value)
}

const getSubjectValue = (subject) => {
  if (!serviceData.value) return 'Loading...'
  const value = serviceData.value[subject]
  if (value === undefined) return 'Not available'
  return formatValue(value)
}

const handleVerify = () => {
  // Verification logic will be implemented here
  console.log('Verification process started')
  console.log('Service:', service.value)
  console.log('Subjects:', subjects.value)
  console.log('Conditions:', conditions.value)
  console.log('Callback URL:', callbackUrl.value)
}

const handleLogout = () => {
  authStore.clearTokens()
}

const checkClaimed = async () => {
  console.log('Checking claimed status for service:', service.value)
  if (!service.value || !authStore.token) {
    isClaimed.value = null
    return
  }
  
  try {
    // First, ensure we have the user's DID
    let userDid = authStore.getDid
    if (!userDid) {
      const profile = await authStore.fetchUserDid()
      userDid = profile?.did || authStore.getDid
    }
    
    if (!userDid) {
      console.error('No DID found for user')
      isClaimed.value = false
      return
    }
    
    console.log('Checking service for DID:', userDid)
    
    // Fetch the DID document
    const didDocument = await $fetch(`${DID_BASE_URL}/api/v1/dids/${encodeURIComponent(userDid)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    console.log('DID Document:', didDocument)
    
    // Check if the service exists in the DID document's service array
    const services = didDocument.service || []
    const serviceExists = services.some(s => s.type === service.value)
    
    if (!serviceExists) {
      console.log('Service does not exist in DID document')
      isClaimed.value = false
      return
    }
    
    // If no conditions are specified, service is claimed
    if (!conditions.value || conditions.value.length === 0) {
      console.log('No conditions specified, service is claimed')
      isClaimed.value = true
      return
    }
    
    // Find the service endpoint
    const serviceInfo = services.find(s => s.type === service.value)
    if (!serviceInfo || !serviceInfo.serviceEndpoint) {
      console.error('Service endpoint not found')
      isClaimed.value = false
      return
    }
    
    console.log('Fetching service data from:', serviceInfo.serviceEndpoint)
    
    // Fetch service data
    const fetchedServiceData = await $fetch(serviceInfo.serviceEndpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    
    console.log('Service data:', fetchedServiceData)
    
    // Store service data for display
    serviceData.value = fetchedServiceData
    
    // Check conditions against service data
    // const credentialSubjects = serviceData.credentialSubjects || []
    // if (credentialSubjects.length === 0) {
    //   console.log('No credential subjects found')
    //   isClaimed.value = false
    //   return
    // }
    
    // Check all conditions
    const allConditionsMet = conditions.value.every(condition => {
      console.log('condition', condition) 
      const { subject, condition: conditionType, value } = condition
      
      console.log(`Checking condition: ${subject} ${conditionType} ${value}`)
      
      // Find the subject field in service data
      const subjectValue = serviceData.value[subject]
      
      if (subjectValue === undefined) {
        console.log(`Subject field '${subject}' not found in credential data`)
        return false
      }
      
      console.log(`Subject value: ${subjectValue}, Expected: ${value}, Condition: ${conditionType}`)
      
      // Apply condition check
      const conditionMet = checkCondition(subjectValue, conditionType, value)
      console.log(`Condition met: ${conditionMet}`)
      
      return conditionMet
    })
    
    console.log(`All conditions met: ${allConditionsMet}`)
    isClaimed.value = allConditionsMet
    
  } catch (error) {
    console.error('Failed to check claimed status:', error)
    isClaimed.value = false
  }
}

// Helper function to check conditions
const checkCondition = (actualValue, conditionType, expectedValue) => {
  // Convert values to appropriate types for comparison
  let actual = actualValue
  let expected = expectedValue
  
  // Try to convert to numbers if possible
  if (!isNaN(actual) && !isNaN(expected)) {
    actual = parseFloat(actual)
    expected = parseFloat(expected)
  }
  
  switch (conditionType) {
    case 'eq':
      return actual === expected
    case 'gt':
      return actual > expected
    case 'gte':
      return actual >= expected
    case 'lt':
      return actual < expected
    case 'lte':
      return actual <= expected
    case 'ne':
      return actual !== expected
    case 'contains':
      return String(actual).includes(String(expected))
    case 'startsWith':
      return String(actual).startsWith(String(expected))
    case 'endsWith':
      return String(actual).endsWith(String(expected))
    default:
      console.warn(`Unknown condition type: ${conditionType}`)
      return false
  }
}

watchEffect(() => {
  checkClaimed()
})

const startVerification = () => {
  showServiceComponent.value = true
}

const handleVerificationComplete = (data) => {
  console.log('Verification completed:', data)
  showServiceComponent.value = false
  // Refresh the claimed status
  checkClaimed()
}

const handleVerificationError = (error) => {
  console.error('Verification error:', error)
  // Optionally hide the service component on error
  // showServiceComponent.value = false
}

const generateProof = async () => {
  if (!service.value || !callbackUrl.value || !authStore.token) {
    console.error('Missing required data for proof generation')
    return
  }

  try {
    isGeneratingProof.value = true
    
    // Prepare the query data to send to the API
    const queryData = {
      service: service.value,
      credentialSubjects: subjects.value,
    }

    console.log('Generating proof with data:', queryData)

    // Call the API to generate DID-JWT
    const response = await $fetch(`${DID_BASE_URL}/api/v1/dids/vc`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: queryData
    })

    console.log('Proof generated:', response)

    // Extract the JWT from the response
    const didJwt = response.didJwt || response.token || response.proof

    if (!didJwt) {
      throw new Error('No JWT received from the API')
    }

    // Redirect to callback URL with JWT
    const redirectUrl = new URL(callbackUrl.value)
    redirectUrl.searchParams.set('didJwt', didJwt)
    
    // Add any additional parameters from the response
    if (response.status) {
      redirectUrl.searchParams.set('status', response.status)
    }
    if (response.message) {
      redirectUrl.searchParams.set('message', response.message)
    }
    redirectUrl.searchParams.set('audience', authStore.getDid)

    console.log('Redirecting to:', redirectUrl.toString())
    
    // Redirect to the callback URL
    // window.location.href = redirectUrl.toString()

  } catch (error) {
    console.error('Failed to generate proof:', error)
    // You might want to show an error message to the user here
    alert('Failed to generate proof. Please try again.')
  } finally {
    isGeneratingProof.value = false
  }
}
</script>

<style scoped>
.verify-page {
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.verify-header {
  text-align: center;
  margin-bottom: 32px;
}

.verify-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.verify-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.verify-verifier {
  font-size: 18px;
  color: #121212;
  margin: 0;
}

.verify-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.service-info {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.service-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  text-align: center;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
}

.subjects-section, .conditions-section {
  margin-bottom: 24px;
}

.subjects-list, .conditions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.subject-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
  border-left: 3px solid #3b82f6;
}

.subject-label {
  font-weight: 500;
  color: #374151;
}

.subject-value {
  color: #059669;
  font-weight: 500;
}

.subject-value.pending {
  color: #6b7280;
  font-style: italic;
}

.condition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
  border-left: 3px solid #10b981;
}

.condition-text {
  flex: 1;
  font-weight: 500;
}

.condition-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.status-icon {
  display: flex;
  align-items: center;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f0fdf4;
  color: #059669;
}

.status-text.pending {
  background: #f3f4f6;
  color: #6b7280;
}

.no-params {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
}

.verify-footer {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.login-section {
  width: 100%;
  max-width: 600px;
}

.login-options {
  text-align: center;
}

.login-options-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.login-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-method {
  flex: 1;
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #d1d5db;
}

.login-divider span {
  padding: 0 16px;
  color: #6b7280;
  font-size: 14px;
  background: white;
}

.logged-in-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
}

.logged-in-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #166534;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
}

.logout-button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.logout-button:active {
  transform: translateY(0);
}

.verify-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.verify-button:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.verify-button:active {
  transform: translateY(0);
}

.claim-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
  margin-top: 4px;
}
.claimed {
  background: #e0fce0;
  color: #15803d;
  border: 1px solid #bbf7d0;
}
.claim-btn {
  background: #fef9c3;
  color: #b45309;
  border: 1px solid #fde68a;
  cursor: pointer;
  transition: background 0.2s;
}
.claim-btn:hover {
  background: #fde68a;
}

.claim-status {
  text-align: center;
  margin-bottom: 20px;
}

.generate-proof-section {
  margin-top: 24px;
  padding: 20px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  text-align: center;
}

.proof-info {
  margin-bottom: 16px;
}

.proof-description {
  font-size: 14px;
  color: #166534;
  margin: 0;
  line-height: 1.5;
}

.generate-proof-button {
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.generate-proof-button:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.generate-proof-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.generate-proof-button .loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.service-component {
  margin-top: 20px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* Responsive design */
@media (max-width: 640px) {
  .verify-title {
    font-size: 20px;
  }
  
  .verify-content {
    gap: 16px;
  }
  
  .component-placeholder {
    min-height: 150px;
  }
}
</style>
