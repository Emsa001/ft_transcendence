import React, { useRef, useEffect } from "react";
import { useGameState } from "../../model/useGameState";
import { useGame } from "../../model/useGame";
import { GameRenderer, renderer } from "@features/game/service/GameRender";
import { gameEngine } from "@features/game/service/GameEngine";

export function GameCanvasElement() {
    const {
        messageTimeoutRef,
        countdownTimeoutRef,
        state,
        message,
        countdown,
        keys,
    } = useGame();

    const { players } = useGameState();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const runningRef = useRef<boolean>(false);

    const baseW = GameRenderer.baseW;
    const baseH = GameRenderer.baseH;

    // Resize canvas to parent size and scale for HiDPI
    const setCanvasSize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement as HTMLElement;
        const rect = parent.getBoundingClientRect();
        const parentW = rect.width;
        const parentH = rect.height;
        let width = parentW;
        let height = (parentW * 9) / 16;
        if (height > parentH) {
            height = parentH;
            width = (parentH * 16) / 9;
        }
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${Math.floor(width)}px`;
        canvas.style.height = `${Math.floor(height)}px`;
    };

    useEffect(() => {
        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);
        return () => window.removeEventListener("resize", setCanvasSize);
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
            renderer.init(ctx, dpr, sx, sy);

            gameEngine.initKeys(keys);

            // Update game logic if running
            if (runningRef.current) {
                gameEngine.update();
            }

            // Render everything
            renderer.clearBackground();
            renderer.drawMidline();
            renderer.drawBall();
            renderer.drawSpeed();
            renderer.drawPaddles();
            renderer.drawStateOverlay(state, countdown);
            renderer.drawMessages(message);

            rafRef.current = requestAnimationFrame(loop);
        };

        runningRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
        return () => {
            runningRef.current = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [state, keys, players, message, countdown]);

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current)
                clearTimeout(messageTimeoutRef.current);
            if (countdownTimeoutRef.current)
                clearTimeout(countdownTimeoutRef.current);
        };
    }, [messageTimeoutRef, countdownTimeoutRef]);

    return <canvas ref={canvasRef} className="rounded-xl m-auto" />;
}
