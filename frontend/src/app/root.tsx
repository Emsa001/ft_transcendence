import "@shared/styles/global.css";
import "@shared/styles/animations.css"

import React, { BrowserRouter, Router } from "react";
import { UserProfile } from "@shared/components/User";
import Home from "./home";
import MainMenu from "@features/menu/ui/MainMenu";

export default function Root() {
    return (
        <main>
            <MainMenu />
            <BrowserRouter>
                <Router src="/" component={<Home />} />
                <Router src="/profile" component={<UserProfile />} />
            </BrowserRouter>
        </main>
    );
}
