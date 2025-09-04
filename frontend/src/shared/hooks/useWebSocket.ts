import { useEffect, useRef, useState } from "react";

interface Hook {
    type: "onMessage" | "onConnect" | "onDisconnect";
    callback: Function;
}

export const useWebSocket = (url: string) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const hooksRef = useRef<Hook[]>([]);
    const reconnectRef = useRef<NodeJS.Timeout | null>(null);

    const addHook = (hook: Hook) => {
        hooksRef.current.push(hook);
    };

    // Reconnect function
    const reconnect = () => {
        if (wsRef.current) {
            return;
        }

        setIsLoading(true);
        setIsConnected(false);

        wsRef.current = new WebSocket(
            process.env.FT_REACT_PUBLIC_API_HOST + url
        );

        wsRef.current.onopen = (event) => {
            setIsConnected(true);
            setIsLoading(false);
            hooksRef.current.forEach((hook) => {
                if (hook.type === "onConnect") {
                    hook.callback(event);
                }
            });
        };

        wsRef.current.onclose = (event) => {
            setIsConnected(false);
            setIsLoading(false);
            hooksRef.current.forEach((hook) => {
                if (hook.type === "onDisconnect") {
                    hook.callback(event);
                }
            });
        };
        wsRef.current.onmessage = (event) => {
            hooksRef.current.forEach((hook) => {
                if (hook.type === "onMessage") {
                    hook.callback(event);
                }
            });
        };
    };

    // Connect to WebSocket initially
    useEffect(() => {
        if (!url) return;

        reconnect();

        return () => {
            console.log("Cleaning up WebSocket connection");
            wsRef.current?.close();
            wsRef.current = null;
            hooksRef.current = [];
        };
    }, [url]);

    // Regular function to send messages
    const sendMessage = (data: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
        }
    };

    return { addHook, sendMessage, isConnected, isLoading, reconnect };
};
