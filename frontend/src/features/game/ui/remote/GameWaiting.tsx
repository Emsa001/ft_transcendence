import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const GameWaiting = () => {
    const ballRef = useRef(null);
    const leftPaddleRef = useRef(null);
    const rightPaddleRef = useRef(null);

    useEffect(() => {
        const ball = ballRef.current;
        const leftPaddle = leftPaddleRef.current;
        const rightPaddle = rightPaddleRef.current;

        // Set initial positions
        gsap.set(ball, { x: 40 });
        gsap.set(leftPaddle, { y: 0 });
        gsap.set(rightPaddle, { y: 0 });

        // Create the ball animation timeline
        const ballTimeline = gsap.timeline({ repeat: -1 });

        // Ball moving right
        ballTimeline
            .to(ball, {
                x: 200,
                duration: 0.6,
                ease: "power1.inOut",
                onStart: () => {
                    // Right paddle follows ball with slight delay
                    gsap.to(rightPaddle, {
                        y: gsap.utils.random(-10, 10),
                        duration: 0.3,
                        ease: "power1.out",
                    });
                },
            })
            // Ball moving left
            .to(ball, {
                x: 40,
                duration: 0.6,
                ease: "power1.inOut",
                onStart: () => {
                    // Left paddle follows ball with slight delay
                    gsap.to(leftPaddle, {
                        y: gsap.utils.random(-10, 10),
                        duration: 0.3,
                        ease: "power1.out",
                    });
                },
            });

        // Additional paddle movements for more realism
        const paddleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
        paddleTimeline.to([leftPaddle, rightPaddle], {
            y: 0,
            duration: 0.5,
            ease: "power1.out",
        });

        return () => {
            ballTimeline.kill();
            paddleTimeline.kill();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div className="text-white text-2xl font-bold mb-8">
                Waiting for all players
            </div>

            {/* Mini Pong Game Container */}
            <div className="relative w-64 h-40 bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden shadow-lg">
                {/* Court lines */}
                <div className="absolute inset-0 flex justify-center">
                    <div className="w-1 h-full bg-gray-700 border-dashed border-l-2"></div>
                </div>

                {/* Left Paddle */}
                <div
                    ref={leftPaddleRef}
                    className="absolute left-2 w-2 h-10 bg-blue-400 rounded-sm transform -translate-y-1/2"
                    style={{ top: "50%" }}
                ></div>

                {/* Right Paddle */}
                <div
                    ref={rightPaddleRef}
                    className="absolute right-2 w-2 h-10 bg-red-400 rounded-sm transform -translate-y-1/2"
                    style={{ top: "50%" }}
                ></div>

                {/* Ball */}
                <div
                    ref={ballRef}
                    className="absolute w-4 h-4 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-sm"
                    style={{ top: "50%" }}
                ></div>
            </div>

            {/* Loading dots animation */}
            <div className="flex mt-8">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full mx-1"
                        style={{
                            animation: `pulse 1.5s infinite ${i * 0.3}s`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};
