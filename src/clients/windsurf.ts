import type { ClientData } from './types';
import type { LinkData } from '../utils/types';

function generateWindsurfConfig(linkData: LinkData) {
  const serverName = linkData.name?.trim();
  
  const config = { 
    mcpServers: {
      [serverName]: {} as Record<string, any>
    }
  };

  const serverConfig = config.mcpServers[serverName];

  if (linkData.type === 'stdio') {
    const [command, ...args] = linkData.command.trim().split(' ').map(arg => arg.trim()).filter(arg => arg.length > 0);
    
    serverConfig['command'] = command;
    
    if (args.length > 0) {
      serverConfig['args'] = args;
    }

    if (linkData.env) {
      const envVars = linkData.env.split(',').map(pair => pair.trim()).filter(pair => pair.length > 0);
      for (const pair of envVars) {
        const [key, value] = pair.split('=').map(part => part.trim());
        if (key && value) {
          serverConfig['env'] = serverConfig['env'] || {};
          serverConfig['env'][key] = value;
        } else if (key) {
          serverConfig['env'] = serverConfig['env'] || {};
          serverConfig['env'][key] = '...';
        }
      }
    }
  }

  if (linkData.type === 'http' || linkData.type === 'sse') {
    serverConfig['serverUrl'] = linkData.url;
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
