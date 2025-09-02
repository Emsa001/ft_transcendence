import "@shared/styles/global.css";
import "@shared/styles/animations.css";

import React, { BrowserRouter, Router, useEffect } from "react";
import Home from "./home";
import Auth from "./auth";
import { useUser } from "@features/auth/model/useUser";
import { Profile } from "./profile";
import { useOnlineUsers } from "@features/user/model/useOnlineUsers";
import MainMenu from "@features/menu/ui/MainMenu";
import Game from "./game";
import Chat from "./chat";
import { LanguageButton } from "@features/language/ui/LanguageButton";

let mounted = false;
let lastUserId = -1;

export default function Root() {
    const { user, loading, fetchUser } = useUser();
    const { subscribeToOnline, resubscribe } = useOnlineUsers();

    useEffect(() => {
        if (mounted) return;
        mounted = true;
        subscribeToOnline();
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (!user || loading) return;
        if (user.id === lastUserId) return;
        lastUserId = user.id;
        resubscribe();
    }, [user]);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black bg-gradient-to-br from-purple-900/20 via-indigo-900/40 to-black">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]" />
            <div className="absolute top-40 -right-40 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px]" />
            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-500/20 rounded-full blur-[80px]" />

            <MainMenu />
            <BrowserRouter>
                <Router src="/" component={<Home />} default />
                <Router src="/auth" component={<Auth />} />
                <Router src="/profile" component={<Profile />} />
                <Router src="/game" component={<Game />} />
                <Router src="/chat" component={<Chat />} />
            </BrowserRouter>
            <LanguageButton />
        </div>
    );
}
