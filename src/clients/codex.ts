import type { ClientData } from './types';
import type { LinkData } from '../utils/types';

function generateCodexConfig(linkData: LinkData): Record<string, any> {
  const serverName = linkData.name?.trim();
  
  const config = {
    mcp_servers: {
      [serverName]: {} as Record<string, any>
    }
  };
  
  const serverConfig = config.mcp_servers[serverName];
  
  if (linkData.type === 'stdio') {
    const [command, ...args] = linkData.command.trim().split(' ').map((arg: string) => arg.trim()).filter((arg: string) => arg.length > 0);
    
    serverConfig.command = command;
    
    if (args.length > 0) {
      serverConfig.args = args;
    }
    
    if (linkData.env) {
      const envVars = linkData.env.split(',').map((pair: string) => pair.trim()).filter((pair: string) => pair.length > 0);
      if (envVars.length > 0) {
        serverConfig.env = {};
        for (const pair of envVars) {
          const [key, value] = pair.split('=').map((part: string) => part.trim());
          if (key && value) {
            serverConfig.env[key] = value;
          } else if (key) {
            serverConfig.env[key] = '...';
          }
        }
      }
    }
  } else {
    // For SSE/HTTP servers, provide a placeholder with note
    serverConfig.command = '...';
    serverConfig._note = 'Codex supports stdio only. For SSE/HTTP, consider mcp-proxy adapter.';
  }
  
  return config;
}

function formatCodexConfig(config: Record<string, any>): string {
  const mcp_servers = config.mcp_servers;
  let tomlConfig = '';
  
  for (const [serverName, serverConfig] of Object.entries(mcp_servers)) {
    const configObj = serverConfig as Record<string, any>;
    
    tomlConfig += `[mcp_servers.${serverName}]\n`;
    
    if (configObj._note) {
      tomlConfig = `# Note: ${configObj._note}\n# Consider using mcp-proxy adapter: https://github.com/sparfenyuk/mcp-proxy\n\n` + tomlConfig;
      continue;
    }
    
    if (configObj.command) {
      tomlConfig += `command = "${configObj.command}"\n`;
    }
    
    if (configObj.args && Array.isArray(configObj.args)) {
      tomlConfig += `args = [${configObj.args.map((arg: string) => `"${arg}"`).join(', ')}]\n`;
    }
    
    if (configObj.env && typeof configObj.env === 'object') {
      const envPairs = Object.entries(configObj.env).map(([key, value]) => `"${key}" = "${value}"`);
      tomlConfig += `env = { ${envPairs.join(', ')} }\n`;
    }
    
    tomlConfig += '\n';
  }
  
  return tomlConfig.trim();
}

export const codexClient: ClientData = {
  id: 'codex',
  name: 'Codex CLI',
  label: 'Codex CLI',
  imageUrl: '/images/mcp-clients/codex.svg',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const tomlConfig = formatCodexConfig(config);
    
    return `1. **Install Codex CLI** if not already installed

2. **Open your terminal**

3. **Edit the Codex configuration file** at \`~/.codex/config.toml\`

4. **Add the MCP server configuration**:

\`\`\`toml
${tomlConfig}
\`\`\`

5. **Save the file and restart Codex** to apply changes`;
  },
  configLocation: '~/.codex/config.toml',
  docs: 'https://raw.githubusercontent.com/openai/codex/refs/heads/main/docs/config.md#mcp_servers',
  generateConfig: generateCodexConfig,
  isCompatible: (linkData) => linkData.type === 'stdio'
};
