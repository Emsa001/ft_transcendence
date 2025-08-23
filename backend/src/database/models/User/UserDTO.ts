import { UserDTOType } from "shared";
import { User } from "./User";
import { HttpException } from "@/utils/exceptions";

export class UserDTO implements UserDTOType {
    private user!: User;

    id: number;
    email?: string | null;
    username: string;
    avatar: string | null;
    is2FAEnabled?: boolean;

    constructor(user: User) {
        if (!user || !user.id)
            throw new HttpException(
                404,
                "User data is required to create UserDTO"
            );

        this.id = user.id;
        this.username = user.username;
        this.avatar = user.avatar;

        // don't expose user instance directly
        Object.defineProperty(this, "user", {
            value: user,
            writable: true,
            enumerable: false,
            configurable: true,
        });
    }

    full(): UserDTO {
        this.email = this.user.email;
        this.is2FAEnabled = this.user.is2FAEnabled;
        return this;
    }

    toString() {
        return `
            ID: ${this.id}
            Name: ${this.username}
            Avatar: ${this.avatar ? this.avatar : "No avatar set"}
        `;
    }
}
