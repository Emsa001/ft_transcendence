import React from "react";

export const UserAvatar = ({
    src,
    name,
}: {
    src: string | null;
    name: string;
}) => {
    return src ? (
        <img
            src={src}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg"
        />
    ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl font-bold border-4 border-white/30 shadow-lg">
            {name[0]}
        </div>
    );
};
