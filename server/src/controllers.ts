import { Request, Response } from 'express';
import dao from './dao';

export const getVendorsByMarket = async (req: Request, res: Response) => {
  const market = req.params.market;
  try {
    const vendors = await dao.getVendorsByMarket(market);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getRewards = async (req: Request, res: Response) => {
  try {
    const rewards = await dao.getAvailableRewards();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export const redeemReward = async (req: Request, res: Response) => {
  try {
    const redeemed = await dao.redeemReward(req.body['rewardID']);
    res.json(redeemed);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}