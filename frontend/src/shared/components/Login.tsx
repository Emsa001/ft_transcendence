import React, { useState } from "react";
import AuthApi from "../../features/auth/service/api";
import { useAuth } from "@features/auth/model/useAuth";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("mail@mail.com");
    const [username, setUsername] = useState("beqa");
    const [password, setPassword] = useState("password");
    const [confirmPassword, setConfirmPassword] = useState("password");
    const { fetchUser } = useAuth();

    const handleLogin = async () => {
        await AuthApi.login(email, password);
        fetchUser();
    };

    const handleRegister = async () => {
        await AuthApi.register(email, username, password);
        isLogin ? handleLogin() : setIsLogin(true);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? "Login" : "Register"}</h2>

            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {!isLogin && (
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}

                <button
                    onClick={isLogin ? handleLogin : handleRegister}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    {isLogin ? "Log In" : "Register"}
                </button>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full text-blue-500 hover:text-blue-700 transition"
                >
                    {isLogin ? "Need an account? Register" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}
