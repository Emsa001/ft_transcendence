import React, { useNavigate } from "react";
import { Icon } from "@shared/components/Icon";
import { FaGamepad, FaUser } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { useUser } from "@features/auth/model/useUser";
import { useLanguage } from "@features/language/model/useLanguage";
import { LanguageButton } from "@features/language/ui/LanguageButton";
import { ImStatsBars2 } from "react-icons/im";
import { IconType } from "react-icons";

interface MenuItem {
    label: string;
    icon: IconType;
    link: string;
}

export default function MainMenu() {
    const { user } = useUser();
    const navigate = useNavigate();

    const { getText } = useLanguage();
    const text = getText("mainMenu");

    const center: MenuItem[] = [
        { label: text.chat, icon: FaRegMessage, link: "/chat" },
        { label: text.play, icon: FaGamepad, link: "/game" },
        { label: text.stats, icon: ImStatsBars2, link: `/stats/${user?.id}` },
    ];

    const username =
        user && user.username
            ? user.username.length > 10
                ? user.username.slice(0, 10) + "..."
                : user.username
            : undefined;

    const logged: MenuItem[] = [
        { label: username || "Login", icon: FaUser, link: "/profile" },
    ];
    const notlogged = [{ label: text.login, icon: FaUser, link: "/auth" }];

    const items = user ? logged : notlogged;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/30 backdrop-blur-lg border-b border-white/10 text-white px-6 py-5">
            <div className="flex items-center justify-between  mx-auto">
                {/* Logo */}
                <button
                    onClick={() => navigate("/")}
                    className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text tracking-tight hover:scale-105 transition-transform"
                >
                    {text.title}
                </button>

                {/* Center menu */}
                <div>{user && <MenuItems items={center} />}</div>

                {/* Right menu */}
                <div className="flex gap-2">
                    <MenuItems items={items} />
                    <LanguageButton />
                </div>
            </div>
        </nav>
    );
}

const MenuItems = ({ items }: { items: MenuItem[] }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center space-x-4">
            {items.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => navigate(item.link)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-purple-200 hover:text-pink-400 transition-colors duration-200"
                >
                    <Icon icon={item.icon} className="text-lg" />
                    <span className="hidden sm:inline">{item.label}</span>
                </button>
            ))}
        </div>
    );
};
