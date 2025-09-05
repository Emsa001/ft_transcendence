import { APIService } from "@shared/lib/api";
import { GameStatus, TournamentCreateType, TournamentDTOType } from "shared";

class TournamentApi extends APIService {
    async getAll({
        status,
        offset,
    }: { status?: GameStatus; offset?: number } = {}): Promise<{
        tournaments: TournamentDTOType[];
        hasMore: boolean;
    } | null> {
        try {
            const response = await this.api.get("/all", {
                params: { status, offset },
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching tournaments:", error);
            return null;
        }
    }

    async create(
        data: TournamentCreateType
    ): Promise<TournamentDTOType | null> {
        try {
            const response = await this.api.post("/create", data);
            return response.data;
        } catch (error) {
            console.error("Error creating tournament:", error);
            return null;
        }
    }

    async get(uuid: string): Promise<TournamentDTOType | null> {
        try {
            const response = await this.api.get(`/${uuid}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching tournament:", error);
            return null;
        }
    }

    async start(uuid: string): Promise<{
        error?: string;
        message?: string;
    }> {
        try {
            const response = await this.api.post(`/${uuid}/start`);
            return response.data;
        } catch (error) {
            console.error("Error starting tournament:", error);
            return (error as any)?.response?.data;
        }
    }
}

export const tournamentApi = new TournamentApi({ path: "/tournament" });
