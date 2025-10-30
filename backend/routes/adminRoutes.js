import express from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/stats', getDashboardStats);

export default router;