import { Request, Response } from 'express';
import dao from '../dao/dao';

export const getVendorsByMarket = async (req: Request, res: Response) => {
  const market = req.params.market;
  try {
    const vendors = await dao.getVendorsByMarket(market);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};