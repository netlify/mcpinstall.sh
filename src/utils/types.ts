
type BaseLinkData = {
    name: string;
    desc?: string;
}

type StdioLinkData = {
    type: 'stdio';
    command: string;
    args?: string;
    env?: string;
};

type SseLinkData = {
    type: 'sse';
    url: string;
    authName?: string;
    authValue?: string;
};

type HttpLinkData = {
    type: 'http';
    url: string;
    authName?: string;
    authValue?: string;
};

export type LinkData = BaseLinkData & (StdioLinkData | SseLinkData | HttpLinkData);