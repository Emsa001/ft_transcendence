import { HttpException } from "@/utils/exceptions";
import { GameCreationAttributes } from "shared";

type TempGame = {
    code: string;
    players: number[];

    maxScore?: number;
    isPrivate?: boolean;

    createdAt: number;
};

type HookType =
    | "onGameCreate"
    | "onGameDelete"
    | "onGameStart"
    | "onPlayerJoin"
    | "onPlayerLeave";

interface Hook {
    type: HookType;
    callback: Function;
}

class GameStore {
    private hosts = new Map<number, string>();
    private tempGames = new Map<string, TempGame>();
    private hooks = new Set<Hook>();

    private checkIfUsed = (code: string) => {
        // check after 3 seconds if the game is still unused, if so delete it
        setTimeout(() => {
            if (
                this.tempGames.has(code) &&
                this.tempGames.get(code)?.players.length === 0
            ) {
                this.deleteTempGame(code);
            }
        }, 1000 * 3);
    };

    private triggerHooks(type: HookType, ...args: any[]) {
        this.hooks.forEach((hook) => {
            if (hook.type === type) {
                hook.callback(...args);
            }
        });
    }

    getGame(code: string) {
        const game = this.tempGames.get(code);
        if (!game) throw new HttpException(404, "Game not found");
        return game;
    }

    createTempGame(userId: number, data: GameCreationAttributes): TempGame {
        if (this.hosts.has(userId)) {
            const existingCode = this.hosts.get(userId);
            if (existingCode) {
                const existingGame = this.tempGames.get(existingCode);
                if (existingGame) return existingGame;
            }
            this.hosts.delete(userId);
        }

        let code: string;
        do {
            code = Math.random().toString(36).substring(2, 8).toUpperCase();
        } while (this.tempGames.has(code));

        const game: TempGame = {
            code,
            players: [],
            createdAt: Date.now(),
            maxScore: data.maxScore,
            isPrivate: data.isPrivate,
        };

        this.tempGames.set(code, game);
        this.hosts.set(userId, code);

        this.checkIfUsed(code);
        this.triggerHooks("onGameCreate", game);

        return game;
    }

    addHook(type: HookType, hook: Function) {
        this.hooks.add({ type, callback: hook });
    }

    getPublicGames() {
        return Array.from(this.tempGames.values()).filter(
            (game) => !game.isPrivate
        );
    }

    deleteTempGame(code: string) {
        this.hosts.forEach((hostedCode, userId) => {
            if (hostedCode === code) {
                this.hosts.delete(userId);
            }
        });

        const game = this.getGame(code);
        const result = this.tempGames.delete(code);
        this.triggerHooks("onGameDelete", game);

        return result;
    }

    addPlayer(code: string, playerId: number) {
        const game = this.getGame(code);

        if (!game.players.includes(playerId)) {
            game.players.push(playerId);
            this.triggerHooks("onPlayerJoin", game, playerId);
        }

        return game;
    }

    removePlayer(code: string, playerId: number) {
        const game = this.getGame(code);

        const index = game.players.indexOf(playerId);
        if (index > -1) {
            game.players.splice(index, 1);

            const currentHost = this.hosts.get(playerId);
            if (currentHost === code) {
                this.hosts.delete(playerId);

                if (game.players.length > 0) {
                    const newHostId = game.players[0];
                    this.hosts.set(newHostId, code);
                } else {
                    this.deleteTempGame(code);
                }
            }

            this.triggerHooks("onPlayerLeave", game, playerId);
        }
        return game;
    }
}

export const GameStoreInstance = new GameStore();
export default GameStoreInstance;
