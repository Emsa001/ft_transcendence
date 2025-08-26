import { useRef } from "react";

// Types for game state
type Vec2 = { x: number; y: number };

interface Paddle {
    x: number;
    y: number;
    w: number;
    h: number;
    speed: number;
}

interface Ball {
    pos: Vec2;
    vel: Vec2;
    size: number;
    speed: number;
}

export function useGameState() {
    // Logical game size independent of pixel density
    const baseW = 1280; // 16:9
    const baseH = 720;

    // Game objects stored in refs to avoid rerenders
    const paddleL = useRef<Paddle>({
        x: 40,
        y: baseH / 2 - 60,
        w: 14,
        h: 120,
        speed: 9,
    });
    const paddleR = useRef<Paddle>({
        x: baseW - 54,
        y: baseH / 2 - 60,
        w: 14,
        h: 120,
        speed: 9,
    });
    const ball = useRef<Ball>({
        pos: { x: baseW / 2, y: baseH / 2 } as Vec2,
        vel: { x: 6, y: 3 } as Vec2,
        size: 14,
        speed: 7.5,
    });

    // Reset ball to center with randomized direction
    const resetBall = (toLeft: boolean) => {
        ball.current.pos = { x: baseW / 2, y: baseH / 2 };
        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // -30°..+30°
        const dir = toLeft ? -1 : 1;
        const speed = ball.current.speed;
        ball.current.vel = {
            x: Math.cos(angle) * speed * dir,
            y: Math.sin(angle) * speed,
        };
    };

    const resetGame = () => {
        paddleL.current.y = baseH / 2 - paddleL.current.h / 2;
        paddleR.current.y = baseH / 2 - paddleR.current.h / 2;
        // Reset ball speed to initial value
        ball.current.speed = 7.5;
        resetBall(Math.random() < 0.5);
    };

    return {
        paddleL: paddleL.current,
        paddleR: paddleR.current,
        ball: ball.current,
        resetBall,
        resetGame,
    };
}
