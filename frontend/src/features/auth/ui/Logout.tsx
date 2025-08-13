import React from 'react';
import { Button } from '@shared/components/Button';
import { useAuth } from '../model/useAuth';

export const LogoutButton = () => {
    const { handleLogout } = useAuth();

    return (
        <div>
            <Button onClick={handleLogout} color="error">
                Logout
            </Button>
        </div>
    );
};
