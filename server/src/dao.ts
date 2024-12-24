import db from './db/db';
import { Vendor, Product } from './models';

const Dao = {

  getVendorsByMarket: async (market: string) => {
    try {
      const database = await db;
      const vendors = await database.all('SELECT * FROM vendors WHERE market = ?', [market]);

      const vendorsArray = await Promise.all(vendors.map(async vendor => {
        const badges = await database.all('SELECT b.name FROM badge_vendor bv JOIN badges b ON bv.badge_id = b.id WHERE bv.vendor_id = ?', [vendor.id]);
        const products = await database.all('SELECT p.id, p.name, p.description, p.price FROM product_vendor pv JOIN products p ON pv.product_id = p.id WHERE pv.vendor_id = ?', [vendor.id]);

        return new Vendor(
          vendor.id,
          vendor.name,
          vendor.market,
          vendor.position.split(',').map(Number),
          vendor.quality_rating, 
          vendor.price_rating,
          vendor.cordiality_rating,
          vendor.price_multiplier,
          badges.map(b => b.name),
          products.map(p => new Product(p.id, p.name, p.description, p.price))
        );
      }));

      return vendorsArray;
    } catch (error) {
      throw new Error('Failed to retrieve vendors');
    }
  }
};

export default Dao;