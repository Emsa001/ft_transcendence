import React from "react";
import "@shared/styles/global.css";
import { UserProfile } from "@shared/components/User";

export default function Root() {
    return (
        <div>
            <h1>Hello World</h1>
            <UserProfile />
        </div>
    );
}
