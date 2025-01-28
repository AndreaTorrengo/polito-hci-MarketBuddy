import { Router } from 'express';
import { getVendorsByMarket, getRewards, getRedeemedRewards, redeemReward, resetDB } from './controllers';

const router = Router();

router.get('/vendors/:market', getVendorsByMarket);
router.get('/rewards', getRewards);
router.get('/rewards/redeemed', getRedeemedRewards);
router.post('/rewards/redeem', redeemReward)
router.post('/reset', resetDB);

export default router;