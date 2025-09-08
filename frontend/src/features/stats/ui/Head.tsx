import { useLanguage } from "@features/language/model/useLanguage";
import { sliceText } from "@shared/lib/utils";
import React from "react";
import { UserDTOType } from "shared/dist";

export function Head({ user }: { user: UserDTOType }) {
    const { getText } = useLanguage();
    const text = getText("charts");

    return (
        <div className="mt-16 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl glass-border">
                <span className="text-4xl font-bold">
                    {user.username[0].toUpperCase()}
                </span>
            </div>
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                    {sliceText(user.username, 10)}
                </h1>
                <p className="text-sm text-purple-200">
                    {text.transcendencePlayer}
                </p>
            </div>
        </div>
    );
}
