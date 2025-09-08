import type { ClientData } from './types';
import { generateGenericConfig, getDefaultConfig } from '../utils/configs';
import type { LinkData } from '../utils/types';

export const claudeCodeClient: ClientData = {
  id: 'claude-code',
  name: 'Claude Code',
  label: 'Claude Code',
  imageUrl: '/images/mcp-clients/claude.png',
  instructions: (generateConfig, linkData) => {
    const generateClaudeCommand = (scope: string) => {
      const serverNameForCommand = linkData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const defaultConfig = getDefaultConfig(linkData);
      
      if (!defaultConfig) {
        return '';
      }
      
      if (defaultConfig.type === 'stdio') {
        const envFlags = defaultConfig.env ? 
          defaultConfig.env.split(',')
            .map((pair: string) => pair.trim())
            .filter((pair: string) => pair.length > 0)
            .map((pair: string) => {
              const [key, value] = pair.split('=').map((part: string) => part.trim());
              return `--env ${key}=${value || `YOUR_${key}`}`;
            })
            .join(' ') : '';
        
        const baseCommand = `claude mcp add ${serverNameForCommand} --scope ${scope}`;
        return envFlags ? 
          `${baseCommand} ${envFlags} -- ${defaultConfig.command}` : 
          `${baseCommand} -- ${defaultConfig.command}`;
      } else if (defaultConfig.type === 'sse') {
        const headerFlags = defaultConfig.headers ? 
          defaultConfig.headers.split(',')
            .map((pair: string) => pair.trim())
            .filter((pair: string) => pair.length > 0)
            .map((pair: string) => {
              const [key, value] = pair.split('=').map((part: string) => part.trim());
              return `--header "${key}=${value || `YOUR_${key}`}"`;
            })
            .join(' ') : '';
        
        const baseCommand = `claude mcp add --scope ${scope} --transport sse ${serverNameForCommand} ${defaultConfig.url}`;
        return headerFlags ? `${baseCommand} ${headerFlags}` : baseCommand;
      } else if (defaultConfig.type === 'http') {
        const headerFlags = defaultConfig.headers ? 
          defaultConfig.headers.split(',')
            .map((pair: string) => pair.trim())
            .filter((pair: string) => pair.length > 0)
            .map((pair: string) => {
              const [key, value] = pair.split('=').map((part: string) => part.trim());
              return `--header "${key}=${value || `YOUR_${key}`}"`;
            })
            .join(' ') : '';
        
        const baseCommand = `claude mcp add --scope ${scope} --transport http ${serverNameForCommand} ${defaultConfig.url}`;
        return headerFlags ? `${baseCommand} ${headerFlags}` : baseCommand;
      }
      return null;
    };
    
    const defaultConfig = getDefaultConfig(linkData);
    const hasEnv = defaultConfig?.type === 'stdio' && defaultConfig.env;
    const hasHeaders = (defaultConfig?.type === 'http' || defaultConfig?.type === 'sse') && defaultConfig.headers;

    return `
## Install via Claude CLI

Run one of the following commands in your terminal to install the ${linkData.name} MCP server:

The commands only vary based on the scope you want this MCP server to have.

**Local scope**: Available only in the current project but not stored in a sharable file location for your team to also use. 
\`\`\`bash
${generateClaudeCommand('local')}
\`\`\`

**Project scope**: Available only in the current project. Stored in a \`.mcp.json\` file on the project for easy team sharing.
\`\`\`bash
${generateClaudeCommand('project')}
\`\`\`

**User scope**: Available to you across all projects
\`\`\`bash
${generateClaudeCommand('user')}
\`\`\`

${hasEnv || hasHeaders ? `

**Note**: Make sure to replace any placeholder values with your actual credentials.` : ''}

**That's it!** The MCP server will be automatically available in Claude Code after installation.

---

## Verify Installation

Check that your server was added successfully:

\`\`\`bash
# List all configured servers
claude mcp list

# Get details for this specific server
claude mcp get ${linkData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
\`\`\`

## Managing the Server

\`\`\`bash
# Remove the server if needed
claude mcp remove ${linkData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}

# Check server status within Claude Code
/mcp
\`\`\`

`;
  },
  configLocation: 'Claude CLI managed configuration',
  docs: 'https://docs.anthropic.com/en/docs/claude-code/mcp',
  generateConfig: generateGenericConfig
};
