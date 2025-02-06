import { Router } from 'express';
import { getVendorsByMarket, getAllProducts, resetDB } from './controllers';

const router = Router();

router.get('/products', getAllProducts);
router.get('/vendors/:market', getVendorsByMarket);
router.post('/reset', resetDB);

export default router;