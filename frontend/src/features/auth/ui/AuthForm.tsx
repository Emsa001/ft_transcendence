import React from 'react';

interface AuthFormProps {
    isRegister: boolean;
}

// TODO: Simplify and make pretty
export default function AuthForm({ isRegister }: AuthFormProps) {
    return (
        <form className="space-y-6">
            <label className="block text-sm font-semibold text-purple-300">
                Email
            </label>
            <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-lg bg-gray-800 bg-opacity-60 border border-transparent
          focus:border-pink-500 px-4 py-3 text-purple-200 placeholder-purple-400
          focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />

            {isRegister && (
                <div>
                    <label className="block text-sm font-semibold text-purple-300">
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Your username"
                        required
                        className="w-full rounded-lg bg-gray-800 bg-opacity-60 border border-transparent
              focus:border-pink-500 px-4 py-3 text-purple-200 placeholder-purple-400
              focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                    />
                </div>
            )}

            <label className="block text-sm font-semibold text-purple-300">
                Password
            </label>
            <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-lg bg-gray-800 bg-opacity-60 border border-transparent
          focus:border-pink-500 px-4 py-3 text-purple-200 placeholder-purple-400
          focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />

            {isRegister && (
                <div>
                    <label className="block text-sm font-semibold text-purple-300">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="w-full rounded-lg bg-gray-800 bg-opacity-60 border border-transparent
              focus:border-pink-500 px-4 py-3 text-purple-200 placeholder-purple-400
              focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                    />
                </div>
            )}

            <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500
          text-white font-semibold shadow-lg hover:brightness-110 transition duration-300"
            >
                {isRegister ? 'Register' : 'Log In'}
            </button>
        </form>
    );
}
