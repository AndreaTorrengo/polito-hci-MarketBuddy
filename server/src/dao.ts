import db from './db/db';
import { Vendor, Product } from './models';

const Dao = {

  getVendorsByMarket: async (market: string) => {
    try {
      const database = await db;
      const vendors = await database.all('SELECT * FROM vendors WHERE market = ?', [market]);

      const vendorsArray = await Promise.all(vendors.map(async vendor => {
        const badges = await database.all('SELECT badge_vendor FROM badges WHERE vendor_id = ?', [vendor.id]);
        const products = await database.all('SELECT * FROM product_vendor WHERE vendor_id = ?', [vendor.id]);

        return new Vendor(
          vendor.id,
          vendor.name,
          vendor.market,
          vendor.position.split(',').map(Number),
          vendor.priceMultiplier,
          badges.map(b => b.badge),
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