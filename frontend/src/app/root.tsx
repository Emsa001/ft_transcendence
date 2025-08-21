import "@shared/styles/global.css";
import "@shared/styles/animations.css";

import React, { BrowserRouter, Router, useEffect } from "react";
import Home from "./home";
import MainMenu from "@features/menu/ui/MainMenu";
import Auth from "./auth";
import { useUser } from "@features/auth/model/useUser";
import { Profile } from "./profile";
import { useOnlineUsers } from "@features/user/model/useOnlineUsers";
import { Local } from "./local";

let mounted = false;

export default function Root() {
    const { user, fetchUser } = useUser();
    const { subscribeToOnline } = useOnlineUsers();

    useEffect(() => {
        if (mounted) return;
        mounted = true;
        const ws = subscribeToOnline();

        return () => {
            ws?.close();
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        subscribeToOnline();
    }, [user]);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <main className="relative w-full h-screen overflow-hidden bg-black bg-gradient-to-br from-purple-900/20 via-indigo-900/40 to-black">
            <MainMenu />

            <BrowserRouter>
                <Router src="/" component={<Home />} />
                <Router src="/auth" component={<Auth />} />
                <Router src="/profile" component={<Profile />} />
                <Router src="/local" component={<Local />} />
            </BrowserRouter>
        </main>
    );
}
