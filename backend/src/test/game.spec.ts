import { startClean } from '@/database/client';
import { Game } from '@/database/models/Game/Game';
import { UserExample } from '@/database/models/User/UserExample';
import { Sequelize } from 'sequelize';

describe('Game Tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = await startClean();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should add player to a game', async () => {
        const game = await Game.create();
        const user = await UserExample.create();
        
        await game.addPlayer(user);

        const players = await game.getPlayers();

        expect(players.length).toBe(1);
        expect(players[0].id).toBe(user.id);
        expect(await game.hasPlayer(user)).toBe(true);
    });

    it('should remove player from a game', async () => {
        const game = await Game.create();
        const user = await UserExample.create();
        
        await game.addPlayer(user);
        await game.removePlayer(user);


        expect(await game.hasPlayer(user)).toBe(false);
        expect((await game.getPlayers()).length).toBe(0);
    });

    it('should create a game with multiple players', async () => {
        const game = await Game.create();
        const user1 = await UserExample.create();
        const user2 = await UserExample.create();
        
        await game.addPlayer(user1);
        await game.addPlayer(user2);
        
        const players = await game.getPlayers();
        expect(players.length).toBe(2);
        expect(await game.hasPlayer(user1)).toBe(true);
        expect(await game.hasPlayer(user2)).toBe(true);
    });
});
