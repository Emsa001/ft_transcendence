import React, { useRef, useEffect } from "react";

// Utility: clamp a value
const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

// Types for game state
type Vec2 = { x: number; y: number };

interface Paddle {
    x: number;
    y: number;
    w: number;
    h: number;
    speed: number;
}

interface Ball {
    pos: Vec2;
    vel: Vec2;
    size: number;
    speed: number;
}

interface GameCanvasProps {
    scoreL: number;
    scoreR: number;
    paused: boolean;
    keys: Record<string, boolean>;
    paddleL: Paddle;
    paddleR: Paddle;
    ball: Ball;
    onScore: (scorer: "left" | "right") => void;
    showMessage: string | null;
    countdown: number | null;
}

export function GameCanvas({
    scoreL,
    scoreR,
    paused,
    keys,
    paddleL,
    paddleR,
    ball,
    onScore,
    showMessage,
    countdown,
}: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const runningRef = useRef<boolean>(false);

    // Logical game size independent of pixel density
    const baseW = 1280; // 16:9
    const baseH = 720;

    // Resize canvas to parent size and scale for HiDPI
    const resize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement as HTMLElement;
        const rect = parent.getBoundingClientRect();
        // Keep 16:9 inside parent
        let width = rect.width;
        let height = (rect.width * 9) / 16;
        if (height > rect.height) {
            height = rect.height;
            width = (rect.height * 16) / 9;
        }
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${Math.floor(width)}px`;
        canvas.style.height = `${Math.floor(height)}px`;
    };

    // Resize on mount & on window resize
    useEffect(() => {
        resize();
        const handler = () => resize();
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    // Main game loop
    useEffect(() => {
        const loop = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Map from logical base size to current canvas size
            const sx = canvas.width / baseW;
            const sy = canvas.height / baseH;

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

            // Midline (glass neon)
            ctx.save();
            ctx.strokeStyle = "rgba(191, 128, 255, 0.35)"; // purple glow
            ctx.lineWidth = 4 * sx;
            ctx.setLineDash([16 * sx, 22 * sx]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 40 * sy);
            ctx.lineTo(canvas.width / 2, canvas.height - 40 * sy);
            ctx.stroke();
            ctx.restore();

            if (!paused && !showMessage && !countdown && runningRef.current) {
                // Left paddle movement (W/S)
                if (keys["w"]) paddleL.y -= paddleL.speed;
                if (keys["s"]) paddleL.y += paddleL.speed;
                // Right paddle movement (ArrowUp/ArrowDown)
                if (keys["arrowup"]) paddleR.y -= paddleR.speed;
                if (keys["arrowdown"]) paddleR.y += paddleR.speed;

                // Clamp paddles
                paddleL.y = clamp(paddleL.y, 20, baseH - paddleL.h - 20);
                paddleR.y = clamp(paddleR.y, 20, baseH - paddleR.h - 20);

                // Ball physics
                ball.pos.x += ball.vel.x;
                ball.pos.y += ball.vel.y;

                // Top/bottom collisions
                if (ball.pos.y <= 10 || ball.pos.y + ball.size >= baseH - 10) {
                    ball.vel.y *= -1;
                }

                // Paddle collisions with a bit of spin based on hit position
                const collidePaddle = (
                    px: number,
                    py: number,
                    pw: number,
                    ph: number,
                    dir: number
                ) => {
                    const bx = ball.pos.x;
                    const by = ball.pos.y;
                    const bs = ball.size;
                    if (
                        bx < px + pw &&
                        bx + bs > px &&
                        by < py + ph &&
                        by + bs > py
                    ) {
                        // Where on the paddle did we hit?
                        const rel = (by + bs / 2 - (py + ph / 2)) / (ph / 2); // -1..1
                        const maxBounce = Math.PI / 3; // 60°
                        const angle = rel * maxBounce;
                        const currentSpeed = Math.hypot(ball.vel.x, ball.vel.y);
                        // Increase speed by 5% each hit, cap at 25
                        const newSpeed = Math.min(currentSpeed * 1.05, 25);
                        ball.vel.x = Math.cos(angle) * newSpeed * dir;
                        ball.vel.y = Math.sin(angle) * newSpeed;
                        // Small nudge to avoid sticking
                        ball.pos.x += dir * 6;
                    }
                };
                collidePaddle(paddleL.x, paddleL.y, paddleL.w, paddleL.h, 1);
                collidePaddle(paddleR.x, paddleR.y, paddleR.w, paddleR.h, -1);

                // Scoring
                if (ball.pos.x < -20) {
                    onScore("right");
                } else if (ball.pos.x > baseW + 20) {
                    onScore("left");
                }
            }

            // Draw paddles & ball with glassmorphism
            const drawGlassRect = (
                x: number,
                y: number,
                w: number,
                h: number
            ) => {
                ctx.save();
                ctx.shadowColor = "#7a5cff"; // purple glow
                ctx.shadowBlur = 18 * dpr;
                const r = 10 * sx;
                ctx.beginPath();
                ctx.moveTo((x + r) * sx, y * sy);
                ctx.lineTo((x + w - r) * sx, y * sy);
                ctx.quadraticCurveTo(
                    (x + w) * sx,
                    y * sy,
                    (x + w) * sx,
                    (y + r) * sy
                );
                ctx.lineTo((x + w) * sx, (y + h - r) * sy);
                ctx.quadraticCurveTo(
                    (x + w) * sx,
                    (y + h) * sy,
                    (x + w - r) * sx,
                    (y + h) * sy
                );
                ctx.lineTo((x + r) * sx, (y + h) * sy);
                ctx.quadraticCurveTo(
                    x * sx,
                    (y + h) * sy,
                    x * sx,
                    (y + h - r) * sy
                );
                ctx.lineTo(x * sx, (y + r) * sy);
                ctx.quadraticCurveTo(x * sx, y * sy, (x + r) * sx, y * sy);
                ctx.closePath();
                const glass = ctx.createLinearGradient(
                    x * sx,
                    y * sy,
                    (x + w) * sx,
                    (y + h) * sy
                );
                glass.addColorStop(0, "rgba(255,255,255,0.08)");
                glass.addColorStop(1, "rgba(130, 100, 255, 0.18)");
                ctx.fillStyle = glass;
                ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.15)";
                ctx.lineWidth = 2 * sx;
                ctx.stroke();
                ctx.restore();
            };

            drawGlassRect(paddleL.x, paddleL.y, paddleL.w, paddleL.h);
            drawGlassRect(paddleR.x, paddleR.y, paddleR.w, paddleR.h);

            // Ball
            ctx.save();
            ctx.shadowColor = "#4cc9f0"; // blue glow
            ctx.shadowBlur = 20 * dpr;
            const bx = (ball.pos.x + ball.size / 2) * sx;
            const by = (ball.pos.y + ball.size / 2) * sy;
            const br = (ball.size / 2) * sx;
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

            // HUD: scores in neon glass chips
            const drawScoreChip = (text: string, cx: number) => {
                const pad = 16 * sx;
                ctx.save();
                ctx.font = `${48 * sx}px ui-sans-serif, system-ui, -apple-system`;
                const metrics = ctx.measureText(text);
                const w = metrics.width + pad * 2;
                const h = 64 * sy;
                const x = cx - w / 2;
                const y = 24 * sy;
                // chip
                ctx.shadowColor = "#7a5cff";
                ctx.shadowBlur = 22 * dpr;
                ctx.fillStyle = "rgba(255,255,255,0.08)";
                ctx.strokeStyle = "rgba(255,255,255,0.16)";
                const r = 14 * sx;
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
                ctx.lineWidth = 2 * sx;
                ctx.stroke();
                // text
                ctx.fillStyle = "#d6ccff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(text, cx, y + h / 2 + 2 * sy);
                ctx.restore();
            };
            drawScoreChip(String(scoreL), canvas.width * 0.25);
            drawScoreChip(String(scoreR), canvas.width * 0.75);

            // Countdown overlay
            if (countdown !== null) {
                ctx.save();
                ctx.fillStyle = "rgba(15, 10, 40, 0.8)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#c4b5fd";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                // Large countdown number
                ctx.font = `${120 * sx}px ui-sans-serif, system-ui`;
                ctx.shadowColor = "#7a5cff";
                ctx.shadowBlur = 30 * dpr;
                ctx.fillText(
                    String(countdown),
                    canvas.width / 2,
                    canvas.height / 2
                );

                // Smaller text below
                ctx.font = `${24 * sx}px ui-sans-serif, system-ui`;
                ctx.shadowBlur = 10 * dpr;
                ctx.fillText(
                    "Get Ready!",
                    canvas.width / 2,
                    canvas.height / 2 + 80 * sy
                );
                ctx.restore();
            }

            // Score message overlay
            if (showMessage) {
                ctx.save();
                ctx.fillStyle = "rgba(15, 10, 40, 0.7)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#c4b5fd";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `${48 * sx}px ui-sans-serif, system-ui`;
                ctx.fillText(
                    showMessage,
                    canvas.width / 2,
                    canvas.height / 2 - 30 * sy
                );
                ctx.font = `${24 * sx}px ui-sans-serif, system-ui`;
                ctx.fillText(
                    "New round starting...",
                    canvas.width / 2,
                    canvas.height / 2 + 30 * sy
                );
                ctx.restore();
            }

            // Pause overlay
            if (paused && !showMessage && !countdown) {
                ctx.save();
                ctx.fillStyle = "rgba(15, 10, 40, 0.45)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#c4b5fd";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `${34 * sx}px ui-sans-serif, system-ui`;
                ctx.fillText(
                    "Press Space to Play/Pause",
                    canvas.width / 2,
                    canvas.height / 2 - 20 * sy
                );
                ctx.font = `${22 * sx}px ui-sans-serif, system-ui`;
                ctx.fillText(
                    "Left: W/S     Right: ↑/↓",
                    canvas.width / 2,
                    canvas.height / 2 + 18 * sy
                );
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        runningRef.current = true;
        rafRef.current = requestAnimationFrame(loop);
        return () => {
            runningRef.current = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [
        paused,
        scoreL,
        scoreR,
        keys,
        paddleL,
        paddleR,
        ball,
        onScore,
        showMessage,
        countdown,
    ]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <canvas ref={canvasRef} className="block rounded-xl" />
        </div>
    );
}
