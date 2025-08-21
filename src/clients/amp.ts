import type { ClientData } from './types';
import { generateGenericConfig } from '../utils/configs';

export const ampClient: ClientData = {
  id: 'amp',
  name: 'Amp',
  label: 'Amp',
  imageUrl: '/images/mcp-clients/amp.svg',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const configJson = JSON.stringify(config, null, 2);
    
    return `#

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
};
