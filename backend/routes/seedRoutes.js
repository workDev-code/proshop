import express from 'express';
import { seedDatabase } from '../controllers/seedController.js';

const router = express.Router();

// POST /api/seed
// Header: X-Seed-Key: <SEED_KEY from env or default 'proshop-seed-2026'>
// Query:  ?fresh=true (default) | false
//
// Body: none
//
// Examples:
//   curl -X POST -H "X-Seed-Key: proshop-seed-2026" https://proshop-api-xxx.onrender.com/api/seed
//   curl -X POST -H "X-Seed-Key: my-secret" "https://...?fresh=false"
router.post('/', seedDatabase);

export default router;
