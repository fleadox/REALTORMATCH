import { createClient } from '@supabase/supabase-js';

interface AuditLog {
  id?: string;
  action: string;
  user_id?: string;
  ip_address?: string;
  resource_type: string;
  resource_id?: string;
  status: 'success' | 'failure';
  details?: Record<string, any>;
  timestamp: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  private supabase;

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  public async logAuthAttempt(log: Omit<AuditLog, 'timestamp'>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('audit_logs')
        .insert([{
          ...log,
          timestamp: new Date().toISOString(),
        }]);

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (e) {
      console.error('Audit logging failed:', e);
    }
  }

  public async logSecurityEvent(log: Omit<AuditLog, 'timestamp'>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('security_audit_logs')
        .insert([{
          ...log,
          timestamp: new Date().toISOString(),
        }]);

      if (error) {
        console.error('Failed to log security audit event:', error);
      }
    } catch (e) {
      console.error('Security audit logging failed:', e);
    }
  }
}

export const auditLogger = AuditLogger.getInstance(); 