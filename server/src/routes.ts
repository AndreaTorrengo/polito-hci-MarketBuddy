import { Router } from 'express';
import { getVendorsByMarket, getRewards, getRedeemedRewards, redeemReward, getAllProducts } from './controllers';

const router = Router();

router.get('/products', getAllProducts);
router.get('/vendors/:market', getVendorsByMarket);
router.get('/rewards', getRewards);
router.get('/rewards/redeemed', getRedeemedRewards);
router.post('/rewards/redeem', redeemReward)

export default router;