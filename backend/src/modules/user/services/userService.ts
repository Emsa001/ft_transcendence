import { User } from '@/database/models/User';

export class UserService {
    async getAll() {
        return await User.findAll();
    }

    async getById(id: number) {
        return await User.findByPk(id);
    }

    async create(userData: User) {
        return await User.create(userData);
    }
}
