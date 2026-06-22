import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const useLivePresence = () => {
    const [presenceCount, setPresenceCount] = useState(0);

    useEffect(() => {
        const socket = new SockJS('/ws');
        const stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, () => {
            // Subscribe to presence updates
            stompClient.subscribe('/topic/global/presence', (message) => {
                setPresenceCount(parseInt(message.body));
            });

            // Initial presence fetch if any (optional as broadcast handles new connections)
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
