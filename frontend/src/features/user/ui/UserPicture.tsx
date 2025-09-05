import React, { useEffect, useState, useNavigate } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { Icon } from "@shared/components/Icon";
import ProfileApi from "@features/user/service/profileApi";
import { useUser } from "@features/auth/model/useUser";
import { useOnlineUsers } from "../model/useOnlineUsers";
import { UserDTOType } from "shared";
import { useOnlineUsers } from "@features/user/model/useOnlineUsers";

interface UserPictureProps {
    userId: number;
    className?: string;
    size: number | string;
}

export function UserPicture({ userId, className, size }: UserPictureProps) {
    const [user, setUser] = useState<UserDTOType | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await ProfileApi.getUserByIdOrUsername(
                userId.toString()
            );
            if (userData) {
                setUser(userData);
            }
        };

        fetchUserData();
    }, [userId]);

    return (
        <button onClick={() => navigate(`/profile/${user?.username}`)} className="focus:outline-none rounded-full hover:shadow-[0_0_8px_rgba(0,255,255,0.7)]">
            {user && user.avatar ? (
                <img
                    src={`${user.avatar}?ver=${Date.now()}`}
                    alt="Profile"
                    className={`object-cover ${className} w-${size} h-${size} rounded-full`}
                />
            ) : (
                <Icon
                    icon={FaUserCircle}
                    className={`${className} w-${size} h-${size} rounded-full`}
                />
            )}
        </button>
    );
}

export function MyPicture() {
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
                <Icon
                    icon={FaUserCircle}
                    className="text-gray-400/50 w-28 h-28"
                />
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


export function OtherUserPicture({ userId, size }: { userId: number; size: number}) {
    const [ user, setUser] = useState<UserDTOType | null>(null);
    const { onlineUsers } = useOnlineUsers();
    console.log("Online Users:", onlineUsers);

    let onlineSize: number = Math.round(size / 5);
    if (onlineSize < 5)
        onlineSize = 5;



    
    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await ProfileApi.getUserByIdOrUsername(userId.toString());
            console.log("FETCHED USER ", fetchedUser);
            if (fetchedUser) {
                setUser(fetchedUser);
                console.log("Fetched User:", fetchedUser);
            }
        };


        fetchUser();
    }, [userId]);
    
    if (!userId) return <div />;
    if (!user) return <div />;

    return (
        <div className={`relative group w-${size} h-${size}`}>
            {user.avatar ? (   
             <img
                src={`${user.avatar}?ver=${Date.now()}`}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-blue-400"
            />
            ) : (
            <Icon icon={FaUserCircle} className="text-gray-400 w-full h-full" />
            )}
            {/* online status icon */}
            {onlineUsers.includes(userId) ? (
            <div className={`absolute top-0.5 right-0.5 bg-green-500 rounded-full w-7 h-7 border border-white`} />
            ) : (
            <div className={`absolute top-0.5 right-0.5 bg-red-500 rounded-full w-${onlineSize} h-${onlineSize} border border-white`} />
            )}
           
        </div>
    );
}