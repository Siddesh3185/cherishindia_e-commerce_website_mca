import { promisePool } from '../config/db.js';

class Order {
  static async create(orderData) {
    const { user_id, total_amount, shipping_address } = orderData;
    const sql = 'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)';
    const [result] = await promisePool.execute(sql, [user_id, total_amount, shipping_address]);
    return result;
  }

  static async createOrderItems(orderId, items) {
    const sql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
    const values = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
    const [result] = await promisePool.query(sql, [values]);
    return result;
  }

  static async getByUserId(userId) {
    const sql = `
      SELECT o.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'name', p.name,
                 'image_url', p.image_url
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const [rows] = await promisePool.execute(sql, [userId]);
    return rows;
  }

  static async getAll() {
    const sql = `
      SELECT o.*, u.name as user_name, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    const [rows] = await promisePool.execute(sql);
    return rows;
  }

  static async updateStatus(orderId, status) {
    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    const [result] = await promisePool.execute(sql, [status, orderId]);
    return result;
  }

  static async getById(orderId) {
    const sql = `
      SELECT o.*, u.name as user_name, u.email,
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'name', p.name,
                 'image_url', p.image_url
               )
             ) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id
    `;
    const [rows] = await promisePool.execute(sql, [orderId]);
    return rows[0];
  }
}

export default Order;