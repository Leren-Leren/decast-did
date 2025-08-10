<template>
  <div>
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <NuxtPage />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { onMounted } from 'vue'

// Initialize auth store on app start
const authStore = useAuthStore()

// Only initialize auth on client side
onMounted(() => {
  authStore.initializeAuth()
})
</script>
