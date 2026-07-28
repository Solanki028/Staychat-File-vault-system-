import express from 'express';
import searchController from '../controllers/SearchController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', (req, res, next) => searchController.searchWorkspace(req, res, next));

export default router;
