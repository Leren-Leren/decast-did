export const config = {
  // Target application URL
  baseUrl: process.env.TARGET_URL || 'https://did.decast.live',
  
  // Test configuration
  testConfig: {
    // Latency test settings
    latency: {
      iterations: 5,
      concurrency: 10,
      timeout: 30000,
      warmupIterations: 10
    },
    
    // Load test settings
    load: {
      duration: 300, // 5 minutes
      rampUpTime: 60, // 1 minute
      maxUsers: 100,
      spawnRate: 10
    },
    
    // Stress test settings
    stress: {
      duration: 600, // 10 minutes
      maxUsers: 500,
      spawnRate: 20
    }
  },
  
  // API endpoints to test
  endpoints: {
    nonce: '/api/v1/auth/did/nonce',
    login: '/api/v1/auth/did/login',
    didResolution: '/api/v1/dids/{did}',
    issuance: '/api/v1/dids/vc',
    serviceData: '/api/v1/dids/services/{service}',
    health: '/health'
  },

  // Test data
  testData: {
    sampleDids: [
      'did:decast:did.decast.live:user:123',
      'did:decast:did.decast.live:user:456',
      'did:decast:did.decast.live:user:789',
      'did:decast:did.decast.live:org:example',
      'did:decast:did.decast.live:service:auth'
    ],
    sampleKeyPairs: [
      {
        publicKey: '9tY4ep2yQtySaMyiX6UQqXrfZ6tVbwBtCPj2zarPjv5X',
        secretKey: '2miFXm6nFLWUE8VHFZHvn7gfY8PXu4hGhjE2Lq6hsePfKhJHkc6oew9itSbkysxkH9PPP81YMi4QbricExsP6iV',
        did: 'did:decast:9tY4ep2yQtySaMyiX6UQqXrfZ6tVbwBtCPj2zarPjv5X'
      }
    ],
    
    // Sample credential data for issuance tests
    sampleCredentials: [
      {
        type: 'VerifiableCredential',
        issuer: 'did:web:wid.decast.live:issuer:1',
        subject: 'did:web:wid.decast.live:user:123',
        claims: {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        }
      }
    ]
  },
  
  // Performance thresholds (in milliseconds)
  thresholds: {
    signInLatency: {
      median: 200
    },
    didResolutionLatency: {
      cacheHit: {
        median: 5
      }
    },
    verificationLatency: {
      warmCache: {
        median: 118
      }
    },
    getServiceDataLatency: {
      median: 50
    }
  }
};

