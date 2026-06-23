import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

// Build the WebSocket URL dynamically:
// - In production (Vercel over HTTPS), use the Railway backend wss:// URL
// - In development, use a relative /ws path (proxied by Vite)
const getWsUrl = () => {
  const backendUrl = import.meta.env.VITE_API_URL;
  if (backendUrl) {
    // Convert https://...railway.app/api  →  https://...railway.app/ws
    return backendUrl.replace(/\/api$/, '') + '/ws';
  }
  // Local dev: relative path, Vite proxy handles it
  return `${window.location.origin}/ws`;
};

export const WebSocketProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [productStock, setProductStock] = useState({}); // { productId: stockQuantity }
  const [presenceCount, setPresenceCount] = useState(7); // Default base
  const subscriptions = useRef({});

  useEffect(() => {
    // Public subscriptions (even for guests)
    const socket = new SockJS(getWsUrl());
    const client = Stomp.over(socket);
    client.debug = null;

    client.connect({}, () => {
      setStompClient(client);
      setConnected(true);
      console.log('Connected to WebSocket');

      // Public Stock Updates
      client.subscribe('/topic/products/stock', (message) => {
        const update = JSON.parse(message.body);
        setProductStock(prev => ({
          ...prev,
          [update.productId]: update.newStockQuantity
        }));
      });

      // Presence Updates
      client.subscribe('/topic/global/presence', (message) => {
        setPresenceCount(parseInt(message.body));
      });

      // Global Activity Pulses
      client.subscribe('/topic/global/activity', (message) => {
        const pulse = JSON.parse(message.body);
        toast(pulse.message, {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: true,
          theme: "dark",
          icon: pulse.type === 'DISCOVERY' ? '✨' : '🔥',
          style: { background: 'rgba(26, 22, 20, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(181, 141, 60, 0.2)' }
        });
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
      setConnected(false);
    });

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUser && stompClient && connected) {
      // Global User-Specific Subscriptions
      const userSub = stompClient.subscribe(`/topic/orders/${currentUser.id}`, (message) => {
        const order = JSON.parse(message.body);
        toast.info(`Order #${order.id} status updated to: ${order.status}`, {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      });
      subscriptions.current['user'] = userSub;

      // Global Admin Subscriptions
      if (currentUser.role === 'ADMIN') {
        const adminSub = stompClient.subscribe('/topic/orders/admin', (message) => {
          const order = JSON.parse(message.body);
          toast.warning(`New Order Placed! ID: #${order.id} from ${order.userName}`, {
            position: "top-right",
            autoClose: 8000,
            theme: "dark",
          });
        });
        subscriptions.current['admin'] = adminSub;
      }

      return () => {
        Object.values(subscriptions.current).forEach(sub => sub.unsubscribe());
        subscriptions.current = {};
      };
    }
  }, [currentUser, stompClient, connected]);

  return (
    <WebSocketContext.Provider value={{ stompClient, connected, productStock, presenceCount }}>
      {children}
    </WebSocketContext.Provider>
  );
};
