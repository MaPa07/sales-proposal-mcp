# Testing Sales Proposal MCP with Claude Desktop

## Quick Start

Your MCP server is already installed and configured! Here's how to test it:

### 1. Restart Claude Desktop

**Important**: You must completely quit and restart Claude Desktop for the MCP server configuration to take effect.

- On macOS: `Cmd+Q` to quit, then reopen
- On Windows: Use Task Manager to ensure it's fully closed, then reopen

### 2. Test the Integration

In Claude Desktop, try these test prompts:

#### Basic Test
```
Can you analyze stripe.com using the sales proposal tool?
```

#### Comprehensive Test
```
I need to create a sales proposal for Shopify. Can you analyze their company call data and generate a comprehensive proposal with MEDDIC evaluation?
```

#### Context-Aware Test
```
Analyze abtasty.com and focus on their enterprise SaaS needs for our sales proposal.
```

### 3. What to Expect

- **Processing Time**: 60-90 seconds for analysis
- **Output Format**: 
  - Company overview and insights
  - Tailored sales proposal
  - MEDDIC evaluation framework
  - Call transcript analysis (if available)

### 4. Verification Checklist

- [ ] Claude Desktop restarted after configuration
- [ ] No error messages when asking for analysis
- [ ] Tool responds and starts processing
- [ ] Returns structured business analysis
- [ ] Processing takes reasonable time (under 2 minutes)

## Troubleshooting

### Common Issues

**"I don't see any tools available"**
- Restart Claude Desktop completely
- Check that your configuration file is valid JSON
- Verify the MCP server is installed: `which sales-proposal-mcp`

**"Tool not found" error**
- Make sure you're using the exact server name: `sales-proposal`
- Check your claude_desktop_config.json syntax

**"No response from server"**
- Verify internet connection (needs backend API access)
- Try with a well-known domain like "stripe.com" first

**Long processing times**
- This is normal! Analysis takes 60-90 seconds
- Don't interrupt the process

### Manual Server Test

You can test the server independently:

```bash
# Check installation
which sales-proposal-mcp

# Run test suite
cd /path/to/mcp-server
npm test

# Validate package
npm run validate
```

## Configuration Reference

Your current Claude Desktop config should look like:

```json
{
  "mcpServers": {
    "sales-proposal": {
      "command": "sales-proposal-mcp"
    }
  }
}
```

## Success Indicators

When working correctly, you should see:
- Claude recognizes requests for company analysis
- Tool execution starts within seconds
- Detailed business analysis returned
- Professional sales proposal generated
- MEDDIC framework applied

## Next Steps

If everything works:
1. ✅ Your MCP server is production-ready
2. ✅ Ready to share with other users
3. ✅ Consider publishing to npm registry

If issues persist:
1. Check the README.md for setup details
2. Review CLAUDE_SETUP.md for configuration
3. Run `npm run validate` for diagnostics 