import { promisePool } from '../config/db.js';

class OrderItem {
  static async getByOrderId(orderId) {
    const sql = `
      SELECT oi.*, p.name, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `;
    const [rows] = await promisePool.execute(sql, [orderId]);
    return rows;
  }

  static async create(orderId, items) {
    const sql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
    const values = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
    const [result] = await promisePool.query(sql, [values]);
    return result;
  }
}

export default OrderItem;