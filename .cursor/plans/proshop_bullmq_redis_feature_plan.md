# ProShop v2 — Feature Plan: Background Job + Queue System (BullMQ + Redis)

## 🎯 Goal

Build a production-style async job system for the ProShop backend using:

- Redis
- BullMQ
- Worker architecture
- Background processing
- Retry & failure handling

This feature is NOT just about sending emails.
The real purpose is to learn:

- async backend architecture
- system thinking
- producer/consumer flow
- failure handling
- scalability mindset
- background processing

---

# 🧠 Mental Model

Current flow:

```txt
Request
→ controller
→ database
→ response
```

New async flow:

```txt
Request
→ create job
→ return response immediately

Worker
→ process job in background
```

Important:

The request should NOT do heavy work.
The request should delegate work to background workers.

---

# 🧱 Tech Stack

## Required

- Node.js
- Express
- Redis
- BullMQ
- TypeScript (recommended)

---

# 📁 Suggested Folder Structure

```txt
src/
 ├── jobs/
 │    ├── queues/
 │    │     └── emailQueue.ts
 │    │
 │    ├── workers/
 │    │     └── emailWorker.ts
 │    │
 │    ├── producers/
 │    │     └── emailProducer.ts
 │    │
 │    ├── processors/
 │    │     └── emailProcessor.ts
 │    │
 │    └── redis/
 │          └── redisConnection.ts
 │
 ├── services/
 ├── controllers/
 ├── routes/
 └── app.ts
```

---

# 🚀 Learning Roadmap

## Phase 1 — Understand Queue Architecture

### Goal
Understand producer → queue → worker flow.

### Learn

- what Redis does
- what BullMQ does
- producer/consumer pattern
- background jobs
- async architecture

### Cursor Prompts

```txt
Explain BullMQ architecture like a senior backend engineer.
```

```txt
Explain producer-consumer flow using BullMQ and Redis.
```

```txt
Why should background jobs not run directly inside request handlers?
```

### Success Criteria

You can explain:

```txt
Controller
→ creates job
→ Redis stores job
→ Worker processes later
```

---

# 🔥 Phase 2 — Setup Redis + BullMQ

## Goal
Create working queue infrastructure.

### Tasks

- install BullMQ
- setup Redis connection
- create first queue
- test enqueue/dequeue

### Cursor Prompts

```txt
Setup BullMQ with Redis in Express backend using modular architecture.
```

```txt
Create reusable Redis connection for BullMQ.
```

```txt
Create a basic BullMQ queue named emailQueue.
```

### Success Criteria

- Redis connects successfully
- Queue receives jobs
- Worker can process jobs

---

# 📬 Phase 3 — Email Queue Feature

## Goal
Move email sending into background worker.

### Flow

```txt
User creates order
→ controller creates order
→ email job added to queue
→ response returned immediately

Worker
→ sends email later
```

### Tasks

- create email producer
- create email worker
- process email jobs
- log job status

### Cursor Prompts

```txt
Implement email queue using BullMQ for order confirmation emails.
```

```txt
Create producer function for enqueueing order confirmation email jobs.
```

```txt
Create BullMQ worker that processes email jobs.
```

### Important Concepts

- decoupling
- async processing
- request performance

### Success Criteria

- API responds immediately
- Email sends in background
- Worker logs success/failure

---

# ⚠️ Phase 4 — Retry & Failure Handling

## Goal
Learn production reliability patterns.

### Tasks

- retry failed jobs
- exponential backoff
- dead-letter strategy
- logging failed jobs

### Cursor Prompts

```txt
Add retry strategy with exponential backoff to BullMQ jobs.
```

```txt
How should failed jobs be handled in production systems?
```

```txt
Review this BullMQ retry configuration for reliability.
```

### Concepts To Learn

- transient failures
- retry strategies
- resilience
- fault tolerance

### Success Criteria

- failed jobs retry automatically
- retries stop after limit
- failed jobs logged clearly

---

# 🖼️ Phase 5 — Image Processing Queue

## Goal
Use queues for CPU-heavy work.

### Example Flow

```txt
Upload image
→ create image processing job
→ worker resizes/compresses image
→ upload cloud storage
```

### Tasks

- upload image
- enqueue processing job
- resize/compress image
- save processed URL

### Cursor Prompts

```txt
Design image processing pipeline using BullMQ.
```

```txt
Implement image processing worker using Sharp and BullMQ.
```

### Concepts To Learn

- CPU-heavy tasks
- async processing
- media pipeline

---

# 📦 Phase 6 — Inventory Queue

## Goal
Handle stock updates asynchronously.

### Example Flow

```txt
Order created
→ enqueue inventory update job
→ worker updates stock safely
```

### Concepts To Learn

- concurrency
- race conditions
- inventory consistency

### Cursor Prompts

```txt
Design inventory update queue for e-commerce backend.
```

```txt
What race conditions can happen in inventory systems?
```

---

# 🔍 Architecture Rules

## Always Follow

```txt
- Controllers should not contain heavy async work.
- Business logic stays outside routes.
- Workers process jobs independently.
- Keep queue setup modular.
- Log all failed jobs.
- Use retry strategies.
- Avoid blocking request lifecycle.
```

---

# ❌ Things NOT To Do

```txt
- Do NOT send emails directly inside controllers.
- Do NOT create Redis connections in multiple places.
- Do NOT mix queue logic with route definitions.
- Do NOT ignore failed jobs.
- Do NOT put business logic inside workers.
```

---

# 🧠 Key Concepts To Master

## 1. Producer

Creates jobs.

Example:

```txt
Order controller
→ add email job
```

---

## 2. Queue

Stores jobs temporarily.

---

## 3. Worker

Processes jobs independently.

---

## 4. Retry Strategy

Handles temporary failures.

---

## 5. Async Architecture

Heavy work should happen outside request-response cycle.

---

# 🔥 Real-World Engineering Thinking

When learning this feature, constantly ask:

```txt
What happens if Redis goes down?
What happens if email service fails?
What happens if worker crashes?
What happens if 1000 orders happen simultaneously?
How can duplicate jobs be prevented?
```

These questions are more important than syntax.

---

# 🧭 Suggested Workflow With Cursor

## 1. Understand

```txt
Explain the architecture first.
```

---

## 2. Design

```txt
Design producer-consumer flow.
```

---

## 3. Build Small

One prompt = one responsibility.

Examples:

```txt
Create Redis connection.
Create queue.
Create worker.
Create producer.
```

---

## 4. Review

```txt
Review this queue architecture for scalability and failure handling.
```

---

## 5. Refactor

Clean naming, structure, logging.

---

# 🏁 Final Goal

After finishing this feature, you should understand:

```txt
- background jobs
- async systems
- queue architecture
- Redis basics
- retry strategies
- worker systems
- production backend flow
```

This feature is the transition from:

```txt
CRUD Developer
→
Backend Engineer Thinking
```

