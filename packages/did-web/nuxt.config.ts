// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  
  // Expose environment variables to the client
  runtimeConfig: {
    // Server-side only keys
    // Keys within public are exposed to the client
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || '1054183103777-7eqm2ddpdo6ok9b1cq4c350132mmiusr.apps.googleusercontent.com',
      didBaseUrl: process.env.DID_BASE_URL || 'http://localhost:3000',
      extensionId: process.env.EXTENSION_ID || 'algkhhfaciplhfnkmecpmdfampkppndj'
    }
  }
})