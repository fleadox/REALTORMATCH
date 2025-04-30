import { useState, useEffect } from 'react';
import { PropertyLink } from '../utils/types';
import { usePropertySync as useSyncManager } from '../lib/propertySync';

export function usePropertySync(propertyId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const syncManager = useSyncManager();

  useEffect(() => {
    if (!propertyId) return;

    const unsubscribe = syncManager.subscribe((event) => {
      if (event.type === 'UPDATE' && event.data.id === propertyId) {
        // Handle property updates
        setIsLoading(false);
        setError(null);
      }
    });

    return () => unsubscribe();
  }, [propertyId]);

  const updateProperty = async (updates: Partial<PropertyLink>) => {
    if (!propertyId) return;

    setIsLoading(true);
    setError(null);

    try {
      await syncManager.updateProperty(propertyId, updates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update property'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateProperty,
    syncStatus: syncManager.getStatus()
  };
}