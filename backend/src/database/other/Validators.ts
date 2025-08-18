import { GameStatus } from "shared";
import { HttpException } from "@/utils/exceptions";
import { Game } from "../models/Game/Game";
import { GameUser } from "../models/Game/GameUser";
import { Tournament } from "../models/Tournaments/Tournament";
import { TournamentUser } from "../models/Tournaments/TournamentUser";

interface GameLike {
    id: number;
    status: GameStatus;
    maxPlayers: number;
}

type GameModel = {
    findByPk: (id: number) => Promise<GameLike | null>;
};

type UserModel = {
    count: (options: { where: { [key: string]: number } }) => Promise<number>;
};

export class Validators {
    private static async validateGameStateGeneric(
        entityId: number,
        entityModel: GameModel,
        userModel: UserModel,
        additionalPlayers = 1,
        entityName = "game"
    ): Promise<void> {
        const entity = await entityModel.findByPk(entityId);
        if (!entity) throw new HttpException(404, `${entityName} not found`);

        if (entity.status !== GameStatus.WAITING)
            throw new HttpException(
                400,
                `Cannot add players to a ${entityName} that is not waiting`
            );

        const currentPlayersCount = await userModel.count({
            where: { [`${entityName}Id`]: entity.id },
        });

        if (currentPlayersCount + additionalPlayers > entity.maxPlayers)
            throw new HttpException(400, "Maximum number of players reached");
    }

    // Public methods
    static async validateGame(gameId: number, additionalPlayers = 1) {
        return this.validateGameStateGeneric(
            gameId,
            Game,
            GameUser,
            additionalPlayers,
            "game"
        );
    }

    static async validateTournament(
        tournamentId: number,
        additionalPlayers = 1
    ) {
        return this.validateGameStateGeneric(
            tournamentId,
            Tournament,
            TournamentUser,
            additionalPlayers,
            "tournament"
        );
    }
}
