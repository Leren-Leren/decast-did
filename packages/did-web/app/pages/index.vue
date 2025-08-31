<template>
  <div>
    <div v-if="!authStore.isLoggedIn" class="page-main">
      <div class="page-main-child">
        <!-- Left Side -->
        <div class="pmc-left-container">
          <div class="pmc-left">
            <div class="dd-label" @click="redirectToHomePage">
              <DecastLogo />
              <span class="ml-2">Decast</span>
            </div>
            <LockImage />
          </div>
        </div>

        <!-- Right Side -->
        <div class="pmc-right-container">

          <!-- Login Required Section -->
          <div v-if="!authStore.isLoggedIn" class="login-required">
            <div class="login-card">
              <div class="login-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="30" fill="#1B1D29" stroke="#242632" stroke-width="2" />
                  <path d="M20 32L28 40L44 24" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path
                    d="M32 16C24.268 16 18 22.268 18 30C18 37.732 24.268 44 32 44C39.732 44 46 37.732 46 30C46 22.268 39.732 16 32 16Z"
                    stroke="#FFFFFF" stroke-width="2" stroke-dasharray="2 2" />
                </svg>
              </div>
              <h2 class="login-title">Login Required</h2>
              <p class="login-subtitle">Please log in to view your DID services</p>
              <div class="login-options">
                <MetaMaskLogin />
                <!-- <div class="login-divider">
                  <span>or</span>
                </div> -->
                <OrDivider />
                <DecastDidLogin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DID Services Section -->
    <div v-else class="page-main">
      <div class="page-main-child1">
        <div class="page-header">
          <h1 class="page-title">Your DID Services</h1>
          <p class="page-subtitle">Manage and view your decentralized identity services</p>
          <button class="logout-button" @click="handleLogout">
            Logout
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading your DID services...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="22" fill="#fef2f2" stroke="#fecaca" stroke-width="2" />
              <path d="M24 12V24M24 36H24.01" stroke="#dc2626" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <h3>Failed to load services</h3>
          <p>{{ error }}</p>
          <button class="retry-button" @click="fetchServices">
            Try Again
          </button>
        </div>

        <!-- Services Grid -->
        <div v-else-if="services.length > 0" class="services-grid">
          <div v-for="service in services" :key="service.id || service.service" class="service-card">
            <div class="service-header">
              <div class="service-icon">
                <svg v-if="service.service === 'email-verification'" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <svg v-else-if="service.service === 'google-account'" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4" />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853" />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05" />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335" />
                </svg>
                <svg v-else-if="service.service === 'liveness-check'" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
              <div class="service-status" :class="service.verified ? 'verified' : 'unverified'">
                <span v-if="service.verified" class="status-text">Verified</span>
                <span v-else class="status-text">Unverified</span>
              </div>
            </div>

            <div class="service-content">
              <h3 class="service-name">{{ getServiceDisplayName(service.service) }}</h3>
              <p class="service-description">{{ getServiceDescription(service.service) }}</p>

              <div v-if="service.verified" class="service-details">
                <p class="verified-date">Verified on {{ formatDate(service.verifiedAt) }}</p>

                <!-- Display Credential Subjects -->
                <div v-if="service.credentialSubjects && service.credentialSubjects.length > 0"
                  class="credential-subjects">
                  <h4 class="subjects-title">Credential Subjects:</h4>
                  <div class="subjects-list">
                    <div v-for="(subject, index) in service.credentialSubjects" :key="index" class="subject-item">
                      <div class="subject-content">
                        <div v-for="(value, key) in subject" :key="key" class="subject-field">
                          <span class="field-label">{{ formatFieldLabel(key) }}:</span>
                          <span class="field-value">{{ formatFieldValue(value) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error display -->
                <div v-if="service.error" class="service-error">
                  <p class="error-text">Failed to load service data: {{ service.error }}</p>
                </div>
              </div>
            </div>

            <div class="service-actions">
              <button v-if="!service.verified" class="verify-button" @click="goToVerification(service.service)">
                Verify Now
              </button>
              <div v-else class="action-buttons">
                <button class="view-button" @click="viewDetails(service)">
                  View Details
                </button>
                <button class="delete-button" @click="confirmDelete(service)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2" />
              <path d="M32 20V32L40 40" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <h3>No services found</h3>
          <p>You haven't verified any services yet. Start by verifying your first service.</p>
          <button class="primary-button" @click="goToVerification('email-verification')">
            Start Verification
          </button>
        </div>
      </div>
    </div>


    <!-- Service Details Modal -->
    <BaseModal v-if="showDetailsModal" :title="'Service Details'" @close="closeDetailsModal">
      <template #modalContent>
        <div class="modal-container" @click.stop>
          <div class="modal-content" v-if="selectedService">
            <div class="service-details-header">
              <div class="service-icon-large">
                <svg v-if="selectedService.service === 'email-verification'" width="32" height="32" viewBox="0 0 24 24"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <svg v-else-if="selectedService.service === 'google-account'" width="32" height="32" viewBox="0 0 24 24"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4" />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853" />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05" />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335" />
                </svg>
                <svg v-else-if="selectedService.service === 'liveness-check'" width="32" height="32" viewBox="0 0 24 24"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
              <div class="service-info">
                <h3 class="service-name-large">{{ getServiceDisplayName(selectedService.service) }}</h3>
                <p class="service-description-large">{{ getServiceDescription(selectedService.service) }}</p>
                <div class="service-meta">
                  <span class="verification-date">Verified on {{ formatDate(selectedService.verifiedAt) }}</span>
                  <span class="service-id">ID: {{ selectedService.id }}</span>
                </div>
              </div>
            </div>

            <!-- Service Data Section -->
            <div class="service-data-section">
              <h4 class="section-title">Service Data</h4>

              <!-- Error State -->
              <div v-if="selectedService.error" class="error-state">
                <div class="error-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#fef2f2" stroke="#fecaca" stroke-width="2" />
                    <path d="M12 8V12M12 16H12.01" stroke="#dc2626" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
                <p class="error-message">{{ selectedService.error }}</p>
              </div>

              <!-- Service Data -->
              <div v-else-if="selectedService.data" class="service-data">
                <div class="data-section">
                  <h5 class="data-title">Credential Information</h5>
                  <div class="data-grid">
                    <div class="data-item">
                      <span class="data-label">Credential Type:</span>
                      <span class="data-value">{{ selectedService.data.type || 'N/A' }}</span>
                    </div>
                    <div class="data-item">
                      <span class="data-label">Issuer:</span>
                      <span class="data-value">{{ selectedService.data.issuer || 'N/A' }}</span>
                    </div>
                    <div class="data-item">
                      <span class="data-label">Issued At:</span>
                      <span class="data-value">{{ formatDate(selectedService.data.issuedAt) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Credential Subjects -->
                <div v-if="selectedService.credentialSubjects && selectedService.credentialSubjects.length > 0"
                  class="data-section">
                  <h5 class="data-title">Credential Subjects</h5>
                  <div class="subjects-container">
                    <div v-for="(subject, index) in selectedService.credentialSubjects" :key="index"
                      class="subject-card">
                      <div class="subject-header">
                        <span class="subject-index">Subject {{ index + 1 }}</span>
                      </div>
                      <div class="subject-fields">
                        <div v-for="(value, key) in subject" :key="key" class="subject-field">
                          <span class="field-label">{{ formatFieldLabel(key) }}:</span>
                          <span class="field-value">{{ formatFieldValue(value) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Proof Information -->
                <div v-if="selectedService.data.proof" class="data-section">
                  <h5 class="data-title">Proof Information</h5>
                  <div class="proof-info">
                    <div class="data-item">
                      <span class="data-label">Proof Type:</span>
                      <span class="data-value">{{ selectedService.data.proof.type }}</span>
                    </div>
                    <div class="data-item">
                      <span class="data-label">Created:</span>
                      <span class="data-value">{{ formatDate(selectedService.data.proof.created) }}</span>
                    </div>
                    <div class="data-item">
                      <span class="data-label">Verification Method:</span>
                      <span class="data-value">{{ selectedService.data.proof.verificationMethod }}</span>
                    </div>
                    <div class="data-item">
                      <span class="data-label">Proof Purpose:</span>
                      <span class="data-value">{{ selectedService.data.proof.proofPurpose }}</span>
                    </div>
                  </div>
                </div>

                <!-- Raw Data (Collapsible) -->
                <div class="data-section">
                  <details class="raw-data-details">
                    <summary class="raw-data-summary">View Raw Data</summary>
                    <pre class="raw-data-content">{{ JSON.stringify(selectedService.data, null, 2) }}</pre>
                  </details>
                </div>
              </div>

              <!-- Loading State -->
              <div v-else class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading service data...</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal v-if="showDeleteModal" :title="'Delete Service'" @close="cancelDelete">
      <template #modalContent>
        <div class="modal-container delete-modal" @click.stop>
          <div class="modal-content">
            <div class="delete-warning">
              <div class="warning-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
                  <path d="M12 8V12M12 16H12.01" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
              <h3 class="warning-title">Are you sure you want to delete this service?</h3>
              <p class="warning-message">
                This action will permanently remove the <strong>{{ getServiceDisplayName(serviceToDelete?.service)
                  }}</strong> service from your DID.
                This action cannot be undone.
              </p>

              <div class="service-preview">
                <div class="service-icon-small">
                  <svg v-if="serviceToDelete?.service === 'email-verification'" width="20" height="20"
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  <svg v-else-if="serviceToDelete?.service === 'google-account'" width="20" height="20"
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4" />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853" />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05" />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335" />
                  </svg>
                  <svg v-else-if="serviceToDelete?.service === 'liveness-check'" width="20" height="20"
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
                <span class="service-name-preview">{{ getServiceDisplayName(serviceToDelete?.service) }}</span>
              </div>
            </div>

            <div class="delete-actions">
              <button class="cancel-button" @click="cancelDelete" :disabled="isDeleting">
                Cancel
              </button>
              <button class="confirm-delete-button" @click="deleteService" :disabled="isDeleting">
                <span v-if="isDeleting" class="loading-spinner-small"></span>
                {{ isDeleting ? 'Deleting...' : 'Delete Service' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import MetaMaskLogin from '~/components/MetaMaskLogin.vue'
import DecastDidLogin from '~/components/DecastDidLogin.vue'
import LockImage from '~/icons/LockImage.vue'
import DecastLogo from '~/icons/DecastLogo.vue'
import OrDivider from '~/common/OrDivider.vue'
import BaseModal from '~/common/BaseModal.vue'
import { useHead } from '#imports'
const { $customFetch } = useNuxtApp()

useHead({
  title: 'Decast verifier',
  meta: [
    { name: 'description', content: 'Manage your verifiable credential' }
  ]
})

const authStore = useAuthStore()
const router = useRouter()

// Reactive state
const services = ref([])
const isLoading = ref(false)
const error = ref('')
const selectedService = ref(null)
const showDetailsModal = ref(false)
const serviceToDelete = ref(null)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const config = useRuntimeConfig()
const DID_BASE_URL = config.public.didBaseUrl

// Service display names mapping
const serviceDisplayNames = {
  'email-verification': 'Email Verification',
  'liveness-check': 'Liveness Check',
  'google-account': 'Google Account',
  'facebook-account': 'Facebook Account',
  'apple-account': 'Apple Account',
  'metamask-address': 'MetaMask Address'
}

// Service descriptions mapping
const serviceDescriptions = {
  'email-verification': 'Verify your email address with a one-time code',
  'liveness-check': 'Prove you are a real person using camera verification',
  'google-account': 'Connect and verify your Google account',
  'facebook-account': 'Connect and verify your Facebook account',
  'apple-account': 'Connect and verify your Apple ID',
  'metamask-address': 'Verify your MetaMask wallet address'
}

// Computed
const getServiceDisplayName = (serviceName) => {
  return serviceDisplayNames[serviceName] || serviceName
}

const getServiceDescription = (serviceName) => {
  return serviceDescriptions[serviceName] || 'Service verification'
}

const handleLogout = () => {
  authStore.clearTokens()
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatFieldLabel = (key) => {
  // Convert camelCase or snake_case to readable labels
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const formatFieldValue = (value) => {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

// Fetch services
const fetchServices = async () => {
  if (!authStore.token) return

  try {
    isLoading.value = true
    error.value = ''

    // First, ensure we have the user's DID
    let userDid = authStore.getDid
    if (!userDid) {
      const profile = await authStore.fetchUserDid()
      userDid = profile?.did || authStore.getDid
    }

    if (!userDid) {
      throw new Error('No DID found for user')
    }

    console.log('Fetching DID document for:', userDid)

    // Fetch the DID document
    const didDocument = await $customFetch(`${DID_BASE_URL}/api/v1/dids/${encodeURIComponent(userDid)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    console.log('DID Document:', didDocument)

    // Extract services from DID document
    const didServices = didDocument.service || []

    // Fetch service data for each service
    const servicePromises = didServices.map(async (service) => {
      try {
        console.log(`Fetching data for service: ${service.type}`)

        // Fetch service credential subjects data
        const serviceData = await $customFetch(service.serviceEndpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        console.log(`Service data for ${service.type}:`, serviceData)

        return {
          id: service.id,
          service: service.type,
          serviceEndpoint: service.serviceEndpoint,
          verified: true, // If service exists in DID document, it's verified
          verifiedAt: serviceData.issuedAt || serviceData.createdAt || new Date().toISOString(),
          credentialSubjects: serviceData.credentialSubjects || serviceData.subjects || [],
          data: serviceData
        }
      } catch (serviceError) {
        console.error(`Failed to fetch data for service ${service.type}:`, serviceError)

        // Return service info even if data fetch failed
        return {
          id: service.id,
          service: service.type,
          serviceEndpoint: service.serviceEndpoint,
          verified: true,
          verifiedAt: new Date().toISOString(),
          credentialSubjects: [],
          data: null,
          error: serviceError.message
        }
      }
    })

    // Wait for all service data to be fetched
    const servicesWithData = await Promise.all(servicePromises)

    console.log('All services with data:', servicesWithData)
    services.value = servicesWithData

  } catch (err) {
    console.error('Failed to fetch services:', err)
    error.value = err.message || 'Failed to load services'
  } finally {
    isLoading.value = false
  }
}

// Navigation functions
const goToVerification = (service) => {
  router.push(`/verify?service=${service}`)
}

const viewDetails = (service) => {
  console.log('View details for service:', service)
  selectedService.value = service
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedService.value = null
}

const confirmDelete = (service) => {
  serviceToDelete.value = service
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  serviceToDelete.value = null
  isDeleting.value = false
}

const deleteService = async () => {
  if (!serviceToDelete.value || !authStore.token) return

  try {
    isDeleting.value = true

    console.log('Deleting service:', serviceToDelete.value.service)

    // Call the delete API endpoint
    await $customFetch(`${DID_BASE_URL}/api/v1/dids/${serviceToDelete.value.service}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    console.log('Service deleted successfully')

    // Remove the service from the local list
    const serviceIndex = services.value.findIndex(s => s.id === serviceToDelete.value.id)
    if (serviceIndex !== -1) {
      services.value.splice(serviceIndex, 1)
    }

    // Close the modal
    cancelDelete()

    // Show success message (you could add a toast notification here)
    console.log('Service deleted successfully')

  } catch (error) {
    console.error('Failed to delete service:', error)

    // Show error message (you could add a toast notification here)
    console.error('Failed to delete service:', error.message)

    // Reset loading state
    isDeleting.value = false
  }
}

// Watch for auth changes
watchEffect(() => {
  if (authStore.isLoggedIn) {
    fetchServices()
  } else {
    services.value = []
  }
})

// Initialize on mount
onMounted(() => {
  if (authStore.isLoggedIn) {
    fetchServices()
  }
})
</script>

<style scoped>
*:not(i) {
  font-family: 'Rethink Sans' !important;
}

.page-main {
  height: 100vh;
  width: 100vw;
}

.page-main-child {
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
}

.page-main-child1 {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #15161F;
}

.pmc-left-container {
  width: 50%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1b1d29;
}

.pmc-left {
  width: 100%;
  height: 100%;
  padding: 30px 70px;
  display: flex;
  flex-direction: column;
}

.pmc-left svg {
  width: auto;
  height: auto;
}

.pmc-left span {
  font-size: 18px;
  font-weight: 500;
}

.pmc-right-container {
  width: 50%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #15161f;
}

.dd-label {
  /* flex items-center gap-2 font-mono text-white cursor-pointer */
  display: flex;
  align-items: center;
  gap: 2;
  margin-left: .5rem !important;
  color: #FFFFFF;
  cursor: pointer;
}

.dd-label span {
  margin-left: .5rem !important;
}

/* Animation: slide-fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  width: 100%;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.logout-button {
  background-color: transparent;
  color: #D3CA57;
  border: none;
  margin-top: 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0px;
}

.logout-button:hover {
  transform: translateY(-1px);
}

.logout-button:active {
  transform: translateY(0);
}

/* Animation: slide-fade end*/

@media (max-width: 1024px) {
  .pmc-right {
    width: 100%;
    padding: 70px 40px;
  }
}

@media (max-width: 768px) {
  .pmc-left-container {
    display: none;
  }

  .pmc-right-container {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .pmc-right {
    padding: 20px;
  }
}
</style>

<style scoped>
.did-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px;
}

/* Login Required Section */
.login-required {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 80%;
  padding: 0px 70px;
}

.login-card {
  border-radius: 16px;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.login-icon {
  margin-bottom: 24px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 12px;
}

.login-subtitle {
  font-size: 16px;
  color: #FFFFFF80;
  margin-bottom: 32px;
}

.login-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

/* DID Services Section */
.did-services {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 18px;
  color: #FFFFFF80;
  margin: 0;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #FFFFFF;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px 20px;
}

.error-icon {
  margin-bottom: 16px;
}

.error-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.error-state p {
  color: #6b7280;
  margin-bottom: 24px;
}

.error-text {
  overflow: scroll;
}

.retry-button {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  padding: 20px;
}

.service-card {
  background: #1B1D29;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.service-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.service-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.service-status.verified {
  background: #22C55E10;
  color: #22C55E;
}

.service-status.unverified {
  background: #fef3c7;
  color: #92400e;
}

.service-content {
  margin-bottom: 20px;
}

.service-name {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.service-description {
  font-size: 14px;
  color: #FFFFFF80;
  margin-bottom: 12px;
  line-height: 1.5;
}

.service-details {
  padding: 12px;
  background-color: #FFFFFF05;
  border-radius: 8px;
}

.service-error {
  color: #FFFFFF80;
}

.verified-date {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.service-actions {
  display: flex;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}

.delete-button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-button:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.verify-button,
.view-button {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.verify-button {
  background: #3b82f6;
  color: white;
}

.verify-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.view-button {
  background: #D3CA57;
  color: #000000;
}

.view-button:hover {
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.primary-button {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 76vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.service-details-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid #444551;
}

.service-icon-large {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
}

.service-info {
  flex: 1;
}

.service-name-large {
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 8px 0;
}

.service-description-large {
  font-size: 16px;
  color: #FFFFFF80;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.service-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.verification-date {
  font-size: 14px;
  color: #059669;
  font-weight: 500;
}

.service-id {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.service-data-section {
  margin-top: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 20px 0;
}

.error-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #1B1D29;
  border-radius: 8px;
}

.error-icon {
  flex-shrink: 0;
}

.error-message {
  color: #dc2626;
  margin: 0;
  font-size: 14px;
}

.service-data {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.data-section {
  background: #1B1D29;
  border-radius: 12px;
  padding: 20px;
}

.data-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 16px 0;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid #444551;
}

.data-item:last-child {
  border-bottom: none;
}

.data-label {
  font-weight: 500;
  color: #FFFFFF80;
  font-size: 14px;
}

.data-value {
  color: #FFFFFF80;
  font-size: 14px;
  text-align: right;
  word-break: break-word;
  max-width: 200px;
}

.subjects-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subject-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.subject-header {
  background: #f3f4f6;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.subject-index {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.subject-fields {
  padding: 16px;
}

.subject-field {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
}

.subject-field:last-child {
  margin-bottom: 0;
}

.field-label {
  font-weight: 500;
  color: #374151;
  min-width: 120px;
  flex-shrink: 0;
}

.field-value {
  color: #6b7280;
  text-align: right;
  word-break: break-word;
  white-space: pre-wrap;
  max-width: 250px;
}

.proof-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.raw-data-details {
  margin-top: 16px;
}

.raw-data-summary {
  font-weight: 500;
  color: #FFFFFF;
  cursor: pointer;
  padding: 8px 0;
  user-select: none;
}

.raw-data-summary:hover {
  color: rgba(255, 255, 255, .8);
  transition: color 200ms ease-in-out;
}

.raw-data-content {
  background: #1f2937;
  color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  margin-top: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    margin: 10px;
    max-height: 80vh;
  }

  .service-details-header {
    flex-direction: column;
    text-align: center;
  }

  .service-icon-large {
    align-self: center;
  }

  .data-grid {
    grid-template-columns: 1fr;
  }

  .proof-info {
    grid-template-columns: 1fr;
  }

  .subject-field {
    flex-direction: column;
    gap: 4px;
  }

  .field-label {
    min-width: auto;
  }

  .field-value {
    text-align: left;
    max-width: none;
  }
}

/* Delete Modal Styles */
.delete-modal {
  max-width: 500px;
}

.delete-warning {
  text-align: center;
  margin-bottom: 32px;
}

.warning-icon {
  margin-bottom: 16px;
}

.warning-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 12px 0;
}

.warning-message {
  font-size: 16px;
  color: #FFFFFF80;
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.service-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #1B1D29;
  border-radius: 8px;
  margin-bottom: 24px;
}

.service-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.service-name-preview {
  font-weight: 600;
  color: #FFFFFF80;
  font-size: 16px;
}

.delete-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-button {
  padding: 12px 24px;
  background: #D3CA57;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-delete-button {
  padding: 12px 24px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirm-delete-button:hover:not(:disabled) {
  background: #b91c1c;
}

.confirm-delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-required {
    width: 100%;
    padding: 70px 40px;
  }
}

@media (max-width: 768px) {
  .did-page {
    padding: 16px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 28px;
  }

  .login-card {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .login-required {
    padding: 20px;
  }
}
</style>
