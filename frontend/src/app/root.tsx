import React from "react";
import "./global.css";
import { GoogleAuth } from "../components/GoogleAuth";
import { User } from "../components/User";

export default function Root() {
    return (
        <div>
            <h1>Hello World</h1>
            <User />
            <GoogleAuth />
        </div>
    );
}
