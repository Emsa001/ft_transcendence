import { faker } from '@faker-js/faker';
import { User } from './User';

export class UserExample {
    static async create() {
        return await User.create({
            email: faker.internet.email(),
            name: faker.person.firstName(),
            password: faker.internet.password(),
            avatar: faker.image.avatar(),
            provider: 'email',
        });
    }
}
