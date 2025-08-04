import React, {useStatic } from "react";
import {
    LogoutButton,
    GoogleAuthButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from "@features/auth";
import Login from "./Login";

export const UserProfile = () => {
    const [user, setUser] = useStatic<User | null>("user");

    if (!user) {
        return (
            <div>
                <Login />
                <GoogleAuthButton />
            </div>
        );
    }

    return (
        <div>
            <h2>User Information</h2>
            <img
                src={user.picture}
                alt="User Avatar"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
            <p>
                <strong>ID:</strong> {user.id}
            </p>
            <p>
                <strong>Name:</strong> {user.name}
            </p>
            <p>
                <strong>Email:</strong> {user.email}
            </p>

            <hr />

            {user.is2FAEnabled ? <TwoFactorAuthDisable /> : <TwoFactorAuthEnable />}

            <LogoutButton onLogout={() => setUser(null)} />
        </div>
    );
};
