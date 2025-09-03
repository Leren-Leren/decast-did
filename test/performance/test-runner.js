#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import dotenv from 'dotenv';
import LatencyTester from './latency-tests.js';
import { config } from './config.js';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('decast-latency-tests')
  .description('Latency testing framework for Decast DID Web Application')
  .version('1.0.0');

program
  .option('-u, --url <url>', 'Target URL for testing', config.baseUrl)
  .option('-i, --iterations <number>', 'Number of iterations for latency tests', config.testConfig.latency.iterations.toString())
  .option('--no-progress', 'Disable progress bars')
  .option('--save-results', 'Save detailed results to files', true)
  .option('--generate-report', 'Generate detailed reports', true);

program.parse();

const options = program.opts();

// Update config with command line options
config.baseUrl = options.url;
config.testConfig.latency.iterations = parseInt(options.iterations);

async function runLatencyTests() {
  console.log(chalk.yellow('\n🚀 Starting Latency Tests...'));
  const tester = new LatencyTester();
  await tester.runAllTests();
}

async function runAllTests() {
  console.log(chalk.yellow('🚀 Starting Latency Tests'));
  console.log(chalk.cyan(`Target URL: ${config.baseUrl}`));
  console.log(chalk.cyan(`Test Configuration:`));
  console.log(chalk.cyan(`  - Latency iterations: ${config.testConfig.latency.iterations}`));

  try {
    await runLatencyTests();
    console.log(chalk.green('\n🎉 All latency tests completed successfully!'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error during testing:', error.message));
    process.exit(1);
  }
}

async function main() {
  try {
    await runAllTests();
  } catch (error) {
    console.error(chalk.red('❌ Test execution failed:', error.message));
    process.exit(1);
  }
}

// Run the main function
main();

