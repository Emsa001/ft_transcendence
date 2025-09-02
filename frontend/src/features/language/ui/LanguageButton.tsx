"use client";
import React, { useLocalStorage, useEffect, useState } from "react";

export function LanguageButton() {
    const [language, setLanguage] = useLocalStorage("language", "en");

    function handleClick() {
        let nextLanguage;
        switch (language) {
            case "en":
                nextLanguage = "pl";
                break;
            case "pl":
                nextLanguage = "en";
                break;
        }

        setLanguage(nextLanguage);
    }

    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) return <div />;

    return (
        <div className="fixed bottom-32 right-6 z-50">
            <button
                onClick={handleClick}
                className="p-2 text-3xl text-white font-semibold rounded-xl shadow-lg bg-purple-700 hover:bg-purple-600 transition-colors"
                aria-label="Change language"
            >
                {language === "en" ? <span>EN</span> : <span>PL</span>}
            </button>
        </div>
    );
}
