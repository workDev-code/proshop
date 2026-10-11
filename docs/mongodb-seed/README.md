# 📥 MongoDB Compass Import — ProShop Seed Data

> Use these JSON files when **Render Shell is unavailable** (free tier) or
> you prefer manual import via MongoDB Compass.

---

## 📦 Files in this folder

| File | Contents | Import into |
|---|---|---|
| `01-users.json`    | 3 users (admin, john, jane — all password `123456`) | `proshop.users` |
| `02-products.json` | 6 products (Apple AirPods → Amazon Echo Dot)        | `proshop.products` |
| `03-coupons.json`  | 4 coupons (WELCOME10, SAVE20, FLAT15, EXPIRED50)   | `proshop.coupons` |

---

## 🚀 Steps (5 phút)

### 1. Connect Compass to your Atlas cluster

Mở MongoDB Compass → connect tới cluster của bạn. Connection string dạng:
```
mongodb+srv://<user>:<password>@cluster0.4xgjvsc.mongodb.net/proshop
```

### 2. Create the `proshop` database

Click tab **Database** → **+ Create Database**:
- Database Name: `proshop`
- Collection Name: `products`
- Click **Create Database**

> (Chỉ cần tạo 1 collection trước, các collection khác sẽ tự động tạo khi import.)

### 3. Import JSON files

Lần lượt mở MongoDB Compass:

**`01-users.json`** — import vào `users` collection:
- Click collection `products` (vừa tạo) → bên trái không chọn
- Hoặc: Click `+ Create Collection` nếu chưa có → name = `users`
- Click vào collection `users` vừa tạo
- Click nút **`+ ADD DATA`** → **`Import JSON or CSV file`**
- Chọn file `01-users.json` → **Import**
- ✅ Thấy "3 documents inserted successfully"

**`02-products.json`** — vào collection `products` → IMPORT:
- Click `products` collection
- **`+ ADD DATA`** → **Import JSON or CSV file**
- Chọn `02-products.json` → **Import**
- ✅ 6 documents inserted

**`03-coupons.json`** — tạo collection mới + IMPORT:
- Click `+ Create Collection` → name = `coupons` → Create
- Click collection `coupons` → **Import JSON** → `03-coupons.json`
- ✅ 4 documents inserted

---

## ✅ Verify

Trong Compass, click vào database `proshop`:

```
proshop
├── products    (6 documents)
├── users       (3 documents)
└── coupons     (4 documents)
```

Click vào mỗi collection, kiểm tra:
- **users** có 3 entries: `admin@email.com`, `john@email.com`, `jane@email.com`
- **products** có 6 sản phẩm Apple/Amazon/Sony...
- **coupons** có 4 codes: WELCOME10 / SAVE20 / FLAT15 / EXPIRED50

---

## 🔐 Wire với Render

Sau khi data có sẵn:

### 1. Lấy SRV connection string

Atlas web → cluster → **Connect** → **Drivers** → Node.js 6.0+
Copy SRV string, thay `<password>` bằng password thật:

```
mongodb+srv://proshop:YOUR_PASSWORD@cluster0.4xgjvsc.mongodb.net/proshop?retryWrites=true&w=majority
```

### 2. Set MONGO_URI trên Render

- Render dashboard → `proshop-api` service
- Tab **Environment** (sidebar trái)
- **+ Add Environment Variable**:
  - Key: `MONGO_URI`
  - Value: `<paste SRV string ở trên>`
- **Save Changes** → Render redeploy ~1 phút

### 3. Test API

```bash
# Should return 6 products
curl https://proshop-api-tovz.onrender.com/api/products

# Should return {"name":"John Doe",...}
curl -X POST https://proshop-api-tovz.onrender.com/api/users/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"john@email.com","password":"123456"}'

# Should return discount=10
curl -X POST https://proshop-api-tovz.onrender.com/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME10","subtotal":100}'
```

---

## 📊 What data is in each file

### 01-users.json (3 docs)
| Email | Role | Password |
|---|---|---|
| `admin@email.com` | Admin | `123456` (bcrypt-hashed) |
| `john@email.com`  | Customer | `123456` (bcrypt-hashed) |
| `jane@email.com`  | Customer | `123456` (bcrypt-hashed) |

### 02-products.json (6 docs)
| Name | Brand | Price | Stock |
|---|---|---|---|
| Airpods Wireless | Apple | $89.99 | 10 |
| iPhone 13 Pro 256GB | Apple | $599.99 | 7 |
| Cannon EOS 80D | Cannon | $929.99 | 5 |
| Sony PS5 | Sony | $399.99 | 11 |
| Logitech G Gaming | Logitech | $49.99 | 7 |
| Amazon Echo Dot | Amazon | $29.99 | **0 (out of stock)** |

### 03-coupons.json (4 docs)
| Code | Type | Value | Min | Status |
|---|---|---|---|---|
| `WELCOME10` | percentage 10% | - | $50 | Active (expires +1 month) |
| `SAVE20`    | percentage 20% (cap $100) | - | $200 | Active (expires +1 month) |
| `FLAT15`    | fixed $15 | - | $30 | Active (expires +1 month) |
| `EXPIRED50` | percentage 50% | - | $0 | Expired (-1 year) — for testing validation |

---

## 🔄 Reset data

Nếu muốn reset lại từ đầu:
1. Trong Compass → click vào collection → **DELETE** (xóa hết docs)
2. Import lại JSON file tương ứng

Hoặc: xóa luôn database `proshop` rồi tạo lại và import cả 3 files.

---

## ⚠️ Compatibility notes

- **MongoDB version**: MongoDB 4.2+ for `$oid` shorthand
- **ObjectIds are pre-set** (`000...aa`, `100...a1` etc.) để tham chiếu giữa các collections không bị lệch
- **Timestamps** dùng `$date` syntax chuẩn Compass/MongoDB
- **Passwords** đã bcrypt-hashed với salt rounds 10 (giống code mẫu seeder.js)
