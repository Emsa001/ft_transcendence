import { useLanguage } from "@features/language/model/useLanguage";
import React from "react";

export const Footer = () => {
    const { getText } = useLanguage();
    const text = getText("footer");
    return (
        <footer
            className="fixed left-0 bottom-6 w-full text-center opacity-0 animate-fade-in"
            style={{ animationDelay: "3s" }}
        >
            <p className="text-sm text-white opacity-40">
                © {new Date().getFullYear()}{" "}
                <span className="text-indigo-300">{text.name}</span>
                <br />
                {text.madeWith}{" "}
                <span className="text-rose-300">{text.badDecisions}</span>{" "}
                {text.and}{" "}
                <span className="text-purple-300">{text.aLotOfFaith}</span>.
            </p>
        </footer>
    );
};
