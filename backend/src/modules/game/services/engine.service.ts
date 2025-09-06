import {
    Ball,
    GameEngineType,
    GameEvents,
    GameFrame,
    GameUserDTOType,
    Paddle,
} from "shared";

export class GameEngine implements GameEngineType {
    private readonly baseW = 1280;
    private readonly baseH = 720;

    ball: Ball;
    paddles: Record<number, Paddle>;
    randomEvents = false;
    stopped = true;
    onScore?: (scorerId: number) => void;
    onRandomEvent?: (event: string) => void;

    private readonly defaultBallSpeed = 7.5;
    private readonly paddleWidth = 14;
    private readonly paddleHeight = 120;
    private readonly paddleSpeed = 6;
    private readonly paddlePadding = 40;

    static readonly fps = 60;
    static readonly dt = 1 / GameEngine.fps;
    private gameEvents;

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

    getFrame(): GameFrame {
        return {
            ball: this.ball,
            paddles: this.paddles,
        };
    }

    initPaddles(players: GameUserDTOType[]): void {
        this.paddles = {};
        players.forEach((player, index) => {
            const y = this.baseH / 2 - this.paddleHeight / 2;
            const x =
                index === 0
                    ? this.paddlePadding
                    : this.baseW - (this.paddlePadding + this.paddleWidth);

            const controls = { up: "w", down: "s" };

            this.paddles[player.id] = {
                pos: { x, y },
                size: { x: this.paddleWidth, y: this.paddleHeight },
                speed: this.paddleSpeed,
                vel: 0,
                controls,
            };
        });
    }

    handleInput(playerId: number, input: string, state: "down" | "up"): void {
        const paddle = this.paddles[playerId];
        if (!paddle) return;

        const key = input.toLowerCase();
        if (key === paddle.controls.up.toLowerCase()) {
            paddle.vel = state === "down" ? -1 : 0;
        } else if (key === paddle.controls.down.toLowerCase()) {
            paddle.vel = state === "down" ? 1 : 0;
        }
    }

    togglePause() {
        this.stopped = !this.stopped;
    }

    update() {
        if (this.stopped) return false;
        if (this.randomEvents) this.gameEvents.tryEvent();

        this.updatePaddles();
        this.updateBall();
        this.handleCollisions();
        this.handleScoring();

        return true;
    }

    private updatePaddles() {
        for (const id in this.paddles) {
            const p = this.paddles[id];
            p.pos.y += p.vel * p.speed;
            p.pos.y = Math.max(0, Math.min(this.baseH - p.size.y, p.pos.y));
        }
    }

    private updateBall() {
        const dtScale = GameEngine.dt * GameEngine.fps; // scale to match speed
        this.ball.pos.x += this.ball.vel.x * dtScale;
        this.ball.pos.y += this.ball.vel.y * dtScale;
    }

    private handleCollisions() {
        // Wall collisions
        if (this.ball.pos.y <= 0) {
            this.ball.pos.y = 0;
            this.ball.vel.y = Math.abs(this.ball.vel.y);
        } else if (this.ball.pos.y + this.ball.size >= this.baseH) {
            this.ball.pos.y = this.baseH - this.ball.size;
            this.ball.vel.y = -Math.abs(this.ball.vel.y);
        }

        // Paddle collisions
        for (const id in this.paddles) {
            const paddle = this.paddles[id];
            const b = this.ball;
            const dir = paddle.pos.x < this.baseW / 2 ? 1 : -1;

            if (
                b.pos.x < paddle.pos.x + paddle.size.x &&
                b.pos.x + b.size > paddle.pos.x &&
                b.pos.y < paddle.pos.y + paddle.size.y &&
                b.pos.y + b.size > paddle.pos.y
            ) {
                const rel =
                    (b.pos.y +
                        b.size / 2 -
                        (paddle.pos.y + paddle.size.y / 2)) /
                    (paddle.size.y / 2);
                const angle = rel * (Math.PI / 3);
                const boost = 0.92 + (1.18 - 0.92) * Math.abs(rel);
                const speed = Math.max(
                    5,
                    Math.min(Math.hypot(b.vel.x, b.vel.y) * boost, 28)
                );

                b.vel.x = Math.cos(angle) * speed * dir;
                b.vel.y = Math.sin(angle) * speed;

                // prevent sticking to paddle
                b.pos.x += dir * 6;
            }
        }
    }

    private handleScoring() {
        const paddleEntries = Object.entries(this.paddles).map(([id, p]) => ({
            id: parseInt(id),
            x: p.pos.x,
        }));

        const leftPlayerId = paddleEntries.reduce((left, p) =>
            p.x < left.x ? p : left
        ).id;
        const rightPlayerId = paddleEntries.reduce((right, p) =>
            p.x > right.x ? p : right
        ).id;

        if (this.ball.pos.x < -20) {
            // Right player scores
            this.onScore?.(rightPlayerId);
            this.gameEvents.reset();
            this.resetPositions();
        } else if (this.ball.pos.x > this.baseW + 20) {
            // Left player scores
            this.onScore?.(leftPlayerId);
            this.gameEvents.reset();
            this.resetPositions();
        }
    }

    resetPositions() {
        const centerY = this.baseH / 2;

        for (const id in this.paddles) {
            const p = this.paddles[id];
            p.pos.y = centerY - p.size.y / 2;
        }

        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6;
        const dir = Math.random() < 0.5 ? -1 : 1;

        this.ball.pos = { x: this.baseW / 2, y: this.baseH / 2 };
        this.ball.vel = {
            x: Math.cos(angle) * this.defaultBallSpeed * dir,
            y: Math.sin(angle) * this.defaultBallSpeed,
        };
        this.ball.speed = this.defaultBallSpeed;
    }
}
