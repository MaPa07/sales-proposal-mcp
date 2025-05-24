import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import { z } from 'zod';

export class SalesProposalMCPServer {
  constructor() {
    this.server = new Server({
      name: 'sales-proposal-agent',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });

    this.backendUrl = process.env.BACKEND_URL || 
      'https://us-central1-sales-proposal-assistant.cloudfunctions.net/analyzeCompanyCalls';
    
    // Check for access token
    this.accessToken = process.env.SALES_PROPOSAL_ACCESS_TOKEN;
    if (!this.accessToken) {
      console.error('WARNING: SALES_PROPOSAL_ACCESS_TOKEN environment variable is not set. The server will not function without a valid access token.');
    }

    this.setupTools();
  }

  setupTools() {
    // Define the analyze_company_calls tool
    const analyzeCompanyCallsTool = {
      name: 'analyze_company_calls',
      description: 'Analyze company call transcripts and generate comprehensive sales proposal with MEDDIC evaluation. Takes 60-90 seconds to process.',
      inputSchema: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Company domain like abtasty.com (required)'
          },
          additionalContext: {
            type: 'string',
            description: 'Optional context like "focus on enterprise features"'
          }
        },
        required: ['domain']
      }
    };

    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [analyzeCompanyCallsTool]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const requestId = Math.random().toString(36).substr(2, 9);
      
      if (request.params.name !== 'analyze_company_calls') {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      // Validate access token
      if (!this.accessToken) {
        return {
          content: [{
            type: 'text',
            text: 'Error: Access token not configured. Please set the SALES_PROPOSAL_ACCESS_TOKEN environment variable in your Claude Desktop configuration.'
          }],
          isError: true
        };
      }

      const { domain, additionalContext } = request.params.arguments;

      try {
        // Call the Firebase Function
        const startTime = Date.now();
        const response = await fetch(this.backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
          },
          body: JSON.stringify({
            domain,
            additionalContext: additionalContext || ''
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          return {
            content: [{
              type: 'text',
              text: `Error: Failed to analyze company calls. Status: ${response.status}. ${errorText}`
            }],
            isError: true
          };
        }

        const result = await response.json();

        // Format the response properly
        let formattedResponse = '';
        
        if (result.businessSummary) {
          const summary = typeof result.businessSummary === 'object' 
            ? JSON.stringify(result.businessSummary, null, 2)
            : String(result.businessSummary);
          formattedResponse += '## Business Summary\n\n' + summary + '\n\n';
        }
        
        if (result.proposal) {
          const proposal = typeof result.proposal === 'object' 
            ? JSON.stringify(result.proposal, null, 2)
            : String(result.proposal);
          formattedResponse += '## Sales Proposal\n\n' + proposal + '\n\n';
        }
        
        if (result.meddicEvaluation) {
          const meddic = typeof result.meddicEvaluation === 'object' 
            ? JSON.stringify(result.meddicEvaluation, null, 2)
            : String(result.meddicEvaluation);
          formattedResponse += '## MEDDIC Evaluation\n\n' + meddic + '\n\n';
        }
        
        if (result.additionalInsights) {
          const insights = typeof result.additionalInsights === 'object' 
            ? JSON.stringify(result.additionalInsights, null, 2)
            : String(result.additionalInsights);
          formattedResponse += '## Additional Insights\n\n' + insights;
        }

        return {
          content: [{
            type: 'text',
            text: formattedResponse.trim()
          }]
        };

      } catch (error) {
        let errorMessage = 'An unexpected error occurred while analyzing company calls.';
        
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
          errorMessage = 'The analysis request timed out. This process typically takes 60-90 seconds. Please try again.';
        } else if (error.message) {
          errorMessage = `Error: ${error.message}`;
        }
        
        return {
          content: [{
            type: 'text',
            text: errorMessage
          }],
          isError: true
        };
      }
    });
  }

  async start() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      // Keep the process alive
      process.stdin.resume();
      
    } catch (error) {
      throw new Error(`Failed to start MCP server: ${error.message}`);
    }
  }
} 