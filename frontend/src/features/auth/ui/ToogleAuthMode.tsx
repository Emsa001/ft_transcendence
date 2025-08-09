import React from "react";

interface ToggleAuthModeProps {
    isRegister: boolean;
    setIsRegister: (isRegister: boolean) => void;
}

export default function ToggleAuthMode({ isRegister, setIsRegister }: ToggleAuthModeProps) {
    return (
        <p className="text-center mt-6 text-sm text-gray-400">
            {isRegister ? (
                <div>
                    Already have an account?{" "}
                    <button
                        onClick={() => setIsRegister(false)}
                        className="font-semibold text-pink-500 hover:underline"
                        type="button"
                    >
                        Log in
                    </button>
                </div>
            ) : (
                <div>
                    Don’t have an account?{" "}
                    <button
                        onClick={() => setIsRegister(true)}
                        className="font-semibold text-pink-500 hover:underline"
                        type="button"
                    >
                        Register
                    </button>
                </div>
            )}
        </p>
    );
}
