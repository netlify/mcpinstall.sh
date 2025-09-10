import type { ClientData } from './types';
import type { LinkData } from '../utils/types';
import { getDefaultConfig, getSelectedConfig } from '../utils/configs';

export const vscodeClient: ClientData = {
  id: 'vscode',
  name: 'VS Code',
  label: 'VS Code',
  imageUrl: '/images/mcp-clients/vscode.png',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const configWithName = generateVSCodeConfig(linkData, true);
    const configJson = JSON.stringify(config, null, 2);
    const selectedConfig = getSelectedConfig(linkData);
    const serverName = linkData.name?.trim();
    
    return `
VS Code has built-in support for MCP servers with various ways to install them.

## Installation Scope

MCP servers can be installed at two different scopes:

- **User scope** (recommended): Available across all VS Code instances and workspaces
  - Configuration file: \`~/.vscode/mcp.json\`
  - Best for servers you want to use in multiple projects

- **Workspace scope**: Available only for the current workspace/project
  - Configuration file: \`.vscode/mcp.json\` in your project root
  - Best for project-specific servers or when working in teams

Choose your preferred installation method:

### Option 1: Command Line Installation

Install directly via VS Code CLI:

\`\`\`bash
code --add-mcp '${JSON.stringify(configWithName.servers[serverName])}'
\`\`\`

This will automatically add the MCP server to your user configuration and start it.

### Option 2: Command Palette Installation

1. **Open Command Palette** (Cmd/Ctrl + Shift + P)
2. **Run command**: \`MCP: Open User Configuration\` or \`MCP: Open Workspace Folder Configuration\`
3. **Add the server configuration** to the \`mcp.json\` file:

\`\`\`json
${configJson}
\`\`\`

4. **Save the file** and VS Code will automatically start the MCP server

### Option 3: Manual Configuration

1. **Create or edit** the MCP configuration file:
   - **User scope**: \`~/.vscode/mcp.json\`
   - **Workspace scope**: \`.vscode/mcp.json\` in your project root

2. **Add the server configuration**:

\`\`\`json
${configJson}
\`\`\`

3. **Restart VS Code** or run \`MCP: Restart Servers\` from the Command Palette

---

## Verification

- **Check server status**: Run \`MCP: List Servers\` to see if your server is running
- **View server logs**: If there are issues, use \`MCP: Show Output\` to debug
- **Test tools**: In Agent mode, type a command that would use the server's tools

`;
  },
  configLocation: '~/.vscode/mcp.json or .vscode/mcp.json',
  docs: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers',
  generateConfig: generateVSCodeConfig,
  generateInstallLink: (linkData) => {
    const config = generateVSCodeConfig(linkData, true);
    const encodedConfig = encodeURIComponent(JSON.stringify(config.servers[linkData.name]));
    return {
      installLink: `vscode:mcp/install?${encodedConfig}`
    };
  }
};


export function generateVSCodeConfig(linkData: LinkData, includeName: boolean = false) {
  const serverName = linkData.name?.trim();
  const selectedConfig = getSelectedConfig(linkData);
  
  if (!selectedConfig) {
    return { servers: {} };
  }
  
  const config = {
    servers: {
      [serverName]: {} as Record<string, any>
    }
  };

  const serverConfig = config.servers[serverName];

  if (includeName) {
    serverConfig.name = serverName;
  }

  if (selectedConfig.type === 'stdio') {
    const [command, ...args] = selectedConfig.command.trim().split(' ').map((arg: string) => arg.trim()).filter((arg: string) => arg.length > 0);
    
    serverConfig.command = command;
    
    if (args.length > 0) {
      serverConfig.args = args;
    }

    if (selectedConfig.env) {
      const envVars = selectedConfig.env.split(',').map((pair: string) => pair.trim()).filter((pair: string) => pair.length > 0);
      for (const pair of envVars) {
        const [key, value] = pair.split('=').map((part: string) => part.trim());
        if (key && value) {
          serverConfig.env = serverConfig.env || {};
          serverConfig.env[key] = value;
        } else if (key) {
          serverConfig.env = serverConfig.env || {};
          serverConfig.env[key] = '${input:' + key.toLowerCase().replace(/[^a-z0-9]/g, '-') + '}';
        }
      }
    }
  }

  if (selectedConfig.type === 'http' || selectedConfig.type === 'sse') {
    serverConfig.type = selectedConfig.type;
    serverConfig.url = selectedConfig.url;
    
    // Combine auth headers and custom headers
    let headers: Record<string, string> = {};
    
    if (selectedConfig.authName && selectedConfig.authValue) {
      headers[selectedConfig.authName] = selectedConfig.authValue;
    }
    
    if (selectedConfig.headers) {
      const headerPairs = selectedConfig.headers.split(',').map((pair: string) => pair.trim()).filter((pair: string) => pair.length > 0);
      for (const pair of headerPairs) {
        const [key, value] = pair.split('=').map((part: string) => part.trim());
        if (key && value) {
          headers[key] = value;
        } else if (key) {
          headers[key] = '${input:' + key.toLowerCase().replace(/[^a-z0-9]/g, '-') + '}';
        }
      }
    }
    
    if (Object.keys(headers).length > 0) {
      serverConfig.headers = headers;
    }
  }

  return config;
}