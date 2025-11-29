import { Router } from 'express';
import cashierRoutes from './cashierRoutes';
import inventoryRoutes from './inventoryRoutes';
import menuRoutes from './menuRoutes';

const router = Router();

router.use('/cashier', cashierRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/menu', menuRoutes);

export default router;