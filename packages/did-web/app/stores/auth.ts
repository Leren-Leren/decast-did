import { defineStore } from 'pinia'
interface AuthState {
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  did: string | null
  walletAddress: string | null
}

// Helper function to safely access localStorage
const getLocalStorage = (key: string): string | null => {
  if (process.client && typeof window !== 'undefined') {
    return localStorage.getItem(key)
  }
  return null
}

const setLocalStorage = (key: string, value: string): void => {
  if (process.client && typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

const removeLocalStorage = (key: string): void => {
  if (process.client && typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    did: null,
    walletAddress: null
  }),

  getters: {
    getToken: (state) => state.token,
    getRefreshToken: (state) => state.refreshToken,
    isLoggedIn: (state) => state.isAuthenticated,
    getDid: (state) => state.did,
    getWalletAddress: (state) => state.walletAddress
  },

  actions: {
    setTokens(token: string, refreshToken: string, did?: string) {
      this.token = token
      this.refreshToken = refreshToken
      this.isAuthenticated = true
      
      if (did) {
        this.did = did
        setLocalStorage('did', did)
      }
      
      // Store in localStorage for persistence
      setLocalStorage('token', token)
      setLocalStorage('refreshToken', refreshToken)
    },

    clearTokens() {
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.did = null
      this.walletAddress = null
      
      // Clear from localStorage
      removeLocalStorage('token')
      removeLocalStorage('refreshToken')
      removeLocalStorage('did')
      removeLocalStorage('walletAddress')
    },

    initializeAuth() {
      // Check if tokens exist in localStorage on app start
      const token = getLocalStorage('token')
      const refreshToken = getLocalStorage('refreshToken')
      const did = getLocalStorage('did')
      
      if (token && refreshToken) {
        this.token = token
        this.refreshToken = refreshToken
        this.isAuthenticated = true
        
        if (did) {
          this.did = did
        }
      }
    }

  }
})