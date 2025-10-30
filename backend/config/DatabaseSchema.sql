CREATE DATABASE IF NOT EXISTS bigshop_db;
USE bigshop_db;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  stock_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10,2),
  status ENUM('pending', 'confirmed', 'shipped', 'delivered') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);



INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES
('Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation', 99.99, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 50),
('Smart Watch Series 5', 'Latest smartwatch with health monitoring features', 199.99, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 30),
('Running Shoes', 'Comfortable running shoes for all terrains', 79.99, 'Sports', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 100),
('Cotton T-Shirt', '100% cotton comfortable t-shirt', 24.99, 'Clothing', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 200),
('Laptop Backpack', 'Water-resistant laptop backpack with multiple compartments', 49.99, 'Accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 75),
('Coffee Maker', 'Automatic drip coffee maker with timer', 89.99, 'Home', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', 40);