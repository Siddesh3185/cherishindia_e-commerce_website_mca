import { promisePool } from '../config/db.js';

class Cart {
  static async getByUserId(userId) {
    const sql = `
      SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity 
      FROM cart c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `;
    const [rows] = await promisePool.execute(sql, [userId]);
    return rows;
  }

  static async addItem(userId, productId, quantity = 1) {
    // Check if item already exists in cart
    const checkSql = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
    const [existing] = await promisePool.execute(checkSql, [userId, productId]);
    
    if (existing.length > 0) {
      // Update quantity if exists
      const updateSql = 'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
      const [result] = await promisePool.execute(updateSql, [quantity, userId, productId]);
      return result;
    } else {
      // Add new item
      const insertSql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
      const [result] = await promisePool.execute(insertSql, [userId, productId, quantity]);
      return result;
    }
  }

  static async updateQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return await this.removeItem(userId, productId);
    }
    
    const sql = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
    const [result] = await promisePool.execute(sql, [quantity, userId, productId]);
    return result;
  }

  static async removeItem(userId, productId) {
    const sql = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';
    const [result] = await promisePool.execute(sql, [userId, productId]);
    return result;
  }

  static async clearUserCart(userId) {
    const sql = 'DELETE FROM cart WHERE user_id = ?';
    const [result] = await promisePool.execute(sql, [userId]);
    return result;
  }

  static async getCartCount(userId) {
    const sql = 'SELECT SUM(quantity) as total FROM cart WHERE user_id = ?';
    const [rows] = await promisePool.execute(sql, [userId]);
    return rows[0].total || 0;
  }
}

export default Cart;