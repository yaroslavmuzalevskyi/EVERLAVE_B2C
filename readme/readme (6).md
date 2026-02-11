# Orders & Checkout API

Handles:

- checkout (cart → order)
- order history
- delivery tracking
- order status lifecycle

All endpoints **require authentication**.


---

# Authentication

All routes require:

```
Authorization: Bearer <access_token>
```

---

# POST /checkout

Creates a new order from the user's current cart.

Behavior:

1. reads cart items
2. snapshots product prices
3. creates order + order items
4. saves delivery address
5. clears cart

---

## Request

```json
{
  "address": {
    "fullName": "John Doe",
    "line1": "Street 1",
    "city": "Luxembourg",
    "postalCode": "L-1234",
    "country": "LU",
    //optional (either pass with value or don't pass at all):
    "line2": "House 2",
    "phone": "+329323"
  }
}
```

### Example 1 (with optional fields):

```json
{
  "address": {
    "fullName": "John Doe",
    "line1": "Street 1",
    "city": "Luxembourg",
    "postalCode": "L-1234",
    "country": "LU",
    "line2": "House 2",
    "phone": "+329323"
  }
}
```

### Example 2 (without optional fields):

```json
{
  "address": {
    "fullName": "John Doe",
    "line1": "Street 1",
    "city": "Luxembourg",
    "postalCode": "L-1234",
    "country": "LU"
  }
}
```
---

## Response

```json
{
  "id": "uuid",
  "status": "PENDING",
  "totalAmountCents": 25998,
  "currency": "EUR"
}
```

---

---

# GET /orders

Returns paginated orders for the authenticated user.

Includes:

- order items snapshot
- delivery address
- tracking info
- full status

---

## Query Parameters (mandatory)

| Name  | Rules       |
| ----- | ----------- |
| page  | integer ≥ 1 |
| limit | 1–16        |

---

## Optional Filters

| Name   | Values                                                            |
| ------ | ----------------------------------------------------------------- |
| status | PENDING, PAID, SHIPPED, DELIVERED, COMPLETED, CANCELLED, REFUNDED |

---

## Examples

```
GET /orders?page=1&limit=10
GET /orders?page=1&limit=10&status=PAID
GET /orders?page=2&limit=16&status=SHIPPED
```

---

## Response

```json
{
  "page": 1,
  "limit": 10,
  "total": 24,
  "items": [
    {
      "id": "uuid",
      "status": "SHIPPED",
      "totalAmountCents": 25998,
      "currency": "EUR",

      "trackingNumber": "LX123456789" | null,
      "carrier": "DHL" | null,
      "trackingUrl": "https://dhl.com/track/LX123456789" | null,

      "shippedAt": "2026-02-10T12:00:00Z" | null,
      "deliveredAt": "2026-02-10T12:00:00Z" | null,
      "completedAt": "2026-02-10T12:00:00Z" | null,

      "items": [
        {
          "id": "record-uuid",
          "productId": "uuid",
          "productName": "Headphones",
          "unitPriceCents": 12999,
          "qty": 2
        }
      ],

      "address": {
        "fullName": "John Doe",
        "line1": "Street 1",
        "line2": "Apt 3" | null,
        "city": "Luxembourg",
        "postalCode": "L-1234",
        "country": "LU",
        "phone": "+32323" | null
      }
    }
  ]
}
```

---

---

# Order Lifecycle

Orders follow this state machine:

```
PENDING     → created, not paid
PAID        → payment confirmed
SHIPPED     → handed to courier
DELIVERED   → courier delivered
COMPLETED   → confirmed received

CANCELLED   → cancelled before shipping
REFUNDED    → money returned
```

---

# Tracking Fields

| Field          | Description             |
| -------------- | ----------------------- |
| trackingNumber | courier tracking number |
| carrier        | shipping provider       |
| trackingUrl    | external tracking link  |
| shippedAt      | shipment time           |
| deliveredAt    | delivery time           |
| completedAt    | order finalized         |

---
