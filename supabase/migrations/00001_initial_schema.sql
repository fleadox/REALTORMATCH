-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- =================================================================
-- Auth.js Required Tables
-- =================================================================

-- Users table (if not using Supabase Auth)
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    name text,
    email citext unique,
    email_verified timestamp with time zone,
    image text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- OAuth Accounts table
create table if not exists public.accounts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    type text not null,
    provider text not null,
    provider_account_id text not null,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (provider, provider_account_id)
);

-- Sessions table
create table if not exists public.sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.users(id) on delete cascade,
    expires timestamp with time zone not null,
    session_token text not null unique,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Verification tokens table
create table if not exists public.verification_tokens (
    identifier text,
    token text,
    expires timestamp with time zone not null,
    created_at timestamp with time zone default now(),
    primary key (identifier, token)
);

-- =================================================================
-- Extended Profile Information
-- =================================================================

-- Profiles table (extends user information)
create table if not exists public.profiles (
    id uuid primary key references public.users(id) on delete cascade,
    username citext unique,
    full_name text,
    avatar_url text,
    bio text,
    website text,
    location text,
    birth_date date,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- User preferences table
create table if not exists public.user_preferences (
    user_id uuid primary key references public.users(id) on delete cascade,
    theme text default 'light',
    notifications_enabled boolean default true,
    email_notifications boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- =================================================================
-- Indexes for Performance
-- =================================================================

-- Users indexes
create index if not exists users_email_idx on public.users (email);

-- Accounts indexes
create index if not exists accounts_user_id_idx on public.accounts (user_id);
create index if not exists accounts_provider_account_id_idx on public.accounts (provider, provider_account_id);

-- Sessions indexes
create index if not exists sessions_user_id_idx on public.sessions (user_id);
create index if not exists sessions_session_token_idx on public.sessions (session_token);

-- Profiles indexes
create index if not exists profiles_username_idx on public.profiles (username);

-- =================================================================
-- Security Policies (RLS)
-- =================================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.sessions enable row level security;
alter table public.verification_tokens enable row level security;
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;

-- Users policies
create policy "Users can view their own user data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own data"
    on public.users for update
    using (auth.uid() = id);

-- Accounts policies
create policy "Users can view their own accounts"
    on public.accounts for select
    using (auth.uid() = user_id);

create policy "Users can manage their own accounts"
    on public.accounts for all
    using (auth.uid() = user_id);

-- Sessions policies
create policy "Users can view their own sessions"
    on public.sessions for select
    using (auth.uid() = user_id);

create policy "Users can manage their own sessions"
    on public.sessions for all
    using (auth.uid() = user_id);

-- Profiles policies
create policy "Profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can delete their own profile"
    on public.profiles for delete
    using (auth.uid() = id);

-- User preferences policies
create policy "Users can view their own preferences"
    on public.user_preferences for select
    using (auth.uid() = user_id);

create policy "Users can update their own preferences"
    on public.user_preferences for update
    using (auth.uid() = user_id);

-- =================================================================
-- Functions and Triggers
-- =================================================================

-- Function to handle updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql security definer;

-- Add updated_at triggers to all tables
create trigger handle_updated_at
    before update on public.users
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.accounts
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.sessions
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.profiles
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.user_preferences
    for each row
    execute procedure public.handle_updated_at();

-- Function to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, username)
    values (new.id, new.email);
    
    insert into public.user_preferences (user_id)
    values (new.id);
    
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile and preferences for new users
create trigger on_auth_user_created
    after insert on public.users
    for each row execute procedure public.handle_new_user();

-- =================================================================
-- Comments
-- =================================================================

comment on table public.users is 'Auth.js users table for authentication';
comment on table public.accounts is 'OAuth accounts information for Auth.js';
comment on table public.sessions is 'User sessions for Auth.js';
comment on table public.verification_tokens is 'Verification tokens for email verification and password reset';
comment on table public.profiles is 'Extended user profile information';
comment on table public.user_preferences is 'User preferences and settings'; 