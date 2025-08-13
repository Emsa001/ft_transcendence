import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

interface BallProps {
    className?: string;
    bound?: { current: HTMLDivElement | null };
    maxX?: number;
    maxY?: number;
}

const minOpacity = 0.3;
const maxOpacity = 0.9;

export const Ball = ({
    className = "bg-gradient-to-br from-red-400 to-pink-500",
    bound,
    maxX = window.innerWidth,
    maxY = window.innerHeight,
}: BallProps) => {
    const ballRef = useRef<HTMLDivElement | null>(null);

    const throwBall = () => {
        if (!ballRef.current) return;

        const radius = ballRef.current.offsetWidth / 2;
        const x = Math.random() * (maxX - 2 * radius) + radius;
        const y = Math.random() * (maxY - 2 * radius) + radius;

        gsap.to(ballRef.current, {
            duration: 1,
            x: x,
            y: y,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(ballRef.current, {
                    duration: 1,
                    opacity: minOpacity,
                    ease: "power2.out",
                });
            },
        });
    };

    useEffect(() => {
        const ball = ballRef.current;
        if (!ball) return;

        ball.style.opacity = `${maxOpacity}`;

        gsap.defaults({
            overwrite: "auto",
        });

        gsap.set(ball, {
            xPercent: -50,
            yPercent: -50,
            x: maxX / 2,
            y: maxY / 2,
        });

        throwBall();
    }, []);

    useEffect(() => {
        const ball = ballRef.current;
        if (!ball) return;

        const friction = -0.5;
        const ballProps = gsap.getProperty(ball);
        const radius = ball.offsetWidth / 2;

        const draggable = new Draggable(ball, {
            bounds: bound ? bound.current : window,
            onPress() {
                gsap.killTweensOf(ball);
                this.update();
                gsap.to(ball, {
                    duration: 0.1,
                    opacity: maxOpacity,
                    ease: "power2.in",
                });
            },
            onDragEnd: animateBounce,
            onDragEndParams: [],
        });

        function animateBounce(
            x: number | string = "+=0",
            y: number | string = "+=0",
            vx: number | string = "auto",
            vy: number | string = "auto"
        ) {
            gsap.fromTo(
                ball,
                { x, y },
                {
                    inertia: {
                        x: vx,
                        y: vy,
                    },
                    onUpdate: checkBounds,
                    onComplete: () => {
                        gsap.to(ball, {
                            duration: 0.5,
                            opacity: minOpacity,
                            ease: "power2.in",
                        });
                    },
                }
            );
        }

        function checkBounds() {
            let r = radius;
            let x = ballProps("x") as number;
            let y = ballProps("y") as number;
            let vx = InertiaPlugin.getVelocity(ball!, "x");
            let vy = InertiaPlugin.getVelocity(ball!, "y");

            let xPos = x;
            let yPos = y;

            let hitting = false;

            if (x + r > maxX) {
                xPos = maxX - r;
                vx *= friction;
                hitting = true;
            } else if (x - r < 0) {
                xPos = r;
                vx *= friction;
                hitting = true;
            }

            if (y + r > maxY) {
                yPos = maxY - r;
                vy *= friction;
                hitting = true;
            } else if (y - r < 0) {
                yPos = r;
                vy *= friction;
                hitting = true;
            }

            if (hitting) {
                animateBounce(xPos, yPos, vx, vy);
            }
        }

        return () => {
            gsap.killTweensOf(ball);
            draggable.kill();
        };
    }, [maxX, maxY, bound]);

    return (
        <div
            ref={ballRef}
            className={`opacity-0 w-24 h-24 rounded-full absolute will-change-transform touch-none ${className}`}
        />
    );
};
