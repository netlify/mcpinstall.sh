
type BaseLinkData = {
    name: string;
    desc?: string;
    homepage?: string;
    repository?: string;
    documentation?: string;
}

type StdioLinkData = {
    type: 'stdio';
    command: string;
    env?: string;
};

type SseLinkData = {
    type: 'sse';
    url: string;
    authName?: string;
    authValue?: string;
    headers?: string;
};

type HttpLinkData = {
    type: 'http';
    url: string;
    authName?: string;
    authValue?: string;
    headers?: string;
};

export type LinkData = BaseLinkData & (StdioLinkData | SseLinkData | HttpLinkData);