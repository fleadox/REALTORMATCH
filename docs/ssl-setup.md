# SSL/TLS Setup Guide

## Prerequisites
- Domain name with DNS access
- Server with root access
- OpenSSL installed

## 1. Generate SSL Certificate

### Option A: Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be stored in:
# - /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# - /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Option B: Self-Signed Certificate (Development Only)
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate CSR
openssl req -new -key private.key -out certificate.csr

# Generate self-signed certificate
openssl x509 -req -days 365 -in certificate.csr -signkey private.key -out certificate.crt
```

## 2. Configure Next.js

1. Update `.env.production`:
```env
SSL_CERT_PATH=/path/to/certificate.crt
SSL_KEY_PATH=/path/to/private.key
```

2. Configure SSL in `next.config.js`:
```javascript
module.exports = {
  server: {
    https: {
      key: process.env.SSL_KEY_PATH,
      cert: process.env.SSL_CERT_PATH,
    },
  },
}
```

## 3. Security Headers

Ensure these headers are set in your middleware:

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}
```

## 4. Certificate Renewal

### Let's Encrypt Auto-Renewal
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Add to crontab
sudo crontab -e
# Add line:
0 0 * * * certbot renew --quiet
```

## 5. SSL/TLS Best Practices

1. Use TLS 1.2 or higher
2. Enable HSTS
3. Use strong cipher suites
4. Disable weak protocols (SSL 3.0, TLS 1.0, 1.1)
5. Regular certificate renewal
6. Monitor certificate expiration

## 6. Testing SSL Configuration

1. Use SSL Labs to test your configuration:
   - Visit https://www.ssllabs.com/ssltest/
   - Enter your domain
   - Review the report

2. Check for common vulnerabilities:
   - Heartbleed
   - POODLE
   - BEAST
   - FREAK

## 7. Monitoring

1. Set up certificate expiration monitoring
2. Monitor SSL/TLS errors in logs
3. Set up alerts for certificate issues
4. Regular security scans

## 8. Troubleshooting

Common issues and solutions:

1. Certificate not trusted
   - Ensure proper certificate chain
   - Check intermediate certificates

2. Mixed content warnings
   - Update all resources to HTTPS
   - Use relative URLs

3. HSTS issues
   - Check preload status
   - Verify includeSubDomains

4. Certificate renewal failures
   - Check DNS configuration
   - Verify server accessibility
   - Review certbot logs 