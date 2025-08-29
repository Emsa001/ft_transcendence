import React, { createContext, useContext, useRef, useState } from "react";
import { Paddle, Ball, PongPlayer } from "../types";
import { GameUserDTOType } from "shared";
import { GameRenderer } from "../service/GameRender";

interface GameStateContextType {
    players: PongPlayer[];
    ball: Ball;
    resetBall: (toPlayerId?: string) => void;
    resetGame: () => void;
    resetPaddles: () => void;
    updatePlayerScore: (playerId: string, newScore: number) => void;
    maxScore: number;
    setMaxScore: (score: number | ((prev: number) => number)) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(
    undefined
);

/** --- Provider --- */
interface GameStateProviderProps {
    children?: ReactNode;
    playersConfig: GameUserDTOType[];
    maxScore?: number;
}

export const GameStateProvider = ({
    children,
    playersConfig,
    maxScore = 5,
}: GameStateProviderProps) => {
    const baseW = GameRenderer.baseW;
    const baseH = GameRenderer.baseH;

    const [maxScoreValue, setMaxScore] = useState(maxScore);

    /** --- Full player Creation --- */
    const createPongPlayers = (): PongPlayer[] => {
        return playersConfig.map((playerConfig, index) => {
            const w = 14;
            const h = 120;
            const y = baseH / 2 - h / 2;

            let x = index === 0 ? 40 : baseW - (40 + w);

            // Assign controls (currently only for 2 players)
            let controls: { up: string; down: string };
            if (index === 0) {
                controls = { up: "w", down: "s" };
            } else {
                controls = { up: "arrowup", down: "arrowdown" };
            }

            const paddle: Paddle = { x, y, w, h, speed: 9 };

            return {
                id: `player_${playerConfig.id}`,
                username: playerConfig.username,
                score: 0,
                paddle,
                controls,
            };
        });
    };

    /** --- State --- */
    const [players, setPlayers] = useState<PongPlayer[]>(createPongPlayers());
    const paddleRefs = useRef(players.map((p) => p.paddle));

    // keep paddle references synced
    players.forEach((p, i) => (p.paddle = paddleRefs.current[i]));

    const ball = useRef<Ball>({
        pos: { x: baseW / 2, y: baseH / 2 },
        vel: { x: 6, y: 3 },
        size: 14,
        speed: 7.5,
    });

    /** --- Helpers --- */
    const centerPaddles = () => {
        paddleRefs.current.forEach((p) => {
            p.y = baseH / 2 - p.h / 2;
        });
    };

    const resetPaddles = () => {
        centerPaddles();
        setPlayers((prev) => [...prev]); // trigger re-render
    };

    const resetBall = (toPlayerId?: string) => {
        ball.current.pos = { x: baseW / 2, y: baseH / 2 };
        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // -30°..+30°

        let dir = Math.random() < 0.5 ? -1 : 1;
        if (players.length === 2 && toPlayerId) {
            const target = players.find((p) => p.id === toPlayerId);
            if (target) dir = target.paddle.x < baseW / 2 ? -1 : 1;
        }

        const speed = ball.current.speed;
        ball.current.vel = {
            x: Math.cos(angle) * speed * dir,
            y: Math.sin(angle) * speed,
        };
    };

    const resetGame = () => {
        centerPaddles();
        setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
        ball.current.speed = 7.5;
        resetBall();
    };

    const updatePlayerScore = (playerId: string, newScore: number) => {
        setPlayers((prev) =>
            prev.map((p) => (p.id === playerId ? { ...p, score: newScore } : p))
        );
    };

    return (
        <div>
            <GameStateContext.Provider
                value={{
                    players,
                    ball: ball.current,
                    resetBall,
                    resetGame,
                    resetPaddles,
                    updatePlayerScore,
                    maxScore: maxScoreValue,
                    setMaxScore,
                }}
            >
                {children}
            </GameStateContext.Provider>
        </div>
    );
};

export const useGameState = (): GameStateContextType => {
    const context = useContext(GameStateContext);
    if (!context) {
        throw new Error("useGameContext must be used inside GameStateProvider");
    }
    return context;
};
