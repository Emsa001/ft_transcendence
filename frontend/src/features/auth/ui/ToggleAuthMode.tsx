import { useLanguage } from "@features/language/model/useLanguage";
import React from "react";

interface ToggleAuthModeProps {
    isRegister: boolean;
    setIsRegister: (isRegister: boolean) => void;
}

export default function ToggleAuthMode({
    isRegister,
    setIsRegister,
}: ToggleAuthModeProps) {
    const { getText } = useLanguage();
    const text = getText("auth");
    return (
        <p className="text-center mt-6 text-sm text-gray-400">
            {isRegister ? (
                <div>
                    {text.alreadyHaveAccount}{" "}
                    <button
                        onClick={() => setIsRegister(false)}
                        className="font-semibold text-pink-500 hover:underline"
                        type="button"
                    >
                        {text.logIn}
                    </button>
                </div>
            ) : (
                <div>
                    {text.dontHaveAccount}{" "}
                    <button
                        onClick={() => setIsRegister(true)}
                        className="font-semibold text-pink-500 hover:underline"
                        type="button"
                    >
                        {text.register}
                    </button>
                </div>
            )}
        </p>
    );
}
