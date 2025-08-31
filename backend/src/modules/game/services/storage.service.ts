type TempGame = {
    code: string;
    players: number[];
    createdAt: number;
};

const tempGames = new Map<string, TempGame>();

export const GameStore = {
    createTempGame: (): TempGame => {
        let code: string;
        do {
            code = Math.random().toString(36).substring(2, 8).toUpperCase();
        } while (tempGames.has(code));

        const game: TempGame = { code, players: [], createdAt: Date.now() };
        tempGames.set(code, game);
        return game;
    },

    getTempGame: (code: string) => tempGames.get(code),

    deleteTempGame: (code: string) => tempGames.delete(code),

    addPlayer: (code: string, playerId: number) => {
        const game = tempGames.get(code);
        if (!game) throw new Error("Game not found");
        if (!game.players.includes(playerId)) game.players.push(playerId);
        return game;
    },
};
