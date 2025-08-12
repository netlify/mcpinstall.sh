export interface ClientData {
  id: string;
  name: string;
  label: string;
  imageUrl: string;
  instructions: string[];
  configLocation: string;
  docs?: string;
}

export const clientsData: Record<string, ClientData> = {
  'cursor': {
    id: 'cursor',
    name: 'Cursor',
    label: 'Cursor',
    imageUrl: '/images/mcp-clients/cursor.png',
    instructions: [
      'Open Cursor IDE',
      'Go to Cursor Settings (Cmd/Ctrl + ,)',
      'Navigate to "Features" → "Model Context Protocol"',
      'Add a new MCP server configuration',
      'Paste the configuration below',
      'Restart Cursor to apply changes'
    ],
    configLocation: '~/.cursor/mcp_servers.json',
    docs: 'https://docs.cursor.com/mcp'
  },
  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code',
    label: 'Claude Code',
    imageUrl: '/images/mcp-clients/claude.png',
    instructions: [
      'Open Claude Code',
      'Access Settings via the gear icon',
      'Navigate to "Extensions" → "MCP Servers"',
      'Click "Add Server"',
      'Paste the server configuration',
      'Save and restart Claude Code'
    ],
    configLocation: '~/.claude-code/mcp-servers.json',
    docs: 'https://docs.anthropic.com/claude-code/mcp'
  },
  'vscode': {
    id: 'vscode',
    name: 'VS Code',
    label: 'VS Code',
    imageUrl: '/images/mcp-clients/vscode.png',
    instructions: [
      'Install the MCP extension from the VS Code marketplace',
      'Open VS Code Settings (Cmd/Ctrl + ,)',
      'Search for "MCP" in settings',
      'Find "MCP: Server Configurations"',
      'Add the server configuration below',
      'Reload VS Code window'
    ],
    configLocation: 'VS Code Settings → Extensions → MCP',
    docs: 'https://marketplace.visualstudio.com/items?itemName=mcp.mcp-client'
  },
  'vscode-insiders': {
    id: 'vscode-insiders',
    name: 'VS Code Insiders',
    label: 'VS Code Insiders',
    imageUrl: '/images/mcp-clients/vscode-insiders.png',
    instructions: [
      'Install the MCP extension from the VS Code marketplace',
      'Open VS Code Insiders Settings (Cmd/Ctrl + ,)',
      'Search for "MCP" in settings',
      'Find "MCP: Server Configurations"',
      'Add the server configuration below',
      'Reload VS Code Insiders window'
    ],
    configLocation: 'VS Code Insiders Settings → Extensions → MCP',
    docs: 'https://marketplace.visualstudio.com/items?itemName=mcp.mcp-client'
  },
  'amp': {
    id: 'amp',
    name: 'Amp',
    label: 'Amp',
    imageUrl: '/images/mcp-clients/amp.svg',
    instructions: [
      'Open Amp terminal application',
      'Navigate to your Amp configuration directory',
      'Edit the MCP servers configuration file',
      'Add the server configuration below',
      'Restart Amp to apply changes'
    ],
    configLocation: '~/.config/amp/mcp-servers.json',
    docs: 'https://amp.dev/mcp'
  },
  'codex': {
    id: 'codex',
    name: 'Codex CLI',
    label: 'Codex CLI',
    imageUrl: '/images/mcp-clients/codex.svg',
    instructions: [
      'Install Codex CLI if not already installed',
      'Open your terminal',
      'Edit the Codex configuration file',
      'Add the MCP server configuration',
      'Run codex --reload to apply changes'
    ],
    configLocation: '~/.config/codex/config.toml',
    docs: 'https://github.com/openai/codex/blob/main/codex-rs/config.md#mcp_servers'
  },
  'windsurf': {
    id: 'windsurf',
    name: 'Windsurf',
    label: 'Windsurf',
    imageUrl: '/images/mcp-clients/windsurf.png',
    instructions: [
      'Open Windsurf IDE',
      'Go to Preferences → MCP Servers',
      'Click "Add New Server"',
      'Enter the server details below',
      'Save configuration',
      'Restart Windsurf to connect'
    ],
    configLocation: 'Windsurf → Preferences → MCP Servers',
    docs: 'https://windsurf.dev/docs/mcp'
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
