import { promisePool } from '../config/db.js';

class Product {
  static async getAll() {
    const sql = 'SELECT * FROM products WHERE stock_quantity > 0 ORDER BY created_at DESC';
    const [rows] = await promisePool.execute(sql);
    return rows;
  }

  static async getFeatured() {
    const sql = 'SELECT * FROM products WHERE featured = TRUE AND stock_quantity > 0 LIMIT 8';
    const [rows] = await promisePool.execute(sql);
    return rows;
  }

  static async getById(id) {
    const sql = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await promisePool.execute(sql, [id]);
    return rows[0];
  }

  static async getByCategory(category) {
    const sql = 'SELECT * FROM products WHERE category = ? AND stock_quantity > 0';
    const [rows] = await promisePool.execute(sql, [category]);
    return rows;
  }

  static async create(productData) {
    const { name, description, price, category, image_url, stock_quantity, featured } = productData;
    const sql = 'INSERT INTO products (name, description, price, category, image_url, stock_quantity, featured) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await promisePool.execute(sql, [name, description, price, category, image_url, stock_quantity, featured]);
    return result;
  }

  static async update(id, productData) {
    const { name, description, price, category, image_url, stock_quantity, featured } = productData;
    const sql = 'UPDATE products SET name=?, description=?, price=?, category=?, image_url=?, stock_quantity=?, featured=? WHERE id=?';
    const [result] = await promisePool.execute(sql, [name, description, price, category, image_url, stock_quantity, featured, id]);
    return result;
  }

  static async delete(id) {
    const sql = 'DELETE FROM products WHERE id = ?';
    const [result] = await promisePool.execute(sql, [id]);
    return result;
  }

  static async updateStock(id, quantity) {
    const sql = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?';
    const [result] = await promisePool.execute(sql, [quantity, id]);
    return result;
  }
}

export default Product;