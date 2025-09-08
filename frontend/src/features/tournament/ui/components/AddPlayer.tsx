import { useLanguage } from "@features/language/model/useLanguage";
import React from "react";

interface AddPlayerInputProps {
    onAddPlayer: (e: Event) => void;
}

export const AddPlayerInput = ({ onAddPlayer }: AddPlayerInputProps) => {
    const { getText } = useLanguage();
    const text = getText("tournament");
    return (
        <form className="flex gap-3" onSubmit={onAddPlayer}>
            <input
                type="text"
                name="player"
                maxLength={32}
                placeholder={text.enterPlayerName}
                className="flex-1 px-4 py-2 rounded-xl bg-fuchsia-200/10 placeholder-gray-200 focus:outline-none focus:bg-fuchsia-300/10 transition"
            />
            <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-fuchsia-200/10 hover:bg-fuchsia-300/10 transition font-medium"
            >
                {text.add}
            </button>
        </form>
    );
};
