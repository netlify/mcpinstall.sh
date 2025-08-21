import type { ClientData } from './types';
import { generateGenericConfig } from '../utils/configs';

export const claudeCodeClient: ClientData = {
  id: 'claude-code',
  name: 'Claude Code',
  label: 'Claude Code',
  imageUrl: '/images/mcp-clients/claude.png',
  instructions: (generateConfig, linkData) => {
    const generateClaudeCommand = (scope: string) => {
      const serverNameForCommand = linkData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      if (linkData.type === 'stdio') {
        const envFlags = (linkData.type === 'stdio' && linkData.env) ? 
          linkData.env.split(',')
            .map(pair => pair.trim())
            .filter(pair => pair.length > 0)
            .map(pair => {
              const [key, value] = pair.split('=').map(part => part.trim());
              return `--env ${key}=${value || `YOUR_${key}`}`;
            })
            .join(' ') : '';
        
        const baseCommand = `claude mcp add ${serverNameForCommand} --scope ${scope}`;
        return envFlags ? 
          `${baseCommand} ${envFlags} -- ${linkData.command}` : 
          `${baseCommand} -- ${linkData.command}`;
      } else if (linkData.type === 'sse') {
        return `claude mcp add --scope ${scope} --transport sse ${serverNameForCommand} ${linkData.url}`;
      } else if (linkData.type === 'http') {
        return `claude mcp add --scope ${scope} --transport http ${serverNameForCommand} ${linkData.url}`;
      }
      return null;
    };
    const hasEnv = linkData.type === 'stdio' && linkData.env;

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

${hasEnv ? `

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
