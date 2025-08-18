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
                label="Username"
                name="username"
                type="text"
                placeholder="Your username"
                required
            />
            <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
            />
            {isRegister && (
                <FormInput
                    label="Confirm Password"
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
                {isRegister ? "Register" : "Log In"}
            </button>
        </form>
    );
}

const inputClass =
    "w-full rounded-lg bg-gray-800 bg-opacity-60 border border-transparent px-4 py-3 text-purple-200 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition";

const FormInput = ({ label, ...props }: FormInputProps) => (
    <div>
        <label className="block text-sm font-semibold text-purple-300">
            {label}
        </label>
        <input className={inputClass} {...props} />
    </div>
);
