import type { LinkData } from '../utils/types';

export interface ClientData {
  id: string;
  name: string;
  label: string;
  imageUrl: string;
  instructions: (generateConfig: (linkData: LinkData) => Record<string, any>, linkData: LinkData) => string;
  configLocation: string;
  docs?: string;
  generateConfig: (linkData: LinkData) => Record<string, any>;
  generateInstallLink?: (linkData: LinkData) => { installLink: string };
  isCompatible?: (linkData: LinkData) => boolean;
}
