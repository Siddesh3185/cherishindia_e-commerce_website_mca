
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock_quantity === 0) return;
    
    setIsAdding(true);
    const result = await addToCart(product);
    if (result.success) {
      // You can replace this with a toast notification
      console.log('Product added to cart!');
    } else {
      console.error(result.error);
    }
    setTimeout(() => setIsAdding(false), 500);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star">☆</span>);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star" style={{ opacity: 0.3 }}>★</span>);
    }

    return stars;
  };

  return (
    <div className="product-card fade-in">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image_url || './placeholder-image.jpg'} 
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </Link>
        
        {product.stock_quantity === 0 && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
        
        {hasDiscount && (
          <div className="discount-badge">-{discountPercentage}%</div>
        )}
        
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>
      
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        {product.rating && (
          <div className="rating">
            {renderStars(product.rating)}
            <span className="rating-count">({product.review_count || 0})</span>
          </div>
        )}
        
        <p className="product-description">
          {product.description?.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description}
        </p>
        
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <span className={`product-stock ${product.stock_quantity > 0 ? 'in-stock' : ''}`}>
            {product.stock_quantity > 0 
              ? `${product.stock_quantity} left` 
              : 'Out of stock'}
          </span>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            ₹{product.price}
            {hasDiscount && (
              <span className="original-price">₹{product.original_price}</span>
            )}
          </div>
          <button 
            className={`add-to-cart-btn ${product.stock_quantity === 0 ? 'disabled' : ''} ${isAdding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || isAdding}
          >
            {isAdding ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
