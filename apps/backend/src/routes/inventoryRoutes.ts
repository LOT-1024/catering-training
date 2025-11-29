import { Router } from 'express';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterialStock,
  updateMaterial,
  deleteMaterial,
  getStats,
  getCategories,
  restockMaterials
} from '../controllers/inventoryController';
import { validateMaterial } from '../middleware/validation';

const router = Router();

router.get('/materials', getMaterials);
router.get('/materials/stats', getStats);
router.get('/materials/categories', getCategories);
router.get('/materials/:id', getMaterialById);
router.post('/materials', validateMaterial, createMaterial);
router.patch('/materials/:id/stock', updateMaterialStock);
router.put('/materials/:id', validateMaterial, updateMaterial);
router.delete('/materials/:id', deleteMaterial);
router.post('/materials/restock/bulk', restockMaterials);

export default router;