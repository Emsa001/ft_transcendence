import React, { useRef, useEffect } from "react";
import { GameRenderer } from "../../service/GameRender";
import { GameConfig, GameData } from "../../types";
import { GameEngine } from "../../service/GameEngine";
import { useGameState } from "../../model/useGameState";
import { useGame } from "../../model/useGame";
import { GameScore } from "./GameScore";

export interface GameCanvasElementProps {
    padding?: number;
}

export function GameCanvasElement({ padding = 2 }: GameCanvasElementProps) {
    const {
        messageTimeoutRef,
        countdownTimeoutRef,
        state,
        showMessage,
        countdown,
        keys,
        handleScore,
    } = useGame();

    const { players, ball } = useGameState();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const runningRef = useRef<boolean>(false);

    const baseW = GameRenderer.baseW;
    const baseH = GameRenderer.baseH;

    // Resize canvas to parent size and scale for HiDPI
    const resize = () => {
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
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        // Create game engine with configuration
        const gameConfig: GameConfig = {
            baseW,
            baseH,
            padding,
        };

        const gameData: GameData = {
            players: players,
            ball: ball,
            state: state,
            showMessage: showMessage,
            countdown: countdown,
        };

        const gameEngine = new GameEngine(
            gameData,
            gameConfig,
            keys,
            handleScore
        );

        const loop = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const sx = canvas.width / baseW;
            const sy = canvas.height / baseH;
            const renderer = new GameRenderer(ctx, dpr, sx, sy);

            // Update game state in engine
            const currentData: GameData = {
                players: players,
                ball: ball,
                state: state,
                showMessage: showMessage,
                countdown: countdown,
            };

            gameEngine.updateState(currentData);
            gameEngine.updateKeys(keys);

            // Update game logic if running
            if (runningRef.current) {
                gameEngine.update();
            }

            // Render everything
            renderer.clearBackground(canvas);
            renderer.drawMidline(canvas);
            renderer.drawPaddles(players);
            renderer.drawBall(ball);
            renderer.drawSpeed(ball);
            renderer.drawOverlay(canvas, {
                countdown: countdown,
                showMessage: showMessage,
                state: state,
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        runningRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
        return () => {
            runningRef.current = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [state, keys, players, ball, showMessage, countdown]);

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
