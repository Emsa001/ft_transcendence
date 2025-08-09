import React, { useRef, useEffect, useNavigate } from "react";
import gsap from "gsap";
import { Icon } from "@shared/components/Icon";
import { FaHome, FaGamepad, FaUser } from "react-icons/fa";

let loaded = false;

export default function MainMenu() {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(loaded) return ;
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

    const menuItems = [
        { label: "Home", icon: FaHome, link: "/" },
        { label: "Auth", icon: FaGamepad, link: "/auth" },
        { label: "Profile", icon: FaUser, link: "/profile" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl text-white px-6 py-4 flex items-center justify-center">
            <div ref={menuRef} className="flex items-center gap-8">
                {menuItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(item.link)}
                        className="flex items-center gap-2 text-lg font-medium hover:text-pink-400 transition-colors duration-200"
                    >
                        <Icon icon={item.icon} className="text-xl" />
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
