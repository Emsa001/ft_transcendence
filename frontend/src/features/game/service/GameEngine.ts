import { GameConfig, GameState } from "../types";

// Utility: clamp a value
const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

export class GameEngine {
    private state: GameState;
    private config: GameConfig;
    private keys: Record<string, boolean>;
    private onScore: (scorer: "left" | "right") => void;

    constructor(
        initialState: GameState,
        config: GameConfig,
        keys: Record<string, boolean>,
        onScore: (scorer: "left" | "right") => void
    ) {
        this.state = initialState;
        this.config = config;
        this.keys = keys;
        this.onScore = onScore;
    }

    // Update the game state reference
    updateState(newState: GameState) {
        this.state = newState;
    }

    // Update keys reference
    updateKeys(keys: Record<string, boolean>) {
        this.keys = keys;
    }

    // Main update method - handles all game logic
    update(): void {
        if (
            !this.state.started ||
            this.state.paused ||
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

        // Update left paddle
        if (this.keys["w"]) {
            this.state.paddleL.y -= this.state.paddleL.speed;
        }
        if (this.keys["s"]) {
            this.state.paddleL.y += this.state.paddleL.speed;
        }

        // Update right paddle
        if (this.keys["arrowup"]) {
            this.state.paddleR.y -= this.state.paddleR.speed;
        }
        if (this.keys["arrowdown"]) {
            this.state.paddleR.y += this.state.paddleR.speed;
        }

        // Clamp paddles to screen bounds
        this.state.paddleL.y = clamp(
            this.state.paddleL.y,
            padding,
            baseH - this.state.paddleL.h - padding
        );
        this.state.paddleR.y = clamp(
            this.state.paddleR.y,
            padding,
            baseH - this.state.paddleR.h - padding
        );
    }

    private updateBall(): void {
        this.state.ball.pos.x += this.state.ball.vel.x;
        this.state.ball.pos.y += this.state.ball.vel.y;
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

        // Paddle collisions
        this.checkPaddleCollision(
            this.state.paddleL.x,
            this.state.paddleL.y,
            this.state.paddleL.w,
            this.state.paddleL.h,
            1 // direction: left paddle hits ball to the right
        );

        this.checkPaddleCollision(
            this.state.paddleR.x,
            this.state.paddleR.y,
            this.state.paddleR.w,
            this.state.paddleR.h,
            -1 // direction: right paddle hits ball to the left
        );
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

        if (ball.pos.x < -20) {
            this.onScore("right");
        } else if (ball.pos.x > baseW + 20) {
            this.onScore("left");
        }
    }

    // Get current game state (read-only)
    getState(): Readonly<GameState> {
        return this.state;
    }

    // Get current config (read-only)
    getConfig(): Readonly<GameConfig> {
        return this.config;
    }
}
