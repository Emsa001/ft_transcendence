import React, { useNavigate } from 'react';
import {
    LogoutButton,
    TwoFactorAuthDisable,
    TwoFactorAuthEnable,
} from '@features/auth';
import { useUser } from '@features/auth/model/useUser';

// TODO: Divide to components, this is just test
export const Profile = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    if (!user) {
        navigate('/auth');
        return <div />;
    }

    return (
        <div className="text-white flex flex-col w-screen h-screen items-center justify-center">
            <h2>User Information</h2>
            <img
                src={user.avatar}
                alt="User Avatar"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
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

            {user.is2FAEnabled ? (
                <TwoFactorAuthDisable />
            ) : (
                <TwoFactorAuthEnable />
            )}

            <LogoutButton />
        </div>
    );
};
