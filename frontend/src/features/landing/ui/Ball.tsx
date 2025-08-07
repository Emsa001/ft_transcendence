import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);

interface BallProps {
    className?: string;
    bound?: { current: HTMLDivElement | null };
}

export const Ball = ({
    className = "bg-gradient-to-br from-red-400 to-pink-500",
    bound,
}: BallProps) => {
    const ballRef = useRef<HTMLDivElement>(null);

    let maxX = bound?.current?.offsetWidth || window.innerWidth;
    let maxY = bound?.current?.offsetHeight || window.innerHeight;

    useEffect(() => {
        if (bound?.current) {
            maxX = bound.current.offsetWidth;
            maxY = bound.current.offsetHeight;
        }
    }, [bound?.current?.offsetWidth, bound?.current?.offsetHeight]);

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
                    opacity: 0.2,
                    ease: "power2.out",
                });
            },
        });
    };

    useEffect(() => {
        if (!ballRef.current) return;

        const friction = -0.5;

        const ball = ballRef.current;
        const ballProps = gsap.getProperty(ball);
        const radius = ball.offsetWidth / 2;


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

        const draggable = new Draggable(ball, {
            bounds: bound ? bound.current : window,
            onPress() {
                gsap.killTweensOf(ball);
                this.update();
                gsap.to(ball, {
                    duration: 0.1,
                    opacity: 1,
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
                            opacity: 0.2,
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
            let vx = InertiaPlugin.getVelocity(ball, "x");
            let vy = InertiaPlugin.getVelocity(ball, "y");

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

        const resizeHandler = () => {
            if(!bound?.current) return;
    
            maxX = window.innerWidth;
            maxY = window.innerHeight;
        };

        window.addEventListener("resize", resizeHandler);

        return () => {
            draggable.kill();
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    return (
        <div
            ref={ballRef}
            className={`w-24 h-24 rounded-full absolute will-change-transform touch-none ${className}`}
        />
    );
};
