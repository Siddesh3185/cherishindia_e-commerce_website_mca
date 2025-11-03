import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';
import './Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    cartLoading, 
    getCartTotal, 
    getCartItemsCount,
    clearCart 
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (cartLoading) {
    return <LoadingSpinner text="Loading cart..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{getCartItemsCount()} items in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Items</h2>
              <button 
                onClick={handleClearCart}
                className="btn btn-danger btn-sm"
              >
                Clear Cart
              </button>
            </div>
            
            <div className="cart-items">
              {cartItems.map(item => (
                <CartItem key={item.product_id || item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items ({getCartItemsCount()}):</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{getCartTotal() > 50 ? 'FREE' : '₹9.99'}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax:</span>
                <span>₹{(getCartTotal() * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>
                  ₹{(getCartTotal() + (getCartTotal() > 50 ? 0 : 9.99) + (getCartTotal() * 0.1)).toFixed(2)}
                </span>
              </div>

              <div className="shipping-notice">
                {getCartTotal() < 50 && (
                  <p>Add ₹{(50 - getCartTotal()).toFixed(2)} more for free shipping!</p>
                )}
              </div>

              <button 
                onClick={handleCheckout}
                className="btn btn-primary checkout-btn"
              >
                Proceed to Checkout
              </button>

              <Link to="/shop" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;