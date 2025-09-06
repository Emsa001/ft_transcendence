import React, { useEffect, useRef, useState, useStatic } from "react";
import { Ball } from "./Ball";

const gradients = [
    "bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900",
    "bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900",
    "bg-gradient-to-tl from-pink-900 via-purple-900 to-indigo-900",
    "bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900",
    "bg-gradient-to-tr from-indigo-900 via-pink-900 to-purple-900",
    "bg-gradient-to-l from-blue-900 via-indigo-900 to-purple-900",
    "bg-gradient-to-t from-purple-900 via-indigo-900 to-pink-900",
    "bg-gradient-to-bl from-pink-900 via-purple-900 to-blue-900",
];

interface BallFieldProps {
    amount?: number;
    delay?: number;
}

export const BallField = ({ amount = 30, delay = 0 }: BallFieldProps) => {
    const bound = useRef<HTMLDivElement | null>(null);
    const [maxX, setMaxX] = useState(window.innerWidth);
    const [maxY, setMaxY] = useState(window.innerHeight);
    const [balls, setBalls] = useState<number[]>([]);

    useEffect(() => {
        const resizeHandler = () => {
            if (!bound?.current) return;
            setMaxX(window.innerWidth);
            setMaxY(window.innerHeight);
        };

        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    useEffect(() => {
        let i = 0;
        let interval: NodeJS.Timeout;

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                setBalls((prev) => {
                    if (prev.length >= amount) {
                        clearInterval(interval);
                        return prev;
                    }
                    return [...prev, i++];
                });
            }, 10);
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [delay, amount]);

    return (
        <div className="absolute w-screen h-screen top-0 left-0">
            <div
                className={`w-full h-full absolute top-0 overflow-hidden z-5`}
                ref={bound}
            >
                {balls.map((id) => {
                    const gradient =
                        gradients[Math.floor(Math.random() * gradients.length)];
                    return (
                        <Ball
                            key={id}
                            bound={bound}
                            className={gradient}
                            maxX={maxX}
                            maxY={maxY}
                        />
                    );
                })}
            </div>
        </div>
    );
};
