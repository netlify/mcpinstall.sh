
type BaseLinkData = {
    name: string;
    desc?: string;
    homepage?: string;
    repository?: string;
    documentation?: string;
}

type StdioConfig = {
    type: 'stdio';
    command: string;
    env?: string;
    default?: boolean;
};

type SseConfig = {
    type: 'sse';
    url: string;
    authName?: string;
    authValue?: string;
    headers?: string;
    default?: boolean;
};

type HttpConfig = {
    type: 'http';
    url: string;
    authName?: string;
    authValue?: string;
    headers?: string;
    default?: boolean;
};

export type McpConfig = StdioConfig | SseConfig | HttpConfig;

export type LinkData = BaseLinkData & {
    configs: McpConfig[];
};