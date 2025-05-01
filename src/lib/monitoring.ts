import { logger } from './logger';
import { createClient } from '@supabase/supabase-js';

interface MonitoringMetrics {
  authAttempts: number;
  failedAttempts: number;
  activeSessions: number;
  averageResponseTime: number;
  errorRate: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private supabase;
  private metrics: MonitoringMetrics = {
    authAttempts: 0,
    failedAttempts: 0,
    activeSessions: 0,
    averageResponseTime: 0,
    errorRate: 0,
  };

  private constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Track authentication attempts
  public async trackAuthAttempt(success: boolean, duration: number): Promise<void> {
    this.metrics.authAttempts++;
    if (!success) this.metrics.failedAttempts++;
    
    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.authAttempts - 1) + duration) / 
      this.metrics.authAttempts;

    // Calculate error rate
    this.metrics.errorRate = (this.metrics.failedAttempts / this.metrics.authAttempts) * 100;

    // Log metrics to database
    await this.logMetrics();
  }

  // Track active sessions
  public async updateActiveSessions(): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from('auth.sessions')
        .select('id')
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      this.metrics.activeSessions = data.length;
    } catch (error) {
      await logger.logError({
        error: 'Failed to update active sessions',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { error }
      });
    }
  }

  // Log metrics to database
  private async logMetrics(): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('monitoring_metrics')
        .insert([{
          ...this.metrics,
          timestamp: new Date().toISOString(),
        }]);

      if (error) throw error;
    } catch (error) {
      await logger.logError({
        error: 'Failed to log monitoring metrics',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { error }
      });
    }
  }

  // Get current metrics
  public getMetrics(): MonitoringMetrics {
    return { ...this.metrics };
  }

  // Check for anomalies
  public async checkAnomalies(): Promise<void> {
    const { errorRate, failedAttempts } = this.metrics;

    // Alert on high error rate
    if (errorRate > 10) { // 10% error rate threshold
      await logger.logError({
        error: 'High authentication error rate detected',
        severity: 'warning',
        timestamp: new Date().toISOString(),
        context: { errorRate, failedAttempts }
      });
    }

    // Alert on sudden spike in failed attempts
    if (failedAttempts > 50) { // 50 failed attempts threshold
      await logger.logError({
        error: 'Suspicious number of failed authentication attempts',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        context: { failedAttempts }
      });
    }
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('monitoring_metrics')
        .select('timestamp')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      return true;
    } catch (error) {
      await logger.logError({
        error: 'Monitoring health check failed',
        severity: 'error',
        timestamp: new Date().toISOString(),
        context: { error }
      });
      return false;
    }
  }
}

export const monitoring = MonitoringService.getInstance(); 