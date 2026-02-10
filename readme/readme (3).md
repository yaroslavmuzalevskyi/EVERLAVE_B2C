# Cart API

Handles the authenticated user's shopping cart.

Each user has **exactly one cart**.

The cart contains:
- products
- quantities
- calculated totals

All endpoints require authentication.

Base path:

```
/cart
```

Header required for every request:

```
Authorization: Bearer <accessToken>
```

---

# Behavior

- Cart is created automatically on first use
- One cart per user
- Adding the same product increases quantity
- Totals are calculated server-side
- Images limited to 1 per product for performance

---

---

# GET /cart

Returns the current user's cart.

If no cart exists yet, an empty one is created automatically.

---

## Example

```
GET /cart
```

---

## Response

```json
{
  "id": "uuid",
  "items": [
    {
      "product": {
        "id": "uuid",
        "name": "Wireless Headphones",
        "priceCents": 12999,
        "currency": "EUR",
        "stockQty": 50,
        "images": [
          {
            "id": "uuid",
            "url": "https://..."
          }
        ]
      },
      "qty": 2,
      "lineTotal": 25998
    }
  ],
  "subtotalCents": 25998
}
```

---

---

# POST /cart/items

Add a product to the cart.

If product already exists → quantity increases.

---

## Body

```json
{
  "productId": "uuid",
  "qty": 2
}
```

---

## Fields

| Field     | Type   | Required | Rules      |
| --------- | ------ | -------- | ---------- |
| productId | UUID   | ✅        | must exist |
| qty       | number | ✅        | 1–100      |

---

## Response

```json
{
  "success": true
}
```

---

---

# PATCH /cart/items/:productId

Update quantity of an item.

---

## Body

```json
{
  "qty": 5
}
```

---

## Behavior

- replaces quantity
- does not add

---

## Response

```json
{
  "success": true
}
```

---

---

# DELETE /cart/items/:productId

Remove a single product from cart.

---

## Example

```
DELETE /cart/items/uuid
```

---

## Response

```json
{
  "success": true
}
```

---

---

# DELETE /cart

Clear entire cart.

Removes all items but keeps cart record.

---

## Example

```
DELETE /cart
```

---

## Response

```json
{
  "success": true
}
```

---

---

# Notes

- all endpoints require authentication
- subtotal is computed server-side
- prices always stored in cents
- one image returned per product for performance
- duplicates prevented by `(cart_id, product_id)` unique constraint

---

# Typical Frontend Flow

1. GET `/cart`
2. POST items while shopping
3. PATCH quantities
4. DELETE unwanted items
5. Proceed to checkout

---

# Status Codes

| Code | Meaning           |
| ---- | ----------------- |
| 200  | OK                |
| 201  | Created           |
| 400  | Validation error  |
| 401  | Unauthorized      |
| 404  | Product not found |

---
