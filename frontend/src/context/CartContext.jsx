import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return { ...state, items: action.payload, loading: false };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product_id === action.payload.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.product_id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product_id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // For non-authenticated users, try to load from localStorage
      loadCartFromStorage();
    }
  }, [isAuthenticated]);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('bigshop_cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        if (Array.isArray(cartItems)) {
          dispatch({ type: 'SET_CART_ITEMS', payload: cartItems });
        }
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const saveCartToStorage = (items) => {
    try {
      localStorage.setItem('bigshop_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await cartAPI.getCart();
      dispatch({ type: 'SET_CART_ITEMS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch cart' });
    }
  };

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      // For non-authenticated users, update local storage
      const newItem = { ...product, product_id: product.id, quantity: 1 };
      dispatch({ type: 'ADD_TO_CART', payload: newItem });
      saveCartToStorage([...state.items, newItem]);
      return { success: true };
    }

    try {
      await cartAPI.addToCart(product.id, 1);
      await fetchCart();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    if (!isAuthenticated) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
      saveCartToStorage(state.items.map(item => 
        item.product_id === productId ? { ...item, quantity } : item
      ));
      return { success: true };
    }

    try {
      await cartAPI.updateCartItem(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      saveCartToStorage(state.items.filter(item => item.product_id !== productId));
      return { success: true };
    }

    try {
      await cartAPI.removeFromCart(productId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR_CART' });
      saveCartToStorage([]);
      return { success: true };
    }

    try {
      await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems: state.items,
      cartLoading: state.loading,
      cartError: state.error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};