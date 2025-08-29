import React, { useRef, useEffect } from "react";
import { GameRenderer } from "../service/GameRender";
import { GameConfig, GameData } from "../types";
import { GameEngine } from "../service/GameEngine";
import { useGameState } from "../model/useGameState";

export interface GameCanvasElementProps {
    state: GameData["state"];
    keys: Record<string, boolean>;
    onScore: (scorerId: string) => void;
    showMessage: string | null;
    countdown: number | null;
    padding?: number; // logical units, default 0
}

export function GameCanvasElement(props: GameCanvasElementProps) {
    const { players, ball } = useGameState();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const runningRef = useRef<boolean>(false);

    const baseW = GameRenderer.baseW;
    const baseH = GameRenderer.baseH;
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
        // Create game engine with configuration
        const gameConfig: GameConfig = {
            baseW,
            baseH,
            padding,
        };

        const gameData: GameData = {
            players: players,
            ball: ball,
            state: props.state,
            showMessage: props.showMessage,
            countdown: props.countdown,
        };

        const gameEngine = new GameEngine(
            gameData,
            gameConfig,
            props.keys,
            props.onScore
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
                state: props.state,
                showMessage: props.showMessage,
                countdown: props.countdown,
            };

            gameEngine.updateState(currentData);
            gameEngine.updateKeys(props.keys);

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
                countdown: props.countdown,
                showMessage: props.showMessage,
                state: props.state,
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
        props.state,
        props.keys,
        players,
        ball,
        props.onScore,
        props.showMessage,
        props.countdown,
    ]);

    return (
        <canvas ref={canvasRef} className="rounded-2xl w-full h-full m-auto" />
    );
}
