import { toast } from 'react-hot-toast';
import { PropertyLink } from '../utils/types';

// Event types for property synchronization
export type PropertySyncEvent = 
  | { type: 'CREATE'; data: PropertyLink }
  | { type: 'UPDATE'; data: Partial<PropertyLink> & { id: string } }
  | { type: 'DELETE'; data: { id: string } };

// Sync status for monitoring
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';

// Sync manager class
export class PropertySyncManager {
  private static instance: PropertySyncManager;
  private subscribers: Set<(event: PropertySyncEvent) => void>;
  private status: SyncStatus;
  private retryAttempts: number;
  private maxRetries: number;
  private retryTimeout: number;

  private constructor() {
    this.subscribers = new Set();
    this.status = 'idle';
    this.retryAttempts = 0;
    this.maxRetries = 3;
    this.retryTimeout = 1000;
    this.setupEventSource();
  }

  static getInstance(): PropertySyncManager {
    if (!PropertySyncManager.instance) {
      PropertySyncManager.instance = new PropertySyncManager();
    }
    return PropertySyncManager.instance;
  }

  private setupEventSource() {
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const eventSource = new EventSource(`${baseUrl}/realtime/v1/property-updates`);

    eventSource.onmessage = (event) => {
      try {
        const syncEvent: PropertySyncEvent = JSON.parse(event.data);
        this.notifySubscribers(syncEvent);
      } catch (error) {
        console.error('Error processing sync event:', error);
        this.handleError(error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      this.handleError(error);
      this.retryConnection();
    };
  }

  private async retryConnection() {
    if (this.retryAttempts >= this.maxRetries) {
      this.status = 'error';
      toast.error('Failed to maintain sync connection. Please refresh the page.');
      return;
    }

    this.retryAttempts++;
    await new Promise(resolve => setTimeout(resolve, this.retryTimeout * this.retryAttempts));
    this.setupEventSource();
  }

  private notifySubscribers(event: PropertySyncEvent) {
    this.subscribers.forEach(subscriber => {
      try {
        subscriber(event);
      } catch (error) {
        console.error('Error in subscriber:', error);
      }
    });
  }

  private handleError(error: any) {
    this.status = 'error';
    console.error('Sync error:', error);
    toast.error('Error syncing property changes');
  }

  // Public methods for property operations
  async createProperty(property: PropertyLink): Promise<void> {
    this.status = 'syncing';
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(property)
      });

      if (!response.ok) throw new Error('Failed to create property');

      this.status = 'success';
      this.notifySubscribers({ type: 'CREATE', data: property });
      toast.success('Property created successfully');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProperty(propertyId: string, updates: Partial<PropertyLink>): Promise<void> {
    this.status = 'syncing';
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/properties?id=eq.${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update property');

      this.status = 'success';
      this.notifySubscribers({ type: 'UPDATE', data: { id: propertyId, ...updates } });
      toast.success('Property updated successfully');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteProperty(propertyId: string): Promise<void> {
    this.status = 'syncing';
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/properties?id=eq.${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete property');

      this.status = 'success';
      this.notifySubscribers({ type: 'DELETE', data: { id: propertyId } });
      toast.success('Property deleted successfully');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Subscription management
  subscribe(callback: (event: PropertySyncEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getStatus(): SyncStatus {
    return this.status;
  }
}

// Hook for using property sync
export function usePropertySync() {
  const syncManager = PropertySyncManager.getInstance();

  return {
    createProperty: syncManager.createProperty.bind(syncManager),
    updateProperty: syncManager.updateProperty.bind(syncManager),
    deleteProperty: syncManager.deleteProperty.bind(syncManager),
    subscribe: syncManager.subscribe.bind(syncManager),
    getStatus: syncManager.getStatus.bind(syncManager)
  };
}