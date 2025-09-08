import type { ClientData } from './types';
import { generateGenericConfig, type GenericConfigOptions } from '../utils/configs';
import type { LinkData } from '../utils/types';
import { getDefaultConfig } from '../utils/configs';

function generateWindsurfConfig(linkData: LinkData) {
  const options: GenericConfigOptions = { omitHeaders: true };
  const config = generateGenericConfig(linkData, options);
  
  // Convert 'url' to 'serverUrl' for Windsurf's specific naming
  const serverName = linkData.name?.trim();
  const serverConfig = config.mcpServers[serverName];
  const defaultConfig = getDefaultConfig(linkData);
  
  if (defaultConfig && (defaultConfig.type === 'http' || defaultConfig.type === 'sse')) {
    if (serverConfig['url']) {
      serverConfig['serverUrl'] = serverConfig['url'];
      delete serverConfig['url'];
    }
  }
  
  return config;
}

export const windsurfClient: ClientData = {
  id: 'windsurf',
  name: 'Windsurf',
  label: 'Windsurf',
  imageUrl: '/images/mcp-clients/windsurf.png',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const configJson = JSON.stringify(config, null, 2);
    
    return `
1. **Open or create** \`~/.codeium/windsurf/mcp_config.json\`
2. **Add the server configuration**:

\`\`\`json
${configJson}
\`\`\`

3. **Save the file**
4. **Click the refresh button** in Windsurf to reload MCP plugins

`;
  },
  configLocation: '~/.codeium/windsurf/mcp_config.json',
  docs: 'https://docs.windsurf.com/windsurf/cascade/mcp',
  generateConfig: generateWindsurfConfig
};
