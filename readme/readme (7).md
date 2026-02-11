# Reviews API

Handles product reviews.

Supports:

- public listing
- pinned user's review
- review creation
- review deletion

---

# Base Path

```
/products/:id/reviews
```

---

# Authentication Model

## Public (no auth required)

```
GET /products/:id/reviews
GET /products/:id/reviews/summary
```

If a token is provided, the response is personalized.

---

## Protected

```
POST   /products/:id/reviews
DELETE /reviews/:id
```

Require:

```
Authorization: Bearer <access_token>
```

---

---

# GET /products/:product_id/reviews

Returns paginated reviews for a product.

If authenticated:

- adds `isMine`
- pins user's review first on page 1
- returns `id` ONLY for user's own review

---

## Query Parameters (mandatory)

| Name  | Rules       |
| ----- | ----------- |
| page  | integer ≥ 1 |
| limit | integer ≥ 1 |

---

## Example

```
GET /products/uuid/reviews?page=1&limit=10
```

---

# Response (guest)

```json
{
  "page": 1,
  "limit": 10,
  "total": 12,
  "items": [
    {
      "rating": 5,
      "text": "Great product",
      "createdAt": "2026-02-10T10:00:00Z",
      "user": {
        "name": "Alice"
      },
      "images": [
        { "url": "https://..." }
      ]
    }
  ]
}
```

---

# Response (authenticated)

If the user has a review:

```json
{
  "page": 1,
  "limit": 10,
  "total": 12,
  "items": [
    {
      "id": "review-uuid",
      "rating": 5,
      "text": "My review",
      "createdAt": "2026-02-10T10:00:00Z",
      "isMine": true,
      "user": {
        "name": "John"
      },
      "images": [
        { "url": "https://..." }
      ]
    },
    {
      "rating": 4,
      "text": "Good",
      "isMine": false,
      "user": {
        "name": "Alice"
      },
      "images": [
        { "url": "https://..." }
      ]
    }
  ]
}
```

---

---

# Field Rules

## Review

| Field      | Notes                               |
| ---------- | ----------------------------------- |
| id         | ONLY returned for user's own review |
| rating     | 1–5                                 |
| text       | review text                         |
| createdAt  | timestamp                           |
| isMine     | only when authenticated             |
| user.name  | display only                        |
| images.url | image only                          |



---

# GET /products/:product_id/reviews/summary

Returns aggregated rating stats.

---

## Response

```json
{
  "ratingAvg": 4.6,
  "reviewCount": 37
}
```

---

# POST /products/:product_id/reviews

Create OR Replace user's review.

A new review will be created if there is 0 from this user for the product.

An old review will be updated if the user already reviewed this product.

Auth required.

---

## Example for create/update with ALL optional parameters

```json
{
  "rating": 5,
  "text": "Excellent!",
  "images": ["https://..."]
}
```

## Example for create/update with NO optional parameters (DO NOT PASS THEM AT ALL, setting value to null throws error)

```json
{
  "rating": 5
}
```

---

## Behavior

- one review per user per product
- creates if not exists (201)
- updates if exists (201)

---

---

# DELETE /reviews/:review_id

Delete user's own review.

Auth required.

---

## Response (200)

```json
{
  "success": true
}
```

---

# Personalization Logic

When authenticated:

1. system checks for user's review
2. if exists:
   - returned first on page 1
   - marked `isMine: true`
   - includes review `id`
3. others:
   - `isMine: false`
   - no id

---
