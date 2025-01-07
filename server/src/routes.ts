import { Router } from 'express';
import { getVendorsByMarket, getRewards, redeemReward } from './controllers';

const router = Router();

router.get('/vendors/:market', getVendorsByMarket);
router.get('/rewards', getRewards);
router.post('/rewards/redeem', redeemReward)

export default router;