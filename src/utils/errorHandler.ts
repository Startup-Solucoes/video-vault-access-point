import { toast } from '@/hooks/use-toast';

export interface SecurityEvent {
  type: 'auth_failure' | 'unauthorized_access' | 'validation_error' | 'rate_limit' | 'suspicious_activity';
  userId?: string;
  details: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

class SecurityLogger {
  private static events: SecurityEvent[] = [];

  static logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date(),
      userAgent: navigator.userAgent
    };

    this.events.push(securityEvent);
    console.warn('🔒 Security Event:', securityEvent);

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to security monitoring service
      // this.sendToMonitoring(securityEvent);
    }

    // Keep only last 100 events in memory
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  static getRecentEvents(): SecurityEvent[] {
    return [...this.events];
  }

  static clearEvents(): void {
    this.events = [];
  }
}

export class SecureErrorHandler {
  static handleAuthError(error: any, context?: string) {
    console.error('Auth Error:', error);
    
    SecurityLogger.logSecurityEvent({
      type: 'auth_failure',
      details: `Authentication failed: ${error.message || 'Unknown error'} ${context ? `(${context})` : ''}`
    });

    // Don't expose detailed error messages to users
    toast({
      title: "Erro de Autenticação",
      description: "Credenciais inválidas. Tente novamente.",
      variant: "destructive"
    });
  }

  static handleUnauthorizedAccess(action: string, userId?: string) {
    SecurityLogger.logSecurityEvent({
      type: 'unauthorized_access',
      userId,
      details: `Unauthorized access attempt: ${action}`
    });

    toast({
      title: "Acesso Negado",
      description: "Você não tem permissão para realizar esta ação.",
      variant: "destructive"
    });
  }

  static handleValidationError(field: string, value: any, error: string) {
    SecurityLogger.logSecurityEvent({
      type: 'validation_error',
      details: `Validation failed for field '${field}': ${error}`
    });

    toast({
      title: "Erro de Validação",
      description: `${field}: ${error}`,
      variant: "destructive"
    });
  }

  static handleRateLimit(action: string, userId?: string) {
    SecurityLogger.logSecurityEvent({
      type: 'rate_limit',
      userId,
      details: `Rate limit exceeded for action: ${action}`
    });

    toast({
      title: "Muitas Tentativas",
      description: "Aguarde um momento antes de tentar novamente.",
      variant: "destructive"
    });
  }

  static handleSuspiciousActivity(details: string, userId?: string) {
    SecurityLogger.logSecurityEvent({
      type: 'suspicious_activity',
      userId,
      details
    });

    // For suspicious activity, we might want to take additional actions
    console.warn('🚨 Suspicious Activity Detected:', details);
  }

  static handleGenericError(error: any, context?: string) {
    console.error('Generic Error:', error, context);
    
    // Log for debugging but don't expose details to user
    toast({
      title: "Erro",
      description: "Ocorreu um erro inesperado. Tente novamente.",
      variant: "destructive"
    });
  }
}

export { SecurityLogger };
