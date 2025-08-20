import React from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { Icon } from "@shared/components/Icon";
import ProfileApi from "@features/user/service/profileApi";
import { useUser } from "@features/auth/model/useUser";

export function UserPicture() {
    const { user, setUser } = useUser();

    if (!user) return <div />;

    const handleFileChange = async (e: Event) => {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0] || null;
        if (file) {
            const pictureUrl = await ProfileApi.updateUserPicture(file);
            if (pictureUrl) {
                setUser({ ...user, avatar: pictureUrl });
            } else {
                console.warn(
                    "Failed to update user picture: pictureUrl is null."
                );
            }
        } else {
            console.warn("No file provided for picture update.");
        }
    };

    return (
        <div className="min-w-[80px] relative group">
            {user.avatar ? (
                <img
                    src={`${user.avatar}?ver=${Date.now()}`}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-400"
                />
            ) : (
                <Icon icon={FaUserCircle} className="text-gray-400 w-28 h-28" />
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-gray-800 opacity-0 group-hover:opacity-70 transition-opacity cursor-pointer rounded-full">
                <Icon icon={FaCamera} className="text-white w-10 h-10" />
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
}
