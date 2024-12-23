import { Router } from 'express';
import { getVendorsByMarket } from './controllers';

const router = Router();

router.get('/example', (req, res) => {
  res.send('This is an example GET route');
});


router.get('/vendors/:market', getVendorsByMarket);
export default router;