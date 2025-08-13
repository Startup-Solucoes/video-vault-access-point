import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Shield, User, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SecurityLog {
  id: string;
  user_id: string | null;
  action: string;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const SecurityMonitor = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar logs de segurança:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os logs de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const getActionIcon = (action: string) => {
    if (action.includes('password')) return <Key className="h-4 w-4" />;
    if (action.includes('failed')) return <AlertTriangle className="h-4 w-4" />;
    if (action.includes('login')) return <User className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('failed')) return 'destructive';
    if (action.includes('password')) return 'secondary';
    return 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getActionDescription = (action: string, details: any) => {
    switch (action) {
      case 'client_password_changed':
        return `Senha alterada para usuário: ${details?.user_email || 'N/A'}`;
      case 'client_password_change_failed':
        return `Falha ao alterar senha: ${details?.error || 'Erro desconhecido'}`;
      case 'main_client_password_changed':
        return `Senha do cliente principal alterada: ${details?.client_email || 'N/A'}`;
      case 'main_client_password_change_failed':
        return `Falha ao alterar senha do cliente principal: ${details?.error || 'Erro desconhecido'}`;
      default:
        return action;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Monitor de Segurança
        </CardTitle>
        <Button 
          onClick={fetchSecurityLogs} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando logs de segurança...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum evento de segurança registrado.
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(log.created_at)}
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    {getActionDescription(log.action, log.details)}
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {log.ip_address && (
                      <div>IP: {log.ip_address}</div>
                    )}
                    {log.user_agent && (
                      <div className="truncate">
                        User Agent: {log.user_agent}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};