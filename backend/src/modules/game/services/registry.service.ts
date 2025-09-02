import { Game } from "@/database/models/Game/Game";
import { GameRoom } from "./room.service";
import { GameStatus } from "shared";

type HookType =
    | "onGameCreate"
    | "onGameDelete"
    | "onGameStart"
    | "onGameAvailabilityChange";

interface Hook {
    type: HookType;
    callback: Function;
}

class GameRoomRegistry {
    private rooms = new Map<string, GameRoom>();
    private hooks = new Set<Hook>();

    async init() {
        const games = await Game.findAll({
            where: {
                status: [GameStatus.WAITING, GameStatus.IN_PROGRESS],
            },
        });
        games.forEach((game) => {
            this.rooms.set(game.code!, new GameRoom(game));
        });
    }

    triggerHooks(type: HookType, ...args: any[]) {
        this.hooks.forEach((hook) => {
            if (hook.type === type) hook.callback(...args);
        });
    }

    create(game: Game) {
        if (!this.rooms.has(game.code!)) {
            this.rooms.set(game.code!, new GameRoom(game));
            this.triggerHooks("onGameCreate", game);
        }
        return this.rooms.get(game.code!)!;
    }

    get(gameCode: string) {
        return this.rooms.get(gameCode);
    }

    getPublicWaitingRooms() {
        const allRooms = Array.from(this.rooms.values());

        const rooms = allRooms.filter((room) => {
            const isWaiting = room.game.status === GameStatus.WAITING;
            const isPublic = !room.game.isPrivate;
            const hasSpace = room.game.players.length < room.game.maxPlayers;

            return isWaiting && isPublic && hasSpace;
        });

        return rooms;
    }

    async remove(gameCode: string) {
        const room = this.rooms.get(gameCode);
        if (!room) return;

        if (room.game.status === GameStatus.WAITING) await room.game.destroy();

        this.rooms.delete(gameCode);
        this.triggerHooks("onGameDelete", gameCode);
    }

    addHook(type: HookType, callback: Function) {
        this.hooks.add({ type, callback });
    }
}

export const GameRooms = new GameRoomRegistry();
