import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Create connection without database specified initially
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true // Allow multiple SQL statements
});

const initDatabase = async () => {
  try {
    console.log('🔄 Starting database initialization...');

    // Create database if it doesn't exist
    await connection.promise().execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log('✅ Database created or already exists');

    // Switch to the database using regular query (not prepared statement)
    await new Promise((resolve, reject) => {
      connection.query(`USE \`${process.env.DB_NAME}\``, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Database selected');

    // Users table
    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Products table
    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(500),
        stock_quantity INT DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Products table created');

    // Cart table
    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Cart table created');

    // Orders table
    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total_amount DECIMAL(10,2),
        status ENUM('pending', 'confirmed', 'shipped', 'delivered') DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Orders table created');

    // Order items table
    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT,
        price DECIMAL(10,2),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Order items table created');

    // Insert sample products
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
        price: 99.99,
        category: 'Electronics',
        image_url: '/placeholder-image.jpg',
        stock_quantity: 50,
        featured: true
      },
      {
        name: 'Smart Watch Series 5',
        description: 'Latest smartwatch with health monitoring features, GPS, and long battery life. Stay connected and track your fitness.',
        price: 199.99,
        category: 'Electronics',
        image_url: '/placeholder-image.jpg',
        stock_quantity: 30,
        featured: true
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable running shoes for all terrains with advanced cushioning technology. Perfect for athletes and casual runners.',
        price: 79.99,
        category: 'Sports',
        image_url: '/placeholder-image.jpg',
        stock_quantity: 100,
        featured: true
      },
      {
        name: 'Cotton T-Shirt',
        description: '100% cotton comfortable t-shirt available in multiple colors. Perfect for everyday wear.',
        price: 24.99,
        category: 'Clothing',
        image_url: '/placeholder-image.jpg',
        stock_quantity: 200,
        featured: false
      },
      {
        name: 'Laptop Backpack',
        description: 'Water-resistant laptop backpack with multiple compartments and USB charging port. Ideal for students and professionals.',
        price: 49.99,
        category: 'Accessories',
        image_url: '/placeholder-image.jpg',
        stock_quantity: 75,
        featured: false
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker with timer and programmable settings. Brew perfect coffee every morning.',
        price: 89.99,
        category: 'Home',
        image_url: '/placeholder-image.jpg',
        stock_quantity: 40,
        featured: true
      },
      {
        name: 'Smartphone Pro',
        description: 'Latest smartphone with advanced camera system, 5G connectivity, and all-day battery life.',
        price: 699.99,
        category: 'Electronics',
        image_url: '/placeholder-image.jpg',
        stock_quantity: 25,
        featured: true
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat for comfortable exercise with excellent grip and cushioning.',
        price: 29.99,
        category: 'Sports',
        image_url: '/placeholder-image.jpg',
        stock_quantity: 80,
        featured: false
      }
    ];

    for (const product of products) {
      try {
        await connection.promise().execute(
          `INSERT IGNORE INTO products (name, description, price, category, image_url, stock_quantity, featured) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [product.name, product.description, product.price, product.category, product.image_url, product.stock_quantity, product.featured]
        );
      } catch (error) {
        console.log(`⚠️  Product "${product.name}" already exists or error:`, error.message);
      }
    }
    console.log('✅ Sample products inserted');

    // Create demo users
    const saltRounds = 10;

    // Demo admin user
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    try {
      await connection.promise().execute(
        'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@bigshop.com', adminPassword, 'admin']
      );
      console.log('✅ Admin user created: admin@bigshop.com / admin123');
    } catch (error) {
      console.log('⚠️  Admin user already exists');
    }

    // Demo regular user
    const userPassword = await bcrypt.hash('user123', saltRounds);
    try {
      await connection.promise().execute(
        'INSERT IGNORE INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Demo User', 'user@bigshop.com', userPassword]
      );
      console.log('✅ Demo user created: user@bigshop.com / user123');
    } catch (error) {
      console.log('⚠️  Demo user already exists');
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Summary:');
    console.log('   - Database: bigshop_db');
    console.log('   - Tables: users, products, cart, orders, order_items');
    console.log('   - Sample data: 8 products, 2 users');
    console.log('');
    console.log('🔑 Demo Accounts:');
    console.log('   👑 Admin: admin@bigshop.com / admin123');
    console.log('   👤 User:  user@bigshop.com / user123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Full error:', error);
  } finally {
    connection.end();
    console.log('🔗 Database connection closed');
  }
};

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

initDatabase();