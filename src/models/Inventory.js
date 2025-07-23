const { db } = require('../utils/database');

class Inventory {
  static async findAll() {
    return db.all('SELECT * FROM inventory ORDER BY name ASC');
  }

  static async findById(id) {
    return db.get('SELECT * FROM inventory WHERE id = ?', [id]);
  }

  static async create(data) {
    const { name, description, category, quantity, price, expiry_date, status } = data;
    return db.run(
      'INSERT INTO inventory (name, description, category, quantity, min_stock, price, expiry_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, quantity, 10, price, expiry_date, status || 'active']
    );
  }

  static async update(id, data) {
    const { name, description, category, quantity, price, expiry_date, status } = data;
    return db.run(
      'UPDATE inventory SET name=?, description=?, category=?, quantity=?, min_stock=?, price=?, expiry_date=?, status=?, updated_at=NOW() WHERE id=?',
      [name, description, category, quantity, 10, price, expiry_date, status, id]
    );
  }

  static async delete(id) {
    return db.run('DELETE FROM inventory WHERE id = ?', [id]);
  }

  static async count() {
    const row = await db.get('SELECT COUNT(*) as count FROM inventory');
    return row ? row.count : 0;
  }

  static async countLowStock(threshold = 10) {
    const row = await db.get('SELECT COUNT(*) as count FROM inventory WHERE quantity <= min_stock', []);
    return row ? row.count : 0;
  }

  static async countExpired() {
    const row = await db.get('SELECT COUNT(*) as count FROM inventory WHERE expiry_date < CURDATE() AND expiry_date IS NOT NULL', []);
    return row ? row.count : 0;
  }

  static async getTotalValue() {
    const row = await db.get('SELECT SUM(quantity * price) as total FROM inventory WHERE price IS NOT NULL', []);
    return row ? (row.total || 0) : 0;
  }

  static async getStats() {
    const [totalItems, lowStock, expired, totalValue] = await Promise.all([
      this.count(),
      this.countLowStock(),
      this.countExpired(),
      this.getTotalValue()
    ]);
    
    return {
      totalItems,
      lowStock,
      expired,
      totalValue: parseFloat(totalValue).toFixed(2)
    };
  }
}

module.exports = Inventory;
