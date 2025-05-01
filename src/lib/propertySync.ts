import { toast } from 'react-hot-toast';
import { Property } from '../types/property';

const API_URL = import.meta.env.VITE_API_URL;

// Event types for property synchronization
export type PropertySyncEvent = 
  | { type: 'CREATE'; data: Property }
  | { type: 'UPDATE'; data: Partial<Property> & { id: string } }
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
    const eventSource = new EventSource(`${API_URL}/properties/events`);

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
  async createProperty(property: Property): Promise<void> {
    this.status = 'syncing';
    try {
      const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  async updateProperty(propertyId: string, updates: Partial<Property>): Promise<void> {
    this.status = 'syncing';
    try {
      const response = await fetch(`${API_URL}/properties/${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${API_URL}/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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

export async function fetchProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${API_URL}/properties`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

export async function fetchPropertyById(propertyId: string): Promise<Property> {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
}

export async function deleteProperty(propertyId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
}

export async function createProperty(property: Omit<Property, 'id'>): Promise<Property> {
  try {
    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(property),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}

export async function updateProperty(propertyId: string, updates: Partial<Property>): Promise<Property> {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}