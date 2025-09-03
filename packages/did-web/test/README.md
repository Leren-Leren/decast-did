# Testing Guide for DID Web

This document provides comprehensive information about the testing setup and how to write tests for the DID Web project.

## Overview

The DID Web project uses a **dual testing approach**:
- **Vitest** for unit and component tests with **jsdom** environment
- **Playwright** for end-to-end (E2E) tests with real browser automation

The project is Nuxt-based and uses Pinia for state management.

## Test Structure

```
test/
├── README.md                    # This documentation
├── setup.ts                    # Global test setup and mocks
├── unit/                       # Unit tests
│   └── stores/                # Store tests
│       └── auth.test.ts       # Authentication store tests
└── e2e/                       # End-to-end tests
    └── metamask-login-flow.spec.ts  # MetaMask login flow tests
```

## Dependencies

### Unit Testing (Vitest)
- **vitest**: Modern testing framework
- **jsdom**: DOM environment for Node.js
- **@testing-library/vue**: Vue component testing utilities
- **@vue/test-utils**: Vue testing utilities
- **@testing-library/jest-dom**: Additional matchers

### E2E Testing (Playwright)
- **@playwright/test**: Browser automation framework
- **Multiple browsers**: Chrome, Firefox, Safari, Mobile

## Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  }
})
```

### Playwright Config (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: false, // Sequential execution to avoid interference
  workers: 1,           // Single worker for stability
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ],
  
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
```

## Global Setup (`test/setup.ts`)

The setup file provides essential mocks for the Nuxt environment:

- **process.client**: Mocked for isomorphic checks
- **localStorage**: Mocked for storage operations
- **Nuxt composables**: Mocked `useRuntimeConfig` and `useNuxtApp`
- **$fetch**: Global mock for API calls

## Available Scripts

### Unit Tests
```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests
```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in debug mode
pnpm test:e2e:debug

# Install Playwright browsers
pnpm test:e2e:install
```

## Writing Tests

### Unit Tests

#### Store Tests (Pinia)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../../../app/stores/auth'

describe('Auth Store', () => {
  let pinia: any
  let authStore: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
  })

  it('should have correct initial state', () => {
    expect(authStore.token).toBe(null)
    expect(authStore.isAuthenticated).toBe(false)
  })

  it('should set tokens correctly', () => {
    authStore.setTokens('token', 'refresh-token')
    expect(authStore.isAuthenticated).toBe(true)
  })
})
```

#### Component Tests

```typescript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import YourComponent from '@/components/YourComponent.vue'

describe('YourComponent', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should render correctly', () => {
    const wrapper = mount(YourComponent, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
```

### E2E Tests

#### MetaMask Integration Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('MetaMask Login Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API endpoints
    await page.route('**/api/v1/auth/wallet/nonce', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          nonce: 'test-nonce-' + Date.now(),
          token: 'temp-token-' + Date.now()
        })
      })
    })

    // Mock browser APIs
    await page.addInitScript(() => {
      // Mock ethereum provider
      ;(window as any).ethereum = {
        isMetaMask: true,
        request: async (request: any) => {
          if (request.method === 'eth_requestAccounts') {
            return ['0x1234567890abcdef1234567890abcdef12345678']
          }
          if (request.method === 'personal_sign') {
            return '0x' + 'b'.repeat(64)
          }
          return null
        }
      }
    })

    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should complete full MetaMask login flow', async ({ page }) => {
    const metamaskButton = page.getByText('Login with a MetaMask')
    await expect(metamaskButton).toBeVisible()
    
    await metamaskButton.click()
    await page.waitForTimeout(3000)
    
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
    expect(token).toContain('jwt-token')
  })
})
```

## Testing Patterns

### Mocking External Dependencies

#### API Calls
```typescript
// Mock $fetch in setup.ts
;(global as any).$fetch = vi.fn()

// Mock specific API endpoints in tests
vi.mocked($fetch).mockResolvedValue({
  token: 'mock-token',
  refreshToken: 'mock-refresh'
})
```

#### Browser APIs
```typescript
// Mock localStorage
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})

// Mock ethereum provider
;(window as any).ethereum = {
  isMetaMask: true,
  request: vi.fn()
}
```

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  const wrapper = mount(AsyncComponent)
  
  // Trigger async action
  await wrapper.find('button').trigger('click')
  
  // Wait for async operation to complete
  await wrapper.vm.$nextTick()
  
  // Assert results
  expect(wrapper.text()).toContain('Expected Result')
})
```

## Best Practices

### Unit Tests
1. **Test Isolation**: Each test should be independent
2. **Mock External Dependencies**: APIs, localStorage, browser APIs
3. **Test Store Actions**: Verify state changes and side effects
4. **Use Descriptive Names**: Clear test descriptions

### E2E Tests
1. **Sequential Execution**: Avoid test interference
2. **Mock External Services**: Don't depend on real APIs
3. **Realistic User Flows**: Test complete user journeys
4. **Proper Waiting**: Use appropriate wait strategies

## Common Issues and Solutions

### Unit Tests

#### Module Resolution
- **Issue**: Cannot resolve `~` aliases
- **Solution**: Use relative paths or configure aliases in vitest.config.ts

#### Nuxt Composables
- **Issue**: `useRuntimeConfig` not available
- **Solution**: Mock in test/setup.ts

### E2E Tests

#### Test Interference
- **Issue**: Tests affecting each other
- **Solution**: Set `fullyParallel: false` and `workers: 1`

#### Browser API Mocking
- **Issue**: MetaMask not available in test environment
- **Solution**: Use `page.addInitScript()` to mock ethereum provider

#### Network Mocking
- **Issue**: API calls failing
- **Solution**: Use `page.route()` to intercept and mock API responses

## Running Specific Tests

### Unit Tests
```bash
# Run specific test file
pnpm test:run test/unit/stores/auth.test.ts

# Run tests matching pattern
pnpm test:run --reporter=verbose --run auth

# Run tests in specific directory
pnpm test:run test/unit/
```

### E2E Tests
```bash
# Run specific E2E test
pnpm test:e2e test/e2e/metamask-login-flow.spec.ts

# Run tests in specific browser
pnpm test:e2e --project=chromium

# Run tests with specific grep pattern
pnpm test:e2e --grep="MetaMask"
```

## Debugging

### Unit Tests
```bash
# Run with UI for interactive debugging
pnpm test:ui

# Add console.log statements
console.log('Debug info:', someVariable)
```

### E2E Tests
```bash
# Run in debug mode
pnpm test:e2e:debug

# Run with UI
pnpm test:e2e:ui

# Check test results
open playwright-report/index.html
```

## Coverage

Generate coverage reports for unit tests:

```bash
pnpm test:coverage
```

This creates a `coverage/` directory with detailed coverage information.

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Unit Tests
  run: pnpm test:run

- name: Run E2E Tests
  run: pnpm test:e2e

- name: Upload Playwright Report
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Next Steps

1. **Expand Unit Tests**: Add tests for all components and stores
2. **Add Integration Tests**: Test component interactions
3. **Enhance E2E Coverage**: Add tests for DecastID login flow
4. **Performance Testing**: Add load and stress tests
5. **Accessibility Testing**: Ensure UI is accessible
6. **Visual Regression**: Add visual testing with Playwright

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Vue Test Utils Guide](https://test-utils.vuejs.org/)
- [Testing Library Vue](https://testing-library.com/docs/vue-testing-library/intro/)
- [Nuxt Testing Guide](https://nuxt.com/docs/guide/concepts/testing)
