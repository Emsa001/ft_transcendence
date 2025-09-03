import { CanvasMessage, GameState } from "../types";
import { gameEngine } from "./GameEngine";

// Drawing and Calculation Class
export class GameRenderer {
    static baseW = 1280;
    static baseH = 720;
    static padding = 2;

    ctx: CanvasRenderingContext2D | null;
    dpr: number;
    sx: number;
    sy: number;

    constructor() {
        this.ctx = null;
        this.dpr = 1;
        this.sx = 1;
        this.sy = 1;

        console.log("GameRenderer initialized");
    }

    init(ctx: CanvasRenderingContext2D, dpr: number, sx: number, sy: number) {
        this.ctx = ctx;
        this.dpr = dpr;
        this.sx = sx;
        this.sy = sy;
    }

    clearBackground() {
        const ctx = this.ctx;
        if (!ctx) return;
        const canvas = ctx.canvas;

        const grad = ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );
        grad.addColorStop(0, "#0b0b1a");
        grad.addColorStop(1, "#0a0620");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;
    }

    drawMidline() {
        const ctx = this.ctx;
        if (!ctx) return;
        const canvas = ctx.canvas;

        ctx.save();
        ctx.strokeStyle = "rgba(191, 128, 255, 0.35)";
        ctx.lineWidth = 4 * this.sx;
        ctx.setLineDash([16 * this.sx, 22 * this.sx]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 10 * this.sy);
        ctx.lineTo(canvas.width / 2, canvas.height - 10 * this.sy);
        ctx.stroke();
        ctx.restore();
    }

    drawPaddles() {
        gameEngine.paddles.forEach((paddle) => {
            this.drawGlassRect(paddle.x, paddle.y, paddle.w, paddle.h);
        });
    }

    drawGlassRect(x: number, y: number, w: number, h: number) {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.save();
        ctx.shadowColor = "#7a5cff";
        ctx.shadowBlur = 18 * this.dpr;

        const r = Math.min(10 * this.sx, (w * this.sx) / 2, (h * this.sy) / 2);
        ctx.roundRect(x * this.sx, y * this.sy, w * this.sx, h * this.sy, r);

        ctx.closePath();

        const glass = ctx.createLinearGradient(
            x * this.sx,
            y * this.sy,
            (x + w) * this.sx,
            (y + h) * this.sy
        );
        glass.addColorStop(0, "rgba(255,255,255,0.08)");
        glass.addColorStop(1, "rgba(130, 100, 255, 0.18)");
        ctx.fillStyle = glass;

        ctx.fill();
        ctx.restore();
    }

    drawBall() {
        const ctx = this.ctx;
        if (!ctx) return;

        const ball = gameEngine.ball;

        ctx.save();
        ctx.shadowColor = "#4cc9f0";
        ctx.shadowBlur = 20 * this.dpr;
        const bx = (ball.pos.x + ball.size / 2) * this.sx;
        const by = (ball.pos.y + ball.size / 2) * this.sy;
        const br = (ball.size / 2) * this.sx;
        const radial = ctx.createRadialGradient(
            bx - br / 3,
            by - br / 3,
            br / 5,
            bx,
            by,
            br
        );
        radial.addColorStop(0, "#a0f");
        radial.addColorStop(1, "#4cc9f0");
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawSpeed() {
        const ctx = this.ctx;
        if (!ctx) return;

        const ball = gameEngine.ball;

        ctx.save();
        ctx.font = `${22 * this.sx}px ui-sans-serif, system-ui`;
        ctx.fillStyle = "#a0f";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const speed = Math.hypot(ball.vel.x, ball.vel.y).toFixed(1);
        ctx.fillText(`Speed: ${speed}`, 24 * this.sx, 18 * this.sy);
        ctx.restore();
    }

    drawStateOverlay(state: GameState, countDown: number | null) {
        const ctx = this.ctx;
        if (!ctx) return;
        const canvas = ctx.canvas;

        if (countDown) {
            ctx.save();
            ctx.fillStyle = "rgba(15, 10, 40, 0.8)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#c4b5fd";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${120 * this.sx}px ui-sans-serif, system-ui`;
            ctx.shadowColor = "#7a5cff";
            ctx.shadowBlur = 30 * this.dpr;
            ctx.fillText(
                String(countDown),
                canvas.width / 2,
                canvas.height / 2
            );
            ctx.font = `${24 * this.sx}px ui-sans-serif, system-ui`;
            ctx.shadowBlur = 10 * this.dpr;
            ctx.fillText(
                "Get Ready!",
                canvas.width / 2,
                canvas.height / 2 + 80 * this.sy
            );
            ctx.restore();
        } else if (state === "created") {
            ctx.save();
            ctx.fillStyle = "rgba(15, 10, 40, 0.8)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#c4b5fd";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${48 * this.sx}px ui-sans-serif, system-ui`;
            ctx.fillText(
                "Press Space to Start",
                canvas.width / 2,
                canvas.height / 2
            );
            ctx.restore();
        } else if (state === "paused") {
            ctx.save();
            ctx.fillStyle = "rgba(15, 10, 40, 0.45)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#c4b5fd";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${34 * this.sx}px ui-sans-serif, system-ui`;
            ctx.fillText(
                "Press Space to Play/Pause",
                canvas.width / 2,
                canvas.height / 2 - 20 * this.sy
            );
            ctx.font = `${22 * this.sx}px ui-sans-serif, system-ui`;
            ctx.fillText(
                "Left: W/S     Right: ↑/↓",
                canvas.width / 2,
                canvas.height / 2 + 18 * this.sy
            );
            ctx.restore();
        }
    }

    drawMessages(message: CanvasMessage[]) {
        if (message.length === 0) return;

        const ctx = this.ctx;
        if (!ctx) return;
        const canvas = ctx.canvas;

        ctx.save();
        ctx.fillStyle = "rgba(15, 10, 40, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        let currentY = canvas.height / 2;
        message.forEach((msg, index) => {
            const size = msg.size ?? 48;
            const color = msg.color ?? "#c4b5fd";
            const marginTop = msg.marginTop ?? 0;

            ctx.save();
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${size * this.sx}px ui-sans-serif, system-ui`;
            if (msg.shadow) {
                ctx.shadowColor = msg.shadow.color;
                ctx.shadowBlur = (msg.shadow.blur || 30) * this.dpr;
            }
            currentY += marginTop * this.sy;
            ctx.fillText(msg.text, canvas.width / 2, currentY);
            currentY += (size + 10) * this.sy;
            ctx.restore();
        });
    }
}

export const renderer = new GameRenderer();
