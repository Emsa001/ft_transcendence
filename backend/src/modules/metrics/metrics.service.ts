import { Game } from "@/database/models/Game/Game";
import { Message } from "@/database/models/Message/Message";
import { Tournament } from "@/database/models/Tournaments/Tournament";
import { User } from "@/database/models/User/User";
import { Gauge } from "prom-client";

export class MetricsGauge {
    private userCountGauge: Gauge<string>;
    private gameCountGauge: Gauge<string>;
    private tournamentCountGauge: Gauge<string>;
    private messageCountGauge: Gauge<string>;

    constructor() {
        this.userCountGauge = new Gauge({
            name: "sqlite_user_count",
            help: "Number of users in SQLite DB",
        });
        this.gameCountGauge = new Gauge({
            name: "sqlite_game_count",
            help: "Number of games in SQLite DB",
        });
        this.tournamentCountGauge = new Gauge({
            name: "sqlite_tournament_count",
            help: "Number of tournaments in SQLite DB",
        });
        this.messageCountGauge = new Gauge({
            name: "sqlite_chat_messages",
            help: "Number of messages in SQLite DB",
        });
    }

    public async collect() {
        const users = await User.count();
        const games = await Game.count();
        const tournaments = await Tournament.count();
        const messages = await Message.count();

        this.userCountGauge.set(users);
        this.gameCountGauge.set(games);
        this.tournamentCountGauge.set(tournaments);
        this.messageCountGauge.set(messages);
    }
}
