import { GameUserDTOType } from "shared";
import { Paddle, PongPlayer } from "../types";
import { GameRenderer } from "./GameRender";

const defaultPlayers = [
    { id: 1, username: "Player 1" },
    { id: 2, username: "Player 2" },
];

export const createPongPlayers = (
    playersConfig?: GameUserDTOType[]
): PongPlayer[] => {
    return (playersConfig || defaultPlayers).map((playerConfig, index) => {
        const w = 14;
        const h = 120;
        const y = GameRenderer.baseH / 2 - h / 2;

        let x = index === 0 ? 40 : GameRenderer.baseW - (40 + w);

        // Assign controls (currently only for 2 players)
        let controls: { up: string; down: string };
        if (index === 0) {
            controls = { up: "w", down: "s" };
        } else {
            controls = { up: "arrowup", down: "arrowdown" };
        }

        const paddle: Paddle = { x, y, w, h, speed: 9, controls };

        return {
            id: `player_${playerConfig.id}`,
            username: playerConfig.username,
            score: 0,
            paddle,
        };
    });
};
