import { User } from "./User";

export class UserFinder {
    static async getByEmail(email: string): Promise<User | null> {
        return User.findOne({
            where: { email },
            attributes: [
                'id',
                'name',
                'email',
                'password',
                'avatar',
                'twoFASecret',
                'is2FAEnabled',
            ],
        });
    }
}