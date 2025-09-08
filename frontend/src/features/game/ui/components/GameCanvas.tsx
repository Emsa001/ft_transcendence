import React, { useRef, useEffect } from "react";
import { useGame } from "../../model/useGame";
import { GameRenderer, renderer } from "@features/game/service/GameRender";
import { gameEngine } from "@features/game/service/GameEngine";
import { useCanvasResize } from "@features/game/model/useCanvasResize";
import { useRemoteGame } from "@features/game/model/useRemoteGame";

export const GameCanvasLocal = () => {
    const { state, messages, countdown } = useGame();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    useCanvasResize(canvasRef);

    useEffect(() => {
        const loop = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const sx = canvas.width / GameRenderer.baseW;
            const sy = canvas.height / GameRenderer.baseH;
            renderer.init(ctx, dpr, sx, sy);

            // Update game logic if running
            gameEngine.update();

            // Render everything
            renderer.clearBackground();
            renderer.drawMidline();
            renderer.drawBall(gameEngine.ball);
            renderer.drawSpeed(gameEngine.ball);
            renderer.drawRandomEvent(gameEngine.gameEvents.selectedEvent);

            renderer.drawPaddles(gameEngine.paddles);
            renderer.drawCountDown(countdown.current);

            if (messages.current) {
                renderer.drawMessages(
                    messages.current.messages,
                    messages.current.cover
                );
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [state]);

    return <canvas ref={canvasRef} className="rounded-xl m-auto" />;
};

export const GameCanvasRemote = () => {
    const { frameRef, messages } = useRemoteGame();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    useCanvasResize(canvasRef);

    useEffect(() => {
        const loop = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const sx = canvas.width / GameRenderer.baseW;
            const sy = canvas.height / GameRenderer.baseH;
            renderer.init(ctx, dpr, sx, sy);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            renderer.clearBackground();
            renderer.drawMidline();
            if (frameRef.current) {
                if (frameRef.current.ball) {
                    renderer.drawBall(frameRef.current.ball);
                    renderer.drawSpeed(frameRef.current.ball);
                    renderer.drawRandomEvent(frameRef.current.selectedEvent);
                }
                renderer.drawPaddles(frameRef.current?.paddles ?? {});
            }

            if (messages.current) {
                renderer.drawMessages(
                    messages.current.messages,
                    messages.current.cover
                );
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} className="rounded-xl m-auto" />;
};
