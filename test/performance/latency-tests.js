import axios from 'axios';
import { config } from './config.js';
import chalk from 'chalk';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import * as ed from '@stablelib/ed25519';
import bs58 from 'bs58';

import progress from 'cli-progress';

class LatencyTester {

  constructor() {
    this.loginData = [];
    this.results = {
      signInLatency: [],
      didResolutionLatency: {
        cacheHit: []
      },
      verificationLatency: {
        warmCache: []
      },
      getServiceDataLatency: []
    };
    this.resultsDir = join(__dirname, 'results');
    fs.ensureDirSync(this.resultsDir);
  }

  async login(did, publicKey, secretKey) {

      const response = await axios.post(
        `${config.baseUrl}${config.endpoints.nonce}`, {
          did
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: config.testConfig.latency.timeout
        }
      );
     const nonce = response.data.nonce;
     const token = response.data.token;
     const nonceBytes = new TextEncoder().encode(nonce);
     const signature = ed.sign(bs58.decode(secretKey), nonceBytes);
    //  console.log('signature', bs58.encode(signature));
    //  console.log('signature', (signature));
    //  console.log('nonce', nonce);
    //  console.log('token', token);

     try {
     const response2 = await axios.post(
      `${config.baseUrl}${config.endpoints.login}`, {
        token,
        signature: bs58.encode(signature),
        didDocument: {
          "@context": "https://www.w3.org/ns/did/v1",
          "id": did,
          "verificationMethod": [{
            "id": `${did}#keys-1`,
            "type": "Ed25519VerificationKey2018",
            "controller": did,
            "publicKeyBase58": publicKey
          }],
          "authentication": [`${did}#keys-1`]
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: config.testConfig.latency.timeout
        }
       );
       return response2.data;
     } catch (error) {
      console.log('Error in iteration:', error);
      throw error;
     }
  }

  async measureLatency(testName, testFunction, iterations = 100) {
    console.log(chalk.blue(`\n🔍 Measuring ${testName}...`));
    
    const latencies = [];
    const progressBar = this.createProgressBar(iterations);
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      try {
        await testFunction();
        const endTime = Date.now();
        const latency = endTime - startTime;
        latencies.push(latency);
      } catch (error) {
        console.error(chalk.red(`Error in iteration ${i + 1}:`, error.message));
        latencies.push(null);
      }
      
      if (i % 10 === 0) {
        progressBar.update(i + 1);
      }
    }
    
    progressBar.stop();
    
    const validLatencies = latencies.filter(l => l !== null);
    const stats = this.calculateStats(validLatencies);
    
    console.log(chalk.green(`✅ ${testName} completed:`));
    console.log(`   Median: ${stats.median}ms`);
    console.log(`   Min: ${stats.min}ms`);
    console.log(`   Max: ${stats.max}ms`);
    console.log(`   Mean: ${stats.mean}ms`);
    
    return { latencies: validLatencies, stats };
  }

