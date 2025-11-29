import { Router } from 'express';
import {
  getProducts,
  createTransaction,
  getTransactions,
  getTransactionById
} from '../controllers/cashierController';

const router = Router();

router.get('/products', getProducts);
router.post('/transactions', createTransaction);
router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransactionById);

export default router;