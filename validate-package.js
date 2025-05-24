#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

console.log('🔍 Validating Sales Proposal MCP package...\n');

const checks = [];

// Check package.json
try {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  checks.push({
    name: 'Package.json exists',
    status: '✅',
    details: `Name: ${pkg.name}, Version: ${pkg.version}`
  });
  
  if (pkg.bin && pkg.bin['sales-proposal-mcp']) {
    checks.push({
      name: 'Binary entry configured',
      status: '✅',
      details: `Command: ${pkg.bin['sales-proposal-mcp']}`
    });
  } else {
    checks.push({
      name: 'Binary entry configured',
      status: '❌',
      details: 'Missing bin entry in package.json'
    });
  }
} catch (error) {
  checks.push({
    name: 'Package.json exists',
    status: '❌',
    details: error.message
  });
}

// Check if binary file exists
if (existsSync('bin/cli.js')) {
  checks.push({
    name: 'Binary file exists',
    status: '✅',
    details: 'bin/cli.js found'
  });
} else {
  checks.push({
    name: 'Binary file exists',
    status: '❌',
    details: 'bin/cli.js not found'
  });
}

// Check if source files exist
if (existsSync('src/server.js')) {
  checks.push({
    name: 'Source files exist',
    status: '✅',
    details: 'src/server.js found'
  });
} else {
  checks.push({
    name: 'Source files exist',
    status: '❌',
    details: 'src/server.js not found'
  });
}

// Check documentation
const docs = ['README.md', 'CLAUDE_SETUP.md'];
docs.forEach(doc => {
  if (existsSync(doc)) {
    checks.push({
      name: `Documentation: ${doc}`,
      status: '✅',
      details: 'Found'
    });
  } else {
    checks.push({
      name: `Documentation: ${doc}`,
      status: '❌',
      details: 'Missing'
    });
  }
});

// Test installation simulation
try {
  console.log('📦 Running npm pack to test package...');
  const packResult = execSync('npm pack', { encoding: 'utf8' });
  const tarball = packResult.trim();
  
  checks.push({
    name: 'Package creation',
    status: '✅',
    details: `Created: ${tarball}`
  });
  
  // Clean up
  execSync(`rm -f ${tarball}`, { stdio: 'ignore' });
} catch (error) {
  checks.push({
    name: 'Package creation',
    status: '❌',
    details: error.message
  });
}

// Test the server
try {
  console.log('🧪 Testing server functionality...');
  execSync('npm test', { stdio: 'pipe' });
  checks.push({
    name: 'Server functionality',
    status: '✅',
    details: 'npm test passed'
  });
} catch (error) {
  checks.push({
    name: 'Server functionality',
    status: '❌',
    details: 'npm test failed'
  });
}

// Display results
console.log('\n📊 Validation Results:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
  console.log(`   ${check.details}\n`);
});

const failed = checks.filter(c => c.status === '❌').length;
const passed = checks.filter(c => c.status === '✅').length;

console.log(`\n📈 Summary: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 Package is ready for distribution! 🚀');
  console.log('\nNext steps:');
  console.log('1. Restart Claude Desktop');
  console.log('2. Test with Claude Desktop');
  console.log('3. Consider publishing to npm');
} else {
  console.log('\n⚠️  Please fix the failed checks before distribution.');
  process.exit(1);
} 