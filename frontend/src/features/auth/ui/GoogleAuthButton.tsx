import React from "react";
import { useAuth } from "../model/useAuth";
import { FcGoogle } from "react-icons/fc";
import { Icon } from "@shared/components/Icon";

interface GoogleAuthButtonProps {
    handleLogin: () => Promise<void>;
}

export const GoogleAuthButton = ({ handleLogin }: GoogleAuthButtonProps) => {
    return (
        <div>
            <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-pink-500
            text-white font-semibold hover:bg-pink-600 transition duration-300"
                type="button"
            >
                <Icon icon={FcGoogle} size={24} />
                Continue with Google
            </button>
        </div>
    );
};
