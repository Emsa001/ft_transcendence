import React from "react";

export const Footer = () => {
    return (
        <footer
            className="fixed left-0 bottom-6 w-full text-center opacity-0 animate-fade-in"
            style={{ animationDelay: "3s" }}
        >
            <p className="text-sm text-white opacity-40">
                © {new Date().getFullYear()}{" "}
                <span className="text-indigo-300">ft_transcendence</span>
                <br />
                Made with <span className="text-rose-300">
                    bad decisions
                </span>{" "}
                and <span className="text-purple-300">a lot of faith</span>.
            </p>
        </footer>
    );
};
