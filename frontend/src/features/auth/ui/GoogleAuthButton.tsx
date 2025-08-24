import React from "react";
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
                className="
                relative w-full py-3 rounded-xl
                flex items-center justify-center gap-3 
                text-white font-semibold 
                border border-fuchsia-500 hover:border-fuchsia-400/20
                hover:bg-fuchsia-700/30
                transition duration-300"
                type="button"
            >
                <Icon icon={FcGoogle} size={24} />
                Continue with Google
            </button>
        </div>
    );
};
