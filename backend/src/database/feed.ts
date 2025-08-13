import { Game, GameMode, GameStatus } from "./models/Game/Game";
import { User } from "./models/User/User";
import { UserExample } from "./models/User/UserExample";

export class DatabaseExampleFeed {
    users: number = 10;
    games: number = 5;

    constructor(users: number = 10, games: number = 5) {
        this.users = users;
        this.games = games;
        this.feed().catch((error) => {
            console.error("Error feeding database with example data:", error);
        });
    }

    private async feed(): Promise<void> {
        console.log("Feeding database with example data...");
        await this.createExampleUsers(this.users);
        await this.createExampleGames(this.games);
        await this.assignGamesToUsers();
        console.log("Database example data created successfully.");
    }

    async createExampleUsers(users: number): Promise<void> {
        for (let i = 0; i < users; i++) {
            await UserExample.create();
        }
    }

    async createExampleGames(games: number): Promise<void> {
        const statuses = Object.values(GameStatus);
        const modes = Object.values(GameMode);

        for (let i = 0; i < games; i++) {
            const status =
                statuses[Math.floor(Math.random() * statuses.length)];
            const mode = modes[Math.floor(Math.random() * modes.length)];
            await Game.create({
                status,
                mode,
            });
        }
    }

    async assignGamesToUsers(): Promise<void> {
        const users = await User.findAll();
        const games = await Game.findAll({
            where: { status: GameStatus.WAITING },
        });

        for (const game of games) {
            const randomUsers = this.getRandomUsers(users, 2);
            for (const user of randomUsers) {
                await game.addPlayer(user);
            }
        }
    }

    private getRandomUsers(users: User[], count: number): User[] {
        const shuffled = users.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}
