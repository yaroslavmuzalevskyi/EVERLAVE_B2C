# Orders / Checkout API

Handles checkout and order history.

All endpoints require authentication.

---

# POST /checkout

Creates order from current cart.

Cart is cleared after successful checkout.

---

## Body

```json
{
  "address": {
    "fullName": "John Doe",
    "line1": "Street 1",
    "line2": "Apt 3",
    "city": "Luxembourg",
    "postalCode": "L-1234",
    "country": "LU"
  }
}
```

---

## Behavior

- reads cart
- snapshots product prices
- creates order + order_items
- saves delivery address
- clears cart

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

Returns all orders of the authenticated user with full details.

Includes:
- order items (snapshot)
- delivery address

---

## Example

```
GET /orders
```

---

## Response

```json
[
  {
    "id": "uuid",
    "status": "PAID",
    "totalAmountCents": 25998,
    "currency": "EUR",
    "createdAt": "2026-02-10T12:00:00Z",
    "items": [
      {
        "productName": "Headphones",
        "unitPriceCents": 12999,
        "qty": 2
      }
    ],
    "address": {
      "fullName": "John Doe",
      "line1": "Street 1",
      "city": "Luxembourg"
    }
  }
]
```

---

---

# Notes

- orders are immutable snapshots
- prices stored inside order_items
- cart cleared after checkout
