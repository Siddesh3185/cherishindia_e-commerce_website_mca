import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { productsAPI } from '../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
      
      // Fetch related products
      const productsResponse = await productsAPI.getAll();
      const related = productsResponse.data
        .filter(p => p.category === response.data.category && p.id !== response.data.id)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (error) {
      setError('Product not found');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      const result = await addToCart(product);
      if (!result.success) {
        alert(result.error);
        return;
      }
    }
    
    alert(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading product..." />;
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="error-page">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/shop')} className="btn btn-primary">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Main */}
        <div className="product-main">
          <div className="product-image-section">
            <img 
              src={product.image_url || '/placeholder-image.jpg'} 
              alt={product.name}
              className="product-detail-image"
            />
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-category">Category: {product.category}</p>
            <p className="product-price">${product.price}</p>
            
            <div className="product-stock">
              {product.stock_quantity > 0 ? (
                <span className="in-stock">In Stock ({product.stock_quantity} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <p className="product-description-full">{product.description}</p>

            {product.stock_quantity > 0 && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    onClick={handleAddToCart}
                    className="btn btn-primary add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  <button className="btn btn-secondary buy-now-btn">
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tab-content">
            <h3>Product Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Category:</strong>
                <span>{product.category}</span>
              </div>
              <div className="detail-item">
                <strong>SKU:</strong>
                <span>BS-{product.id.toString().padStart(4, '0')}</span>
              </div>
              <div className="detail-item">
                <strong>Stock:</strong>
                <span>{product.stock_quantity} units</span>
              </div>
              <div className="detail-item">
                <strong>Shipping:</strong>
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="related-product-card">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <img 
                      src={relatedProduct.image_url || '/placeholder-image.jpg'} 
                      alt={relatedProduct.name}
                    />
                    <h4>{relatedProduct.name}</h4>
                    <p>${relatedProduct.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;