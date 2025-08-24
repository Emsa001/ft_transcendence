import { useEffect, useRef } from "react";

interface UseKeyboardProps {
    onSpacePress: () => void;
}

export function useKeyboard({ onSpacePress }: UseKeyboardProps) {
    const keysRef = useRef<Record<string, boolean>>({});

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            keysRef.current[e.key.toLowerCase()] = true;
            if (e.code === "Space") {
                e.preventDefault();
                onSpacePress();
            }
        };
        const up = (e: KeyboardEvent) => {
            keysRef.current[e.key.toLowerCase()] = false;
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, [onSpacePress]);

    return keysRef.current;
}
