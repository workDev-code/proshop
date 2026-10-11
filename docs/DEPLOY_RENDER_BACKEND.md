# 🚀 DEPLOY BACKEND LÊN RENDER — Step-by-step Runbook

> Thời gian cần: **~30 phút** (lần đầu). Sau đó mỗi lần push lên `main` sẽ tự
> động re-deploy trong ~2 phút.

---

## 📋 PRE-FLIGHT CHECKLIST

Trước khi bắt đầu, bạn cần:

| # | Cần có | Trạng thái |
|---|---|---|
| 1 | GitHub account (free) | ☐ |
| 2 | Code đã push lên GitHub | ☐ |
| 3 | Render account (free, đăng ký bằng GitHub) | ☐ |
| 4 | MongoDB Atlas account (free M0) | ☐ |
| 5 | MongoDB Atlas cluster đã tạo + có SRV connection string | ☐ |
| 6 | PayPal sandbox account (optional, cho payment test) | ☐ |

> ⚠️ **Không cần** gì khác. Tất cả đều free tier.

---

## 🚀 STEP 1: Push code lên GitHub

Nếu bạn chưa push code lên GitHub:

```bash
cd /home/killer/development/projects/proshop-v2

# Tạo repo mới trên https://github.com/new (đặt tên "proshop-v2", không tick Initialize)

git remote add origin https://github.com/<YOUR_USERNAME>/proshop-v2.git
git branch -M main
git push -u origin main
```

> ⚠️ **Quan trọng:** Đảm bảo không push file `.env`. Kiểm tra `.gitignore` đã có `.env` chưa:
> ```bash
> cat .gitignore | grep "^\.env"
> ```
> Nếu chưa có, thêm ngay:
> ```bash
> echo ".env" >> .gitignore
> git add .gitignore && git commit -m "chore: ensure .env ignored" && git push
> ```

Verify GitHub có code:
- Mở `https://github.com/<YOUR_USERNAME>/proshop-v2`
- Thấy file `render.yaml`, `backend/`, `frontend/`...

✅ **Hoàn thành Step 1.**

---

## 🍃 STEP 2: Tạo MongoDB Atlas Cluster (free M0)

### 2.1. Tạo account + cluster
1. Mở https://www.mongodb.com/atlas → **Try Free**
2. Đăng ký với Google/GitHub/Email
3. Sau khi login, click **+ Create a Deployment** (hoặc **Build a Database**)
4. Chọn:
   - **Plan:** M0 (FREE) — highlighted mặc định
   - **Provider:** AWS
   - **Region:** Chọn gần bạn nhất (ví dụ Singapore cho VN, hoặc US Virginia)
   - **Cluster Name:** `proshop-cluster` (hoặc tên bất kỳ)
5. Click **Create Deployment** — đợi 1-3 phút

### 2.2. Tạo database user
Sau khi cluster tạo xong, popup **Database Access** sẽ hiện:
1. Method: **Password**
2. Username: `proshop` (hoặc tên khác)
3. Password: Click **Autogenerate Secure Password** rồi **COPY LẠI**
   > ⚠️ Mật khẩu chỉ hiện 1 lần. Lưu vào notepad ngay.
4. User Privileges: **Read and write to any database**
5. Click **Add User**

### 2.3. Whitelist IP (cho phép Render connect)
1. Menu trái → **Network Access** (hoặc popup **Network Access**)
2. Click **+ Add IP Address**
3. Click **Allow Access from Anywhere** (auto-fill `0.0.0.0/0`)
4. Comment: `render-deploy`
5. Click **Add Entry**

