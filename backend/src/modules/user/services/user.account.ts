import { User } from "@/database/models/User/User";
import { MultipartFile } from "@fastify/multipart";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { UserEditableData } from "shared";
import { Op } from "sequelize";
import { HttpException } from "@/utils/exceptions";
import { UserGenerate } from "@/database/models/User/UserGenerate";

const imageDirUrl = `${process.env.BACKEND_URL}/public/uploads/`;

async function uploadImage(image: MultipartFile, fileName: string) {
    const imagesDir = path.join(process.cwd(), "public", "uploads");

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
    async uploadPicture(user: User, data?: MultipartFile) {
        if (!data) throw new HttpException(400, "No file provided");

        const imagePath = await uploadImage(data, user.id.toString());

        user.avatar = imagePath;
        await user.save();

        return user.avatar;
    }

    async editProfile(user: User, data: UserEditableData) {
        const existingUser = await User.findByUsername(data.username, {
            where: { id: { [Op.ne]: user.id } },
        });

        if (existingUser)
            throw new HttpException(400, "Username already exists");

        user.username = data.username || user.username;
        await user.save();

        return user;
    }

    async deleteAccount(user: User) {
        if (user.avatar) await deleteImage(user.avatar);

        // await user.destroy();
        user.status = "deleted";
        user.password = null;
        user.email = null;
        user.username = await UserGenerate.createUsername(
            `deleted_user_${user.id}`
        );

        await user.save();

        return { message: "User account deleted successfully" };
    }
}

const userAccountService = new UserAccountService();
export default userAccountService;
