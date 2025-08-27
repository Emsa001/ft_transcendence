import { GameConfig, GameData } from "../types";

// Utility: clamp a value
const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

export class GameEngine {
    private state: GameData;
    private config: GameConfig;
    private keys: Record<string, boolean>;
    private onScore: (scorerId: string) => void;

    constructor(
        initialState: GameData,
        config: GameConfig,
        keys: Record<string, boolean>,
        onScore: (scorerId: string) => void
    ) {
        this.state = initialState;
        this.config = config;
        this.keys = keys;
        this.onScore = onScore;
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
        if (
            this.state.state !== "started" ||
            this.state.showMessage ||
            this.state.countdown
        ) {
            return;
        }

        this.updatePaddles();
        this.updateBall();
        this.checkCollisions();
        this.checkScoring();
    }

    private updatePaddles(): void {
        const { padding, baseH } = this.config;

        // Update all player paddles based on their controls
        this.state.players.forEach((player) => {
            const paddle = player.paddle;
            const controls = player.controls;

            // Check up/down movement for this player
            if (this.keys[controls.up]) {
                paddle.y -= paddle.speed;
            }
            if (this.keys[controls.down]) {
                paddle.y += paddle.speed;
            }

            // Clamp paddle to screen bounds
            paddle.y = clamp(paddle.y, padding, baseH - paddle.h - padding);
        });
    }

    private updateBall(): void {
        const ball = this.state.ball;
        ball.pos.x += ball.vel.x;
        ball.pos.y += ball.vel.y;
    }

    private checkCollisions(): void {
        const { padding, baseH } = this.config;
        const ball = this.state.ball;

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
        const { baseW } = this.config;
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
        const ball = this.state.ball;
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
            const baseBoost = 1.05;
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
        const { baseW } = this.config;
        const ball = this.state.ball;

        // For 2 players, use traditional left/right scoring
        if (this.state.players.length === 2) {
            if (ball.pos.x < -20) {
                this.onScore(this.state.players[1].id); // Right player scores
            } else if (ball.pos.x > baseW + 20) {
                this.onScore(this.state.players[0].id); // Left player scores
            }
        } else {
            // For more players, find the nearest player to the ball position
            if (ball.pos.x < -20 || ball.pos.x > baseW + 20) {
                // Find the player whose paddle is closest to the ball when it goes out
                let closestPlayer = this.state.players[0];
                let minDistance = Math.abs(ball.pos.x - closestPlayer.paddle.x);

                this.state.players.forEach((player) => {
                    const distance = Math.abs(ball.pos.x - player.paddle.x);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPlayer = player;
                    }
                });

                this.onScore(closestPlayer.id);
            }
        }
    }
}
