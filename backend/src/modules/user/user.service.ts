import { User } from '@/database/models/User';

class UserService {
    async getAll() {
        return await User.findAll();
    }

    async getById(id: number) {
        return await User.findByPk(id);
    }
}

const userService = new UserService();
export default userService;
