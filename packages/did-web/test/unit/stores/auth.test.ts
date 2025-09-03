import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../../../app/stores/auth'

describe('Auth Store', () => {
  let pinia: any
  let authStore: any
  let mockLocalStorage: any

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    pinia = createPinia()
    setActivePinia(pinia)
    
    // Get the auth store
    authStore = useAuthStore()
    
    // Mock localStorage methods
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    
    // Replace global localStorage with our mock
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(authStore.token).toBe(null)
      expect(authStore.refreshToken).toBe(null)
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.did).toBe(null)
      expect(authStore.walletAddress).toBe(null)
    })
  })

  describe('Getters', () => {
    it('should return correct token via getToken', () => {
      authStore.token = 'test-token'
      expect(authStore.getToken).toBe('test-token')
    })

    it('should return correct refresh token via getRefreshToken', () => {
      authStore.refreshToken = 'refresh-token'
      expect(authStore.getRefreshToken).toBe('refresh-token')
    })

    it('should return correct authentication status via isLoggedIn', () => {
      authStore.isAuthenticated = true
      expect(authStore.isLoggedIn).toBe(true)
      
      authStore.isAuthenticated = false
      expect(authStore.isLoggedIn).toBe(false)
    })

    it('should return correct DID via getDid', () => {
      authStore.did = 'did:decast:test123'
      expect(authStore.getDid).toBe('did:decast:test123')
    })

    it('should return correct wallet address via getWalletAddress', () => {
      authStore.walletAddress = '0x1234567890abcdef'
      expect(authStore.getWalletAddress).toBe('0x1234567890abcdef')
    })
  })

  describe('Actions', () => {
    describe('setTokens', () => {
      it('should set tokens and update authentication state', () => {
        authStore.setTokens('new-token', 'new-refresh-token')
        
        expect(authStore.token).toBe('new-token')
        expect(authStore.refreshToken).toBe('new-refresh-token')
        expect(authStore.isAuthenticated).toBe(true)
      })

      it('should set DID when provided', () => {
        authStore.setTokens('new-token', 'new-refresh-token', 'did:decast:test123')
        
        expect(authStore.did).toBe('did:decast:test123')
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('did', 'did:decast:test123')
      })

      it('should store tokens in localStorage', () => {
        authStore.setTokens('new-token', 'new-refresh-token')
        
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'new-token')
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token')
      })

      it('should not set DID when not provided', () => {
        authStore.setTokens('new-token', 'new-refresh-token')
        
        expect(authStore.did).toBe(null)
        expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith('did', expect.any(String))
      })
    })

    describe('clearTokens', () => {
      it('should clear all authentication data', () => {
        // Set some initial state
        authStore.token = 'test-token'
        authStore.refreshToken = 'test-refresh'
        authStore.isAuthenticated = true
        authStore.did = 'test-did'
        authStore.walletAddress = 'test-wallet'
        
        authStore.clearTokens()
        
        expect(authStore.token).toBe(null)
        expect(authStore.refreshToken).toBe(null)
        expect(authStore.isAuthenticated).toBe(false)
        expect(authStore.did).toBe(null)
        expect(authStore.walletAddress).toBe(null)
      })

      it('should clear localStorage items', () => {
        authStore.clearTokens()
        
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token')
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken')
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('did')
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('walletAddress')
      })
    })

    describe('initializeAuth', () => {
      it('should restore authentication from localStorage when tokens exist', () => {
        // Mock localStorage to return tokens
        mockLocalStorage.getItem
          .mockReturnValueOnce('stored-token')      // token
          .mockReturnValueOnce('stored-refresh')   // refreshToken
          .mockReturnValueOnce('stored-did')       // did
        
        authStore.initializeAuth()
        
        expect(authStore.token).toBe('stored-token')
        expect(authStore.refreshToken).toBe('stored-refresh')
        expect(authStore.isAuthenticated).toBe(true)
        expect(authStore.did).toBe('stored-did')
      })

      it('should not restore authentication when tokens are missing', () => {
        // Mock localStorage to return null for tokens
        mockLocalStorage.getItem
          .mockReturnValueOnce(null)  // token
          .mockReturnValueOnce(null)  // refreshToken
        
        authStore.initializeAuth()
        
        expect(authStore.token).toBe(null)
        expect(authStore.refreshToken).toBe(null)
        expect(authStore.isAuthenticated).toBe(false)
        expect(authStore.did).toBe(null)
      })

      it('should handle partial localStorage data', () => {
        // Mock localStorage to return only token
        mockLocalStorage.getItem
          .mockReturnValueOnce('stored-token')  // token
          .mockReturnValueOnce(null)           // refreshToken
        
        authStore.initializeAuth()
        
        expect(authStore.token).toBe(null)
        expect(authStore.refreshToken).toBe(null)
        expect(authStore.isAuthenticated).toBe(false)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple setTokens calls', () => {
      authStore.setTokens('first-token', 'first-refresh')
      expect(authStore.token).toBe('first-token')
      
      authStore.setTokens('second-token', 'second-refresh')
      expect(authStore.token).toBe('second-token')
      expect(authStore.refreshToken).toBe('second-refresh')
    })

    it('should handle clearTokens after setTokens', () => {
      authStore.setTokens('test-token', 'test-refresh', 'test-did')
      expect(authStore.isAuthenticated).toBe(true)
      
      authStore.clearTokens()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.token).toBe(null)
    })

    it('should handle initializeAuth after clearTokens', () => {
      // Set tokens first
      authStore.setTokens('test-token', 'test-refresh', 'test-did')
      
      // Clear them
      authStore.clearTokens()
      expect(authStore.isAuthenticated).toBe(false)
      
      // Mock localStorage to return the tokens
      mockLocalStorage.getItem
        .mockReturnValueOnce('test-token')
        .mockReturnValueOnce('test-refresh')
        .mockReturnValueOnce('test-did')
      
      // Initialize should restore them
      authStore.initializeAuth()
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.token).toBe('test-token')
    })
  })
})
