import db from './db/db';
import { Vendor, Product, Reward } from './models';

const Dao = {

  getAllProducts: async () => {
    try {
      const database = await db;
      const products = await database.all('SELECT * FROM products');

      return products.map(product => new Product(product.id, product.name, product.price, product.image, product.points));
    } catch (error) {
      throw new Error('Failed to retrieve products');
    }
  },

  getVendorsByMarket: async (market: string) => {
    try {
      const database = await db;
      const vendors = await database.all('SELECT * FROM vendors WHERE market = ?', [market]);

      const vendorsArray = await Promise.all(vendors.map(async vendor => {
        const categories = await database.all('SELECT c.name FROM categories_vendor cv JOIN categories c ON cv.category_id = c.id WHERE cv.vendor_id = ?', [vendor.id]);
        const badges = await database.all('SELECT b.name FROM badges_vendor vb JOIN badges b ON vb.badge_id = b.id WHERE vb.vendor_id = ?', [vendor.id]);
        const products = await database.all('SELECT p.id, p.name, p.price, p.points, p.image FROM products_vendor pv JOIN products p ON pv.product_id = p.id WHERE pv.vendor_id = ?', [vendor.id]);

        return new Vendor(
          vendor.id,
          vendor.name,
          vendor.market,
          vendor.position.split(',').map(Number),
          vendor.quality_rating,
          vendor.convenience_rating,
          vendor.cordiality_rating,
          vendor.price_multiplier,
          categories.map(c => c.name),
          badges.map(b => b.name),
          products.map(p => new Product(p.id, p.name, p.price, p.image, p.points))
        );
      }));

      return vendorsArray;
    } catch (error) {
      throw new Error('Failed to retrieve vendors');
    }
  },
};

export default Dao;