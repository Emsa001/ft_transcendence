import React, { useRef, useEffect, useNavigate } from "react";
import gsap from "gsap";
import { Icon } from "@shared/components/Icon";
import { FaHome, FaGamepad, FaUser, FaCog } from "react-icons/fa";
import { useUser } from "@features/auth/model/useUser";

let loaded = false;

export default function MainMenu() {
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { user } = useUser();

    useEffect(() => {
        if (loaded) return;
        if (menuRef.current) {
            gsap.fromTo(
                menuRef.current.children,
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.08,
                    ease: "power3.out",
                    duration: 0.6,
                }
            );
            loaded = true;
        }
    }, []);

    const menuItems = [{ label: "", icon: null, link: "" }];

    const profileItems = [{ label: "Profile", icon: FaUser, link: "/profile" }];

    const loginItems = [{ label: "Login", icon: FaUser, link: "/auth" }];

    const items = user ? profileItems : loginItems;

    return (
        <nav className="w-full z-50 bg-gray-400/10 backdrop-blur-xl shadow-lg text-white px-6 py-4 flex">
            <div className="flex w-full">
                <button
                    onClick={() => navigate("./")}
                    className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text"
                >
                    ft_transcendence
                </button>
            </div>

            <div className="flex justify-center w-full">
                {menuItems.map((item, idx) => (
                    <button
                        key={idx}
                        className="flex items-center gap-2 text-3xl font-medium text-purple-300 hover:text-pink-400 transition-colors duration-200"
                    >
                        <Icon icon={item.icon} className="text-3xl" />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* {condition ? <ButtonA /> : <ButtonB />} */}
            <div
                className="flex w-full justify-end space-x-4 pr-2"
                ref={menuRef}
            >
                {items.map((item, idx) => (
                    <button
                        key={idx}
                        className="flex items-center gap-2 text-2xl font-medium text-purple-300 hover:text-pink-400 transition-colors duration-200"
                        onClick={() => navigate(item.link)}
                    >
                        <Icon icon={item.icon} className="text-xl" />
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
