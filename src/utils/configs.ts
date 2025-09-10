import type { LinkData, McpConfig } from "./types";
import type { ClientData } from "../clients/types";

export interface GenericConfigOptions {
  omitHeaders?: boolean;
  configIndex?: number; // Optional index to select specific config instead of default
}

/**
 * Determines which configuration types are compatible with a given client
 * @param client - The client to test compatibility for
 * @param linkData - The link data containing all available configurations
 * @returns Array of compatible config type strings
 */
export function getCompatibleConfigTypes(client: ClientData, linkData: LinkData): string[] {
  if (!client.isCompatible) {
    // If no isCompatible function, assume all types are supported
    return linkData.configs.map(config => config.type);
  }
  
  // Special handling for Codex which only supports stdio
  if (client.id === 'codex') {
    return linkData.configs.filter(config => config.type === 'stdio').map(config => config.type);
  }
  
  // For other clients with isCompatible function, check each type
  const uniqueTypes = [...new Set(linkData.configs.map(config => config.type))];
  const compatibleTypes: string[] = [];
  
  for (const configType of uniqueTypes) {
    // Get a sample config of this type
    const sampleConfig = linkData.configs.find(config => config.type === configType);
    if (sampleConfig) {
      // Create test linkData with just configs of this type
      const configsOfThisType = linkData.configs.filter(config => config.type === configType);
      const testLinkData: LinkData = {
        ...linkData,
        configs: configsOfThisType
      };
      
      if (client.isCompatible(testLinkData)) {
        compatibleTypes.push(configType);
      }
    }
  }
  
  return compatibleTypes;
}

/**
 * Filters configurations to only include those compatible with the given client
 * @param client - The client to filter configurations for
 * @param linkData - The link data containing all configurations
 * @returns Array of compatible configurations
 */
export function getCompatibleConfigs(client: ClientData, linkData: LinkData): McpConfig[] {
  const compatibleTypes = getCompatibleConfigTypes(client, linkData);
  return linkData.configs.filter(config => compatibleTypes.includes(config.type));
}

/**
 * Ensures that the working configuration data uses a compatible config as default
 * If the current default is incompatible, switches to the first compatible config
 * @param client - The client to ensure compatibility for
 * @param linkData - The original link data
 * @param selectedConfigType - Optional config type selected via URL parameter
 * @returns Modified LinkData with compatible default configuration
 */
export function ensureCompatibleWorkingConfig(
  client: ClientData, 
  linkData: LinkData, 
  selectedConfigType?: string | null
): LinkData {
  const compatibleConfigs = getCompatibleConfigs(client, linkData);
  
  if (compatibleConfigs.length === 0) {
    // No compatible configs - return original data
    return linkData;
  }

  // Check if the currently selected/default config is compatible
  const currentDefaultConfig = linkData.configs.find(c => c.default) || linkData.configs[0];
  const compatibleTypes = getCompatibleConfigTypes(client, linkData);
  const currentDefaultIsCompatible = currentDefaultConfig ? 
    compatibleTypes.includes(currentDefaultConfig.type) : false;
  
  const shouldSwitchConfig = !currentDefaultIsCompatible || 
    (selectedConfigType && !compatibleTypes.includes(selectedConfigType));

  if (shouldSwitchConfig) {
    // Switch to the first compatible config as default
    const modifiedConfigs = linkData.configs.map(config => ({
      ...config,
      default: config.type === compatibleConfigs[0].type && config === compatibleConfigs[0]
    }));
    
    return { ...linkData, configs: modifiedConfigs };
  }
  
  return linkData;
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

/**
 * Gets the currently selected configuration (the one marked as default)
 * This is the same as getDefaultConfig but more semantically clear for current selection
 */
export function getSelectedConfig(linkData: LinkData): McpConfig | null {
  return getDefaultConfig(linkData);
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

