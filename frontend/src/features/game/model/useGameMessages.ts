import { useEffect, useRef } from "react";
import { GameMessage, MessageData } from "shared";

interface showMessageProps {
    message: MessageData;
    duration?: number;
    after?: () => void;
}

// TODO: Handle countdown through messages
export const useGameMessages = () => {
    const messages = useRef<MessageData | null>(null);
    const countdown = useRef<number | null>(null);

    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showMessage = ({ message, duration, after }: showMessageProps) => {
        messages.current = message;
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => {
            messages.current = null;
            after?.();
        }, duration);
    };

    const startCountdown = (): Promise<void> =>
        new Promise((resolve) => {
            const run = (count: number) => {
                if (count > 0) {
                    countdown.current = count;
                    countdownTimeoutRef.current = setTimeout(
                        () => run(count - 1),
                        1000
                    );
                } else {
                    countdown.current = null;
                    resolve();
                }
            };
            run(3);
        });

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current)
                clearTimeout(messageTimeoutRef.current);
            if (countdownTimeoutRef.current)
                clearTimeout(countdownTimeoutRef.current);
        };
    }, []);

    return {
        messages,
        countdown,

        showMessage,
        startCountdown,
    };
};
