import { useLanguage } from "@features/language/model/useLanguage";
import React from "react";

interface AuthFormProps {
    isRegister: boolean;
    handleUsernameLogin: (username: string, password: string) => Promise<void>;
    handleUsernameRegister: (
        username: string,
        password: string,
        confirmPassword: string
    ) => Promise<void>;
}

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
}

export default function AuthForm({
    isRegister,
    handleUsernameLogin,
    handleUsernameRegister,
}: AuthFormProps) {
    const { getText } = useLanguage();
    const text = getText("auth");

    const handleSubmit = async (e: HTMLFormElement) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        if (isRegister) {
            const confirmPassword = formData.get("confirmPassword") as string;
            await handleUsernameRegister(username, password, confirmPassword);
        } else {
            await handleUsernameLogin(username, password);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
                label={text.username}
                name="username"
                type="text"
                placeholder={text.yourUsername}
                required
            />
            <FormInput
                label={text.password}
                name="password"
                type="password"
                placeholder="••••••••"
                required
            />
            {isRegister && (
                <FormInput
                    label={text.confirmPassword}
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                />
            )}
            <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:brightness-110 transition duration-300"
            >
                {isRegister ? text.register : text.logIn}
            </button>
        </form>
    );
}

const FormInput = ({ label, ...props }: FormInputProps) => (
    <div>
        <label className="block text-sm font-semibold text-purple-300">
            {label}
        </label>
        <input
            className="w-full rounded-lg bg-indigo-800/20 border border-transparent px-4 py-3 text-purple-200 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            {...props}
        />
    </div>
);
