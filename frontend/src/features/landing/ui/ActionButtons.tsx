import { useLanguage } from "@features/language/model/useLanguage";
import gsap from "gsap";
import React, { useEffect, useNavigate, useRef } from "react";

export const ActionButtons = () => {
    const navigate = useNavigate();
    const buttonsRef = useRef<HTMLDivElement | null>(null);
    const { getText } = useLanguage();
    const text = getText("landScreen");

    useEffect(() => {
        gsap.fromTo(
            buttonsRef.current,
            { y: 80, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                ease: "power4.out",
                duration: 1.2,
                delay: 0.8,
            }
        );
    }, []);

    const btnClass =
        "py-4 px-10 text-lg text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 group-hover:opacity-30 hover:!opacity-100 hover:scale-105 active:scale-95";

    return (
        <div
            ref={buttonsRef}
            className="group flex gap-4 items-center justify-center relative z-50 mt-10 opacity-0"
        >
            {/* Play Locally */}
            <button
                onClick={() => navigate("/game")}
                className={`${btnClass}
                    bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500/70
                    bg-[length:200%_200%] hover:bg-[position:100%_0%]`}
            >
                {text.play}
            </button>
        </div>
    );
};
