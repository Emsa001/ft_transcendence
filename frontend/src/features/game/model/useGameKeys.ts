import { useEffect, useRef } from "react";

interface UseGameKeysProps {
    onSpacePress?: () => void;
    onKeyDown?: (key: string) => void;
    onKeyUp?: (key: string) => void;
}

export const useGameKeys = ({
    onSpacePress,
    onKeyDown,
    onKeyUp,
}: UseGameKeysProps = {}) => {
    const keysRef = useRef<Record<string, boolean>>({});

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            keysRef.current[key] = true;

            if (e.code === "Space" && onSpacePress) {
                e.preventDefault();
                onSpacePress();
            }

            onKeyDown?.(key);
        };

        const up = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            keysRef.current[key] = false;
            onKeyUp?.(key);
        };

        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);

        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, [onSpacePress, onKeyDown, onKeyUp]);

    return keysRef.current;
};
