import { useRef, useState } from "react";
import { Vec2, Paddle, Ball, PongPlayer, PongPlayerInitial } from "../types";

export function useGameState(initialPlayers?: PongPlayerInitial[]) {
    // Logical game size independent of pixel density
    const baseW = 1280; // 16:9
    const baseH = 720;

    // Default players if none provided
    const defaultPlayers = [
        { name: "Player 1", controls: { up: "w", down: "s" } },
        { name: "Player 2", controls: { up: "arrowup", down: "arrowdown" } },
    ];

    const playersConfig = initialPlayers || defaultPlayers;

    // Create paddles based on player count and position them appropriately
    const createPaddles = (): {
        players: PongPlayer[];
        paddleRefs: Paddle[];
    } => {
        const players: PongPlayer[] = [];
        const paddleRefs: Paddle[] = [];

        playersConfig.forEach((playerConfig, index) => {
            const paddleWidth = 14;
            const paddleHeight = 120;
            const spacing = baseW / (playersConfig.length + 1);

            // For 2 players, position at sides. For more players, distribute evenly
            let x: number;
            if (playersConfig.length === 2) {
                x = index === 0 ? 40 : baseW - 54;
            } else {
                x = spacing * (index + 1) - paddleWidth / 2;
            }

            const paddle = {
                x,
                y: baseH / 2 - paddleHeight / 2,
                w: paddleWidth,
                h: paddleHeight,
                speed: 9,
            };

            players.push({
                id: `player_${index}`,
                name: playerConfig.name,
                score: 0,
                paddle, // This will reference the paddle from paddleRefs
                controls: playerConfig.controls,
            });

            paddleRefs.push(paddle);
        });

        return { players, paddleRefs };
    };

    const { players: initialPlayersState, paddleRefs } = createPaddles();

    // Players state for UI updates (scores)
    const [players, setPlayers] = useState<PongPlayer[]>(initialPlayersState);

    // Paddle refs for performance (positions)
    const paddleRefsRef = useRef<Paddle[]>(paddleRefs);

    // Keep players paddle references in sync
    players.forEach((player, index) => {
        player.paddle = paddleRefsRef.current[index];
    });

    const ball = useRef<Ball>({
        pos: { x: baseW / 2, y: baseH / 2 } as Vec2,
        vel: { x: 6, y: 3 } as Vec2,
        size: 14,
        speed: 7.5,
    });

    const resetPaddles = () => {
        // Reset all player paddles to center position
        setPlayers((prevPlayers) => {
            prevPlayers.forEach((player, index) => {
                paddleRefsRef.current[index].y =
                    baseH / 2 - paddleRefsRef.current[index].h / 2;
            });
            return prevPlayers;
        });
    };

    // Reset ball to center with randomized direction
    const resetBall = (toPlayerId?: string) => {
        ball.current.pos = { x: baseW / 2, y: baseH / 2 };
        const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6; // -30°..+30°

        // For 2 players, use traditional left/right direction
        // For more players, randomize direction
        let dir = 1;
        if (players.length === 2) {
            if (toPlayerId) {
                const player = players.find((p) => p.id === toPlayerId);
                dir = player && player.paddle.x < baseW / 2 ? -1 : 1;
            } else {
                dir = Math.random() < 0.5 ? -1 : 1;
            }
        } else {
            dir = Math.random() < 0.5 ? -1 : 1;
        }

        const speed = ball.current.speed;
        ball.current.vel = {
            x: Math.cos(angle) * speed * dir,
            y: Math.sin(angle) * speed,
        };
    };

    const resetGame = () => {
        // Reset all player paddles to center position and scores
        setPlayers((prevPlayers) =>
            prevPlayers.map((player, index) => {
                paddleRefsRef.current[index].y =
                    baseH / 2 - paddleRefsRef.current[index].h / 2;
                return {
                    ...player,
                    score: 0,
                };
            })
        );

        // Reset ball speed to initial value
        ball.current.speed = 7.5;
        resetBall();
    };

    const updatePlayerScore = (playerId: string, newScore: number) => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
                player.id === playerId ? { ...player, score: newScore } : player
            )
        );
    };

    return {
        players,
        ball: ball.current,
        resetBall,
        resetGame,
        resetPaddles,
        updatePlayerScore,
    };
}
