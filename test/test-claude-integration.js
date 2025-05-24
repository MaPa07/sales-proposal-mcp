#!/usr/bin/env node

// This script tests the MCP server exactly like Claude Desktop would
import { spawn } from 'child_process';
import path from 'path';

console.log('🧪 Claude Desktop Integration Test');
console.log('==================================');
console.log('This simulates how Claude Desktop interacts with your MCP server\n');

const serverPath = path.join(process.cwd(), 'server.js');

// Start the server exactly like Claude Desktop does
const server = spawn('node', [serverPath], {
  env: { ...process.env, MCP_MODE: 'stdio' },
  stdio: ['pipe', 'pipe', 'pipe']
});

let testStep = 0;
const tests = [
  'initialize',
  'list_tools',
  'call_tool'
];

console.log(`📍 Server: ${serverPath}`);
console.log(`🚀 Started server (PID: ${server.pid})\n`);

// Capture all server output
server.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log('📤 Server Response:', output);
  
  try {
    const response = JSON.parse(output);
    if (response.result && testStep < tests.length - 1) {
      setTimeout(() => runNextTest(), 1000);
    } else if (response.result && testStep === tests.length - 1) {
      console.log('\n✅ All tests passed! Your MCP server is Claude Desktop ready!');
      cleanup();
    }
  } catch (e) {
    // Might be a partial response, that's ok
  }
});

server.stderr.on('data', (data) => {
  console.log('📝 Server Log:', data.toString().trim());
});

server.on('close', (code) => {
  console.log(`\n🏁 Server exited with code: ${code}`);
  process.exit(code);
});

server.on('error', (error) => {
  console.error('💥 Server error:', error.message);
  process.exit(1);
});

// Test sequence
function runNextTest() {
  testStep++;
  
  switch (tests[testStep]) {
    case 'list_tools':
      console.log('\n🔧 Test 2: Listing available tools...');
      const listToolsMessage = JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
      }) + '\n';
      server.stdin.write(listToolsMessage);
      break;
      
    case 'call_tool':
      console.log('\n🎯 Test 3: Calling analyze_company_calls tool...');
      const callToolMessage = JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'analyze_company_calls',
          arguments: {
            domain: 'example.com',
            additionalContext: 'This is a test call'
          }
        }
      }) + '\n';
      server.stdin.write(callToolMessage);
      break;
  }
}

function cleanup() {
  setTimeout(() => {
    server.kill('SIGTERM');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }, 2000);
}

// Start with initialization
console.log('🚀 Test 1: Initializing connection...');
const initMessage = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'claude-desktop-test',
      version: '1.0.0'
    }
  }
}) + '\n';

setTimeout(() => {
  server.stdin.write(initMessage);
}, 1000);

// Timeout after 30 seconds
setTimeout(() => {
  console.log('\n⏰ Test timeout - this might indicate an issue');
  cleanup();
}, 30000); 