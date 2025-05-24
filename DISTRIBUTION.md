# Sales Proposal MCP Server - Distribution Guide

## For New Users

When sharing this MCP server with someone new, they need to follow these simple steps:

### Prerequisites

- Node.js 18 or higher installed
- Claude Desktop application
- Internet connection

### Installation Steps

1. **Install the MCP Server**
   ```bash
   npm install -g @badlieutenant/sales-proposal-mcp
   ```

2. **Configure Claude Desktop**
   
   Edit the Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

   Add this configuration:
   ```json
   {
     "mcpServers": {
       "sales-proposal": {
         "command": "sales-proposal-mcp"
       }
     }
   }
   ```

3. **Restart Claude Desktop**
   
   Completely quit and reopen Claude Desktop.

4. **Test the Installation**
   
   In Claude Desktop, try: 
   > "Analyze stripe.com and create a sales proposal"

### What Users Get

- **Company Analysis**: Deep analysis of company calls and transcripts
- **Sales Proposals**: AI-generated proposals based on call data
- **MEDDIC Evaluation**: Structured sales methodology assessment
- **60-90 second processing time** for comprehensive analysis

## For Developers Publishing to npm

### Pre-publication Checklist

- [ ] Update version in `package.json`
- [ ] Test locally with `npm install -g .`
- [ ] Verify Claude Desktop integration
- [ ] Run `npm test` successfully
- [ ] Update README.md if needed
- [ ] Update CLAUDE_SETUP.md if needed

### Publishing Commands

```bash
# Login to npm (first time only)
npm login

# Publish to npm
npm publish

# For scoped packages
npm publish --access public
```

### Version Management

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### Testing Distribution

Before publishing, always test the distribution:

```bash
# Pack the package locally
npm pack

# Install from the packed tarball
npm install -g ./badlieutenant-sales-proposal-mcp-1.0.0.tgz

# Test with Claude Desktop
# Then clean up
npm uninstall -g @badlieutenant/sales-proposal-mcp
```

## Support & Troubleshooting

Users can:
1. Check the README.md for basic usage
2. Check CLAUDE_SETUP.md for detailed setup
3. Run `npm test` to verify installation
4. File issues on the GitHub repository

## Distribution Methods

### 1. npm Registry (Recommended)
- Simple installation: `npm install -g @badlieutenant/sales-proposal-mcp`
- Automatic updates available
- Professional distribution

### 2. GitHub Releases
- Direct install: `npm install -g https://github.com/username/repo/tarball/main`
- Good for private/beta testing

### 3. Local Package
- For development: `npm install -g ./path/to/package`
- Testing before publication 