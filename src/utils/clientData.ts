// Re-export everything from the new clients module
export type { ClientData } from '../clients';
export { 
  clientsData, 
  getClientById, 
  getAllClients, 
  getClientsForButtons 
} from '../clients';
