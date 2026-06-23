import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const getWsUrl = () => {
  const backendUrl = import.meta.env.VITE_API_URL;
  if (backendUrl) {
    return backendUrl.replace(/\/api$/, '') + '/ws';
  }
  return `${window.location.origin}/ws`;
};

const useLivePresence = () => {
    const [presenceCount, setPresenceCount] = useState(0);

    useEffect(() => {
        const socket = new SockJS(getWsUrl());
        const stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, () => {
            // Subscribe to presence updates
            stompClient.subscribe('/topic/global/presence', (message) => {
                setPresenceCount(parseInt(message.body));
            });
        });

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []);

    return presenceCount;
};

export default useLivePresence;
