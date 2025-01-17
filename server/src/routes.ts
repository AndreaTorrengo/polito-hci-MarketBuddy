import { Router } from 'express';
import { getVendorsByMarket, getRewards, getRedeemedRewards, redeemReward } from './controllers';

const router = Router();

router.get('/vendors/:market', getVendorsByMarket);
router.get('/rewards', getRewards);
router.get('/rewards/redeemed', getRedeemedRewards);
router.post('/rewards/redeem', redeemReward)

export default router;