import { GameMode, GameStatus } from "shared";
import { Game } from "./models/Game/Game";
import { User } from "./models/User/User";
import { UserGenerate } from "./models/User/UserGenerate";
import { Tournament } from "./models/Tournaments/Tournament";

interface FeedOptions {
    users?: number;
    games?: number;
}

export class DatabaseExampleFeed {
    static async feed(options: FeedOptions = {}): Promise<void> {
        const { users = 10, games = 5 } = options;

        console.log("Feeding database with example data...");
        await this.createExampleUsers(users);
        // await this.createExampleGames(games);
        // await this.assignGamesToUsers();
        await this.createExampleTournament();
        console.log("Database example data created successfully.");
    }

    static async createExampleUsers(users: number): Promise<void> {
        for (let i = 0; i < users; i++) {
            await UserGenerate.createExample();
        }
    }

    static async createExampleGames(games: number): Promise<void> {
        const modes = Object.values(GameMode);

        // for (let i = 0; i < games; i++) {
        //     const mode = modes[Math.floor(Math.random() * modes.length)];
        //     await Game.create({
        //         mode,
        //     });
        // }
    }

    static async assignGamesToUsers(): Promise<void> {
        const users = await User.findAll();
        const games = await Game.findAll({
            where: { status: GameStatus.WAITING },
        });

        for (const game of games) {
            game.status = GameStatus.IN_PROGRESS;
            const randomUsers = this.getRandomUsers(users, 2);
            for (const user of randomUsers) {
                await game.addPlayer(user);
                await game.playerScore(user.id, Math.floor(Math.random() * 11));
            }
            game.status = GameStatus.FINISHED;
            await game.save();
        }
    }

    static getRandomUsers(users: User[], count: number): User[] {
        const shuffled = users.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    static createExampleTournament = async (): Promise<void> => {
        const tournament = await Tournament.create({ maxPlayers: 4 });
        const user1 = await UserGenerate.createExample();
        const user2 = await UserGenerate.createExample();

        await tournament.addPlayers([user1, user2]);
    };
}
