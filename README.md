# 🛍️ BIGSHOP - E-commerce Platform

A modern, full-stack e-commerce web application built with React.js, Node.js, Express, and MySQL. BIGSHOP provides a complete online shopping experience with user authentication, product catalog, shopping cart, and order management.

![BIGSHOP](https://img.shields.io/badge/BIGSHOP-E--commerce-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)

## ✨ Features

### 🎯 Core Features
- **User Authentication** - Register, login, and secure JWT-based authentication
- **Product Catalog** - Browse products with search, filter, and categories
- **Shopping Cart** - Add, remove, and update items with persistent storage
- **Order Management** - Complete checkout process with order tracking
- **Responsive Design** - Mobile-first design that works on all devices
- **Admin Panel** - Manage products, orders, and users (Admin role)

### 🛠️ Technical Features
- **Frontend**: React.js with Context API for state management
- **Backend**: Node.js with Express.js framework
- **Database**: MySQL with proper relational schema
- **Authentication**: JWT tokens with bcrypt password hashing
- **API**: RESTful API design with proper error handling
- **Security**: CORS, input validation, and SQL injection protection

## 📁 Project Structure

```
bigshop-ecommerce/
│
├── backend/                 # Node.js/Express Backend
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── scripts/
│   │   └── initDB.js       # Database initialization
│   └── server.js           # Main server file
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main App component
│   └── public/             # Static files
│
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-app
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bigshop_db
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

#### 3. Database Setup
```bash
# Initialize database with sample data
npm run init-db
```

**Expected Output:**
```
🔄 Starting database initialization...
✅ Database created or already exists
✅ Database selected
✅ Users table created
✅ Products table created
✅ Cart table created
✅ Orders table created
✅ Order items table created
✅ Sample products inserted
✅ Admin user created: admin@bigshop.com / password123
✅ Demo user created: user@bigshop.com / password123
🎉 Database initialization completed successfully!
```

#### 4. Start Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

Backend will run on: `http://localhost:5000`

#### 5. Frontend Setup
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 🗄️ Database Schema

### Tables Overview

#### 1. `users` Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `products` Table
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  stock_quantity INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. `cart` Table
```sql
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### 4. `orders` & `order_items` Tables
```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10,2),
  status ENUM('pending', 'confirmed', 'shipped', 'delivered') DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

## 🔑 Demo Accounts

After running the database initialization, you'll have these demo accounts:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| 👑 Admin | `admin@bigshop.com` | `password123` | Full access to all features |
| 👤 User | `user@bigshop.com` | `password123` | Standard user features |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID

### Admin (Protected)
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/stats` - Get dashboard statistics

## 🎨 Frontend Components

### Core Components
- **Navbar** - Navigation with cart counter and user menu
- **ProductCard** - Product display component
- **CartItem** - Individual cart item with quantity controls
- **LoadingSpinner** - Loading indicator

### Pages
- **Home** - Landing page with featured products
- **Shop** - Product catalog with filters
- **ProductDetail** - Individual product page
- **Cart** - Shopping cart management
- **Checkout** - Order placement
- **Login/Register** - Authentication pages

### Context Providers
- **AuthContext** - User authentication state
- **CartContext** - Shopping cart state management

## 🔧 Development

### Running in Development Mode

#### Backend Development
```bash
cd backend
npm run dev
```
- Uses nodemon for auto-restart on file changes
- Debug mode enabled
- CORS configured for frontend development

#### Frontend Development
```bash
cd frontend
npm run dev
```
- Vite dev server with hot reload
- Proxy configured to backend API
- Source maps for debugging

### Building for Production

#### Backend Build
```bash
cd backend
npm start
```

#### Frontend Build
```bash
cd frontend
npm run build
```

### Environment Variables

#### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bigshop_db
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

#### Frontend (vite.config.js)
- API proxy configured for development
- Build optimization for production

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check MySQL service is running
sudo service mysql start  # Linux/Mac
net start mysql          # Windows

# Verify credentials in .env file
```

#### 2. Port Already in Use
```bash
# Kill process on port 3000 (Frontend)
npx kill-port 3000

# Kill process on port 5000 (Backend)  
npx kill-port 5000
```

#### 3. Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

#### 4. JSON Parse Errors
```bash
# Clear browser localStorage
localStorage.clear()

# Or clear specific keys
localStorage.removeItem('bigshop_user')
localStorage.removeItem('bigshop_token')
localStorage.removeItem('bigshop_cart')
```

### Debug Mode

#### Backend Debug
```bash
# Add to package.json scripts
"debug": "node --inspect server.js"
```

#### Frontend Debug
- Use React Developer Tools browser extension
- Check browser console for errors

## 📊 Sample Data

The database initialization includes:

### Products
- 8 sample products across different categories
- Electronics, Sports, Clothing, Accessories, Home
- Featured products marked for homepage display
- Realistic pricing and stock quantities

### Users
- Admin user with full privileges
- Regular user for testing customer features
- Secure password hashing with bcrypt

## 🛡️ Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **SQL Injection Protection** - Prepared statements
- **CORS Configuration** - Controlled API access
- **Input Validation** - Express validator middleware
- **XSS Protection** - Data sanitization

## 📱 Responsive Design

- **Mobile-first** approach
- **Flexbox** and **CSS Grid** layouts
- **Breakpoints** for tablets and desktops
- **Touch-friendly** interface elements

## 🔄 State Management

- **React Context API** for global state
- **useReducer** for complex state logic
- **Local Storage** persistence for cart
- **Optimistic updates** for better UX

