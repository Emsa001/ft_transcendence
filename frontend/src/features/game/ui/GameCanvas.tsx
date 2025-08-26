import React, { useRef, useEffect } from "react";
import { GameCanvasProps, GameRenderer } from "../service/GameCanvas";

// Utility: clamp a value
const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

// React element for rendering the canvas
export interface GameCanvasElementProps extends GameCanvasProps {
    padding?: number; // logical units, default 0
}

export function GameCanvasElement(props: GameCanvasElementProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const runningRef = useRef<boolean>(false);

    // Logical game size independent of pixel density
    const baseW = 1280; // 16:9
    const baseH = 720;
    const padding = props.padding ?? 2;

    // Resize canvas to parent size and scale for HiDPI
    const resize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement as HTMLElement;
        const rect = parent.getBoundingClientRect();
        let width = rect.width;
        let height = (rect.width * 9) / 16;
        if (height > rect.height) {
            height = rect.height;
            width = (rect.height * 16) / 9;
        }
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${Math.floor(width)}px`;
        canvas.style.height = `${Math.floor(height)}px`;
    };

    useEffect(() => {
        resize();
        const handler = () => resize();
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    useEffect(() => {
        const loop = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const sx = canvas.width / baseW;
            const sy = canvas.height / baseH;
            const renderer = new GameRenderer(ctx, dpr, sx, sy, baseW, baseH);

            renderer.clearBackground(canvas);
            renderer.drawMidline(canvas);

            if (
                props.started &&
                !props.paused &&
                !props.showMessage &&
                !props.countdown &&
                runningRef.current
            ) {
                if (props.keys["w"]) props.paddleL.y -= props.paddleL.speed;
                if (props.keys["s"]) props.paddleL.y += props.paddleL.speed;
                if (props.keys["arrowup"])
                    props.paddleR.y -= props.paddleR.speed;
                if (props.keys["arrowdown"])
                    props.paddleR.y += props.paddleR.speed;
                props.paddleL.y = clamp(
                    props.paddleL.y,
                    padding,
                    baseH - props.paddleL.h - padding
                );
                props.paddleR.y = clamp(
                    props.paddleR.y,
                    padding,
                    baseH - props.paddleR.h - padding
                );
                props.ball.pos.x += props.ball.vel.x;
                props.ball.pos.y += props.ball.vel.y;
                if (props.ball.pos.y <= padding) {
                    props.ball.pos.y = padding;
                    props.ball.vel.y = Math.abs(props.ball.vel.y);
                } else if (
                    props.ball.pos.y + props.ball.size >=
                    baseH - padding
                ) {
                    props.ball.pos.y = baseH - padding - props.ball.size;
                    props.ball.vel.y = -Math.abs(props.ball.vel.y);
                }
                const collidePaddle = (
                    px: number,
                    py: number,
                    pw: number,
                    ph: number,
                    dir: number
                ) => {
                    const bx = props.ball.pos.x;
                    const by = props.ball.pos.y;
                    const bs = props.ball.size;
                    if (
                        bx < px + pw &&
                        bx + bs > px &&
                        by < py + ph &&
                        by + bs > py
                    ) {
                        const rel = (by + bs / 2 - (py + ph / 2)) / (ph / 2);
                        const maxBounce = Math.PI / 3;
                        const angle = rel * maxBounce;
                        const currentSpeed = Math.hypot(
                            props.ball.vel.x,
                            props.ball.vel.y
                        );
                        const baseBoost = 1.05;
                        const edgeBoost = 1.18;
                        const centerSlow = 0.92;
                        const boost =
                            centerSlow +
                            (edgeBoost - centerSlow) * Math.abs(rel);
                        const newSpeed = Math.max(
                            Math.min(currentSpeed * boost, 28),
                            5
                        );
                        props.ball.vel.x = Math.cos(angle) * newSpeed * dir;
                        props.ball.vel.y = Math.sin(angle) * newSpeed;
                        props.ball.pos.x += dir * 6;
                    }
                };
                collidePaddle(
                    props.paddleL.x,
                    props.paddleL.y,
                    props.paddleL.w,
                    props.paddleL.h,
                    1
                );
                collidePaddle(
                    props.paddleR.x,
                    props.paddleR.y,
                    props.paddleR.w,
                    props.paddleR.h,
                    -1
                );
                if (props.ball.pos.x < -20) {
                    props.onScore("right");
                } else if (props.ball.pos.x > baseW + 20) {
                    props.onScore("left");
                }
            }

            renderer.drawPaddles(props.paddleL, props.paddleR);
            renderer.drawBall(props.ball);
            renderer.drawSpeed(props.ball);
            renderer.drawOverlay(canvas, {
                countdown: props.countdown,
                showMessage: props.showMessage,
                started: props.started,
                paused: props.paused,
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        runningRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
        return () => {
            runningRef.current = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [
        props.started,
        props.paused,
        props.keys,
        props.paddleL,
        props.paddleR,
        props.ball,
        props.onScore,
        props.showMessage,
        props.countdown,
    ]);

    return (
        <canvas ref={canvasRef} className="rounded-2xl w-full h-full m-auto" />
    );
}
