# Authentication API Reference

## Base URL

```
Production: https://api.example.com/auth
Development: http://localhost:3000/auth
```

## Authentication Endpoints

### 1. User Registration

```http
POST /register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-04-30T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `409 Conflict`: Email already exists
- `422 Unprocessable Entity`: Password policy violation

### 2. User Login

```http
POST /login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 86400
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded
- `403 Forbidden`: Account locked

### 3. Two-Factor Authentication

```http
POST /2fa/verify
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "verified": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid code
- `401 Unauthorized`: Invalid token
- `410 Gone`: Code expired

### 4. Password Reset Request

```http
POST /password/reset-request
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Reset instructions sent",
  "expires_in": 3600
}
```

### 5. Password Reset

```http
POST /password/reset
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "reset_token_123",
  "new_password": "newSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid token
- `422 Unprocessable Entity`: Password policy violation

### 6. Token Refresh

```http
POST /token/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 86400
}
```

### 7. Logout

```http
POST /logout
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

### 8. Session Management

```http
GET /sessions
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "sessions": [
    {
      "id": "session_123",
      "device": "Chrome on MacOS",
      "ip": "192.168.1.1",
      "created_at": "2024-04-30T10:00:00Z",
      "last_active": "2024-04-30T11:00:00Z"
    }
  ]
}
```

### 9. Account Verification

```http
POST /verify-email
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "verification_token_123"
}
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully"
}
```

## Rate Limiting

- Default rate limit: 100 requests per 15 minutes
- Login endpoint: 5 attempts per minute
- Password reset: 3 requests per hour per email

## Security Headers

All endpoints include the following security headers:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Error Format

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {
      "field": "specific_field",
      "reason": "specific reason"
    }
  }
}
```

## Common Error Codes

- `AUTH001`: Invalid credentials
- `AUTH002`: Account locked
- `AUTH003`: Email not verified
- `AUTH004`: Invalid token
- `AUTH005`: Token expired
- `AUTH006`: Rate limit exceeded
- `AUTH007`: Invalid 2FA code
- `AUTH008`: Password policy violation 