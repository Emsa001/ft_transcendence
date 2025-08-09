import "@shared/styles/global.css";
import "@shared/styles/animations.css"

import React, { BrowserRouter, Router } from "react";
import { UserProfile } from "@shared/components/User";
import Home from "./home";

export default function Root() {
    return (
        <main>
            <BrowserRouter>
                <Router src="/" component={<Home />} />
                <Router src="/profile" component={<UserProfile />} />
            </BrowserRouter>
        </main>
    );
}
