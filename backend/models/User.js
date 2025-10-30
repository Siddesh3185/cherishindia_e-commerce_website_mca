import { promisePool } from '../config/db.js';

class User {
  static async create(userData) {
    const { name, email, password } = userData;
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await promisePool.execute(sql, [name, email, password]);
    return result;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await promisePool.execute(sql, [email]);
    return rows[0];
  }

  static async findById(id) {
    const sql = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    const [rows] = await promisePool.execute(sql, [id]);
    return rows[0];
  }

  static async update(id, userData) {
    const { name, email } = userData;
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    const [result] = await promisePool.execute(sql, [name, email, id]);
    return result;
  }
}

export default User;