### 2.4. Lấy connection string
1. Menu trái → **Database** (Deployments) → click vào cluster
2. Click **Connect** → **Drivers** (hoặc **Drivers** ở popup)
3. Driver: **Node.js**, Version: **6.0 or later**
4. Copy connection string, dạng:
   ```
   mongodb+srv://proshop:<password>@proshop-cluster.xxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Thay `<password>` bằng password thật** bạn vừa copy ở bước 2.2
6. Thêm tên database vào cuối: `...mongodb.net/proshop?retryWrites=true&w=majority`

✅ **Lưu connection string vào notepad**, dạng:
```
mongodb+srv://proshop:YOUR_PASSWORD@proshop-cluster.xxxx.mongodb.net/proshop?retryWrites=true&w=majority
```

✅ **Hoàn thành Step 2.**

---

## 🎨 STEP 3: Tạo Render Service

### 3.1. Đăng ký Render
1. Mở https://render.com
2. Click **Get Started for Free**
3. Đăng ký bằng **GitHub account** (khuyến nghị — sẽ auto-link repo)
4. Authorize Render truy cập GitHub

### 3.2. Tạo Blueprint (recommended)
1. Dashboard Render → click **New +** ở góc trên-phải
2. Chọn **Blueprint**
3. **Connect a repository:** search "proshop-v2", click vào repo của bạn
4. Render sẽ tự động detect file `render.yaml` và hiển thị:
   ```
   ┌────────────────────────────────────────────┐
   │  proshop-api                               │
   │  Type: Web Service · Plan: Free           │
   │  Branch: main · Region: Oregon             │
   │  Build: npm install --omit=dev             │
   │  Start: node backend/server.js            │
   │                                            │
   │         [ Apply ] ← click                  │
   └────────────────────────────────────────────┘
   ```
5. Click **Apply**
6. Render bắt đầu provisioning service (1-2 phút)

### 3.3. (Alternative nếu Blueprint không work) Manual setup
Nếu không dùng Blueprint:
1. Dashboard → **New +** → **Web Service**
2. **Connect a repository:** chọn GitHub repo `proshop-v2`
3. Cấu hình:
   - **Name:** `proshop-api`
   - **Region:** Oregon (hoặc same với Atlas)
   - **Branch:** `main`
   - **Root Directory:** (để trống)
   - **Runtime:** Node
   - **Build Command:** `npm install --omit=dev`
   - **Start Command:** `node backend/server.js`
   - **Plan:** Free
4. Click **Create Web Service**

✅ **Hoàn thành Step 3.**

---

## 🔐 STEP 4: Set Environment Variables

Sau khi service được tạo, vào tab **Environment** ở sidebar trái:

Click **+ Add Environment Variable** cho từng cái sau:

### 4.1. Biến BẮT BUỘC

| Key | Value | Ghi chú |
|---|---|---|
| `MONGO_URI` | `<paste your Atlas SRV string>` | ⚠️ đã thay `<password>` thật |
| `PAYPAL_CLIENT_ID` | `<your PayPal sandbox Client ID>` | Tạo tại https://developer.paypal.com → My Apps & Credentials |
| `PAYPAL_APP_SECRET` | `<your PayPal sandbox Secret>` | Cùng chỗ trên |

> ℹ️ `JWT_SECRET` đã được Render tự động generate (`generateValue: true`).
>   Bạn không cần set. Render sẽ tự tạo 1 secret random và inject vào env.

### 4.2. (Optional) PayPal sandbox setup
Nếu chưa có PayPal sandbox:
1. Mở https://developer.paypal.com → login
2. **Apps & Credentials** → tab **Sandbox**
3. Click **Create App** → name "proshop" → create
4. Copy **Client ID** + **Secret** → paste vào Render env

> ℹ️ PayPal sandbox cho phép test thanh toán không tốn tiền thật.

### 4.3. Save & Apply
- Sau khi add tất cả biến, click **Save Changes**
- Render sẽ tự động **trigger redeploy**
- Đợi 2-5 phút cho build xong

Theo dõi build log ở tab **Logs**:
```
==> Installing dependencies
==> Building...
==> Starting service
Server running in production mode on port 10000
MongoDB Connected: proshop-cluster-shard-00-02.xxxx.mongodb.net
```

✅ **Hoàn thành Step 4.**

---

## 🌱 STEP 5: Seed Database

Sau khi service chạy thành công, cần seed data (users, products, coupons):

1. Sidebar trái → tab **Shell**
2. Mở tab Shell (có thể mất 10-30s để kết nối)
3. Chạy lệnh:
   ```bash
   cd backend && node seeder.js
   ```
4. Output mong đợi:
   ```
   MongoDB Connected: proshop-cluster-shard-00-02.xxx.mongodb.net
   [7m[32mData Imported![39m[27m
   ```
5. Nếu thành công → đã có 8 products + 3 users + 4 coupons trong DB

### (Optional) Xác minh seed thành công
```bash
cd backend && node -e "
import('./config/db.js').then(async ({default: connectDB}) => {
  await connectDB();
  const User = (await import('./models/userModel.js')).default;
  const Product = (await import('./models/productModel.js')).default;
  const Coupon = (await import('./models/couponModel.js')).default;
  console.log('Users:', await User.countDocuments());
  console.log('Products:', await Product.countDocuments());
  console.log('Coupons:', await Coupon.countDocuments());
  process.exit();
});
"
```

Sẽ in ra: `Users: 3  Products: 8  Coupons: 4`

✅ **Hoàn thành Step 5.**

---

## ✅ STEP 6: Verify API hoạt động

Lấy URL service ở đầu trang Render dashboard (ví dụ):
```
https://proshop-api-xxxx.onrender.com
```

Test trong terminal:

```bash
# Health check
curl https://proshop-api-xxxx.onrender.com/
# → "API is running...."

# Get products
curl https://proshop-api-xxxx.onrender.com/api/products | python3 -m json.tool | head -20
# → Có 8 products trả về

# Login test
curl -X POST https://proshop-api-xxxx.onrender.com/api/users/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"john@email.com","password":"123456"}' \
  -c /tmp/cookies.txt
# → {"_id":"...","name":"John Doe","email":"john@email.com","isAdmin":false}

# Get coupons
curl https://proshop-api-xxxx.onrender.com/api/coupons \
  -b /tmp/cookies.txt
# → Cần admin login để get coupons (sẽ 401)
```

Hoặc test trong browser:
- Mở `https://proshop-api-xxxx.onrender.com/api/products` — thấy JSON 8 products
- Mở `https://proshop-api-xxxx.onrender.com/api/config/paypal` — thấy PayPal clientId

✅ **Hoàn thành Step 6.** API deployed và chạy!

---

## 🌐 STEP 7 (Optional): Custom Domain

Nếu bạn muốn dùng domain riêng (ví dụ `api.proshop.yourdomain.com`):

1. Render dashboard → **Settings** → **Custom Domains**
2. Click **+ Add Custom Domain**
3. Nhập: `api.yourdomain.com`
4. Render sẽ hiển thị DNS record cần thêm:
   ```
   CNAME api.proshop.yourdomain.com → proshop-api-xxxx.onrender.com
   ```
5. Vào nhà cung cấp domain (Cloudflare, Namecheap,...) thêm record đó
6. Đợi DNS propagate (5-30 phút)
7. Render tự động cấp SSL Let's Encrypt

✅ **Hoàn thành Step 7 (nếu cần).**

---

## 🔄 STEP 8: Auto-deploy on push

Render mặc định **auto-deploy** đã bật (`autoDeploy: true` trong `render.yaml`).

Workflow khi bạn push code mới:
```bash
# Code changes locally
git add .
git commit -m "fix: something"
git push origin main
```

Sau ~2 phút:
1. Render detect push trên GitHub
2. Trigger build mới
3. Run lại `npm install --omit=dev`
4. Restart service với code mới
5. Zero-downtime (Render tự drain connections cũ)

Kiểm tra trong tab **Events** của Render dashboard.

---

## 📊 MONITORING

| Tab | Xem gì |
|---|---|
| **Logs** | Realtime log từ server (stdout/stderr) |
| **Events** | Deploy history (mỗi lần push → 1 entry) |
| **Metrics** | CPU, memory, response time, request count |
| **Shell** | SSH vào container để chạy commands |

### Setup log alerts (optional)
Render không có free alerts, nhưng có thể:
1. Upgrade lên paid plan (giá từ $7/mo) → có alerts
2. Hoặc tích hợp **Sentry** (free tier) qua env vars

---

## 🛟 TROUBLESHOOTING

### ❌ Build fails: "Cannot find package 'express'"

**Nguyên nhân:** `npm install` không tìm thấy package.json

**Fix:**
- Verify `package.json` ở root, không phải `backend/`
- Trong Render: **Settings** → **Build Command** = `npm install --omit=dev`
- Đừng có `cd backend && npm install`

### ❌ Build fails: "MODULE_NOT_FOUND" cho dotenv, mongoose, etc

**Nguyên nhân:** Render chạy `npm install --omit=dev` bỏ qua devDependencies

**Fix:**
- Đảm bảo `dotenv`, `mongoose`, `express`... trong `dependencies` (không phải `devDependencies`)
- Xem `package.json` ở root, kiểm tra section `dependencies`

### ❌ Service crashes sau khi start: "Mongo connection error"

**Nguyên nhân:** Sai MONGO_URI hoặc IP chưa whitelist

**Fix:**
1. Verify `MONGO_URI` trong Render env var
2. Test URI local:
   ```bash
   # Trong local terminal
   MONGO_URI="mongodb+srv://..." node backend/server.js
   ```
3. Nếu local OK mà Render fail → check Atlas **Network Access**:
   - Đảm bảo `0.0.0.0/0` đã whitelist
   - Đợi 1-2 phút để propagate

### ❌ "Application failed to respond" trên health check

**Nguyên nhân:** Service listen sai port hoặc start command sai

**Fix:**
- Start command phải là: `node backend/server.js`
- Server.js phải listen `process.env.PORT || 10000`
- Đã làm sẵn trong code (xem `server.js`)

### ❌ API chậm / cold start

**Nguyên nhân:** Free tier Render sleep sau 15 phút idle → cold start ~30s

**Fix tạm thời:**
- Dùng [UptimeRobot](https://uptimerobot.com) (free) ping mỗi 5 phút
- Hoặc upgrade lên paid plan ($7/mo) để always-on

### ❌ 401 Unauthorized khi gọi /api/users/auth

**Nguyên nhân:** JWT_SECRET khác nhau giữa deploys (Render rotate secret)

**Fix:**
- Render tự generate JWT_SECRET mỗi deploy → cookies cũ invalid
- User phải login lại
- Hoặc set manual `JWT_SECRET` trong env để fix cố định

---

## 📈 SCALE UP (khi có nhiều user)

| Tier | Price | Specs | Phù hợp khi |
|---|---|---|---|
| Free | $0 | 0.5GB RAM, sleep sau 15min | Demo, portfolio |
| Starter | $7/mo | 0.5GB RAM, always-on | < 1000 visits/day |
| Standard | $25/mo | 2GB RAM, autoscaling | < 10000 visits/day |
| Pro | $85+/mo | 4GB+ RAM, multiple regions | Production |

---

## 🎯 Done checklist

Sau khi hoàn thành Step 6, bạn có:

- [x] Backend chạy ở `https://proshop-api-xxxx.onrender.com`
- [x] MongoDB Atlas có 8 products + 3 users + 4 coupons
- [x] Health check returns "API is running...."
- [x] Login với `john@email.com / 123456` thành công
- [x] Auto-deploy mỗi khi push lên `main`
- [x] Logs realtime xem được ở Render dashboard
- [x] Cost: $0/tháng

**Bước tiếp:** Deploy frontend lên Vercel (xem [DEPLOY_VERCEL_FRONTEND.md](./DEPLOY_VERCEL_FRONTEND.md) nếu có) — wire URL backend vào frontend.

---

## 🆘 Cần giúp?

- Xem [docs/DEPLOYMENT_PROPOSAL.md](./DEPLOYMENT_PROPOSAL.md) cho big-picture
- Render docs: https://render.com/docs
- Render community: https://community.render.com
- MongoDB Atlas docs: https://www.mongodb.com/docs/atlas
