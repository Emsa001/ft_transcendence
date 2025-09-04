import React, { useRef, useEffect } from "react";
import { useGame } from "../../model/useGame";
import { GameRenderer, renderer } from "@features/game/service/GameRender";
import { gameEngine } from "@features/game/service/GameEngine";
import { useCanvasResize } from "@features/game/model/useCanvasResize";
import { useRemoteGame } from "@features/game/model/useRemoteGame";
import { GameFrame } from "shared";

export const GameCanvasLocal = () => {
    const {
        messageTimeoutRef,
        countdownTimeoutRef,
        state,
        message,
        countdown,
    } = useGame();

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
            renderer.drawPaddles(gameEngine.paddles);
            renderer.drawStateOverlay(state, countdown);
            renderer.drawMessages(message);

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [state, message, countdown]);

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current)
                clearTimeout(messageTimeoutRef.current);
            if (countdownTimeoutRef.current)
                clearTimeout(countdownTimeoutRef.current);
        };
    }, [messageTimeoutRef, countdownTimeoutRef]);

    return <canvas ref={canvasRef} className="rounded-xl m-auto" />;
};

export const GameCanvasRemote = () => {
    const { frameRef } = useRemoteGame();
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

            if (frameRef.current) {
                renderer.clearBackground();
                renderer.drawMidline();
                if (frameRef.current.ball) {
                    renderer.drawBall(frameRef.current.ball);
                    renderer.drawSpeed(frameRef.current.ball);
                }
                renderer.drawPaddles(frameRef.current?.paddles ?? {});
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
