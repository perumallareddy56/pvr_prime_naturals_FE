import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { toast } from 'react-toastify';

const useWebSocket = (currentUser) => {
  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    const socket = new SockJS('/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // Disable debug logging for production feel

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/orders/${currentUser.id}`, (message) => {
        const order = JSON.parse(message.body);
        toast.info(`🛒 Order #${order.id} status updated to: ${order.status}`, {
            position: "bottom-right",
            icon: "🚀"
        });
      });

      // Subscribe to global activity pulses
      stompClient.subscribe('/topic/global/activity', (message) => {
        const activity = JSON.parse(message.body);
        toast.info(activity.message, {
            position: "bottom-left",
            icon: "⭐",
            autoClose: 3000,
            theme: "dark"
        });
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [currentUser]);
};

export default useWebSocket;
