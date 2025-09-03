# Testing Guide for DID Manager

This document provides comprehensive information about the testing setup and how to write tests for the DID Manager project.

## Overview

The DID Manager project uses **Vitest** as the testing framework with **jsdom** environment for DOM testing. The project is Webpack-based, so we don't use Vite plugins.

## Test Structure

```
test/
├── README.md           # This documentation
├── setup.ts           # Global test setup and mocks
└── smoke.spec.ts      # Basic smoke test to verify setup
```

## Dependencies

The following testing dependencies are installed:

- **vitest**: Modern testing framework
- **jsdom**: DOM environment for Node.js
- **@testing-library/vue**: Vue component testing utilities
- **@vue/test-utils**: Vue testing utilities
- **@testing-library/jest-dom**: Additional matchers (optional)

## Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['node_modules', 'dist']
  }
})
```

### TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*", "test/**/*", "vitest.config.ts"]
}
```

## Global Setup (`test/setup.ts`)

The setup file provides:

- **localStorage mock**: For testing storage operations
- **process mock**: For isomorphic environment checks
- **DOM environment**: Via jsdom

## Available Scripts

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

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import YourComponent from '@/components/YourComponent.vue'

describe('YourComponent', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(YourComponent)
  })

  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have correct initial state', () => {
    expect(wrapper.vm.someData).toBe('expected-value')
  })
})
```

### Testing Vue Components

```typescript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

describe('Component with Pinia', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should work with stores', () => {
    const wrapper = mount(YourComponent, {
      global: {
        plugins: [pinia]
      }
    })
    // Test component behavior
  })
})
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

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **Arrange-Act-Assert**: Structure tests in three clear sections
4. **Mock External Dependencies**: Mock APIs, localStorage, etc.
5. **Test User Behavior**: Focus on what users see and do

## Common Patterns

### Mocking localStorage

```typescript
beforeEach(() => {
  // Mock localStorage methods
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
  
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  })
})
```

### Testing Event Handlers

```typescript
it('should handle click events', async () => {
  const wrapper = mount(ButtonComponent)
  const button = wrapper.find('button')
  
  await button.trigger('click')
  
  expect(wrapper.emitted('click')).toBeTruthy()
  expect(wrapper.emitted('click')).toHaveLength(1)
})
```

### Testing Computed Properties

```typescript
it('should compute derived values', () => {
  const wrapper = mount(ComponentWithComputed)
  
  expect(wrapper.vm.computedValue).toBe('expected-result')
})
```

## Running Specific Tests

```bash
# Run specific test file
pnpm test:run test/unit/MyComponent.test.ts

# Run tests matching pattern
pnpm test:run --reporter=verbose --run MyComponent

# Run tests in specific directory
pnpm test:run test/unit/
```

## Debugging Tests

### Using console.log

```typescript
it('should debug test', () => {
  console.log('Debug info:', someVariable)
  expect(true).toBe(true)
})
```

### Using Vitest UI

```bash
pnpm test:ui
```

This opens a web interface where you can:
- See test results in real-time
- Debug failing tests
- View test coverage
- Filter and search tests

## Coverage

To generate coverage reports:

```bash
pnpm test:coverage
```

This will create a `coverage/` directory with detailed coverage information.

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**: Check `tsconfig.json` and `vitest.config.ts`
2. **DOM Not Available**: Ensure `environment: 'jsdom'` is set
3. **Import Errors**: Verify alias configurations in config files
4. **Type Errors**: Check TypeScript configuration and type declarations

### Getting Help

- Check the [Vitest documentation](https://vitest.dev/)
- Review [Vue Test Utils guide](https://test-utils.vuejs.org/)
- Check [Testing Library Vue docs](https://testing-library.com/docs/vue-testing-library/intro/)

## Next Steps

1. Create unit tests for individual components
2. Add integration tests for component interactions
3. Set up E2E tests with playwrite
4. Add test coverage thresholds
5. Integrate with CI/CD pipeline
