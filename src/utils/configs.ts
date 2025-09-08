import type { LinkData, McpConfig } from "./types";

export interface GenericConfigOptions {
  omitHeaders?: boolean;
  configIndex?: number; // Optional index to select specific config instead of default
}

/**
 * Extracts the default configuration or the single configuration if only one exists
 */
export function getDefaultConfig(linkData: LinkData): McpConfig | null {
  if (!linkData.configs || linkData.configs.length === 0) {
    return null;
  }

  // If only one config, return it
  if (linkData.configs.length === 1) {
    return linkData.configs[0];
  }

  // Find the default config
  const defaultConfig = linkData.configs.find(config => config.default === true);
  
  // If no explicit default, return the first one
  return defaultConfig || linkData.configs[0];
}

export function generateGenericConfig(linkData: LinkData, options: GenericConfigOptions = {}){

  const serverName = linkData.name?.trim();

  // Get the config to use
  let config: McpConfig | null;
  if (options.configIndex !== undefined && linkData.configs[options.configIndex]) {
    config = linkData.configs[options.configIndex];
  } else {
    config = getDefaultConfig(linkData);
  }

  if (!config) {
    throw new Error('No valid configuration found');
  }

  const mcpConfig = { mcpServers: {
    [serverName]: {} as Record<string, any>
  }}

  const serverConfig = mcpConfig.mcpServers[serverName];

  serverConfig['type'] = config.type;

  if(config.type === 'stdio'){

    const [command, ...args] = config.command.trim().split(' ').map(arg => arg.trim()).filter(arg => arg.length > 0);

    serverConfig['command'] = command;

    if(args.length > 0){
      serverConfig['args'] = args;
    }

    if(config.env){
      const envVars = config.env.split(',').map(pair => pair.trim()).filter(pair => pair.length > 0);
      for(const pair of envVars){
        const [key, value] = pair.split('=').map(part => part.trim());
        if(key && value){
          serverConfig['env'] = serverConfig['env'] || {};
          serverConfig['env'][key] = value;
        }else if(key){
          serverConfig['env'][key] = '...';
        }
      }
    }
  }

  if(config.type === 'http' || config.type === 'sse'){
    serverConfig['url'] = config.url;
    // serverConfig['auth'] = {
    //   name: config.authName,
    //   value: config.authValue
    // };

    if(config.headers && !options.omitHeaders){
      const headerPairs = config.headers.split(',').map(pair => pair.trim()).filter(pair => pair.length > 0);
      for(const pair of headerPairs){
        const [key, value] = pair.split('=').map(part => part.trim());
        if(key && value){
          serverConfig['headers'] = serverConfig['headers'] || {};
          serverConfig['headers'][key] = value;
        }else if(key){
          serverConfig['headers'] = serverConfig['headers'] || {};
          serverConfig['headers'][key] = '...';
        }
      }
    }
  }

  return mcpConfig;
}

