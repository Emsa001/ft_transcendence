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

    static async createUsername(name: string): Promise<string> {
        while (await User.findByUsername(name)) {
            const randomSuffix = faker.string.alphanumeric(5);
            name = `${name}_${randomSuffix}`;
        }

        return name;
    }
}
