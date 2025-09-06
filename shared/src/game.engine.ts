import { Ball, Paddle } from "./game";

export interface GameEngineType {
    ball: Ball;
    paddles: Record<number, Paddle>;
    randomEvents: boolean;
    stopped: boolean;
    onScore?: (scorerId: number) => void;
    onRandomEvent?: (event: string) => void;
}

interface RandomEvent {
    action: () => void;
    time: number;
    name: string;
    chance: number;
}

export class GameEvents {
    private isEvent: boolean;
    private events: RandomEvent[];
    private timeoutId: ReturnType<typeof setTimeout> | null = null;
    private snapshot: { ball: Ball; paddles: Record<number, Paddle> } | null =
        null;

    private gameEngine: GameEngineType;

    constructor(gameEngine: GameEngineType) {
        this.events = [];
        this.isEvent = false;
        this.gameEngine = gameEngine;
        this.initEvents();
    }

    reset(): void {
        this.isEvent = false;
        const gameEngine = this.gameEngine;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        if (this.snapshot) {
            gameEngine.ball = this.snapshot.ball;
            gameEngine.paddles = this.snapshot.paddles;
            this.snapshot = null;
        }
    }

    tryEvent(): void {
        if (this.isEvent) return;
        const gameEngine = this.gameEngine;

        this.snapshot = { ball: gameEngine.ball, paddles: gameEngine.paddles };

        this.events.forEach((event) => {
            if (gameEngine.stopped) return;
            if (Math.random() < event.chance) {
                event.action();
                this.isEvent = true;

                this.timeoutId = setTimeout(() => {
                    this.isEvent = false;
                    if (this.snapshot) {
                        gameEngine.ball = this.snapshot.ball;
                        gameEngine.paddles = this.snapshot.paddles;
                    }
                    this.snapshot = null;
                }, event.time);
            }
        });
    }

    registerEvent(event: RandomEvent): void {
        this.events.push(event);
    }

    initEvents(): void {

        const gameEngine = this.gameEngine;

        this.registerEvent({
            name: "STUCK",
            chance: 0.001,
            time: 1000,
            action: () => {
                gameEngine.paddles = Object.fromEntries(
                    Object.entries(gameEngine.paddles).map(([id, p]) => [
                        id,
                        { ...p, speed: 0 },
                    ])
                );
                gameEngine.onRandomEvent?.("STUCK! [1s]");
            },
        });

        // big ball for 1 second
        this.registerEvent({
            name: "BIG_BALL",
            chance: 0.001,
            time: 10000,
            action: () => {
                gameEngine.ball = {
                    ...gameEngine.ball,
                    size: gameEngine.ball.size * 3,
                };
                gameEngine.onRandomEvent?.("BIG BALL! [10s]");
            },
        });

        // small ball for 10 seconds
        this.registerEvent({
            name: "SMALL_BALL",
            chance: 0.001,
            time: 10000,
            action: () => {
                gameEngine.ball = {
                    ...gameEngine.ball,
                    size: gameEngine.ball.size * 0.3,
                };
                gameEngine.onRandomEvent?.("SMALL BALL! [10s]");
            },
        });

        // reverse controls for 5 seconds
        this.registerEvent({
            name: "REVERSE_CONTROLS",
            chance: 0.001,
            time: 5000,
            action: () => {
                gameEngine.paddles = Object.fromEntries(
                    Object.entries(gameEngine.paddles).map(([id, p]) => [
                        id,
                        {
                            ...p,
                            controls: { up: p.controls.down, down: p.controls.up },
                        },
                    ])
                );
                gameEngine.onRandomEvent?.("REVERSE CONTROLS! [5s]");
            },
        });

        // tiny paddles for 10 seconds
        this.registerEvent({
            name: "TINY_PADDLES",
            chance: 0.001,
            time: 10000,
            action: () => {
                gameEngine.paddles = Object.fromEntries(
                    Object.entries(gameEngine.paddles).map(([id, p]) => [
                        id,
                        { ...p, size: { ...p.size, y: p.size.y * 0.5 } },
                    ])
                );
                gameEngine.onRandomEvent?.("TINY PADDLES! [10s]");
            },
        });

        // // huge paddles for 10 seconds
        this.registerEvent({
            name: "HUGE_PADDLES",
            chance: 0.001,
            time: 10000,
            action: () => {
                gameEngine.paddles = Object.fromEntries(
                    Object.entries(gameEngine.paddles).map(([id, p]) => [
                        id,
                        { ...p, size: { ...p.size, y: p.size.y * 2 } },
                    ])
                );
                gameEngine.onRandomEvent?.("HUGE PADDLES! [10s]");
            },
        });

    }
}