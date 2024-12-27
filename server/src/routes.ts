import { Router } from 'express';
import { getVendorsByMarket } from './controllers';

const router = Router();

router.get('/vendors/:market', getVendorsByMarket);

export default router;