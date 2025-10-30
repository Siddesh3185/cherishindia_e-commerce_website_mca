
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemove();
      return;
    }
    
    setIsUpdating(true);
    await updateQuantity(item.product_id || item.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this item from cart?')) {
      setIsRemoving(true);
      setTimeout(async () => {
        await removeFromCart(item.product_id || item.id);
      }, 300);
    }
  };

  const subtotal = item.price * item.quantity;
  const hasDiscount = item.original_price && item.original_price > item.price;
  const discountAmount = hasDiscount ? (item.original_price - item.price) * item.quantity : 0;

  const isLowStock = item.stock_quantity && item.quantity >= item.stock_quantity;

  return (
    <div className={`cart-item ${isRemoving ? 'removing' : ''} ${isUpdating ? 'updating' : ''}`}>
      <div className="cart-item-image">
        <Link to={`/product/${item.product_id || item.id}`}>
          <img 
            src={item.image_url || '/placeholder-image.jpg'} 
            alt={item.name}
            loading="lazy"
          />
        </Link>
      </div>

      <div className="cart-item-details">
        <Link to={`/product/${item.product_id || item.id}`} className="cart-item-name">
          {item.name}
        </Link>
        <p className="cart-item-category">{item.category}</p>
        <div className="cart-item-price">
          ${item.price}
          {hasDiscount && (
            <>
              <span className="original-price">${item.original_price}</span>
              <span className="discount-badge">
                Save ${(item.original_price - item.price).toFixed(2)}
              </span>
            </>
          )}
        </div>
        {isLowStock && (
          <p className="stock-warning">⚠️ Limited stock available</p>
        )}
      </div>

      <div className="cart-item-quantity">
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="quantity-btn"
            disabled={item.quantity <= 1 || isUpdating}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button 
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="quantity-btn"
            disabled={item.stock_quantity && item.quantity >= item.stock_quantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-subtotal">
        <span className="subtotal-label">Subtotal</span>
        <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
        {discountAmount > 0 && (
          <span className="discount-badge" style={{ display: 'block', marginTop: '0.25rem' }}>
            You save ${discountAmount.toFixed(2)}
          </span>
        )}
      </div>

      <div className="cart-item-actions">
        <button 
          onClick={handleRemove}
          className="remove-btn"
          title="Remove item from cart"
          disabled={isUpdating}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CartItem;