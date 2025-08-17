import { faker } from "@faker-js/faker";
import { User } from "./User";

export class UserGenerate {
    static async createExample(): Promise<User> {
        return await User.create({
            username: faker.internet.username(),
            password: faker.internet.password(),
            avatar: faker.image.avatar(),
            provider: "local",
        });
    }

    static async createUsername(email: string): Promise<string> {
        let username = email.split("@")[0];
        while (await User.findByUsername(username)) {
            const randomSuffix = faker.string.alphanumeric(5);
            username = `${username}_${randomSuffix}`;
        }

        return username;
    }
}
