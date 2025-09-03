import { useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    // Connect to WebSocket
    useEffect(() => {
        wsRef.current = new WebSocket(url);

        wsRef.current.onopen = () => setIsConnected(true);
        wsRef.current.onclose = () => setIsConnected(false);
        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setMessages((prev) => [...prev, data]);
            } catch (e) {
                console.error("Invalid message received:", event.data);
            }
        };

        // Cleanup on unmount
        return () => {
            wsRef.current?.close();
        };
    }, [url]);

    // Regular function to send messages
    const sendMessage = (data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    };

    return { messages, sendMessage, isConnected };
};
