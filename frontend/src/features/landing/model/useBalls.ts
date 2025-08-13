import { useEffect, useRef, useState } from 'react';

export const useBalls = (
    totalBalls: number = 50,
    bound: { current: HTMLDivElement | null }
) => {
    const [maxX, setMaxX] = useState(window.innerWidth);
    const [maxY, setMaxY] = useState(window.innerHeight);
    const [balls, setBalls] = useState<number[]>([]);

    useEffect(() => {
        const resizeHandler = () => {
            if (!bound?.current) return;
            setMaxX(window.innerWidth);
            setMaxY(window.innerHeight);
        };

        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setBalls((prev) => {
                if (prev.length >= totalBalls) {
                    clearInterval(interval);
                    return prev;
                }
                return [...prev, i++];
            });
        }, 10);

        return () => clearInterval(interval);
    }, []);

    return {
        maxX,
        maxY,
        balls,
    };
};
