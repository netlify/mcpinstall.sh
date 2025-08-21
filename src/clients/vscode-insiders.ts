import type { ClientData } from './types';
import { generateGenericConfig } from '../utils/configs';

export const vscodeInsidersClient: ClientData = {
  id: 'vscode-insiders',
  name: 'VS Code Insiders',
  label: 'VS Code Insiders',
  imageUrl: '/images/mcp-clients/vscode-insiders.png',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const configJson = JSON.stringify(config, null, 2);
    
    return `

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
};
