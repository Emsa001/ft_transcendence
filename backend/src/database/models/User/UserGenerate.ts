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
        const maxLength = 32;
        let baseName = name.slice(0, maxLength);

        if (!(await User.findByUsername(baseName))) {
            return baseName;
        }

        for (let suffixLength = 1; suffixLength <= 6; suffixLength++) {
            const allowedLength = maxLength - (suffixLength + 1);
            const basePrefix = name.slice(0, allowedLength);

            for (let i = 0; i < 50; i++) {
                const randomSuffix = faker.string.alphanumeric(suffixLength);
                const candidate = `${basePrefix}_${randomSuffix}`;
                if (!(await User.findByUsername(candidate))) {
                    return candidate;
                }
            }
        }

        return faker.string.alphanumeric(32);
    }
}
