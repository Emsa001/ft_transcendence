import { useRef, useState } from "react";
import { CanvasMessage } from "../types";

export const useGameMessages = () => {
    const [message, setMessage] = useState<CanvasMessage[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);

    const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showMessage = (
        msgs: CanvasMessage[],
        duration = 1000,
        after?: () => void
    ) => {
        setMessage(msgs);
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => {
            setMessage([]);
            after?.();
        }, duration);
    };

    const startCountdown = (): Promise<void> =>
        new Promise((resolve) => {
            const run = (count: number) => {
                if (count > 0) {
                    setCountdown(count);
                    countdownTimeoutRef.current = setTimeout(
                        () => run(count - 1),
                        1000
                    );
                } else {
                    setCountdown(null);
                    resolve();
                }
            };
            run(3);
        });

    return {
        message,
        countdown,
        messageTimeoutRef,
        countdownTimeoutRef,

        setMessage,
        setCountdown,
        showMessage,
        startCountdown,
    };
};
