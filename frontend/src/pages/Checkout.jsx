import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, getCartItemsCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'address', 'city', 'state', 'zipCode', 'phone'];
    for (let field of requiredFields) {
      if (!shippingInfo[field].trim()) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const paymentFields = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
    for (let field of paymentFields) {
      if (!paymentInfo[field].trim()) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }

    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      setError('Please enter a valid CVV');
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const shippingAddress = `
        ${shippingInfo.fullName}
        ${shippingInfo.address}
        ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}
        ${shippingInfo.country}
        Phone: ${shippingInfo.phone}
        Email: ${shippingInfo.email}
      `.trim();

      const orderData = {
        shipping_address: shippingAddress
      };

      const response = await ordersAPI.create(orderData);
      
      setOrderId(response.data.id);
      setOrderSuccess(true);
      await clearCart();
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (orderSuccess) {
    return (
      <div className="checkout-success">
        <div className="container">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            
            <div className="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> #{orderId}</p>
              <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
              <p><strong>Items:</strong> {getCartItemsCount()}</p>
            </div>

            <div className="success-actions">
              <button 
                onClick={() => navigate('/shop')}
                className="btn btn-primary"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => navigate('/orders')}
                className="btn btn-secondary"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="checkout-content">
          <form onSubmit={handleSubmitOrder} className="checkout-form">
            {/* Shipping Information */}
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="form-section">
              <h2>Payment Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Name on Card *</label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={handlePaymentChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-group-group">
                  <div className="form-group">
                    <label className="form-label">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      className="form-control"
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      className="form-control"
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary submit-order-btn"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="small" text="" /> : 'Place Order'}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.product_id || item.id} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 50 && (
                <div className="shipping-notice">
                  <p>Add ₹{(50 - subtotal).toFixed(2)} more for free shipping!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;