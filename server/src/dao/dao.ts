import db from '../db/db';

const Dao = {

    getVendorsByMarket: async (market: string) => {
      try {
        const database = await db;
        const vendors = await database.all('SELECT * FROM vendors WHERE market = ?', [market]);
        return vendors;
      } catch (error) {
        throw new Error('Failed to retrieve vendors');
      }
    }
  };
  
  export default Dao;