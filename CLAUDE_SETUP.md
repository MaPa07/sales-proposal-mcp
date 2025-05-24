# Sales Proposal Agent MCP Server - Claude Desktop Setup

This guide explains how to install and configure the Sales Proposal Agent MCP server for use with Claude Desktop.

## Quick Installation

### Step 1: Install the MCP Server

```bash
npm install -g @badlieutenant/sales-proposal-mcp
```

This installs the server globally and makes the `sales-proposal-mcp` command available system-wide.

### Step 2: Configure Claude Desktop

Edit your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the server configuration:

```json
{
  "mcpServers": {
    "sales-proposal": {
      "command": "sales-proposal-mcp"
    }
  }
}
```

### Step 3: Restart Claude Desktop

Completely quit and reopen Claude Desktop for the changes to take effect.

## Complete Configuration Example

If you have other MCP servers configured, your file might look like this:

```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "node",
      "args": ["/Users/maxpaulus/Documents/GitHub/google-calendar-mcp/build/index.js"]
    },
    "sales-proposal": {
      "command": "sales-proposal-mcp"
    }
  }
}
```

## Usage in Claude Desktop

Once configured, you can ask Claude to analyze company calls like this:

> "Analyze Stripe's call data and create a comprehensive sales proposal"

Claude will:
1. Recognize this as a sales analysis request
2. Extract the domain: "stripe.com"
3. Call the MCP server
4. Wait 60-90 seconds for processing
5. Return a formatted business summary, proposal, and MEDDIC evaluation

## Available Tool

### `analyze_company_calls`

**Description**: Analyze company call transcripts and generate comprehensive sales proposal with MEDDIC evaluation. Takes 60-90 seconds to process.

**Parameters**:
- `domain` (required): Company domain like "abtasty.com"
- `additionalContext` (optional): Context like "focus on enterprise features"

## Testing the Installation

You can test the server manually:

```bash
# Check if the command is available
which sales-proposal-mcp

# Test the server (it should start and wait for JSON-RPC input)
sales-proposal-mcp
```

## Troubleshooting

### Common Issues

1. **"Command not found" error**: 
   - Make sure you installed globally with `-g` flag
   - Check that npm global bin directory is in your PATH
   - Run `npm list -g @badlieutenant/sales-proposal-mcp` to verify installation

2. **"Unknown tool" error in Claude**: 
   - Restart Claude Desktop after updating the configuration
   - Check that the configuration file syntax is valid JSON

3. **No response from tool**: 
   - Check that the Firebase Function backend is running
   - Verify your internet connection

### Configuration Backup

Always backup your Claude Desktop configuration before making changes:

```bash
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json.backup
```

### Updating the Server

To update to the latest version:

```bash
npm update -g @badlieutenant/sales-proposal-mcp
```

Then restart Claude Desktop.

### Uninstalling

To remove the server:

```bash
npm uninstall -g @badlieutenant/sales-proposal-mcp
```

Remove the server entry from your Claude Desktop configuration and restart Claude.

## Environment Configuration

The server connects to the production backend by default. You can customize this with environment variables:

```bash
export BACKEND_URL=https://your-custom-backend.com/analyzeCompanyCalls
```

Then restart Claude Desktop for the changes to take effect.

## Requirements

- Node.js 18 or higher
- npm (comes with Node.js)
- Claude Desktop application
- Internet connection for backend API calls

Your Sales Proposal Agent MCP server is now ready to use! 🎉 