import React, { useStatic } from "react";
import { LogoutButton, GoogleAuthButton, Disable2FAElement, Enable2FAElement } from "@features/auth/ui";
import { User } from "@features/auth/types";

export const UserProfile = () => {
    const [user, setUser] = useStatic<User | null>("user");

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

            {user.is2FAEnabled ? <Disable2FAElement email={user.email} /> : <Enable2FAElement email={user.email} />}
            
            <LogoutButton onLogout={() => setUser(null)} />
        </div>
    );
};
