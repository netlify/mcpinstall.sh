import type { LinkData } from "./types";

export interface GenericConfigOptions {
  omitHeaders?: boolean;
}

export function generateGenericConfig(linkData: LinkData, options: GenericConfigOptions = {}){

  const serverName = linkData.name?.trim();

  const config = { mcpServers: {
    [serverName]: {} as Record<string, any>
  }}

  const serverConfig = config.mcpServers[serverName];

  serverConfig['type'] = linkData.type;

  if(linkData.type === 'stdio'){

    const [command, ...args] = linkData.command.trim().split(' ').map(arg => arg.trim()).filter(arg => arg.length > 0);

    serverConfig['command'] = command;

    if(args.length > 0){
      serverConfig['args'] = args;
    }

    if(linkData.env){
      const envVars = linkData.env.split(',').map(pair => pair.trim()).filter(pair => pair.length > 0);
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

  if(linkData.type === 'http' || linkData.type === 'sse'){
    serverConfig['url'] = linkData.url;
    // serverConfig['auth'] = {
    //   name: linkData.authName,
    //   value: linkData.authValue
    // };

    if(linkData.headers && !options.omitHeaders){
      const headerPairs = linkData.headers.split(',').map(pair => pair.trim()).filter(pair => pair.length > 0);
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

  return config;
}

