#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';

console.log('🔍 Testing MCP server connection...');

const cliPath = path.join(process.cwd(), 'bin', 'cli.js');
console.log(`📍 CLI path: ${cliPath}`);

// Test if the server can start
const server = spawn('node', [cliPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';
let receivedValidResponse = false;

server.stdout.on('data', (data) => {
  output += data.toString();
  const response = data.toString().trim();
  console.log('📤 STDOUT:', response);
  
  // Check if we got a valid initialize response
  if (response.includes('"result"') && response.includes('"protocolVersion"') && response.includes('"serverInfo"')) {
    receivedValidResponse = true;
    console.log('✅ Server responded correctly to initialize message');
  }
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('📤 STDERR:', data.toString().trim());
});

server.on('close', (code) => {
  console.log(`🏁 Server process exited with code: ${code}`);
  
  if (receivedValidResponse) {
    console.log('✅ Test completed successfully - Server is working correctly!');
  } else if (code === 0) {
    console.log('✅ Server exited cleanly but no response captured');
  } else {
    console.log('❌ Server failed to start or respond correctly');
    if (errorOutput) {
      console.log('Error output:', errorOutput);
    }
  }
});

server.on('error', (error) => {
  console.log('💥 Error starting server:', error.message);
});

// Send a test message after 2 seconds
setTimeout(() => {
  console.log('📨 Sending test message...');
  server.stdin.write('{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}\n');
}, 2000);

// Clean up after 5 seconds
setTimeout(() => {
  console.log('🛑 Stopping test...');
  server.kill('SIGTERM');
}, 5000); 