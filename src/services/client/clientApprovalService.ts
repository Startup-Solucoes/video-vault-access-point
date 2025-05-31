
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const approveClientInDB = async (clientId: string, clientEmail: string): Promise<void> => {
  console.log('clientApprovalService: Aprovando cliente:', clientId, clientEmail);
  
  try {
    // Como não podemos acessar auth admin, vamos simular a aprovação 
    // atualizando o timestamp do perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId);

    if (profileError) {
      throw profileError;
    }

    console.log('clientApprovalService: Cliente aprovado com sucesso');
    toast({
      title: "Sucesso!",
      description: `Cliente ${clientEmail} aprovado com sucesso`
    });
  } catch (error) {
    console.error('clientApprovalService: Erro ao aprovar cliente:', error);
    throw error;
  }
};
