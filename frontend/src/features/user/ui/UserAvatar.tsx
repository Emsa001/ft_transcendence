import { Icon } from "@shared/components/Icon";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

export const UserAvatar = ({
    src,
    name,
}: {
    src?: string | null;
    name: string;
}) => {
    return src ? (
        <img
            src={src}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg"
        />
    ) : (
        <div>
            <Icon
                icon={FaUserCircle}
                className={`w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg`}
            />
        </div>
    );
};
