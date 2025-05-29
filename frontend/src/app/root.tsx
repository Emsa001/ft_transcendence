import React from "react";
import "@shared/styles/global.css";
import { User } from "@shared/components/User";

export default function Root() {
    return (
        <div>
            <h1>Hello World</h1>
            <User />
        </div>
    );
}
