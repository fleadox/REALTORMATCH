import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Client-side Supabase client with limited permissions
 * Use this client for all client-side operations
 */
export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public',
    },
  }
)

/**
 * Server-side admin client with full database access
 * Use this ONLY in server-side operations (API routes, Server Components)
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    })
  : null

/**
 * Error types for better error handling
 */
export enum SupabaseErrorType {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class SupabaseError extends Error {
  constructor(
    public type: SupabaseErrorType,
    message: string,
    public originalError?: any
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

/**
 * Helper function to handle Supabase errors
 */
export function handleSupabaseError(error: any): never {
  console.error('Supabase Error:', error)

  if (error?.code === '23505') {
    throw new SupabaseError(
      SupabaseErrorType.ALREADY_EXISTS,
      'Resource already exists'
    )
  }

  if (error?.code === '42P01') {
    throw new SupabaseError(
      SupabaseErrorType.NOT_FOUND,
      'Table or resource not found'
    )
  }

  if (error?.status === 401 || error?.code === '42501') {
    throw new SupabaseError(
      SupabaseErrorType.UNAUTHORIZED,
      'Unauthorized access'
    )
  }

  throw new SupabaseError(
    SupabaseErrorType.INTERNAL_ERROR,
    'An unexpected error occurred',
    error
  )
}

/**
 * Helper functions for common database operations
 */

type TableName = keyof Database['public']['Tables']

/**
 * Safely fetch a single record by ID with type checking
 */
export async function fetchById<T extends TableName>(
  table: T,
  id: string,
  client = supabaseClient
): Promise<Database['public']['Tables'][T]['Row']> {
  const { data, error } = await client
    .from(table)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  if (!data) {
    throw new SupabaseError(
      SupabaseErrorType.NOT_FOUND,
      `${String(table)} with ID ${id} not found`
    )
  }

  return data
}

/**
 * Create a new record with validation
 */
export async function createRecord<T extends TableName>(
  table: T,
  data: Database['public']['Tables'][T]['Insert'],
  client = supabaseClient
): Promise<Database['public']['Tables'][T]['Row']> {
  const { data: newRecord, error } = await client
    .from(table)
    .insert(data)
    .select()
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  if (!newRecord) {
    throw new SupabaseError(
      SupabaseErrorType.INTERNAL_ERROR,
      'Failed to create record'
    )
  }

  return newRecord
}

/**
 * Update an existing record
 */
export async function updateRecord<T extends TableName>(
  table: T,
  id: string,
  data: Database['public']['Tables'][T]['Update'],
  client = supabaseClient
): Promise<Database['public']['Tables'][T]['Row']> {
  const { data: updatedRecord, error } = await client
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    handleSupabaseError(error)
  }

  if (!updatedRecord) {
    throw new SupabaseError(
      SupabaseErrorType.NOT_FOUND,
      `${String(table)} with ID ${id} not found`
    )
  }

  return updatedRecord
}

/**
 * Delete a record
 */
export async function deleteRecord<T extends TableName>(
  table: T,
  id: string,
  client = supabaseClient
): Promise<void> {
  const { error } = await client
    .from(table)
    .delete()
    .eq('id', id)

  if (error) {
    handleSupabaseError(error)
  }
}

/**
 * Fetch records with pagination
 */
export async function fetchPaginated<T extends TableName>(
  table: T,
  {
    page = 1,
    limit = 10,
    orderBy = 'created_at',
    ascending = false,
  }: {
    page?: number
    limit?: number
    orderBy?: string
    ascending?: boolean
  },
  client = supabaseClient
): Promise<{ data: Database['public']['Tables'][T]['Row'][]; count: number }> {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await client
    .from(table)
    .select('*', { count: 'exact' })
    .order(orderBy, { ascending })
    .range(from, to)

  if (error) {
    handleSupabaseError(error)
  }

  return {
    data: (data || []) as Database['public']['Tables'][T]['Row'][],
    count: count || 0,
  }
}

/**
 * Real-time subscription helper
 */
export function subscribeToTable<T extends TableName>(
  table: T,
  callback: (payload: Database['public']['Tables'][T]['Row']) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' = 'INSERT'
) {
  return supabaseClient
    .channel(`${String(table)}_changes`)
    .on(
      'postgres_changes' as any,
      {
        event,
        schema: 'public',
        table: String(table),
      },
      (payload) => callback(payload.new as Database['public']['Tables'][T]['Row'])
    )
    .subscribe()
} 