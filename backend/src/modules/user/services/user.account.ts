import { User } from "@/database/models/User/User";
import { MultipartFile } from "@fastify/multipart";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import sharp from "sharp";
import jwtService from "@/modules/auth/services/jwt.service";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = process.env.BASE_URL || "http://localhost:8000";

export async function uploadImage(image: MultipartFile, fileName: string) {
    const imagesDir = path.join(__dirname, "../../../../public/uploads/");

    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    fileName += ".webp";

    const filePath = path.join(imagesDir, fileName);

    await sharp(await image.toBuffer())
        .webp({ quality: 80 })
        .toFile(filePath);

    return `${url}/public/uploads/${fileName}`;
}

class UserAccountService {
    async getAccount(id: number) {
        return await User.findByPk(id);
    }

    async uploadPicture(email: string, data?: MultipartFile) {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        if (!data) {
            throw new Error("No file provided");
        }

        const imagePath = await uploadImage(data, user.id.toString());
        user.avatar = imagePath;
        await user.save();

        return user.avatar;
    }

    async editProfile(email: string, data: { name?: string; email?: string }) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("User not found");
        }

        user.name = data.name || user.name;
        user.email = data.email || user.email;
        await user.save();
        return user;
    }
}

const userAccountService = new UserAccountService();
export default userAccountService;
