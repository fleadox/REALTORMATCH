-- =================================================================
-- Role-Based Access Control
-- =================================================================

-- Create roles
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'app_admin') then
    create role app_admin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'app_user') then
    create role app_user;
  end if;
end
$$;

-- =================================================================
-- Enhanced Security Policies
-- =================================================================

-- Drop existing policies to avoid conflicts
drop policy if exists "Users can view their own user data" on public.users;
drop policy if exists "Users can update their own data" on public.users;
drop policy if exists "Users can view their own accounts" on public.accounts;
drop policy if exists "Users can manage their own accounts" on public.accounts;
drop policy if exists "Users can view their own sessions" on public.sessions;
drop policy if exists "Users can manage their own sessions" on public.sessions;
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can delete their own profile" on public.profiles;

-- Users table policies
create policy "Users can read their own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own basic info"
    on public.users for update
    using (auth.uid() = id)
    with check (
        auth.uid() = id
        and (
            -- Only allow updating specific fields
            coalesce(array_length(akeys(to_jsonb(new) - array['id', 'email', 'created_at', 'updated_at']::text[]), 1), 0) > 0
        )
    );

create policy "Admins have full access to users"
    on public.users for all
    using (auth.jwt()->>'role' = 'app_admin');

-- Profiles table policies with more granular control
create policy "Profiles are publicly readable"
    on public.profiles for select
    using (true);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

create policy "Users can delete their own profile"
    on public.profiles for delete
    using (auth.uid() = id);

-- Account security policies
create policy "Users can manage their own accounts"
    on public.accounts for all
    using (auth.uid() = user_id);

-- Session security policies with IP tracking
create policy "Users can manage their own sessions"
    on public.sessions for all
    using (auth.uid() = user_id);

-- =================================================================
-- Utility Functions
-- =================================================================

-- Function to safely delete a user and all their data
create or replace function public.delete_user(user_id uuid)
returns void as $$
declare
    _profile_id uuid;
begin
    -- Get the profile ID
    select id into _profile_id from public.profiles where id = user_id;
    
    -- Delete all related data
    delete from public.sessions where user_id = user_id;
    delete from public.accounts where user_id = user_id;
    delete from public.user_preferences where user_id = user_id;
    
    -- Delete profile and user
    delete from public.profiles where id = _profile_id;
    delete from public.users where id = user_id;
end;
$$ language plpgsql security definer;

-- Function to update user profile with validation
create or replace function public.update_user_profile(
    _user_id uuid,
    _username text,
    _full_name text,
    _bio text,
    _website text,
    _avatar_url text
)
returns public.profiles as $$
declare
    _profile public.profiles;
begin
    -- Validate username format
    if _username !~ '^[a-zA-Z0-9_]{3,30}$' then
        raise exception 'Invalid username format. Use 3-30 characters, alphanumeric and underscore only.';
    end if;
    
    -- Check username uniqueness
    if exists (
        select 1 from public.profiles
        where username = _username
        and id != _user_id
    ) then
        raise exception 'Username already taken.';
    end if;
    
    -- Update profile
    update public.profiles
    set
        username = _username,
        full_name = _full_name,
        bio = _bio,
        website = _website,
        avatar_url = _avatar_url,
        updated_at = now()
    where id = _user_id
    returning * into _profile;
    
    return _profile;
end;
$$ language plpgsql security definer;

-- Function to handle password reset requests
create or replace function public.create_password_reset_token(user_email text)
returns text as $$
declare
    _user_id uuid;
    _token text;
begin
    -- Find user
    select id into _user_id from public.users where email = user_email;
    if not found then
        -- Return success even if user not found (security through obscurity)
        return 'token_created';
    end if;
    
    -- Generate token
    _token := encode(gen_random_bytes(32), 'hex');
    
    -- Store token
    insert into public.verification_tokens (
        identifier,
        token,
        expires
    ) values (
        user_email,
        _token,
        now() + interval '1 hour'
    );
    
    return _token;
end;
$$ language plpgsql security definer;

-- =================================================================
-- Enhanced Triggers
-- =================================================================

-- Trigger function for audit logging
create or replace function public.process_audit_log()
returns trigger as $$
begin
    insert into public.audit_log (
        table_name,
        action,
        user_id,
        old_data,
        new_data,
        ip_address
    ) values (
        TG_TABLE_NAME,
        TG_OP,
        auth.uid(),
        case when TG_OP = 'DELETE' then to_jsonb(old) else null end,
        case when TG_OP in ('INSERT', 'UPDATE') then to_jsonb(new) else null end,
        current_setting('request.headers')::json->>'x-forwarded-for'
    );
    return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- Create audit log table
create table if not exists public.audit_log (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default now(),
    table_name text not null,
    action text not null,
    user_id uuid references public.users(id),
    old_data jsonb,
    new_data jsonb,
    ip_address text
);

-- Add audit triggers to important tables
create trigger audit_users_trigger
    after insert or update or delete on public.users
    for each row execute procedure public.process_audit_log();

create trigger audit_profiles_trigger
    after insert or update or delete on public.profiles
    for each row execute procedure public.process_audit_log();

-- Function to validate and clean profile data
create or replace function public.clean_profile_data()
returns trigger as $$
begin
    -- Clean and validate website URL
    if new.website is not null then
        -- Ensure website starts with http:// or https://
        if new.website !~ '^https?://' then
            new.website := 'https://' || new.website;
        end if;
    end if;
    
    -- Clean username
    if new.username is not null then
        -- Convert to lowercase and remove spaces
        new.username := lower(regexp_replace(new.username, '\s+', '', 'g'));
    end if;
    
    -- Sanitize bio
    if new.bio is not null then
        -- Remove excessive whitespace
        new.bio := regexp_replace(new.bio, '\s+', ' ', 'g');
        -- Truncate if too long
        new.bio := substring(new.bio, 1, 500);
    end if;
    
    return new;
end;
$$ language plpgsql;

-- Add data cleaning trigger to profiles
create trigger clean_profile_data_trigger
    before insert or update on public.profiles
    for each row execute procedure public.clean_profile_data();

-- =================================================================
-- Comments
-- =================================================================

comment on function public.delete_user is 'Safely deletes a user and all associated data';
comment on function public.update_user_profile is 'Updates user profile with validation';
comment on function public.create_password_reset_token is 'Creates a password reset token';
comment on function public.process_audit_log is 'Handles audit logging for important tables';
comment on function public.clean_profile_data is 'Validates and cleans profile data before save'; 