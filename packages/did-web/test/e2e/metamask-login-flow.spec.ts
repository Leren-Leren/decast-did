import { test, expect } from '@playwright/test'

test.describe('MetaMask Login Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up route mocking BEFORE navigation
    await page.route('**/api/v1/auth/wallet/nonce', async route => {
      console.log('🔧 Intercepting nonce request')
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          nonce: 'test-nonce-' + Date.now(),
          token: 'temp-token-' + Date.now()
        })
      })
    })
    
    await page.route('**/api/v1/auth/wallet/login', async route => {
      console.log('🔧 Intercepting login request')
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'jwt-token-' + Date.now(),
          refreshToken: 'refresh-token-' + Date.now()
        })
      })
    })
    
    // Apply browser API mocks BEFORE navigation
    await page.addInitScript(() => {
      console.log('🔧 Setting up browser API mocks BEFORE page load...')
      
      // Mock ethereum provider
      ;(window as any).ethereum = {
        isMetaMask: true,
        request: async (request: any) => {
          console.log('🔗 Ethereum request:', request)
          
          if (request.method === 'eth_requestAccounts') {
            console.log('✅ Returning mock accounts')
            return ['0x1234567890abcdef1234567890abcdef12345678']
          }
          if (request.method === 'personal_sign') {
            console.log('✅ Returning mock signature')
            return '0x' + 'b'.repeat(64) // Mock signature
          }
          if (request.method === 'eth_accounts') {
            console.log('✅ Returning mock accounts')
            return ['0x1234567890abcdef1234567890abcdef12345678']
          }
          return null
        }
      }
      
      // Mock ethers.js
      ;(window as any).ethers = {
        BrowserProvider: class MockBrowserProvider {
          private provider: any
          
          constructor(provider: any) {
            this.provider = provider
          }
          
          async getSigner() {
            return {
              signMessage: async (message: string) => {
                console.log('✍️ Mock signing message:', message)
                return '0x' + 'b'.repeat(64) // Mock signature
              }
            }
          }
        }
      }
      
      console.log('🔧 Browser API mocks setup complete')
    })
    
    // Navigate to the page AFTER mocks are set up
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded')
    
    // Wait a bit more for all scripts to load
    await page.waitForTimeout(2000)
  })

  test('should complete full MetaMask login flow', async ({ page }) => {
    console.log('Starting MetaMask login flow test')
    
    // Step 1: Verify login button is visible
    const metamaskButton = page.getByText('Login with a MetaMask')
    await expect(metamaskButton).toBeVisible()
    
    // Step 2: Click login button
    await metamaskButton.click()
    console.log('Clicked MetaMask login button')
    
    // Step 3: Wait for wallet connection and authentication
    await page.waitForTimeout(3000) // Wait for wallet connection and signing
    
    // Step 4: Verify authentication state is updated
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
    expect(token).toContain('jwt-token')
    
    const did = await page.evaluate(() => localStorage.getItem('did'))
    expect(did).toBeTruthy()
    expect(did).toContain('did:ethr:0x1234567890abcdef1234567890abcdef12345678')
    
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'))
    expect(refreshToken).toBeTruthy()
    expect(refreshToken).toContain('refresh-token')
    
    console.log('MetaMask login flow completed successfully')
  })

  test('should handle missing MetaMask gracefully', async ({ page }) => {
    console.log('Testing login flow with missing MetaMask')
    
    // Remove mocked MetaMask
    await page.addInitScript(() => {
      console.log('Removing MetaMask mock...')
      delete (window as any).ethereum
    })
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    
    // Verify buttons are still visible
    await expect(page.getByText('Login with a DecastID')).toBeVisible()
    await expect(page.getByText('Login with a MetaMask')).toBeVisible()
    
    // Try clicking MetaMask button (should handle gracefully)
    await page.getByText('Login with a MetaMask').click()
    
    // Wait a bit to see if any errors occur
    await page.waitForTimeout(1000)
    
    // Page should still be functional
    await expect(page.getByText('Login with a DecastID')).toBeVisible()
    await expect(page.getByText('Login with a MetaMask')).toBeVisible()
    
    console.log('Missing MetaMask handled gracefully')
  })

  test('should persist authentication state across page reloads', async ({ page }) => {
    console.log('Testing MetaMask authentication state persistence')
    
    // First, complete a MetaMask login flow
    const metamaskButton = page.getByText('Login with a MetaMask')
    await metamaskButton.click()
    await page.waitForTimeout(3000)
    
    // Verify tokens are stored
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    
    // Check if tokens are still there
    const persistedToken = await page.evaluate(() => localStorage.getItem('token'))
    expect(persistedToken).toBe(token)
    
    const persistedDid = await page.evaluate(() => localStorage.getItem('did'))
    expect(persistedDid).toBeTruthy()
    expect(persistedDid).toContain('did:ethr:0x1234567890abcdef1234567890abcdef12345678')
    
    console.log('MetaMask authentication state persisted successfully')
  })

  test('should complete login and logout flow', async ({ page }) => {
    console.log('Testing complete MetaMask login and logout flow')
    
    // Step 1: Complete MetaMask login
    const metamaskButton = page.getByText('Login with a MetaMask')
    await metamaskButton.click()
    await page.waitForTimeout(3000)
    
    // Step 2: Verify logged in state
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
    
    // Step 3: Simulate logout by clearing tokens
    await page.evaluate(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('did')
    })
    
    // Step 4: Reload page
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    
    // Step 5: Verify logout state
    const clearedToken = await page.evaluate(() => localStorage.getItem('token'))
    expect(clearedToken).toBeNull()
    
    // Step 6: Verify login buttons are still available
    await expect(page.getByText('Login with a DecastID')).toBeVisible()
    await expect(page.getByText('Login with a MetaMask')).toBeVisible()
    
    console.log('Complete MetaMask login and logout flow completed successfully')
  })
})
