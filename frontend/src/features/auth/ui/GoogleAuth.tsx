import React from "react";
import { useAuth } from "../model/useAuth";

export const GoogleAuthButton = () => {
    const { ref } = useAuth();

    return <div ref={ref} />;
};

