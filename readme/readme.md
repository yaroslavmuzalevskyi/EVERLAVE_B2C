# Auth API

Handles authentication and session management.

Uses:

- JWT access tokens (short-lived)
- refresh tokens (long-lived)
- secure password hashing (bcrypt)
- database-stored refresh tokens

Base path:

```
/auth
```

---

# Authentication Model

## Access Token (short lived)

Used to access protected APIs.

- sent in `Authorization` header
- expires quickly (ex: 15 minutes)

```
Authorization: Bearer <accessToken>
```

---

## Refresh Token (long lived)

Used to obtain new access tokens.

- stored securely (httpOnly cookie or local storage)
- saved hashed in database
- can be revoked

---

# Flow

## Login

```
login → receive access + refresh
```

## Requests

```
send access token
```

## Expired

```
use refresh token → get new access
```

---

---

# Endpoints

---

## POST /auth/register

Create new user account.

---

### Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

---

### Validation

| Field    | Rules                   |
| -------- | ----------------------- |
| name     | 2–100 chars             |
| email    | valid email, lowercased |
| password | 8–128 chars             |

---

### Response (201)

```json
{
  "accessToken": "jwt",
  "refreshToken": "token"
}
```

---

---

## POST /auth/login

Login existing user.

---

### Body

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

---

### Response

```json
{
  "accessToken": "jwt",
  "refreshToken": "token"
}
```

---

---

## POST /auth/refresh

Issue new access token using refresh token.

---

### Body

```json
{
  "refreshToken": "token"
}
```

---

### Response

```json
{
  "accessToken": "jwt"
}
```

---

---

## POST /auth/logout

Invalidate current refresh token.

---

### Body

```json
{
  "refreshToken": "token"
}
```

---

### Behavior

- marks token revoked in DB
- cannot be reused

---

### Response

```json
{
  "success": true
}
```

---

---

# Protected Routes

All protected endpoints require:

```
Authorization: Bearer <accessToken>
```

Example:

```
GET /cart
GET /orders
POST /products/:id/reviews
```

---

---

# Security Details

## Passwords

- hashed using bcrypt
- never stored plain text

---

## Refresh Tokens

- stored hashed in DB
- individually revocable
- expire automatically

---

## Access Tokens

- short lifetime
- stateless
- signed with secret

---

---

# Typical Frontend Flow

## Register

```
POST /auth/register
→ store tokens
```

## Login

```
POST /auth/login
→ store tokens
```

## Use API

```
Authorization header
```

## Token expired

```
POST /auth/refresh
→ replace access token
```

## Logout

```
POST /auth/logout
```

---

---

# Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Validation error      |
| 401  | Invalid credentials   |
| 403  | Token revoked/expired |

---

---