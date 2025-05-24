#!/usr/bin/env node

import { SalesProposalMCPServer } from '../src/server.js';

// Start the MCP server
const server = new SalesProposalMCPServer();
server.start().catch((error) => {
  console.error('Failed to start Sales Proposal MCP Server:', error.message);
  process.exit(1);
}); 