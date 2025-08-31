# Decast DID Web Application - Latency Testing Framework

This latency testing framework is designed to measure the response times of the Decast DID Web Application deployed at `did.decast.live`. The framework provides comprehensive testing for key latency metrics.

## 🎯 Latency Metrics Covered

### 1. Sign In Latency
- **Target**: 200ms median
- **Test**: Measures authentication time including DID signature verification

### 2. DID Resolution Latency (Cache Hit)
- **Target**: 5ms median
- **Test**: Measures resolution time for cached DID lookups

### 3. Verification Latency (Warm Cache)
- **Target**: 118ms median
- **Test**: Measures VP validation lifecycle including signature verification

### 4. Get Service Data Latency
- **Target**: 50ms median
- **Test**: Measures service data retrieval time

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or pnpm

### Installation
```bash
cd test/performance
npm install
```

### Basic Usage

#### Run All Tests
```bash
npm test
```

#### Run Latency Tests
```bash
# Run latency tests directly
npm run test:latency
```

#### Command Line Options
```bash
# Test against a different URL
npm test -- --url https://your-deployment.com

# Run latency tests with custom iterations
npm test -- --iterations 200
```

## 📊 Test Configuration

### Default Settings
```javascript
{
  baseUrl: 'https://did.decast.live',
  latency: {
    iterations: 5,
    concurrency: 10,
    timeout: 30000,
    warmupIterations: 10
  }
}
```

### Environment Variables
Create a `.env` file in the `test/performance` directory:
```env
TARGET_URL=https://did.decast.live
NODE_ENV=production
```

## 🔧 Test Scenarios

### Latency Tests

#### 1. Sign In Latency
- **Endpoint**: `POST /api/v1/auth/did/login`
- **Payload**: DID signature and document
- **Measurement**: Authentication time including signature verification

#### 2. DID Resolution Latency (Cache Hit)
- **Endpoint**: `GET /api/v1/dids/{did}` (repeated requests)
- **Measurement**: Resolution time for cached DID lookups

#### 3. Verification Latency (Warm Cache)
- **Endpoint**: `POST /api/v1/dids/vc`
- **Payload**: Service verification request
- **Measurement**: VP validation time including signature verification

#### 4. Get Service Data Latency
- **Endpoint**: `GET /api/v1/dids/services/{service}`
- **Measurement**: Service data retrieval time

## 📈 Results and Reports

### Generated Files
- `latency-results-{timestamp}.json` - Raw latency test data
- `latency-report-{timestamp}.md` - Detailed latency report

### Report Contents
- Performance metrics (median, min, max, mean)
- Threshold comparisons
- Performance recommendations
- Error analysis
- Scaling suggestions

## 🎯 Performance Thresholds

### Latency Thresholds (milliseconds)
```javascript
{
  signInLatency: { median: 200 },
  didResolutionLatency: {
    cacheHit: { median: 5 }
  },
  verificationLatency: {
    warmCache: { median: 118 }
  },
  getServiceDataLatency: { median: 50 }
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Connection Timeouts
```bash
# Increase timeout values
npm test -- --timeout 60000
```

#### 2. High Error Rates
- Check if the target application is running
- Verify network connectivity
- Check API endpoint availability

#### 3. Memory Issues
```bash
# Reduce concurrent connections
npm test -- --connections 25
```

#### 4. Slow Tests
```bash
# Reduce iterations for faster testing
npm test -- --iterations 50
```

### Debug Mode
```bash
# Enable verbose logging
DEBUG=* npm test
```

## 📝 Customization

### Adding New Test Scenarios
1. Create a new test method in `latency-tests.js`
2. Add configuration in `config.js`
3. Update the main test runner

### Modifying Test Data
Edit the `testData` section in `config.js`:
```javascript
testData: {
  sampleDids: ['your-did-1', 'your-did-2'],
  sampleCredentials: [/* your credential data */]
}
```

### Adjusting Thresholds
Update the `thresholds` section in `config.js` to match your performance requirements.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your tests or improvements
4. Submit a pull request

## 📄 License

This performance testing framework is part of the Decast DID Web Application project.

