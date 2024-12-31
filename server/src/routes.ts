import { Router } from 'express';
import { getVendorsByMarket, getRewards } from './controllers';

const router = Router();

router.get('/vendors/:market', getVendorsByMarket);
router.get('/rewards', getRewards);

export default router;