import React, { useState, useEffect, useNavigate } from "react";

import AuthForm from "@features/auth/ui/AuthForm";
import ToggleAuthMode from "@features/auth/ui/ToggleAuthMode";
import { GoogleAuthButton } from "@features/auth";
import { useAuth } from "@features/auth/model/useAuth";
import { useUser } from "@features/auth/model/useUser";
import { BallField } from "@features/balls/ui/BallField";

export default function Auth() {
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const { user } = useUser();

    const {
        handleOAuthCallback,
        handleUsernameLogin,
        handleUsernameRegister,
        redirectToGoogleAuth,
        error,
        setError,
    } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/profile");
        }
    }, [user]);

    useEffect(() => {
        handleOAuthCallback();
    }, []);

    useEffect(() => {
        setError("");
    }, [isRegister]);

    return (
        <div className="w-screen h-screen flex items-center justify-center px-4">
            <section className="max-w-lg w-full backdrop-blur-2xl bg-gradient-to-br from-transparent to-black/30 rounded-3xl p-10 shadow-2xl relative z-10">
                <h1
                    className="text-center text-4xl font-extrabold text-transparent bg-clip-text
                    bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 mb-2"
                >
                    {isRegister ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-center text-gray-400 mb-8">
                    {isRegister
                        ? "We don't know what to write here"
                        : "Please log in to your account"}
                </p>

                <AuthForm
                    isRegister={isRegister}
                    handleUsernameLogin={handleUsernameLogin}
                    handleUsernameRegister={handleUsernameRegister}
                />

                <p className="text-red-400 mt-4">{error}</p>

                <div className="flex items-center my-8">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="mx-4 text-gray-500 font-semibold">or</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                <GoogleAuthButton handleLogin={redirectToGoogleAuth} />

                <ToggleAuthMode
                    isRegister={isRegister}
                    setIsRegister={setIsRegister}
                />
            </section>
            <BallField amount={50} delay={300} />
        </div>
    );
}
