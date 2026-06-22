import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      setCart(null);
      setCartCount(0);
    }
  }, [currentUser]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
      calculateCount(response.data);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Error fetching cart", error);
      }
      setCart({ items: [] });
    }
  };

  const calculateCount = (cartData) => {
    if (cartData && cartData.items) {
      const count = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    // Optimistic Update: Assume success and update UI immediately
    const prevCart = cart;
    const prevCount = cartCount;

    // We don't have the full product details easily here, but we can at least increment the count
    setCartCount(prevCount + quantity);
    
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      setCart(response.data);
      calculateCount(response.data);
      toast.success("Item added to cart!", {
        position: "bottom-right",
        autoClose: 2000,
        style: { background: '#222', color: '#fff', borderRadius: '12px' }
      });
      return true;
    } catch (error) {
      // Revert on error
      setCart(prevCart);
      setCartCount(prevCount);
      toast.error(error.response?.data?.message || "Failed to add to cart");
      console.error("Error adding to cart", error);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    // Optimistic Update
    const prevCart = cart;
    const prevCount = cartCount;

    if (cart && cart.items) {
      const removedItem = cart.items.find(item => item.id === itemId);
      if (removedItem) {
        setCartCount(prevCount - removedItem.quantity);
        setCart({
          ...cart,
          items: cart.items.filter(item => item.id !== itemId)
        });
      }
    }

    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      setCart(response.data);
      calculateCount(response.data);
      toast.success("Item removed from cart", {
        position: "bottom-right",
        autoClose: 2000
      });
    } catch (error) {
      // Revert on error
      setCart(prevCart);
      setCartCount(prevCount);
      toast.error("Failed to remove item");
      console.error("Error removing from cart", error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    // Optimistic Update
    const prevCart = cart;
    if (cart && cart.items) {
      setCart({
        ...cart,
        items: cart.items.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity, subTotal: item.price * newQuantity } : item
        )
      });
    }

    try {
      const response = await api.put(`/cart/update/${itemId}?quantity=${newQuantity}`);
      setCart(response.data);
      calculateCount(response.data);
    } catch (error) {
      setCart(prevCart);
      toast.error("Failed to update quantity");
      console.error("Error updating quantity", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
