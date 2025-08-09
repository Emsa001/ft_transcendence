import "@shared/styles/global.css";
import "@shared/styles/animations.css";

import React, { BrowserRouter, Router } from "react";
import Home from "./home";
import MainMenu from "@features/menu/ui/MainMenu";
import Auth from "./auth";

export default function Root() {
    return (
        <main className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black via-zinc-900 to-black">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]" />
            <div className="absolute top-40 -right-40 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px]" />

            <MainMenu />
            <BrowserRouter>
                <Router src="/" component={<Home />} />
                <Router src="/auth" component={<Auth />} />
            </BrowserRouter>
        </main>
    );
}
