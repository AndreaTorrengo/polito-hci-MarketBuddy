import { Request, Response } from 'express';
import dao from './dao';
import { promises as fs } from 'fs';
import path from 'path';

export const getVendorsByMarket = async (req: Request, res: Response) => {
  const market = req.params.market;
  try {
    const vendors = await dao.getVendorsByMarket(market);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await dao.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const resetDB = async (req: Request, res: Response) => {
  // Restore the file db/marketbuddy.db.bak to db/marketbuddy.db
  const dbPath = path.resolve(__dirname, 'db/marketbuddy.db');
  const backupPath = path.resolve(__dirname, 'db/marketbuddy.db.bak');

  try {
    await fs.copyFile(backupPath, dbPath);
    res.status(200).json({ message: 'Database reset successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const backupDB = () => {
  const dbPath = path.resolve(__dirname, 'db/marketbuddy.db');
  const backupPath = path.resolve(__dirname, 'db/marketbuddy.db.bak');
  fs.copyFile(dbPath, backupPath);
}