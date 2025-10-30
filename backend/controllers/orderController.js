import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { shipping_address } = req.body;
    const userId = req.user.id;

    // Get user's cart items
    const cartItems = await Cart.getByUserId(userId);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total and check stock
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.quantity > item.stock_quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}` 
        });
      }
      totalAmount += item.price * item.quantity;
    }

    // Create order
    const orderResult = await Order.create({
      user_id: userId,
      total_amount: totalAmount,
      shipping_address
    });

    const orderId = orderResult.insertId;

    // Create order items
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    await Order.createOrderItems(orderId, orderItems);

    // Update product stock
    for (const item of cartItems) {
      await Product.updateStock(item.product_id, item.quantity);
    }

    // Clear user's cart
    await Cart.clearUserCart(userId);

    const order = await Order.getById(orderId);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.getByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns the order or is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};