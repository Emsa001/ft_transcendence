import { GameStatus } from "shared";
import { TournamentRoom } from "./room.service";
import { Tournament } from "@/database/models/Tournaments/Tournament";

type HookType =
    | "onTournamentCreate"
    | "onTournamentDelete"
    | "onTournamentStart";

interface Hook {
    type: HookType;
    callback: Function;
}

class TournamentRoomRegistry {
    private rooms = new Map<string, TournamentRoom>();
    private hooks = new Set<Hook>();

    async init() {
        const tournaments = await Tournament.findAll({
            where: {
                status: [GameStatus.WAITING, GameStatus.IN_PROGRESS],
            },
        });
        tournaments.forEach((tournament) => {
            this.rooms.set(tournament.uuid, new TournamentRoom(tournament));
        });
    }

    triggerHooks(type: HookType, ...args: any[]) {
        this.hooks.forEach((hook) => {
            if (hook.type === type) hook.callback(...args);
        });
    }

    create(tournament: Tournament) {
        if (!this.rooms.has(tournament.uuid)) {
            this.rooms.set(tournament.uuid, new TournamentRoom(tournament));
            this.triggerHooks("onTournamentCreate", tournament);
        }
        return this.rooms.get(tournament.uuid)!;
    }

    get(uuid: string) {
        return this.rooms.get(uuid);
    }

    async remove(uuid: string) {
        const room = this.rooms.get(uuid);
        if (!room) return;

        try {
            room.closeAllClients();

            // Destroy the tournament record if never started
            if (room.tournament.status != GameStatus.FINISHED) {
                await room.tournament.destroy();
            }

            // Remove from registry
            this.rooms.delete(uuid);
            this.triggerHooks("onTournamentDelete", uuid);

            console.log(`Tournament with ID ${uuid} removed from registry.`);
        } catch (err) {
            console.error(`Failed to fully clean up tournament ${uuid}:`, err);
        }
    }

    addHook(type: HookType, callback: Function) {
        this.hooks.add({ type, callback });
    }
}

export const TournamentRooms = new TournamentRoomRegistry();
