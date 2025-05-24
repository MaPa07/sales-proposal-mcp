# Sales Proposal MCP Server

An MCP (Model Context Protocol) server that integrates with Claude Desktop to analyze company call transcripts and generate comprehensive sales proposals with MEDDIC evaluations.

This standalone MCP server connects to the [Bad Lieutenant backend service](https://github.com/MaPa07/bad_lieutenant) to provide sales intelligence capabilities directly within Claude Desktop.

## Installation

### Install from Source (Recommended)

Clone the repository and install the MCP server globally:

```bash
git clone https://github.com/MaPa07/sales-proposal-mcp.git
cd sales-proposal-mcp
npm install -g .
```

### NPM Package (Coming Soon)

Once published to npm, you can install directly:

```bash
npm install -g @badlieutenant/sales-proposal-mcp
```

## Claude Desktop Configuration

After installation, add the server to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sales-proposal": {
      "command": "sales-proposal-mcp",
      "env": {
        "SALES_PROPOSAL_ACCESS_TOKEN": "your-access-token-here"
      }
    }
  }
}
```

**Important**: Replace `"your-access-token-here"` with the actual access token shared via 1Password. The server will not function without a valid access token.

## Usage

Once configured, restart Claude Desktop and you can ask Claude to analyze company calls:

- "Analyze Stripe's call data and create a comprehensive sales proposal"
- "Generate a sales proposal for abtasty.com focusing on enterprise features"  
- "Analyze monday.com and provide MEDDIC evaluation"

The analysis typically takes 60-90 seconds to complete.

## Features

- **Business Analysis**: Comprehensive company analysis from call transcripts
- **Sales Proposals**: AI-generated proposals tailored to company needs
- **MEDDIC Evaluation**: Structured sales qualification framework
- **Additional Insights**: Strategic recommendations and next steps

## Tool Schema

The server exposes one tool:

```javascript
{
  name: 'analyze_company_calls',
  description: 'Analyze company call transcripts and generate comprehensive sales proposal with MEDDIC evaluation',
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
}
```

## Configuration

### Access Token (Required)

This MCP server requires an access token to control usage and costs. The token should be:
- Shared via 1Password with your team
- Added to your Claude Desktop configuration as shown above
- Kept secure and not committed to version control

### Backend URL

The server connects to the [Bad Lieutenant Firebase backend](https://github.com/MaPa07/bad_lieutenant). You can customize the backend URL with an environment variable:

```bash
export BACKEND_URL=https://your-custom-backend.com/analyzeCompanyCalls
```

## Development

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/MaPa07/sales-proposal-mcp.git
cd sales-proposal-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Test the server:
```bash
npm test
```

4. Run locally:
```bash
npm start
```

### Project Structure

```
├── bin/
│   └── cli.js          # CLI entry point
├── src/
│   └── server.js       # Main server logic
├── test/
│   └── test-connection.js
├── package.json
└── README.md
```

## Requirements

- Node.js 18 or higher
- Access to company call data via the [Bad Lieutenant backend service](https://github.com/MaPa07/bad_lieutenant)

## Error Handling

The server gracefully handles:
- Domain not found errors
- Backend service timeouts
- Network connectivity issues
- Invalid domain formats

All errors include descriptive messages to help users understand what went wrong.

## Related Repositories

- [Bad Lieutenant Backend](https://github.com/MaPa07/bad_lieutenant) - The Firebase Functions backend that powers this MCP server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/MaPa07/sales-proposal-mcp/issues). 