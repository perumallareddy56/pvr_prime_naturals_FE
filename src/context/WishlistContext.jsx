import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const WishlistContext = createContext();

export { WishlistContext };

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // We'll sync with backend for authenticated users
  useEffect(() => {
    if (currentUser) {
      fetchWishlist();
    } else {
      const savedWishlist = localStorage.getItem('wishlist_guest');
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }
  }, [currentUser]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Error fetching wishlist", error);
      }
    }
  };

  const toggleWishlist = async (product) => {
    const prevState = [...wishlist];
    const isInList = wishlist.some(item => item.id === product.id);
    
    // Optimistic Update
    let nextState;
    if (isInList) {
      nextState = wishlist.filter(item => item.id !== product.id);
      toast.info(`${product.name} removed from wishlist`, { position: 'bottom-right', autoClose: 2000 });
    } else {
      nextState = [...wishlist, product];
      toast.success(`${product.name} added to wishlist!`, { position: 'bottom-right', autoClose: 2000 });
    }
    setWishlist(nextState);

    if (currentUser) {
      try {
        await api.post(`/wishlist/toggle/${product.id}`);
        // No need to fetchWishlist here as we already updated the state optimistically
        // Unless the backend returns a different structure, but here it's simple toggling
      } catch (e) {
        setWishlist(prevState); // Revert on error
        toast.error("Failed to update wishlist");
      }
    } else {
        localStorage.setItem('wishlist_guest', JSON.stringify(nextState));
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
