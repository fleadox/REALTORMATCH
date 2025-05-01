# Database Schema Documentation

## Overview

The authentication system uses PostgreSQL with the following schema structure:

## Tables

### 1. users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_email_verified ON users(email_verified);
```

### 2. sessions

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### 3. security_events

```sql
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_security_events_type_severity ON security_events(event_type, severity);
```

### 4. password_reset_tokens

```sql
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
```

### 5. monitoring_metrics

```sql
CREATE TABLE monitoring_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_attempts INTEGER NOT NULL,
    failed_attempts INTEGER NOT NULL,
    active_sessions INTEGER NOT NULL,
    average_response_time FLOAT NOT NULL,
    error_rate FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_monitoring_metrics_timestamp ON monitoring_metrics(timestamp);
```

## Security Policies

### Row Level Security (RLS)

```sql
-- Users table RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_self_access ON users
    FOR ALL
    TO authenticated
    USING (id = current_user_id());

-- Sessions table RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY sessions_self_access ON sessions
    FOR ALL
    TO authenticated
    USING (user_id = current_user_id());

-- Security events RLS
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY security_events_self_access ON security_events
    FOR SELECT
    TO authenticated
    USING (user_id = current_user_id());
```

## Functions

### 1. User Management

```sql
-- Create user function
CREATE OR REPLACE FUNCTION create_user(
    email TEXT,
    password_hash TEXT,
    name TEXT
) RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    INSERT INTO users (email, password_hash, name)
    VALUES (email, password_hash, name)
    RETURNING id INTO user_id;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update last login
CREATE OR REPLACE FUNCTION update_last_login(user_id UUID) RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET last_login = CURRENT_TIMESTAMP,
        failed_attempts = 0,
        locked_until = NULL
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Session Management

```sql
-- Create session function
CREATE OR REPLACE FUNCTION create_session(
    user_id UUID,
    token_hash TEXT,
    refresh_token_hash TEXT,
    device_info JSONB,
    ip_address INET,
    duration INTERVAL
) RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    INSERT INTO sessions (
        user_id,
        token_hash,
        refresh_token_hash,
        device_info,
        ip_address,
        expires_at
    )
    VALUES (
        user_id,
        token_hash,
        refresh_token_hash,
        device_info,
        ip_address,
        CURRENT_TIMESTAMP + duration
    )
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Security Functions

```sql
-- Log security event
CREATE OR REPLACE FUNCTION log_security_event(
    user_id UUID,
    event_type TEXT,
    severity TEXT,
    ip_address INET,
    user_agent TEXT,
    details JSONB
) RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO security_events (
        user_id,
        event_type,
        severity,
        ip_address,
        user_agent,
        details
    )
    VALUES (
        user_id,
        event_type,
        severity,
        ip_address,
        user_agent,
        details
    )
    RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Indexes

### Performance Indexes

```sql
-- Users table indexes
CREATE INDEX idx_users_last_login ON users(last_login);
CREATE INDEX idx_users_locked_until ON users(locked_until);

-- Sessions table indexes
CREATE INDEX idx_sessions_last_active ON sessions(last_active);
CREATE INDEX idx_sessions_token_expires ON sessions(token_hash, expires_at);

-- Security events indexes
CREATE INDEX idx_security_events_timestamp_severity ON security_events(created_at, severity);
```

## Triggers

### Automatic Timestamp Updates

```sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users table
CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Apply to sessions table
CREATE TRIGGER update_sessions_timestamp
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
```

## Maintenance

### Cleanup Jobs

```sql
-- Clean expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Clean old security events
CREATE OR REPLACE FUNCTION cleanup_old_security_events() RETURNS void AS $$
BEGIN
    DELETE FROM security_events 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql; 