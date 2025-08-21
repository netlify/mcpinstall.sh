import type { ClientData } from './types';
import { generateGenericConfig } from '../utils/configs';

export const codexClient: ClientData = {
  id: 'codex',
  name: 'Codex CLI',
  label: 'Codex CLI',
  imageUrl: '/images/mcp-clients/codex.svg',
  instructions: (generateConfig, linkData) => {
    const config = generateConfig(linkData);
    const configJson = JSON.stringify(config, null, 2);
    
    return `#

1. **Install Codex CLI** if not already installed
2. **Open your terminal**
3. **Edit the Codex configuration file**
4. **Add the MCP server configuration**:

\`\`\`json
${configJson}
\`\`\`

5. **Run \`codex --reload\`** to apply changes`;
  },
  configLocation: '~/.config/codex/config.toml',
  docs: 'https://github.com/openai/codex/blob/main/codex-rs/config.md#mcp_servers',
  generateConfig: generateGenericConfig
};
