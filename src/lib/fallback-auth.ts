import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';
import { auditLogger } from './audit-logger';

interface FallbackAuthOptions {
  email?: string;
  phone?: string;
  backupCode?: string;
}

class FallbackAuth {
  private static instance: FallbackAuth;
  private supabase;

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  public static getInstance(): FallbackAuth {
    if (!FallbackAuth.instance) {
      FallbackAuth.instance = new FallbackAuth();
    }
    return FallbackAuth.instance;
  }

  public async initiateFallback(options: FallbackAuthOptions): Promise<boolean> {
    try {
      // Log the fallback attempt
      await auditLogger.logAuthAttempt({
        action: 'fallback_auth_initiated',
        resource_type: 'auth',
        status: 'success',
        details: { method: options.email ? 'email' : options.phone ? 'phone' : 'backup_code' }
      });

      if (options.email) {
        return await this.handleEmailFallback(options.email);
      } else if (options.phone) {
        return await this.handlePhoneFallback(options.phone);
      } else if (options.backupCode) {
        return await this.handleBackupCode(options.backupCode);
      }

      return false;
    } catch (error) {
      await logger.logError({
        error: 'Fallback authentication failed',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { options }
      });
      return false;
    }
  }

  private async handleEmailFallback(email: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      await logger.logError({
        error: 'Email fallback failed',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { email }
      });
      return false;
    }
  }

  private async handlePhoneFallback(phone: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.signInWithOtp({
        phone,
        options: {
          shouldCreateUser: false
        }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      await logger.logError({
        error: 'Phone fallback failed',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { phone }
      });
      return false;
    }
  }

  private async handleBackupCode(code: string): Promise<boolean> {
    try {
      // Implement backup code verification logic
      const { error } = await this.supabase
        .from('backup_codes')
        .select('*')
        .eq('code', code)
        .single();

      if (error) throw error;
      return true;
    } catch (error) {
      await logger.logError({
        error: 'Backup code verification failed',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { code }
      });
      return false;
    }
  }
}

export const fallbackAuth = FallbackAuth.getInstance(); 