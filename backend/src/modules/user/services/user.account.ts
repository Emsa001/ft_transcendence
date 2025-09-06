import { User } from "@/database/models/User/User";
import { MultipartFile } from "@fastify/multipart";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import bcrypt from "bcrypt";
import { UserEditableData } from "shared";
import { Op } from "sequelize";
import { HttpException } from "@/utils/exceptions";
import { UserGenerate } from "@/database/models/User/UserGenerate";
import { Validators } from "@/database/other/Validators";

const imageDirUrl = `${process.env.BACKEND_URL}/public/uploads/`;

async function uploadImage(image: MultipartFile, fileName: string) {
    const imagesDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    fileName += ".webp";
    const filePath = path.join(imagesDir, fileName);

    const buffer = await image.toBuffer();

    const MAX_WIDTH = 512;
    const MAX_HEIGHT = 512;

    await sharp(buffer)
        .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside" })
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
        if (data.username) {
            const existingUser = await User.findByUsername(data.username, {
                where: { id: { [Op.ne]: user.id } },
            });

            if (existingUser)
                throw new HttpException(400, "Username already exists");

            const error = Validators.validateUserName(data.username);
            if (error) {
                throw new HttpException(400, error);
            }

            user.username = data.username || user.username;
        }
        if (data.newPassword) {
            if (!user.password)
                throw new HttpException(400, "User does not have a password");

            if (!data.oldPassword)
                throw new HttpException(400, "Old password is required");

            const isMatch = await bcrypt.compare(
                data.oldPassword,
                user.password
            );
            if (!isMatch)
                throw new HttpException(400, "Old password is incorrect");

            const error = Validators.validatePassword(data.newPassword);
            if (error) {
                throw new HttpException(400, error);
            }

            const newPassword = await bcrypt.hash(data.newPassword, 10);
            const samePassword = await bcrypt.compare(
                data.newPassword,
                user.password
            );

            if (samePassword)
                throw new HttpException(
                    400,
                    "New password must be different from old password"
                );

            user.password = newPassword;
        }

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
