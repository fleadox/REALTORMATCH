import { exec } from 'child_process';
import { promisify } from 'util';
import { createClient } from '@supabase/supabase-js';
import { logger } from '../src/lib/logger';

const execAsync = promisify(exec);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface BackupConfig {
  schedule: string;
  retentionDays: number;
  storagePath: string;
}

const backupConfig: BackupConfig = {
  schedule: process.env.BACKUP_SCHEDULE || '0 0 * * *', // Daily at midnight
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '7'),
  storagePath: process.env.BACKUP_STORAGE_PATH || './backups',
};

async function createBackup(): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${backupConfig.storagePath}/backup-${timestamp}.sql`;

  try {
    // Create backup directory if it doesn't exist
    await execAsync(`mkdir -p ${backupConfig.storagePath}`);

    // Create database backup
    const { data, error } = await supabase.rpc('create_backup', {
      backup_path: backupPath,
    });

    if (error) throw error;

    // Compress backup
    await execAsync(`gzip ${backupPath}`);

    // Log successful backup
    await logger.logError({
      error: 'Database backup created successfully',
      severity: 'info',
      timestamp: new Date().toISOString(),
      context: { backupPath: `${backupPath}.gz` },
    });

    // Clean up old backups
    await cleanupOldBackups();
  } catch (error) {
    await logger.logError({
      error: 'Failed to create database backup',
      severity: 'error',
      timestamp: new Date().toISOString(),
      context: { error },
    });
    throw error;
  }
}

async function restoreBackup(backupPath: string): Promise<void> {
  try {
    // Decompress backup if needed
    if (backupPath.endsWith('.gz')) {
      await execAsync(`gunzip -k ${backupPath}`);
      backupPath = backupPath.slice(0, -3);
    }

    // Restore database from backup
    const { data, error } = await supabase.rpc('restore_backup', {
      backup_path: backupPath,
    });

    if (error) throw error;

    await logger.logError({
      error: 'Database restored successfully',
      severity: 'info',
      timestamp: new Date().toISOString(),
      context: { backupPath },
    });
  } catch (error) {
    await logger.logError({
      error: 'Failed to restore database backup',
      severity: 'error',
      timestamp: new Date().toISOString(),
      context: { error },
    });
    throw error;
  }
}

async function cleanupOldBackups(): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - backupConfig.retentionDays);

    const { data: backups, error } = await supabase
      .from('backups')
      .select('*')
      .lt('created_at', cutoffDate.toISOString());

    if (error) throw error;

    for (const backup of backups) {
      await execAsync(`rm ${backup.path}`);
      await supabase.from('backups').delete().eq('id', backup.id);
    }

    await logger.logError({
      error: 'Old backups cleaned up successfully',
      severity: 'info',
      timestamp: new Date().toISOString(),
      context: { deletedCount: backups.length },
    });
  } catch (error) {
    await logger.logError({
      error: 'Failed to cleanup old backups',
      severity: 'error',
      timestamp: new Date().toISOString(),
      context: { error },
    });
  }
}

// Export functions for use in other scripts
export { createBackup, restoreBackup, cleanupOldBackups }; 