import type { LinkData } from './types';
import { generateGenericConfig } from './configs';

export interface ClientData {
  id: string;
  name: string;
  label: string;
  imageUrl: string;
  instructions: (generateConfig: (linkData: LinkData) => Record<string, any>, linkData: LinkData) => string;
  configLocation: string;
  docs?: string;
  generateConfig: (linkData: LinkData) => Record<string, any>;
}

export const clientsData: Record<string, ClientData> = {
  'cursor': {
    id: 'cursor',
    name: 'Cursor',
    label: 'Cursor',
    imageUrl: '/images/mcp-clients/cursor.png',
    instructions: (generateConfig, linkData) => {
      const mcpConfig = generateConfig(linkData);
      const configJson = JSON.stringify(mcpConfig, null, 2);
      
      return `
## Choose Configuration Location

Select one of the following options based on where you want this MCP to be available:

- **Project-specific**: Create \`.cursor/mcp.json\` in your project root  
  *This will only be available while Cursor is working in this current project*

- **Global access**: Create \`~/.cursor/mcp.json\` in your home directory  
  *This will be available across all projects*

---

  ## Add Server Configuration

Add the following configuration to your \`mcp.json\` file:

\`\`\`json
${configJson}
\`\`\`


**Save the file** and you're done! Cursor will automatically detect and load the configuration.

`;
    },
    configLocation: '.cursor/mcp.json (project) or ~/.cursor/mcp.json (global)',
    docs: 'https://docs.cursor.com/en/context/mcp#installing-mcp-servers',
    generateConfig: generateGenericConfig
  },


  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code',
    label: 'Claude Code',
    imageUrl: '/images/mcp-clients/claude.png',
    instructions: (generateConfig, linkData) => {
      const config = generateConfig(linkData);
      const configJson = JSON.stringify(config, null, 2);
      
      return `# Installation Instructions

Follow these steps to install the **${linkData.name}** MCP server in Claude Code:

## 🚀 Open Claude Code Settings

1. **Launch Claude Code**
2. **Click the gear icon** to access Settings
3. **Navigate to** Extensions → MCP Servers

## ➕ Add New Server

1. **Click "Add Server"**
2. **Paste the following configuration**:

\`\`\`json
${configJson}
\`\`\`

## ✅ Complete Installation

**Save the configuration** and **restart Claude Code** to activate the MCP server.

> **📝 Note**: A restart is required for Claude Code to recognize the new MCP server configuration.`;
    },
    configLocation: '~/.claude-code/mcp-servers.json',
    docs: 'https://docs.anthropic.com/en/docs/claude-code/mcp#installing-mcp-servers',
    generateConfig: generateGenericConfig
  },


  'vscode': {
    id: 'vscode',
    name: 'VS Code',
    label: 'VS Code',
    imageUrl: '/images/mcp-clients/vscode.png',
    instructions: (generateConfig, linkData) => {
      const config = generateConfig(linkData);
      const configJson = JSON.stringify(config, null, 2);
      
      return `# Installation Instructions

Follow these steps to install the **${linkData.name}** MCP server in VS Code:

## 🔌 Install MCP Extension

**Install the MCP extension** from the VS Code marketplace to enable MCP server support.

## ⚙️ Configure Server

1. **Open VS Code Settings** (Cmd/Ctrl + ,)
2. **Search for "MCP"** in the settings search bar
3. **Find "MCP: Server Configurations"**
4. **Add the server configuration**:

\`\`\`json
${configJson}
\`\`\`

## ✅ Activate Changes

**Reload the VS Code window** to activate the new MCP server.

> **💡 Tip**: You can reload the window with Cmd/Ctrl + Shift + P → "Developer: Reload Window"`;
    },
    configLocation: 'VS Code Settings → Extensions → MCP',
    docs: 'https://marketplace.visualstudio.com/items?itemName=mcp.mcp-client',
    generateConfig: generateGenericConfig
  },
  'vscode-insiders': {
    id: 'vscode-insiders',
    name: 'VS Code Insiders',
    label: 'VS Code Insiders',
    imageUrl: '/images/mcp-clients/vscode-insiders.png',
    instructions: (generateConfig, linkData) => {
      const config = generateConfig(linkData);
      const configJson = JSON.stringify(config, null, 2);
      
      return `# Installation Instructions

Follow these steps to install the **${linkData.name}** MCP server in VS Code Insiders:

## 🔌 Install MCP Extension

**Install the MCP extension** from the VS Code marketplace to enable MCP server support.

## ⚙️ Configure Server

1. **Open VS Code Insiders Settings** (Cmd/Ctrl + ,)
2. **Search for "MCP"** in the settings search bar
3. **Find "MCP: Server Configurations"**
4. **Add the server configuration**:

\`\`\`json
${configJson}
\`\`\`

## ✅ Activate Changes

**Reload the VS Code Insiders window** to activate the new MCP server.

> **💡 Tip**: You can reload the window with Cmd/Ctrl + Shift + P → "Developer: Reload Window"`;
    },
    configLocation: 'VS Code Insiders Settings → Extensions → MCP',
    docs: 'https://marketplace.visualstudio.com/items?itemName=mcp.mcp-client',
    generateConfig: generateGenericConfig
  },
  'amp': {
    id: 'amp',
    name: 'Amp',
    label: 'Amp',
    imageUrl: '/images/mcp-clients/amp.svg',
    instructions: (generateConfig, linkData) => {
      const config = generateConfig(linkData);
      const configJson = JSON.stringify(config, null, 2);
      
      return `## Installation Instructions

1. **Open Amp terminal application**
2. **Navigate to your Amp configuration directory**
3. **Edit the MCP servers configuration file**
4. **Add the server configuration**:

\`\`\`json
${configJson}
\`\`\`

5. **Restart Amp** to apply changes`;
    },
    configLocation: '~/.config/amp/mcp-servers.json',
    docs: 'https://amp.dev/mcp',
    generateConfig: generateGenericConfig
  },
  'codex': {
    id: 'codex',
    name: 'Codex CLI',
    label: 'Codex CLI',
    imageUrl: '/images/mcp-clients/codex.svg',
    instructions: (generateConfig, linkData) => {
      const config = generateConfig(linkData);
      const configJson = JSON.stringify(config, null, 2);
      
      return `## Installation Instructions

1. **Install Codex CLI** if not already installed
2. **Open your terminal**
3. **Edit the Codex configuration file**
4. **Add the MCP server configuration**:

\`\`\`json
${configJson}
\`\`\`

5. **Run \`codex --reload\`** to apply changes`;
    },
    configLocation: '~/.config/codex/config.toml',
    docs: 'https://github.com/openai/codex/blob/main/codex-rs/config.md#mcp_servers',
    generateConfig: generateGenericConfig
  },
  'windsurf': {
    id: 'windsurf',
    name: 'Windsurf',
    label: 'Windsurf',
    imageUrl: '/images/mcp-clients/windsurf.png',
    instructions: (generateConfig, linkData) => {
      const config = generateConfig(linkData);
      const configJson = JSON.stringify(config, null, 2);
      
      return `## Installation Instructions

1. **Open Windsurf IDE**
2. **Go to Preferences** → MCP Servers
3. **Click "Add New Server"**
4. **Enter the server details**:

\`\`\`json
${configJson}
\`\`\`

5. **Save configuration**
6. **Restart Windsurf** to connect`;
    },
    configLocation: 'Windsurf → Preferences → MCP Servers',
    docs: 'https://windsurf.dev/docs/mcp',
    generateConfig: generateGenericConfig
  }
};

// Helper function to get client data by ID
export function getClientById(clientId: string): ClientData | undefined {
  return clientsData[clientId];
}

// Helper function to get all clients as an array
export function getAllClients(): ClientData[] {
  return Object.values(clientsData);
}

// Helper function to get clients for button display (simplified version)
export function getClientsForButtons() {
  return getAllClients().map(client => ({
    id: client.id,
    label: client.label,
    imageUrl: client.imageUrl,
    docs: client.docs
  }));
}