  createProgressBar(total) {
    
    return new progress.SingleBar({
      format: 'Progress |{bar}| {percentage}% | {value}/{total}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    }, progress.Presets.shades_classic);
  }

  calculateStats(latencies) {
    const sorted = latencies.sort((a, b) => a - b);
    const n = sorted.length;
    
    return {
      min: sorted[0],
      max: sorted[n - 1],
      mean: latencies.reduce((a, b) => a + b, 0) / n,
      median: sorted[Math.floor(n / 2)]
    };
  }

  async testSignInLatency() {
    const testFunction = async () => {
      const { token } = await this.login(config.testData.sampleKeyPairs[0].did, config.testData.sampleKeyPairs[0].publicKey, config.testData.sampleKeyPairs[0].secretKey);
       this.loginData.push({
        did: config.testData.sampleKeyPairs[0].did,
        publicKey: config.testData.sampleKeyPairs[0].publicKey,
        secretKey: config.testData.sampleKeyPairs[0].secretKey,
        token,
       });
       return token;
    };

    const result = await this.measureLatency(
      'Sign In Latency',
      testFunction,
      config.testConfig.latency.iterations
    );

    this.results.signInLatency = result;
  }





  // 2. DID Resolution Latency Test (Cache Hit)
  async testDidResolutionLatency() {
    // Cache Hit Test - Repeated requests to same DID
    const { token } = await this.login(config.testData.sampleKeyPairs[0].did, config.testData.sampleKeyPairs[0].publicKey, config.testData.sampleKeyPairs[0].secretKey);
    const cacheHitTest = async () => {
      const did = config.testData.sampleKeyPairs[0].did;
      const response = await axios.get(
        `${config.baseUrl}${config.endpoints.didResolution.replace('{did}', encodeURIComponent(did))}`,
        {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'timeout': config.testConfig.latency.timeout }
        }
      );
      // console.log(response.data);
      return response.data;
    };

    const cacheHitResult = await this.measureLatency(
      'DID Resolution Latency (Cache Hit)',
      cacheHitTest,
      config.testConfig.latency.iterations
    );
    
    this.results.didResolutionLatency.cacheHit = cacheHitResult;
  }

  // 3. Verification Latency Test (Warm Cache)
  async testVerificationLatency() {

    const { token } = await this.login(config.testData.sampleKeyPairs[0].did, config.testData.sampleKeyPairs[0].publicKey, config.testData.sampleKeyPairs[0].secretKey);

    // Warm Cache Test - Repeated verification of same credential
    const warmCacheTest = async () => {
      const verificationRequest = {
        service: 'email-verification',
        credentialSubjects: ['email', 'updatedAt']
      };
      
      const response = await axios.post(
        `${config.baseUrl}${config.endpoints.issuance}`,
        verificationRequest,
        {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          timeout: config.testConfig.latency.timeout
        }
      );
      return response.data;
    };

    const warmCacheResult = await this.measureLatency(
      'Verification Latency (Warm Cache)',
      warmCacheTest,
      config.testConfig.latency.iterations
    );
    
    this.results.verificationLatency.warmCache = warmCacheResult;
  }

  // 4. Get Service Data Latency Test
  async testGetServiceDataLatency() {
    const { token } = await this.login(config.testData.sampleKeyPairs[0].did, config.testData.sampleKeyPairs[0].publicKey, config.testData.sampleKeyPairs[0].secretKey);
    const testFunction = async () => {
      const response = await axios.get(
        `${config.baseUrl}${config.endpoints.serviceData.replace('{service}', 'email-verification')}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      return response.data;
    };

    const result = await this.measureLatency(
      'Get Service Data Latency',
      testFunction,
      config.testConfig.latency.iterations
    );

    this.results.getServiceDataLatency = result;
  }


  // Health Check Test
  async testHealthCheck() {
    const testFunction = async () => {
      const response = await axios.get(
        `${config.baseUrl}${config.endpoints.health}`,
        { timeout: config.testConfig.latency.timeout }
      );
      return response.data;
    };

    const result = await this.measureLatency(
      'Health Check Latency',
      testFunction,
      50
    );
    
    return result;
  }

  async runAllTests() {
    console.log(chalk.yellow('🚀 Starting Comprehensive Latency Tests for Decast DID Web Application'));
    console.log(chalk.cyan(`Target URL: ${config.baseUrl}`));
    console.log(chalk.cyan(`Test Configuration: ${JSON.stringify(config.testConfig.latency, null, 2)}`));

    try {
      await this.testSignInLatency();
      await this.testDidResolutionLatency();
      await this.testVerificationLatency();
      await this.testGetServiceDataLatency();

      // Save results
      await this.saveResults();
      
      // Generate report
      await this.generateReport();

      console.log(chalk.green('\n🎉 All latency tests completed successfully!'));
      
    } catch (error) {
      console.error(chalk.red('\n❌ Error during testing:', error.message));
      throw error;
    }
  }

  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `latency-results-${timestamp}.json`;
    const filepath = join(this.resultsDir, filename);
    
    await fs.writeJson(filepath, {
      timestamp: new Date().toISOString(),
      targetUrl: config.baseUrl,
      testConfig: config.testConfig.latency,
      results: this.results
    }, { spaces: 2 });
    
    console.log(chalk.blue(`\n💾 Results saved to: ${filepath}`));
  }

  async generateReport() {
    const report = this.generateDetailedReport();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `latency-report-${timestamp}.md`;
    const filepath = join(this.resultsDir, filename);
    
    await fs.writeFile(filepath, report);
    
    console.log(chalk.blue(`📊 Report generated: ${filepath}`));
  }

  generateDetailedReport() {
    const report = `# Decast DID Web Application - Performance Test Report

## Test Summary
- **Target URL**: ${config.baseUrl}
- **Test Date**: ${new Date().toISOString()}
- **Test Duration**: ${new Date().toISOString()}

## Performance Results

### 1. Sign In Latency
${this.formatMetricReport('signInLatency', 'Sign In')}

### 2. DID Resolution Latency
#### Cache Hit Performance
${this.formatMetricReport('didResolutionLatency.cacheHit', 'DID Resolution (Cache Hit)')}

### 3. Verification Latency
#### Warm Cache Performance
${this.formatMetricReport('verificationLatency.warmCache', 'Verification (Warm Cache)')}

### 4. Get Service Data Latency
${this.formatMetricReport('getServiceDataLatency', 'Get Service Data')}

## Performance Thresholds Comparison

${this.generateThresholdComparison()}

## Recommendations

${this.generateRecommendations()}
`;

    return report;
  }

  formatMetricReport(metricPath, title) {
    const metric = this.getNestedValue(this.results, metricPath);
    if (!metric || !metric.stats) return 'No data available';

    const { stats } = metric;
    return `
| Metric | Value (ms) |
|--------|------------|
| Median | ${stats.median} |
| Min | ${stats.min} |
| Max | ${stats.max} |
| Mean | ${stats.mean} |
`;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  generateThresholdComparison() {
    // Implementation for threshold comparison
    return 'Threshold comparison analysis will be implemented here.';
  }

  generateRecommendations() {
    // Implementation for recommendations
    return 'Performance recommendations will be generated based on test results.';
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new LatencyTester();
  tester.runAllTests().catch(console.error);
}

export default LatencyTester;

