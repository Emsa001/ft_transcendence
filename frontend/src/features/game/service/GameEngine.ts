import { clamp } from "lodash";
import { Ball, GameData } from "../types";
import { GameRenderer } from "./GameRender";

class GameEngine {
    private state: GameData;
    private keys: Record<string, boolean>;

    onScore?: (scorerId: string) => void;
    onEnd?: (winnerId: string) => void;

    ball: Ball;
    stopped: boolean = true;

    constructor() {
        this.state = {
            state: "created",
            players: [],
            countdown: null,
        };

        this.keys = {};
        this.ball = {
            pos: { x: -10, y: -10 },
            vel: { x: 6, y: 3 },
            size: 14,
            speed: 7.5,
        };

        console.log("GameEngine created");
    }

    init(initialState: GameData, keys: Record<string, boolean>) {
        this.state = initialState;
        this.keys = keys;
    }

    // Update the game state reference
    updateState(newState: GameData) {
        this.state = newState;
    }

    // Update keys reference
    updateKeys(keys: Record<string, boolean>) {
        this.keys = keys;
    }

    // Main update method - handles all game logic
    update(): void {
        if (this.stopped) return;

        this.updatePaddles();
        this.updateBall();
        this.checkCollisions();
        this.checkScoring();
    }

    private handleScore(scorerId: string): void {
        this.onScore?.(scorerId);
        this.reset();
    }

    private updatePaddles(): void {
        const { baseH, padding } = GameRenderer;

        // Update all player paddles based on their controls
        this.state.players.forEach((player) => {
            const paddle = player.paddle;
            const controls = player.paddle.controls;

            if (this.keys[controls.up]) paddle.y -= paddle.speed;
            if (this.keys[controls.down]) paddle.y += paddle.speed;

            // Clamp paddle to screen bounds
            paddle.y = clamp(paddle.y, padding, baseH - paddle.h - padding);
        });
    }

    private resetPaddles(): void {
        const { baseH } = GameRenderer;
        this.state.players.forEach((player) => {
            const paddle = player.paddle;
            paddle.y = baseH / 2 - paddle.h / 2;
        });
    }

    private resetBall(): void {
        const { baseW, baseH } = GameRenderer;

        this.ball.pos = { x: baseW / 2, y: baseH / 2 };
        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // -30°..+30°

        let dir = Math.random() < 0.5 ? -1 : 1;

        const speed = this.ball.speed;
        this.ball.vel = {
            x: Math.cos(angle) * speed * dir,
            y: Math.sin(angle) * speed,
        };
        this.ball.speed = 7.5;
    }

    reset(): void {
        this.resetBall();
        this.resetPaddles();
    }

    private updateBall(): void {
        const ball = this.ball;
        ball.pos.x += ball.vel.x;
        ball.pos.y += ball.vel.y;
    }

    private checkCollisions(): void {
        const { baseH, padding } = GameRenderer;
        const ball = this.ball;

        // Top and bottom wall collisions
        if (ball.pos.y <= padding) {
            ball.pos.y = padding;
            ball.vel.y = Math.abs(ball.vel.y);
        } else if (ball.pos.y + ball.size >= baseH - padding) {
            ball.pos.y = baseH - padding - ball.size;
            ball.vel.y = -Math.abs(ball.vel.y);
        }

        // Check collisions with all player paddles
        this.state.players.forEach((player) => {
            this.checkPaddleCollision(
                player.paddle.x,
                player.paddle.y,
                player.paddle.w,
                player.paddle.h,
                this.calculateBounceDirection(player.paddle.x)
            );
        });
    }

    private calculateBounceDirection(paddleX: number): number {
        const { baseW } = GameRenderer;
        // If paddle is on left side, ball bounces right (positive direction)
        // If paddle is on right side, ball bounces left (negative direction)
        return paddleX < baseW / 2 ? 1 : -1;
    }

    private checkPaddleCollision(
        px: number,
        py: number,
        pw: number,
        ph: number,
        dir: number
    ): void {
        const ball = this.ball;
        const bx = ball.pos.x;
        const by = ball.pos.y;
        const bs = ball.size;

        // Check if ball intersects with paddle
        if (bx < px + pw && bx + bs > px && by < py + ph && by + bs > py) {
            // Calculate bounce angle based on where ball hits paddle
            const rel = (by + bs / 2 - (py + ph / 2)) / (ph / 2);
            const maxBounce = Math.PI / 3;
            const angle = rel * maxBounce;

            // Calculate speed boost based on hit location
            const currentSpeed = Math.hypot(ball.vel.x, ball.vel.y);
            const edgeBoost = 1.18;
            const centerSlow = 0.92;
            const boost = centerSlow + (edgeBoost - centerSlow) * Math.abs(rel);
            const newSpeed = Math.max(Math.min(currentSpeed * boost, 28), 5);

            // Apply new velocity
            ball.vel.x = Math.cos(angle) * newSpeed * dir;
            ball.vel.y = Math.sin(angle) * newSpeed;

            // Move ball away from paddle to prevent stuck collision
            ball.pos.x += dir * 6;
        }
    }

    private checkScoring(): void {
        const { baseW } = GameRenderer;
        const ball = this.ball;

        // NOTE: works only for 2 players

        if (ball.pos.x < -20) {
            this.handleScore?.(this.state.players[1].id); // Right player scores
        } else if (ball.pos.x > baseW + 20) {
            this.handleScore?.(this.state.players[0].id); // Left player scores
        }
    }
}

export const gameEngine = new GameEngine();
