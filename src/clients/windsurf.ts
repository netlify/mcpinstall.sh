import type { ClientData } from './types';
import { generateGenericConfig } from '../utils/configs';

export const windsurfClient: ClientData = {
  id: 'windsurf',
  name: 'Windsurf',
  label: 'Windsurf',
  imageUrl: '/images/mcp-clients/windsurf.png',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const configJson = JSON.stringify(config, null, 2);
    
    return `#

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
};
