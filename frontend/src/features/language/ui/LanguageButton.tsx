"use client";
import React, { useLocalStorage, useEffect, useState } from "react";

export function LanguageButton() {
    const [language, setLanguage] = useLocalStorage("language");

    function handleClick() {
        let nextLanguage;
        switch (language) {
            case "en":
                nextLanguage = "pl";
                break;
            case "pl":
                nextLanguage = "slangs";
                break;
            case "slangs":
                nextLanguage = "en";
                break;
            default:
                nextLanguage = "en";
        }

        setLanguage(nextLanguage);
    }

    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return <div />;

    return (
        <div>
            <button
                onClick={handleClick}
                aria-label="Change language"
                className="px-4 py-2 text-lg font-semibold text-white 
                       rounded-2xl bg-gradient-to-br from-purple-800/70 to-pink-700/60 
                       backdrop-blur-md shadow-lg border border-white/10
                       hover:from-purple-700/80 hover:to-pink-600/70 
                       transition-all duration-300 ease-out 
                       hover:scale-105 active:scale-95"
            >
                {language === "en"
                    ? "English"
                    : language === "pl"
                      ? "Polski"
                      : language === "slangs"
                        ? "Slangs"
                        : "English"}
            </button>
        </div>
    );
}
