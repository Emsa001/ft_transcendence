import React, { useState } from "react";

import { GoogleAuthButton } from "@features/auth";
import AuthForm from "@features/auth/ui/AuthForm";
import ToggleAuthMode from "@features/auth/ui/ToogleAuthMode";


export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert(isRegister ? "Registering..." : "Logging in...");
  };

  const handleGoogleLogin = () => {
    alert("Google login triggered");
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="max-w-md w-full bg-gray-900 bg-opacity-90 rounded-3xl p-10 shadow-lg">
        <h1
          className="text-center text-4xl font-extrabold text-transparent bg-clip-text
          bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 mb-2"
        >
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {isRegister
            ? "Register to start your journey"
            : "Please log in to access the application"}
        </p>

        <AuthForm isRegister={isRegister} onSubmit={handleSubmit} />

        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-500 font-semibold">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <GoogleAuthButton />

        <ToggleAuthMode isRegister={isRegister} setIsRegister={setIsRegister} />
      </div>
    </section>
  );
}
