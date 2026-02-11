# Categories API

Public endpoint for retrieving product categories.

# Base Path

```
/categories
```

---

# GET /categories

Returns all categories.

---

## Request

```
GET /categories
```

No headers required.

---

## Response

```json
[
  {
    "id": "uuid",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Headphones, speakers, gadgets"
  },
  {
    "id": "uuid",
    "name": "Accessories",
    "slug": "accessories",
    "description": "Cables, cases, chargers"
  }
]
```

---

# Returned Fields

| Field       | Type   | Description              |
| ----------- | ------ | ------------------------ |
| id          | uuid   | category id              |
| name        | string | display name             |
| slug        | string | URL-safe identifier      |
| description | string | short description for UI |

---

# Notes

- always sorted by name (ascending)

---