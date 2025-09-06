import React, { useLocalStorage } from "react";

export const LanguageButton = () => {
    const [language, setLanguage] = useLocalStorage<string>("language");
    const languages = ["en", "pl", "slangs"];

    function handleClick() {
        const current = languages.indexOf(language || "en");
        let nextLanguage = languages[(current + 1) % languages.length];

        setLanguage(nextLanguage);
    }

    return (
        <button
            onClick={handleClick}
            aria-label="Change language"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-purple-200 transition-colors duration-200"
        >
            {(language || "EN").toUpperCase()}
        </button>
    );
};
