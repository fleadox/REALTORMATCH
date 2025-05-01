import { Pool } from 'pg';
import { logger } from './logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Query wrapper with error handling and logging
export async function query<T = any>(
  text: string,
  params?: any[],
  client?: any
): Promise<T[]> {
  const start = Date.now();
  try {
    const res = await (client || pool).query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries
    if (duration > 1000) {
      await logger.logError({
        error: 'Slow query detected',
        severity: 'warning',
        timestamp: new Date().toISOString(),
        context: {
          query: text,
          duration,
          params
        }
      });
    }
    
    return res.rows;
  } catch (error) {
    await logger.logError({
      error: 'Database query failed',
      severity: 'error',
      timestamp: new Date().toISOString(),
      context: {
        query: text,
        params,
        error
      }
    });
    throw error;
  }
}

// Transaction wrapper
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Optimized auth queries
export const authQueries = {
  async getUserById(id: string) {
    return query(
      'SELECT id, email, created_at FROM auth.users WHERE id = $1',
      [id]
    );
  },
  
  async getSessionData(sessionId: string) {
    return query(
      'SELECT * FROM auth.sessions WHERE id = $1',
      [sessionId]
    );
  },
  
  async updateLastActivity(userId: string) {
    return query(
      'UPDATE auth.users SET last_activity = NOW() WHERE id = $1',
      [userId]
    );
  }
};

// Health check
export async function checkPoolHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    await logger.logError({
      error: 'Database pool health check failed',
      severity: 'error',
      timestamp: new Date().toISOString(),
      context: { error }
    });
    return false;
  }
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  try {
    await pool.end();
  } catch (error) {
    await logger.logError({
      error: 'Failed to close database pool',
      severity: 'error',
      timestamp: new Date().toISOString(),
      context: { error }
    });
  }
} 