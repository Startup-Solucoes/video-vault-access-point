
// Serviço consolidado de clientes - Ponto único de acesso
export { fetchClientsFromDB } from './client/clientDataService';
export { updateClientInDB } from './client/clientUpdateService';
export { approveClientInDB } from './client/clientApprovalService';
export { deleteClientFromDB } from './client/clientDeletionService';
export { fetchClientUsers, addClientUser, removeClientUser } from './client/clientUsersService';
export { updateClientUserPassword } from './client/clientPasswordService';
export type { ClientUser, CreateUserResult } from './client/clientUsersService';
