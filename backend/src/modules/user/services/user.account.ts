import { User } from "@/database/models/User/User";
import { MultipartFile } from "@fastify/multipart";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { UserEditableData } from "shared";
import { Op } from "sequelize";
import { HttpException } from "@/utils/exceptions";

const imageDirUrl = `${process.env.BASE_URL}/public/uploads/`;

async function uploadImage(image: MultipartFile, fileName: string) {
    const imagesDir = path.join(process.cwd(), "public", "uploads");

    console.log("Images directory:", imagesDir);

    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    fileName += ".webp";

    const filePath = path.join(imagesDir, fileName);

    await sharp(await image.toBuffer())
        .webp({ quality: 80 })
        .toFile(filePath);

    return `${imageDirUrl}${fileName}`;
}

async function deleteImage(fileName: string) {
    const imagesDir = path.join(process.cwd(), "public", "uploads");

    const originalFileName = fileName.split("/").pop();

    const finalFileName = `${imagesDir}/${originalFileName}`;

    if (fs.existsSync(finalFileName)) {
        fs.unlinkSync(finalFileName);
    }
}

class UserAccountService {
    async getAccount(id: number) {
        return await User.findByPk(id);
    }

    async uploadPicture(id: number, data?: MultipartFile) {
        const user = await User.findByPk(id);
        if (!user) throw new HttpException(404, "User not found");

        if (!data) throw new HttpException(400, "No file provided");

        const imagePath = await uploadImage(data, user.id.toString());
        user.avatar = imagePath;
        await user.save();

        return user.avatar;
    }

    async editProfile(id: number, data: UserEditableData) {
        const user = await User.findByPk(id);
        if (!user) throw new HttpException(404, "User not found");

        const existingUser = await User.findByUsername(data.username, {
            where: { id: { [Op.ne]: user.id } },
        });
        if (existingUser)
            throw new HttpException(400, "Username already exists");

        user.username = data.username || user.username;
        await user.save();
        return user;
    }

    async deleteAccount(id: number) {
        const user = await User.findByPk(id);
        if (!user) throw new HttpException(404, "User not found");

        if (user.avatar) {
            await deleteImage(user.avatar);
        }

        await user.destroy();
        return { message: "User account deleted successfully" };
    }
}

const userAccountService = new UserAccountService();
export default userAccountService;
