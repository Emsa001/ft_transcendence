import { clamp, set } from "lodash";
import { GameRenderer } from "./GameRender";
import {
    Ball,
    GameEngineType,
    GameEvents,
    GameUserDTOType,
    Paddle,
} from "shared";
import { aiEngine } from "./AiEngine";

export class GameEngine implements GameEngineType {
    ball: Ball;
    paddles: Record<number, Paddle>;
    aiPaddle?: boolean;
    randomEvents = false;
    gameEvents;
    keys: Record<string, boolean> = {};
    stopped = true;

    onScore?: (scorerId: number) => void;
    onRandomEvent?: (event: string) => void;

    readonly defaultBallSpeed = 7.5;
    readonly paddleWidth = 14;
    readonly paddleHeight = 120;
    readonly paddleSpeed = 9;
    readonly paddlePadding = 40;

    constructor() {
        this.ball = {
            pos: { x: -10, y: -10 },
            vel: { x: 6, y: 3 },
            size: 14,
            speed: this.defaultBallSpeed,
        };
        this.paddles = {};
        this.gameEvents = new GameEvents(this);
    }

    // Initialization

    createPlayers(players?: GameUserDTOType[]): GameUserDTOType[] {
        const defaultPlayers = [
            { id: 0, username: "Player 1", score: 0 },
            { id: 1, username: "Player 2", score: 0 },
        ];
        const initialized = players ?? defaultPlayers;
        if (
            players &&
            players.length === 2 &&
            players[1].username === "Ai-Pong"
        ) {
            this.aiPaddle = true;
        } else {
            this.aiPaddle = false;
        }
        this.initPaddles(initialized);
        return initialized;
    }

    initPaddles(players: GameUserDTOType[]): void {
        this.paddles = {};
        players.forEach((player, index) => {
            const y = GameRenderer.baseH / 2 - this.paddleHeight / 2;
            const x =
                index === 0
                    ? this.paddlePadding
                    : GameRenderer.baseW -
                      (this.paddlePadding + this.paddleWidth);

            const controls = {
                up: index === 0 ? "w" : !this.aiPaddle ? "arrowup" : "ai",
                down: index === 0 ? "s" : !this.aiPaddle ? "arrowdown" : "ai",
            };

            this.paddles[player.id] = {
                pos: { x, y },
                size: { x: this.paddleWidth, y: this.paddleHeight },
                speed: this.paddleSpeed,
                vel: 0, // not used in frontend
                controls,
            };
        });
    }

    // Resetting

    resetPositions(): void {
        this.gameEvents.reset();
        this.resetPaddles();
        this.resetBall();
    }

    private resetPaddles(): void {
        const centerY = GameRenderer.baseH / 2;
        Object.values(this.paddles).forEach(
            (p) => (p.pos.y = centerY - p.size.y / 2)
        );
    }

    private resetBall(): void {
        const { baseW, baseH } = GameRenderer;
        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6;
        const dir = Math.random() < 0.5 ? -1 : 1;

        this.ball.pos = { x: baseW / 2, y: baseH / 2 };
        this.ball.vel = {
            x: Math.cos(angle) * this.defaultBallSpeed * dir,
            y: Math.sin(angle) * this.defaultBallSpeed,
        };
        this.ball.speed = this.defaultBallSpeed;
    }

    // Update loop

    update(): void {
        if (this.stopped) return;
        if (this.randomEvents) this.gameEvents.tryEvent();

        this.updatePaddles();
        this.updateBall();
        this.handleCollisions();
        this.handleScoring();
    }

    private updatePaddles(): void {
        const { baseH, padding } = GameRenderer;
        Object.values(this.paddles).forEach((p) => {
            if (this.aiPaddle && p.controls.up === "ai") return;
            if (this.keys[p.controls.up]) p.pos.y -= p.speed;
            if (this.keys[p.controls.down]) p.pos.y += p.speed;
            p.pos.y = clamp(p.pos.y, padding, baseH - p.size.y - padding);
        });
        if (this.aiPaddle) {
            aiEngine.update(this.paddles[1], this.ball);
        }
    }

    private updateBall(): void {
        this.ball.pos.x += this.ball.vel.x;
        this.ball.pos.y += this.ball.vel.y;
    }

    private handleCollisions(): void {
        this.handleWallCollision();
        Object.entries(this.paddles).forEach(([playerId, paddle]) => {
            // Determine direction based on paddle position (left paddle = 1, right paddle = -1)
            const dir = paddle.pos.x < GameRenderer.baseW / 2 ? 1 : -1;
            this.handlePaddleCollision(paddle, dir);
        });
    }

    private handleWallCollision(): void {
        const { baseH, padding } = GameRenderer;
        const b = this.ball;
        if (b.pos.y <= padding) {
            b.pos.y = padding;
            b.vel.y = Math.abs(b.vel.y);
        } else if (b.pos.y + b.size >= baseH - padding) {
            b.pos.y = baseH - padding - b.size;
            b.vel.y = -Math.abs(b.vel.y);
        }
    }

    private handlePaddleCollision(paddle: Paddle, dir: number): void {
        const b = this.ball;
        if (
            b.pos.x < paddle.pos.x + paddle.size.x &&
            b.pos.x + b.size > paddle.pos.x &&
            b.pos.y < paddle.pos.y + paddle.size.y &&
            b.pos.y + b.size > paddle.pos.y
        ) {
            const rel =
                (b.pos.y + b.size / 2 - (paddle.pos.y + paddle.size.y / 2)) /
                (paddle.size.y / 2);
            const angle = rel * (Math.PI / 3);
            const boost = 0.92 + (1.18 - 0.92) * Math.abs(rel);
            const speed = clamp(Math.hypot(b.vel.x, b.vel.y) * boost, 5, 28);
            b.vel.x = Math.cos(angle) * speed * dir;
            b.vel.y = Math.sin(angle) * speed;
            b.pos.x += dir * 6;
        }
    }

    private handleScoring(): void {
        const { baseW } = GameRenderer;
        const paddleIds = Object.keys(this.paddles).map(Number);
        if (this.ball.pos.x < -20) {
            this.onScore?.(paddleIds[1]); // Right player scores
        } else if (this.ball.pos.x > baseW + 20) {
            this.onScore?.(paddleIds[0]); // Left player scores
        }
    }
}

export const gameEngine = new GameEngine();
