import { Ball, Paddle } from "shared";
import { GameEngine } from "./engine.service";

interface RandomEvent {
    action: (gameEngine: GameEngine) => void;
    time: number;
    name: string;
    chance: number;
}

let isEvent = false;

class GameEvents {
    private events: RandomEvent[];
    private timeoutId: ReturnType<typeof setTimeout> | null = null;
    private snapshot: { ball: Ball; paddles: Record<number, Paddle> } | null =
        null;

    constructor() {
        this.events = [];
    }

    reset(gameEngine: GameEngine): void {
        isEvent = false;
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

    tryEvent(gameEngine: GameEngine): void {
        if (isEvent) return;

        this.snapshot = { ball: gameEngine.ball, paddles: gameEngine.paddles };

        this.events.forEach((event) => {
            if (Math.random() < event.chance) {
                event.action(gameEngine);
                isEvent = true;

                this.timeoutId = setTimeout(() => {
                    isEvent = false;
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
}

export const gameEvents = new GameEvents();

// Example Events

// stuck paddles for 1 second
gameEvents.registerEvent({
    name: "STUCK",
    chance: 0.001,
    time: 1000,
    action: (gameEngine) => {
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
gameEvents.registerEvent({
    name: "BIG_BALL",
    chance: 0.001,
    time: 10000,
    action: (gameEngine) => {
        gameEngine.ball = {
            ...gameEngine.ball,
            size: gameEngine.ball.size * 3,
        };
        gameEngine.onRandomEvent?.("BIG BALL! [10s]");
    },
});

// small ball for 10 seconds
gameEvents.registerEvent({
    name: "SMALL_BALL",
    chance: 0.001,
    time: 10000,
    action: (gameEngine) => {
        gameEngine.ball = {
            ...gameEngine.ball,
            size: gameEngine.ball.size * 0.3,
        };
        gameEngine.onRandomEvent?.("SMALL BALL! [10s]");
    },
});

// reverse controls for 5 seconds
gameEvents.registerEvent({
    name: "REVERSE_CONTROLS",
    chance: 0.001,
    time: 5000,
    action: (gameEngine) => {
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
gameEvents.registerEvent({
    name: "TINY_PADDLES",
    chance: 0.001,
    time: 10000,
    action: (gameEngine) => {
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
gameEvents.registerEvent({
    name: "HUGE_PADDLES",
    chance: 0.001,
    time: 10000,
    action: (gameEngine) => {
        gameEngine.paddles = Object.fromEntries(
            Object.entries(gameEngine.paddles).map(([id, p]) => [
                id,
                { ...p, size: { ...p.size, y: p.size.y * 2 } },
            ])
        );
        gameEngine.onRandomEvent?.("HUGE PADDLES! [10s]");
    },
});
