import type { ClientData } from './types';
import { generateVSCodeConfig } from './vscode';

export const vscodeInsidersClient: ClientData = {
  id: 'vscode-insiders',
  name: 'VS Code Insiders',
  label: 'VS Code Insiders',
  imageUrl: '/images/mcp-clients/vscode-insiders.png',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const configJson = JSON.stringify(config, null, 2);
    
    // Determine installation method based on MCP type
    const isLocalServer = linkData.type === 'stdio';
    const installationMethod = isLocalServer ? 'workspace' : 'user';
    
    return `
Follow these steps to install the **${linkData.name}** MCP server in VS Code Insiders:

## Prerequisites

- VS Code Insiders version 1.102 or later
- GitHub Copilot extension installed and activated

## Configuration

VS Code Insiders has built-in support for MCP servers. Choose your preferred installation method:

### Option 1: Command Line Installation (Recommended)

Install directly via VS Code Insiders CLI:

\`\`\`bash
code-insiders --add-mcp '${JSON.stringify(config.servers[linkData.name])}'
\`\`\`

This will automatically add the MCP server to your user configuration and start it.

### Option 2: Command Palette Installation

1. **Open Command Palette** (Cmd/Ctrl + Shift + P)
2. **Run command**: \`MCP: Open ${installationMethod === 'user' ? 'User' : 'Workspace Folder'} Configuration\`
3. **Add the server configuration** to the \`mcp.json\` file:

\`\`\`json
${configJson}
\`\`\`

4. **Save the file** and VS Code Insiders will automatically start the MCP server

### Option 3: Manual Configuration

1. **Create or edit** the MCP configuration file:
   - **${installationMethod === 'user' ? 'User scope' : 'Workspace scope'}**: ${installationMethod === 'user' ? '`~/.vscode-insiders/mcp.json`' : '`.vscode/mcp.json` in your project root'}

2. **Add the server configuration**:

\`\`\`json
${configJson}
\`\`\`

3. **Restart VS Code Insiders** or run \`MCP: Restart Servers\` from the Command Palette

## Using the MCP Server

1. **Open Chat view** (Ctrl/Cmd + Alt + I)
2. **Select Agent mode** from the dropdown
3. **Click the Tools button** to see available MCP tools
4. **Enable the tools** you want to use from ${linkData.name}

${linkData.type === 'stdio' && linkData.env ? `
## Environment Variables

This server requires environment variables. You may need to update the configuration with actual values:

\`\`\`json
{
  "servers": {
    "${linkData.name}": {
      "command": "${linkData.command.split(' ')[0]}",
      ${linkData.command.split(' ').slice(1).length > 0 ? `"args": ${JSON.stringify(linkData.command.split(' ').slice(1))},` : ''}
      "env": {
        // Replace placeholder values with actual credentials
        ${linkData.env.split(',').map(pair => {
          const [key] = pair.split('=').map(part => part.trim());
          return `"${key}": "your-${key.toLowerCase().replace(/[^a-z0-9]/g, '-')}-here"`;
        }).join(',\n        ')}
      }
    }
  }
}
\`\`\`
` : ''}

## Verification

- **Check server status**: Run \`MCP: List Servers\` to see if your server is running
- **View server logs**: If there are issues, use \`MCP: Show Output\` to debug
- **Test tools**: In Agent mode, type a command that would use the server's tools

> **Note**: MCP servers can run arbitrary code. Only install servers from trusted sources and review the configuration before starting.`;
  },
  configLocation: '~/.vscode-insiders/mcp.json or .vscode/mcp.json',
  docs: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers',
  generateConfig: generateVSCodeConfig,
  generateInstallLink: (linkData) => {
    const config = generateVSCodeConfig(linkData);
    const encodedConfig = encodeURIComponent(JSON.stringify(config.servers[linkData.name]));
    return {
      installLink: `vscode-insiders:mcp/install?${encodedConfig}`
    };
  }
};
