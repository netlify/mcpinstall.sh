import type { ClientData } from './types';
import { generateGenericConfig } from '../utils/configs';

export const ampClient: ClientData = {
  id: 'amp',
  name: 'Amp',
  label: 'Amp',
  imageUrl: '/images/mcp-clients/amp.svg',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const serverName = linkData.name?.trim();
    const serverConfig = config.mcpServers[serverName];
    
    // Format for amp.mcpServers setting
    const ampConfig = {
      "amp.mcpServers": config.mcpServers
    };
    
    const configJson = JSON.stringify(ampConfig, null, 2);
    
    return `
Amp can run in various modes, including as a standalone CLI and extensions of IDEs


### Option 1: Configuration files:

1. Open your Amp CLI configuration file:
   - macOS/Linux: \`~/.config/amp/settings.json\`
   - Windows: \`%APPDATA%\\amp\\settings.json\`
   - **+ Add MCP Server** option under Amp settings

2. Add the MCP server configuration:

\`\`\`json
${configJson}
\`\`\`

3. **Restart Amp CLI** to apply changes


### Option 2: VS Code/Cursor/Windsurf Extension:

1. **Open your editor settings**
2. **Go to Settings (JSON)** - Use Cmd/Ctrl+Shift+P and search for "Preferences: Open Settings (JSON)"
3. **Add the MCP server configuration**:

\`\`\`json
${configJson}
\`\`\`

4. **Restart your editor** to apply changes


### Option 3: One-time usage:

For one-time usage without modifying configuration files:

\`\`\`bash
amp --mcp-config '${JSON.stringify(config.mcpServers, null, 0)}' -x "What tools are available?"
\`\`\`

`;
  },
  configLocation: '~/.config/amp/settings.json or VS Code settings.json',
  docs: 'https://ampcode.com/manual#mcp',
  generateConfig: generateGenericConfig
};
