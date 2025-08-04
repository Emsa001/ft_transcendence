import React, { BrowserRouter, Router } from "react";
import "@shared/styles/global.css";
import { UserProfile } from "@shared/components/User";
import Home from "./home";
import TwoFA from "./auth/twoFA";

export default function Root() {
    return (
        <div>
            <h1>Hello World</h1>
            <main>
                <BrowserRouter>
                    <Router src="/" component={<Home />} />
                    <Router src="/profile" component={<UserProfile />} />
                    <Router src="/auth/2fa/verify" component={<TwoFA />} />
                </BrowserRouter>
            </main>
        </div>
    );
}
