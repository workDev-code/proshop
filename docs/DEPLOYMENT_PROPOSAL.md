# 🚀 ProShop v2 — Cloud Deployment Proposal

> **Purpose:** Take ProShop from local development to live cloud deployment.
> Scope: prepare config files + runbook so you can deploy with **Vercel**
> (frontend) + **Render** (backend) + **MongoDB Atlas** (database) using only
> free tiers.

---

## 1. 🎯 Target architecture

```
                          ┌──────────────────────────┐
                          │      MongoDB Atlas        │
                          │      (M0 free tier)       │
                          │   ┌──────────────────┐   │
                          │   │  proshop database │   │
                          │   │  - users          │   │
                          │   │  - products       │   │
                          │   │  - orders         │   │
                          │   │  - coupons        │   │
                          │   └──────────────────┘   │
                          └────────────▲─────────────┘
                                       │ TLS
                                       │
                  ┌────────────────────┼─────────────────────┐
                  │                    │                      │
                  │ HTTPS              │ HTTPS                │
                  ▼                    ▼                      │
        ┌──────────────────┐  ┌──────────────────┐            │
        │  Vercel (Free)   │  │  Render (Free)   │            │
        │  ─────────────── │  │  ─────────────── │            │
        │  React SPA build │  │  Node + Express  │            │
        │  served via CDN  │─▶│  REST API        │            │
        │  /design-system  │  │  /api/products   │            │
        │  /wishlist       │  │  /api/users      │            │
        │  /search/:kw     │  │  /api/orders     │            │
        │  etc.            │  │  /api/coupons    │            │
        └──────────────────┘  └──────────────────┘            │
                  ▲                                            │
                  │   HTTPS (api.proshop.vercel.app proxy)     │
                  └────────────────────────────────────────────┘
                                  (or configured API URL)
```

| Component | Provider | Free tier limits | Best for |
|---|---|---|---|
| **Frontend** | Vercel | Unlimited bandwith, 100GB/mo, edge cache | React SPAs |
| **Backend** | Render | 750h/mo, sleeps after 15min idle | Node APIs |
| **Database** | MongoDB Atlas M0 | 512MB storage, shared CPU | Small datasets |

---

## 2. 📋 Pre-flight checklist (manual, user action)

Before deploying, you need:

