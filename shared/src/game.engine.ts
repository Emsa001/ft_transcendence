import { Ball, Paddle } from "./game";

export interface GameEngineType {
    ball: Ball;
    paddles: Record<number, Paddle>;
    randomEvents: boolean;
    stopped: boolean;
    onScore?: (scorerId: number) => void;
    onRandomEvent?: (event: string) => void;
}

export interface RandomEvent {
    action: () => void;
    time: number;
    name: string;
    chance: number;
}

export class GameEvents {
    private isEvent: boolean;
    private events: RandomEvent[];
    selectedEvent: RandomEvent | null = null;
    private timeoutIds: ReturnType<typeof setTimeout>[] = [];
    private snapshot: { ball: Ball; paddles: Record<number, Paddle> } | null =
        null;

    private gameEngine: GameEngineType;
    private cooldown: number;
    private isOnCooldown: boolean;

    constructor(gameEngine: GameEngineType, cooldown: number = 10000) {
        this.events = [];
        this.isEvent = false;
        this.isOnCooldown = false;
        this.cooldown = cooldown;
        this.gameEngine = gameEngine;
        this.initEvents();
    }

    reset(): void {
        this.isEvent = false;
        this.isOnCooldown = true;
        const gameEngine = this.gameEngine;

        this.timeoutIds.forEach((id) => clearTimeout(id));
        this.timeoutIds = [];

        if (this.snapshot) {
            gameEngine.ball = this.snapshot.ball;
            gameEngine.paddles = this.snapshot.paddles;
            this.snapshot = null;
        }

        this.timeoutIds.push(
            setTimeout(() => {
                this.isOnCooldown = false;
            }, this.cooldown)
        );
    }

    tryEvent(): void {
        if (this.isEvent || this.isOnCooldown) return;
        const gameEngine = this.gameEngine;

        const totalChance = this.events.reduce((sum, e) => sum + e.chance, 0);
        if (totalChance !== 100) {
            return;
        }

        let roll = Math.random() * 100;
        this.selectedEvent = null;

        for (const event of this.events) {
            if (roll < event.chance) {
                this.selectedEvent = event;
                break;
            }
            roll -= event.chance;
        }

        if (!this.selectedEvent) return;

        this.snapshot = { ball: gameEngine.ball, paddles: gameEngine.paddles };

        this.selectedEvent.action();
        this.isEvent = true;

        const id = setTimeout(() => {
            this.isEvent = false;
            if (this.snapshot) {
                gameEngine.ball = this.snapshot.ball;
                gameEngine.paddles = this.snapshot.paddles;
            }
            this.snapshot = null;

            const id2 = setTimeout(() => {
                this.isOnCooldown = false;
            }, this.cooldown);
            this.timeoutIds.push(id2);

            this.isOnCooldown = true;
        }, this.selectedEvent.time);


        this.timeoutIds.push(id);
    }

    registerEvent(event: RandomEvent): void {
        this.events.push(event);
    }

    initEvents(): void {
        const gameEngine = this.gameEngine;
        const chances = [12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5];

        this.registerEvent({
            name: "BIG_BALL",
            chance: chances[0],
            time: 10000,
            action: () => {
                gameEngine.ball = {
                    ...gameEngine.ball,
                    size: gameEngine.ball.size * 3,
                };
                gameEngine.onRandomEvent?.("BIG BALL! [10s]");
            },
        });

        this.registerEvent({
            name: "SMALL_BALL",
            chance: chances[1],
            time: 10000,
            action: () => {
                gameEngine.ball = {
                    ...gameEngine.ball,
                    size: gameEngine.ball.size * 0.3,
                };
                gameEngine.onRandomEvent?.("SMALL BALL! [10s]");
            },
        });

        this.registerEvent({
            name: "REVERSE_CONTROLS",
            chance: chances[2],
            time: 5000,
            action: () => {
                gameEngine.paddles = Object.fromEntries(
                    Object.entries(gameEngine.paddles).map(([id, p]) => [
                        id,
                        {
                            ...p,
                            controls: {
                                up: p.controls.down,
                                down: p.controls.up,
                            },
                        },
                    ])
                );
                gameEngine.onRandomEvent?.("REVERSE CONTROLS! [5s]");
            },
        });

        this.registerEvent({
            name: "STUCK",
            chance: chances[3],
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

        this.registerEvent({
            name: "TINY_PADDLES",
            chance: chances[4],
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

        this.registerEvent({
            name: "HUGE_PADDLES",
            chance: chances[5],
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

        this.registerEvent({
            name: "POWER UP PADDLES",
            chance: chances[6],
            time: 10000,
            action: () => {
                gameEngine.paddles = Object.fromEntries(
                    Object.entries(gameEngine.paddles).map(([id, p]) => [
                        id,
                        { ...p, speed: p.speed * 2 },
                    ])
                );
                gameEngine.onRandomEvent?.("POWER UP PADDLES! [10s]");
            },
        });

        this.registerEvent({
            name: "SLOW PADDLES",
            chance: chances[7],
            time: 10000,
            action: () => {
                gameEngine.paddles = Object.fromEntries(
                    Object.entries(gameEngine.paddles).map(([id, p]) => [
                        id,
                        { ...p, speed: p.speed * 0.5 },
                    ])
                );
                gameEngine.onRandomEvent?.("SLOW PADDLES! [10s]");
            },
        });
    }
}
