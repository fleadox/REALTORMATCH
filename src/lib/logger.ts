import { createClient } from '@supabase/supabase-js';
import { NextApiRequest } from 'next';

// Initialize Supabase client for logging
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export interface ErrorLog {
  id?: string;
  error: string;
  stack?: string;
  context?: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  url?: string;
  method?: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface SecurityAlert extends ErrorLog {
  alert_type: 'brute_force' | 'suspicious_ip' | 'multiple_failures' | 'role_escalation';
  threshold_exceeded?: boolean;
  attempts_count?: number;
}

class Logger {
  private static instance: Logger;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private failedAttempts: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public async logError(error: ErrorLog): Promise<void> {
    try {
      const { error: dbError } = await supabase
        .from('error_logs')
        .insert([error]);

      if (dbError) {
        console.error('Failed to log error:', dbError);
      }
    } catch (e) {
      console.error('Error logging failed:', e);
    }
  }

  public async logSecurityAlert(alert: SecurityAlert): Promise<void> {
    try {
      const { error: dbError } = await supabase
        .from('security_alerts')
        .insert([alert]);

      if (dbError) {
        console.error('Failed to log security alert:', dbError);
      }

      // Trigger immediate notification for critical security alerts
      if (alert.severity === 'critical') {
        await this.notifySecurityTeam(alert);
      }
    } catch (e) {
      console.error('Security alert logging failed:', e);
    }
  }

  private async notifySecurityTeam(alert: SecurityAlert): Promise<void> {
    // Implement your notification logic here (e.g., email, Slack, etc.)
    const webhookUrl = process.env.SECURITY_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert),
        });
      } catch (e) {
        console.error('Failed to notify security team:', e);
      }
    }
  }

  public async trackFailedAttempt(identifier: string): Promise<boolean> {
    const currentAttempts = (this.failedAttempts.get(identifier) || 0) + 1;
    this.failedAttempts.set(identifier, currentAttempts);

    if (currentAttempts >= this.MAX_FAILED_ATTEMPTS) {
      await this.logSecurityAlert({
        alert_type: 'brute_force',
        error: 'Maximum failed attempts exceeded',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        threshold_exceeded: true,
        attempts_count: currentAttempts,
        context: { identifier },
      });
      return true; // Threshold exceeded
    }

    return false; // Below threshold
  }

  public resetFailedAttempts(identifier: string): void {
    this.failedAttempts.delete(identifier);
  }

  public getRequestInfo(req: NextApiRequest): Record<string, any> {
    return {
      ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      user_agent: req.headers['user-agent'],
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
    };
  }
}

export const logger = Logger.getInstance(); 