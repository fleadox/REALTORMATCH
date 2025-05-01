# Authentication Troubleshooting Guide

## Common Issues and Solutions

### 1. Login Failures

#### Invalid Credentials
**Symptoms:**
- User receives "Invalid credentials" error
- Failed login attempts increase

**Solutions:**
1. Check user email case sensitivity
2. Verify password hash algorithm is correct
3. Check for account lock status
4. Review failed attempts counter

```typescript
// Check account status
const checkAccountStatus = async (email: string) => {
  const user = await db.users.findUnique({ where: { email } });
  if (user?.locked_until && user.locked_until > new Date()) {
    throw new Error(`Account locked until ${user.locked_until}`);
  }
};
```

#### Account Locked
**Symptoms:**
- User receives "Account locked" message
- Multiple failed login attempts recorded

**Solutions:**
1. Check lock duration in settings
2. Review security logs for suspicious activity
3. Reset failed attempts counter
4. Update lock status

```sql
-- Reset account lock
UPDATE users
SET locked_until = NULL,
    failed_attempts = 0
WHERE email = $1;
```

### 2. Session Issues

#### Token Invalid/Expired
**Symptoms:**
- User suddenly logged out
- "Invalid token" errors
- Session not recognized

**Solutions:**
1. Check token expiration time
2. Verify token signature
3. Check for clock sync issues
4. Review token blacklist

```typescript
// Validate token
const validateToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const isBlacklisted = await checkTokenBlacklist(token);
    return !isBlacklisted;
  } catch (error) {
    return false;
  }
};
```

#### Multiple Sessions
**Symptoms:**
- Unexpected logouts
- Session conflicts
- Different devices showing inconsistent state

**Solutions:**
1. Review session management settings
2. Check device limits
3. Implement session invalidation
4. Update session tracking

### 3. Two-Factor Authentication

#### Code Not Received
**Symptoms:**
- 2FA code never arrives
- Timeout errors
- Invalid code errors

**Solutions:**
1. Verify email/phone settings
2. Check rate limiting
3. Review provider status
4. Check code generation

```typescript
// Regenerate 2FA code
const regenerate2FACode = async (userId: string) => {
  const code = generateTOTP();
  await cache.set(`2fa:${userId}`, code, '5m');
  return sendCode(userId, code);
};
```

#### TOTP Sync Issues
**Symptoms:**
- Valid codes rejected
- Time-based codes out of sync
- Multiple failed attempts

**Solutions:**
1. Check server time sync
2. Verify TOTP settings
3. Adjust time window
4. Reset TOTP secret

### 4. Password Reset

#### Reset Link Issues
**Symptoms:**
- Reset link expired
- Link invalid
- Multiple reset requests

**Solutions:**
1. Check token expiration
2. Verify email delivery
3. Review rate limiting
4. Check token format

```typescript
// Validate reset token
const validateResetToken = async (token: string) => {
  const record = await db.passwordResetTokens.findUnique({
    where: { token_hash: hashToken(token) }
  });
  return record && !record.used && record.expires_at > new Date();
};
```

#### Email Delivery
**Symptoms:**
- Reset emails not received
- Delayed delivery
- Spam folder issues

**Solutions:**
1. Check email service status
2. Verify email templates
3. Review spam settings
4. Check email logs

### 5. Performance Issues

#### Slow Authentication
**Symptoms:**
- Long login times
- Timeout errors
- High latency

**Solutions:**
1. Check database indexes
2. Review cache settings
3. Monitor connection pool
4. Optimize queries

```sql
-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_users_auth ON users(email, password_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_lookup ON sessions(token_hash, user_id);
```

#### High Memory Usage
**Symptoms:**
- Server memory spikes
- Slow response times
- Connection errors

**Solutions:**
1. Review session storage
2. Check memory leaks
3. Optimize caching
4. Monitor resource usage

### 6. Security Alerts

#### Brute Force Attempts
**Symptoms:**
- Multiple failed logins
- IP address patterns
- Rate limit hits

**Solutions:**
1. Review security logs
2. Update rate limits
3. Block suspicious IPs
4. Enable additional monitoring

```typescript
// Monitor suspicious activity
const monitorLoginAttempts = async (ip: string, email: string) => {
  const attempts = await getRecentAttempts(ip);
  if (attempts > THRESHOLD) {
    await blockIP(ip);
    await notifySecurityTeam({
      type: 'brute_force',
      ip,
      email,
      attempts
    });
  }
};
```

#### Suspicious Activity
**Symptoms:**
- Unusual login patterns
- Geographic anomalies
- Multiple device logins

**Solutions:**
1. Enable location tracking
2. Implement device fingerprinting
3. Set up alerts
4. Review security logs

## Diagnostic Tools

### 1. Log Analysis

```bash
# Search authentication failures
grep "authentication failed" /var/log/auth.log

# Check rate limiting
grep "rate limit exceeded" /var/log/nginx/error.log

# Monitor security events
tail -f /var/log/security_events.log
```

### 2. Database Queries

```sql
-- Check locked accounts
SELECT email, failed_attempts, locked_until
FROM users
WHERE locked_until > CURRENT_TIMESTAMP;

-- Review active sessions
SELECT u.email, s.device_info, s.ip_address, s.last_active
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > CURRENT_TIMESTAMP;
```

### 3. Monitoring Commands

```bash
# Check service status
systemctl status auth-service

# Monitor API endpoints
curl -v https://api.example.com/auth/health

# Test rate limiting
ab -n 1000 -c 10 https://api.example.com/auth/login
```

## Prevention Checklist

1. Regular Maintenance:
   - [ ] Review security logs daily
   - [ ] Monitor failed login attempts
   - [ ] Check system resources
   - [ ] Update security rules

2. Performance Optimization:
   - [ ] Review database indexes
   - [ ] Check cache hit rates
   - [ ] Monitor response times
   - [ ] Optimize queries

3. Security Measures:
   - [ ] Update rate limits
   - [ ] Review access patterns
   - [ ] Check for vulnerabilities
   - [ ] Update security policies 