### 2.1. Accounts (free)
- ☐ [GitHub](https://github.com) account (code already pushed)
- ☐ [Vercel](https://vercel.com) account (sign up with GitHub)
- ☐ [Render](https://render.com) account (sign up with GitHub)
- ☐ [MongoDB Atlas](https://www.mongodb.com/atlas) account
- ☐ (Optional) [PayPal Developer](https://developer.paypal.com) sandbox account

### 2.2. MongoDB Atlas setup
1. Create a free M0 cluster (any region)
2. Create a database user (e.g. `proshop` / strong password)
3. Whitelist IP: `0.0.0.0/0` (allow from anywhere) — Render uses dynamic IPs
4. Get the connection string:
   ```
   mongodb+srv://proshop:<password>@cluster0.xxxx.mongodb.net/proshop?retryWrites=true&w=majority
   ```

### 2.3. Production secrets (DO NOT commit)
- ☐ `MONGO_URI` (Atlas SRV string above)
- ☐ `JWT_SECRET` (new random 32+ char string, NOT the default `abc123`)
- ☐ `PAYPAL_CLIENT_ID` (production or keep sandbox for demo)
- ☐ `PAYPAL_APP_SECRET` (production or keep sandbox)
- ☐ `PAYPAL_API_URL` (default `https://api-m.sandbox.paypal.com`)

### 2.4. Image storage consideration
> ⚠️ Render's filesystem is **ephemeral** — uploads reset on every redeploy.
> For full production, the `uploads/` folder should move to **Cloudinary**
> (or S3). For portfolio demo this is acceptable to defer since image URLs
> from `/images/sample.jpg` are served from the frontend bundle, not from
> `/uploads/`. Document this as a known limitation.

---

## 3. 🛠️ Step-by-step deployment

### 3.1. Push to GitHub
```bash
git remote add origin https://github.com/<your-username>/proshop-v2.git
git push -u origin main
```

### 3.2. Deploy backend → Render

**Option A: render.yaml (infrastructure-as-code, recommended)**
1. Push repo to GitHub
2. In Render dashboard: **New + → Blueprint** → point to `render.yaml`
3. Render reads config, creates service, deploys
4. Set env vars in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000           # Render-injected, but explicit doesn't hurt
   MONGO_URI=<atlas-srv-string>
   JWT_SECRET=<new-32+-char-random>
   PAYPAL_CLIENT_ID=<your-paypal-client-id>
   PAYPAL_APP_SECRET=<your-paypal-secret>
   PAYPAL_API_URL=https://api-m.sandbox.paypal.com
   PAGINATION_LIMIT=8
   ```
5. Run DB seeder via Render's **Shell** tab:
   ```bash
   cd backend && node seeder.js
   ```

**Option B: manual UI setup**
- New + → Web Service
- Root directory: `backend`
- Build: `npm install`
- Start: `node server.js`
- Health check path: `/`
- Add same env vars as above
- Add MongoDB Atlas IP whitelist for `0.0.0.0/0`

### 3.3. Deploy frontend → Vercel

**Option A: Dashboard (5 minutes)**
1. vercel.com → **Add New Project** → import GitHub repo
2. **Configure Project**:
   - Root directory: `frontend`
   - Build command: `npm run build` (or keep default `react-scripts build`)
   - Output directory: `build` (default for CRA)
3. Add env var: `REACT_APP_API_URL` → your Render backend URL
   (e.g., `https://proshop-api.onrender.com`)
4. **Deploy** → Done in ~2 minutes

**Option B: CLI**
```bash
cd frontend
npm i -g vercel
vercel --prod
# Follow prompts, add REACT_APP_API_URL env var
```

### 3.4. Wire frontend → backend

After Render gives you `https://proshop-api.onrender.com`:

```bash
# In frontend/, replace proxy in package.json OR use env var
# Choice A: hardcode in constants.js
export const BASE_URL = 'https://proshop-api.onrender.com';

# Choice B: env-driven (RECOMMENDED)
# In constants.js:
#   export const BASE_URL = process.env.REACT_APP_API_URL || '';
# Set in Vercel: REACT_APP_API_URL=https://proshop-api.onrender.com
```

---

## 4. 📦 Files we'll create in this PR

| File | Purpose |
|---|---|
| `vercel.json` | Vercel project config (frontend, output dir, env) |
| `render.yaml` | Render blueprint (backend service spec, env refs) |
| `.github/workflows/ci.yml` | GitHub Actions: lint + test on every push |
| `.github/workflows/deploy.yml` | Auto-deploy main branch to Render + Vercel (optional) |
| `frontend/.env.example` | Sample env vars for `REACT_APP_API_URL` |
| `backend/.env.example` | Document backend env vars |
| `docs/DEPLOYMENT_PROPOSAL.md` | This document |
| Update `README.md` | Add "Deployment" section with steps + badges |

---

## 5. 🌐 CI/CD pipeline

```
        ┌─────────────────────────────────────────┐
        │  push to main branch on GitHub          │
        └─────────────────────┬───────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼                               ▼
   ┌────────────────────┐         ┌────────────────────┐
   │ GitHub Actions: CI │         │   Render CI        │
   │ ────────────────── │         │ ────────────────── │
   │ • Lint (ESLint)     │         │ • Detects push     │
   │ • Run tests        │         │ • Builds & deploys │
   │ • Build frontend   │         │ • Service stays up │
   └────────────────────┘         └────────────────────┘
                                          │
                                          ▼
                              Live at https://...
```

GitHub Actions runs in ~30 seconds, blocks merge if red.

---

## 6. 🔒 Security considerations

| Concern | Mitigation |
|---|---|
| Secrets in code | `.env` files gitignored; only `.env.example` committed |
| JWT_SECRET = 'abc123' | Generate new 64-char hex via `openssl rand -hex 32` |
| CORS | Backend allows `*` by default; restrict to `https://proshop-*.vercel.app` if needed |
| HTTPS | Vercel + Render both auto-issue Let's Encrypt certs |
| MongoDB injection | Mongoose sanitization by default; `.allowJS=false` strict schemas |
| File uploads | Multer is fine for demo; in prod, move to Cloudinary (signed URLs) |
| PayPal secret exposure | Never logged; passed only in server-to-server API calls |
| Rate limiting | Add `express-rate-limit` (10 commits planned but not yet implemented) |

---

## 7. 💸 Cost summary (all free tier)

| Service | Free limits | Estimated usage for demo |
|---|---|---|
| Vercel | 100GB/mo | < 5GB/mo for portfolio demo |
| Render | 750h/mo, 0.5GB RAM | < 100h/mo (sleeps after 15min idle) |
| MongoDB Atlas | 512MB | < 50MB seeded data |
| GitHub Actions | 2000min/mo | ~3min/PR → plenty |
| Total monthly | **$0** | **$0** for portfolio demo |

---

## 8. 📋 Acceptance criteria (deploy success)

- [ ] `https://proshop-v2.vercel.app` loads without console errors
- [ ] Can register a new user
- [ ] Can browse products, filter by category/brand
- [ ] Login as `john@email.com / 123456` works
- [ ] Can add product to wishlist (heart turns red)
- [ ] Can apply coupon `WELCOME10` at checkout
- [ ] Admin can CRUD coupons at `/admin/couponlist`
- [ ] `/design-system` shows 25+ components publicly
- [ ] Lighthouse score > 80 on mobile

---

## 9. ❓ Decisions to confirm

| # | Decision | Default I propose |
|---|---|---|
| 1 | Frontend URL | `https://proshop-v2.vercel.app` |
| 2 | Backend URL | `https://proshop-api.onrender.com` |
| 3 | Database | MongoDB Atlas M0 free |
| 4 | CI provider | GitHub Actions (you already use GitHub) |
| 5 | Custom domain? | Not for first deploy (Vercel/Render free subdomain is fine) |
| 6 | Auto-deploy on push? | Yes (Render auto-detects, Vercel same) |
| 7 | PayPal production? | Sandbox key is fine for demo |

---

## 10. 🚫 Out of scope (defer to v3)

- Custom domain + DNS
- Render persistent disk for `/uploads/` → switch to Cloudinary
- CDN for `/uploads/` images
- Rate limiting middleware (planned but not in MVP)
- Stripe / Razorpay / VNPay alternative payments
- Admin analytics dashboard on cloud (e.g. via Datadog)
- Sentry / LogRocket for production error tracking

---

## 11. ⏱ Effort estimate

| Step | User time |
|---|---|
| Create accounts (~15 minutes) | 15min |
| Push to GitHub | 1min |
| Deploy backend (Render) | 10min |
| Deploy frontend (Vercel) | 5min |
| Wire API URL + test | 5min |
| **Total user effort** | **~36 minutes** |

(My part: write all config files, create CI, update README — ~30 min)

---

> **Ready to proceed?** Confirm decisions above and I'll:
> 1. Create `vercel.json`, `render.yaml`, `.github/workflows/*.yml`
> 2. Add `.env.example` files (frontend + backend)
> 3. Update README with Deploy section + badges
> 4. Commit everything in 2-3 atomic commits
