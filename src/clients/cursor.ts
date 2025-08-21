import type { ClientData } from './types';
import { generateGenericConfig } from '../utils/configs';

export const cursorClient: ClientData = {
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

- **Project-specific**: Create \`.cursor/mcp.json\` in your project root.  
  *This will only be available while Cursor is working in this current project.*

- **Global access**: Create \`~/.cursor/mcp.json\` in your home directory.  
  *This will be available across all projects.*

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
  docs: 'https://docs.cursor.com/en/context/mcp',
  generateConfig: generateGenericConfig,
  generateInstallLink: (linkData) => {
    const config = generateGenericConfig(linkData);
    const configJson = JSON.stringify(config.mcpServers[linkData.name]);
    const base64Config = btoa(configJson);
    const encodedName = encodeURIComponent(linkData.name);
    
    return {
      installLink: `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodedName}&config=${base64Config}`
    };
  }
};
