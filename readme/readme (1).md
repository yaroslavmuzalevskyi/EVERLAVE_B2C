# Products API

Public read-only catalog endpoints.

Base path:

`/products`


---

# GET /products

Returns a paginated list of **active products only**.

This endpoint is **lightweight** and returns **minimal fields** for performance.

---

## Query Parameters

### Required

| Name  | Type   | Rules       | Description           |
| ----- | ------ | ----------- | --------------------- |
| page  | number | integer ≥ 1 | Page number (1-based) |
| limit | number | 1–32        | Items per page        |

---

### Optional

| Name     | Type   | Description                               |
| -------- | ------ | ----------------------------------------- |
| q        | string | Search by product name (case-insensitive) |
| category | string | Category slug                             |
| minPrice | number | Minimum price (cents)                     |
| maxPrice | number | Maximum price (cents)                     |
| sort     | string | Sorting rule (`field:direction`)          |

---

# Sorting

Format:

```
sort=field:direction,field:direction
```

Multiple fields are supported.

Priority is left → right.

---

### Fields

| Field     | Meaning            |
| --------- | ------------------ |
| price     | priceCents         |
| createdAt | creation date      |
| updatedAt | last update date   |
| sold      | most sold products |

---

### Examples

```
sort=price:asc
sort=updatedAt:desc
sort=createdAt:desc,updatedAt:desc
sort=sold:desc,price:asc
```

Default:

`createdAt:desc`


---

# Response Structure

Each product returns **only minimal data**.

Images are limited to **maximum 2 per product**.

```json
{
  "page": 1,
  "limit": 16,
  "total": 120,
  "items": [
    {
      "id": "uuid",
      "name": "Wireless Headphones",

      "content": {
        "description": "Short product description"
      },

      "priceCents": 12999,
      "currency": "EUR",
      "stockQty": 50,

      "images": [
        {
          "id": "uuid",
          "url": "https://...",
          "sortOrder": 0 // 0 - first image, 1 - second image, etc.
        }
      ],

      "category": {
        "id": "uuid",
        "name": "Audio",
        "slug": "audio"
      },

      "soldCount": 57,
      "ratingAvg": 5, // average review score
      "reviewCount": 2 // number of reviews
    }
  ]
}
```


---

# GET /products/:id

Returns **full product details** for a single product.

Unlike `/products` (list endpoint), this endpoint returns the **complete product object**.

Use this for:
- product detail page (PDP)
- full description
- all images
- full content JSON

---

## Path Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | UUID | Product ID  |

---

## Example

```
GET /products/7b7f2e9b-5a2c-4a62-b5df-6a5b2f3c1234
```

---

## Response

```json
{
  "id": "uuid",
  "name": "Wireless Headphones",

  "content": {
    "description": "Full description text",
    "keyFacts": ["Bluetooth 5.3", "30h battery"],
    "sections": [
      { "title": "Sound", "text": "Crystal clear audio" }
    ]
  },

  "priceCents": 12999,
  "currency": "EUR",
  "stockQty": 50,

  "images": [
    { "id": "uuid", "url": "...", "sortOrder": 0 },
    { "id": "uuid", "url": "...", "sortOrder": 1 },
    { "id": "uuid", "url": "...", "sortOrder": 2 }
  ],

  "category": {
    "id": "uuid",
    "name": "Audio",
    "slug": "audio"
  },

  "soldCount": 57,
  "ratingAvg": 5, // average review score
  "reviewCount": 2 // number of reviews

  "createdAt": "2026-02-09T12:00:00Z",
  "updatedAt": "2026-02-10T09:00:00Z"
}
```

---

## Behavior

- Returns **full `content` JSON** (not limited to description)
- Returns **all images** (no limit)
- Includes computed `soldCount`
- Returns `404` if product does not exist or is inactive

---