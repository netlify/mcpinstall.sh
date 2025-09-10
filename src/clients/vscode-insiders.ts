import type { ClientData } from './types';
import { generateVSCodeConfig } from './vscode';
import { getSelectedConfig } from '../utils/configs';
import type { LinkData } from '../utils/types';

export const vscodeInsidersClient: ClientData = {
  id: 'vscode-insiders',
  name: 'VS Code Insiders',
  label: 'VS Code Insiders',
  imageUrl: '/images/mcp-clients/vscode-insiders.png',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const configWithName = generateVSCodeConfig(linkData, true);
    const configJson = JSON.stringify(config, null, 2);
    const selectedConfig = getSelectedConfig(linkData);
    const serverName = linkData.name?.trim();
    
    return `
VS Code Insiders has built-in support for MCP servers with various ways to install them.

## Installation Scope

MCP servers can be installed at two different scopes:

- **User scope**: Available across all VS Code Insiders instances and workspaces
  - Configuration file: \`~/.vscode-insiders/mcp.json\`
  - Best for servers you want to use in multiple projects

- **Workspace scope**: Available only for the current workspace/project
  - Configuration file: \`.vscode/mcp.json\` in your project root
  - Best for project-specific servers or when working in teams

Choose your preferred installation method:

### Option 1: Command Line Installation

Install directly via VS Code Insiders CLI:

\`\`\`bash
code-insiders --add-mcp '${JSON.stringify(configWithName.servers[serverName])}'
\`\`\`

This will automatically add the MCP server to your user configuration and start it.

### Option 2: Command Palette Installation

1. **Open Command Palette** (Cmd/Ctrl + Shift + P)
2. **Run command**: \`MCP: Open User Configuration\` or \`MCP: Open Workspace Folder Configuration\`
3. **Add the server configuration** to the \`mcp.json\` file:

\`\`\`json
${configJson}
\`\`\`

4. **Save the file** and VS Code Insiders will automatically start the MCP server

### Option 3: Manual Configuration

1. **Create or edit** the MCP configuration file:
   - **User scope**: \`~/.vscode-insiders/mcp.json\`
   - **Workspace scope**: \`.vscode/mcp.json\` in your project root

2. **Add the server configuration**:

\`\`\`json
${configJson}
\`\`\`

3. **Restart VS Code Insiders** or run \`MCP: Restart Servers\` from the Command Palette

---

## Verification

- **Check server status**: Run \`MCP: List Servers\` to see if your server is running
- **View server logs**: If there are issues, use \`MCP: Show Output\` to debug
- **Test tools**: In Agent mode, type a command that would use the server's tools

`;
  },
  configLocation: '~/.vscode-insiders/mcp.json or .vscode/mcp.json',
  docs: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers',
  generateConfig: generateVSCodeConfig,
  generateInstallLink: (linkData) => {
    const config = generateVSCodeConfig(linkData, true);
    const encodedConfig = encodeURIComponent(JSON.stringify(config.servers[linkData.name]));
    return {
      installLink: `vscode-insiders:mcp/install?${encodedConfig}`
    };
  }
};
