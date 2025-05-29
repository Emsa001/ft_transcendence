import React, { useStatic } from "react";
import { LogoutButton, GoogleAuthButton } from "@features/auth/ui";

export const User = () => {
    const [user, setUser] = useStatic<google.User | null>("user");

    if (!user) {
        return (
            <div>
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

            <LogoutButton onLogout={() => setUser(null)} />
        </div>
    );
};
