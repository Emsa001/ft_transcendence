import React, { BrowserRouter, Router } from "react";
import "@shared/styles/global.css";
import { UserProfile } from "@shared/components/User";
import Home from "./home";

export default function Root() {    
    return (
        <div>
            <h1>Hello World</h1>
            <main>
                <BrowserRouter>
                    <Router src="/" component={<Home />} />
                    <Router src="/profile" component={<UserProfile />} />
                </BrowserRouter>
            </main>
        </div>
    );
}
