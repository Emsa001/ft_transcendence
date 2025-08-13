import { User } from "./User";

export class UserDTO {
    id: number;
    name: string;
    email: string;
    avatar: string | null;

    constructor(user: User) {
        if (!user || !user.id)
            throw new Error("User data is required to create UserDTO");
        if (!user.name || !user.email)
            throw new Error(
                "User name and email are required to create UserDTO"
            );

        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.avatar = user.avatar;
    }

    toString() {
        return `
            ID: ${this.id}
            Name: ${this.name}
            Email: ${this.email}
            Avatar: ${this.avatar ? this.avatar : "No avatar set"}
        `;
    }
}
