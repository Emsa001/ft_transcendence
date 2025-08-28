import { Ball, GameData, PongPlayer } from "../types";

// Drawing and Calculation Class
export class GameRenderer {
    static baseW = 1280;
    static baseH = 720;

    ctx: CanvasRenderingContext2D;
    dpr: number;
    sx: number;
    sy: number;
    constructor(
        ctx: CanvasRenderingContext2D,
        dpr: number,
        sx: number,
        sy: number
    ) {
        this.ctx = ctx;
        this.dpr = dpr;
        this.sx = sx;
        this.sy = sy;
    }

    clearBackground(canvas: HTMLCanvasElement) {
        const ctx = this.ctx;
        // Clear with dark gradient
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
        // Subtle starry noise / vignette
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;
    }

    drawMidline(canvas: HTMLCanvasElement) {
        const ctx = this.ctx;
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

    drawPaddles(players: PongPlayer[]) {
        players.forEach((player) => {
            this.drawGlassRect(
                player.paddle.x,
                player.paddle.y,
                player.paddle.w,
                player.paddle.h
            );
        });
    }

    drawGlassRect(x: number, y: number, w: number, h: number) {
        const ctx = this.ctx;
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

    drawBall(ball: Ball) {
        const ctx = this.ctx;
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

    drawSpeed(ball: Ball) {
        const ctx = this.ctx;
        ctx.save();
        ctx.font = `${22 * this.sx}px ui-sans-serif, system-ui`;
        ctx.fillStyle = "#a0f";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const speed = Math.hypot(ball.vel.x, ball.vel.y).toFixed(1);
        ctx.fillText(`Speed: ${speed}`, 24 * this.sx, 18 * this.sy);
        ctx.restore();
    }

    drawScoreChip(text: string, cx: number) {
        const ctx = this.ctx;
        const pad = 16 * this.sx;
        ctx.save();
        ctx.font = `${48 * this.sx}px ui-sans-serif, system-ui, -apple-system`;
        const metrics = ctx.measureText(text);
        const w = metrics.width + pad * 2;
        const h = 64 * this.sy;
        const x = cx - w / 2;
        const y = 24 * this.sy;
        ctx.shadowColor = "#7a5cff";
        ctx.shadowBlur = 22 * this.dpr;
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.strokeStyle = "rgba(255,255,255,0.16)";
        const r = 14 * this.sx;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 2 * this.sx;
        ctx.stroke();
        ctx.fillStyle = "#d6ccff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, cx, y + h / 2 + 2 * this.sy);
        ctx.restore();
    }

    drawOverlay(
        canvas: HTMLCanvasElement,
        opts: {
            countdown: number | null;
            showMessage: string | null;
            state: GameData["state"];
        }
    ) {
        const ctx = this.ctx;
        const { countdown, showMessage, state } = opts;
        if (countdown !== null) {
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
                String(countdown),
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
        } else if (showMessage) {
            ctx.save();
            ctx.fillStyle = "rgba(15, 10, 40, 0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#c4b5fd";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${48 * this.sx}px ui-sans-serif, system-ui`;
            ctx.fillText(
                showMessage,
                canvas.width / 2,
                canvas.height / 2 - 30 * this.sy
            );
            ctx.font = `${24 * this.sx}px ui-sans-serif, system-ui`;
            ctx.fillText(
                state == "finished"
                    ? "Press space to restart"
                    : "New round starting...",
                canvas.width / 2,
                canvas.height / 2 + 30 * this.sy
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
}
