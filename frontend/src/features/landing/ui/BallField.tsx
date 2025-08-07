import React, { useRef } from "react";
import { Ball } from "./Ball";

const gradients = [
    "from-red-400 to-pink-500",
    "from-blue-400 to-purple-500",
    "from-green-400 to-teal-500",
    "from-yellow-400 to-orange-500",
];

export default function BallField() {
    const bound = useRef<HTMLDivElement>(null);

    return (
        <div className="w-screen h-screen absolute top-0 overflow-hidden" ref={bound}>
            {Array.from({ length: 20 }).map((_, index) => {
                const gradient = gradients[Math.floor(Math.random() * gradients.length)];

                return (
                    <Ball
                        key={index}
                        bound={bound}
                        className={`bg-gradient-to-br ${gradient}`}
                    />
                );
            })}
        </div>
    );
}
