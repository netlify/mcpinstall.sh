import type { ClientData } from './types';
import { claudeCodeClient } from './claude-code';
import { cursorClient } from './cursor';
import { vscodeClient } from './vscode';
import { vscodeInsidersClient } from './vscode-insiders';
import { ampClient } from './amp';
import { codexClient } from './codex';
import { windsurfClient } from './windsurf';

export type { ClientData } from './types';

export const clientsData: Record<string, ClientData> = {
  'cursor': cursorClient,
  'claude-code': claudeCodeClient,
  
  'codex': codexClient,
  'amp': ampClient,
  'vscode': vscodeClient,
  'vscode-insiders': vscodeInsidersClient,
  'windsurf': windsurfClient
};

// Helper function to get client data by ID
export function getClientById(clientId: string): ClientData | undefined {
  return clientsData[clientId];
}

// Helper function to get all clients as an array
export function getAllClients(): ClientData[] {
  return Object.values(clientsData);
}

// Helper function to get clients for button display (simplified version)
export function getClientsForButtons() {
  return getAllClients().map(client => ({
    id: client.id,
    label: client.label,
    imageUrl: client.imageUrl,
    docs: client.docs
  }));
}
