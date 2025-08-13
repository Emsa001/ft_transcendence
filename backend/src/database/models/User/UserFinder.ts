import { User } from './User';

export class UserFinder {
    static async findByEmail(email: string): Promise<User | null> {
        return User.findOne({ where: { email } });
    }
}
