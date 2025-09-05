import { Ball, Paddle } from "shared";
import { GameRenderer } from "./GameRender";
import { clamp } from "lodash";

interface Aim {
    x: number;
    y: number;
    velX: number;
    velY: number;
}

export enum AiLevel {
    EASY = 1,
    HARD = 2,
    IMPOSSIBLE = 3,
}

class AiEngine {
    level: AiLevel = AiLevel.EASY;
    private targetY: number;
    private paddleX: number;
    private paddleSizeY: number;
    private lastVelY: number = 0;
    private timeSinceUpdate = 0;
    private refreshInterval = 1000;
    private windowTop = GameRenderer.padding;
    private windowBottom = GameRenderer.baseH - GameRenderer.padding;

    constructor() {
        this.paddleX = 0;
        this.targetY = 0;
        this.paddleSizeY = 0;
    }

    private predictTargetY(ball: Ball) {
        let aim: Aim = {
            x: ball.pos.x,
            y: ball.pos.y,
            velX: ball.vel.x,
            velY: ball.vel.y,
        };

        while (true) {
            if (aim.velX < 0 || (aim.velX > 0 && aim.x >= this.paddleX)) break;

            aim.x += aim.velX;
            aim.y += aim.velY;

            if (aim.y <= this.windowTop) {
                aim.y = this.windowTop;
                aim.velY = Math.abs(aim.velY);
            } else if (aim.y >= this.windowBottom) {
                aim.y = this.windowBottom;
                aim.velY = -Math.abs(aim.velY);
            }
        }

        this.targetY = aim.y;
        this.lastVelY = aim.velY;
    }

    private moveToTarget(paddle: Paddle, targetY: number): void {
        const paddleCenter = paddle.pos.y + this.paddleSizeY / 2;

        let aimOffset = 0;
        if (this.lastVelY > 0) {
            aimOffset = this.paddleSizeY / 2 - 5;
        } else {
            aimOffset = -this.paddleSizeY / 2 + 5;
        }

        let adjustedTarget = 0;
        if (this.level === AiLevel.EASY) {
            adjustedTarget = targetY;
        } else {
            adjustedTarget = targetY + aimOffset;
        }

        if (paddleCenter < adjustedTarget) {
            paddle.pos.y += paddle.speed;
        } else if (paddleCenter > adjustedTarget) {
            paddle.pos.y -= paddle.speed;
        }

        paddle.pos.y = clamp(
            paddle.pos.y,
            this.windowTop,
            this.windowBottom - this.paddleSizeY
        );
    }

    public update(paddle: Paddle, ball: Ball): void {
        this.paddleX = paddle.pos.x;
        this.paddleSizeY = paddle.size.y;
        if (this.level === AiLevel.IMPOSSIBLE) {
            this.predictTargetY(ball);
        } else {
            this.timeSinceUpdate += 16;
            if (this.timeSinceUpdate >= this.refreshInterval) {
                this.timeSinceUpdate = 0;
                this.predictTargetY(ball);
            }
        }

        if (this.targetY) this.moveToTarget(paddle, this.targetY);
    }
}

export const aiEngine = new AiEngine();
