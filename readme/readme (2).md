# Reviews API

Handles product reviews and ratings.

Supports:

- listing reviews
- rating summary (avg + breakdown)
- creating reviews (auth required)
- deleting reviews (auth required)

Base paths:

```
/products/:id/reviews
/reviews/:id
```

---

# Public Endpoints

---

## GET /products/:id/reviews

Returns paginated list of reviews for a product.

### Query Parameters

| Name  | Type   | Rules       | Description      |
| ----- | ------ | ----------- | ---------------- |
| page  | number | integer ≥ 1 | Page number      |
| limit | number | 1–20        | Reviews per page |

---

### Example

```
GET /products/uuid/reviews?page=1&limit=10
```

---

### Response

```json
{
  "page": 1,
  "limit": 10,
  "total": 42,
  "items": [
    {
      "id": "uuid",
      "rating": 5,
      "text": "Amazing product!",
      "createdAt": "2026-02-10T12:00:00Z",
      "user": {
        "id": "uuid",
        "name": "John Doe"
      },
      "images": [
        {
          "id": "uuid",
          "url": "https://..."
        }
      ]
    }
  ]
}
```

---

---

## GET /products/:id/reviews/summary

Returns aggregated rating info.

Use this for:
- average rating display
- stars
- rating histogram

---

### Example

```
GET /products/uuid/reviews/summary
```

---

### Response

```json
{
  "count": 42,
  "avg": 4.6,
  "breakdown": {
    "1": 1,
    "2": 0,
    "3": 4,
    "4": 12,
    "5": 25
  }
}
```

---

---

# Authenticated Endpoints

Require:

```
Authorization: Bearer <accessToken>
```

---

## POST /products/:id/reviews

Create a review for a product.

Each user can create **only one review per product**.

(Enforced by database unique constraint)

---

### Body

```json
{
  "rating": 5,
  "text": "Great quality!",
  "images": [
    "https://cdn.example.com/img1.jpg",
    "https://cdn.example.com/img2.jpg"
  ]
}
```

---

### Fields

| Field  | Type     | Required | Rules          |
| ------ | -------- | -------- | -------------- |
| rating | number   | ✅        | 1–5            |
| text   | string   | ❌        | max 2000 chars |
| images | string[] | ❌        | max 5 URLs     |

---

### Notes

Do NOT send:

- userId
- productId

These are automatically derived from:
- JWT
- route param

---

### Response (201)

```json
{
  "id": "review_uuid",
  "rating": 5,
  "text": "Great quality!",
  "createdAt": "2026-02-10T12:00:00Z"
}
```

---

---

## DELETE /reviews/:id

Deletes a review.

Users may delete **only their own reviews**.

---

### Example

```
DELETE /reviews/uuid
```

---

### Response

```json
{
  "success": true
}
```

---

---

# Behavior & Rules

- one review per user per product
- images optional
- reviews sorted newest first
- summary endpoint is optimized for fast aggregation
- write operations require authentication

---

# Typical Flow (Frontend)

1. Load product page
2. GET `/products/:id/reviews/summary`
3. GET `/products/:id/reviews?page=1&limit=10`
4. User submits review → POST
5. Refresh summary + list

---

# Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | OK               |
| 201  | Created          |
| 400  | Validation error |
| 401  | Unauthorized     |
| 404  | Not found        |

---
