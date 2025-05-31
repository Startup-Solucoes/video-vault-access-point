
// Re-export all client service functions from their respective modules
export { fetchClientsFromDB } from './client/clientDataService';
export { updateClientInDB } from './client/clientUpdateService';
export { approveClientInDB } from './client/clientApprovalService';
export { deleteClientFromDB } from './client/clientDeletionService';
