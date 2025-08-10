import React, { useRef, useEffect, useState } from "react";

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import { ShinyText } from "@shared/components/Shiny";
import BallField from "@features/landing/ui/BallField";

gsap.registerPlugin(MotionPathPlugin);

export default function LandingSection() {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const subtitleRef = useRef<HTMLParagraphElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [showField, setShowField] = useState(false);

    useEffect(() => {
        if (titleRef.current && subtitleRef.current && buttonRef.current) {
            gsap.fromTo(
                titleRef.current,
                { y: 80, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, ease: "power4.out", duration: 1.2, delay: 0.1 }
            );
            gsap.fromTo(
                subtitleRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, ease: "power3.out", duration: 1, delay: 0.6 }
            );
            gsap.fromTo(
                buttonRef.current,
                { y: 20, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, ease: "elastic.out(1, 0.6)", duration: 1, delay: 0.8 }
            );

            gsap.fromTo(
                scrollRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, ease: "power3.out", duration: 1, delay: 1.2 }
            );
        }
    }, []);

    return (
        <section className="relative w-full h-full">
            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-500/20 rounded-full blur-[80px]" />
        
            {showField && <BallField />}

            {/* Content */}
            <div className="relative flex flex-col items-center justify-center h-full px-4 text-center">
                <h1
                    ref={titleRef}
                    className="opacity-0 text-[clamp(3rem,6vw,10rem)] font-extrabold select-none text-white drop-shadow-xl"
                >
                    <ShinyText
                        text="ft_transcendence"
                        gradient="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                    />
                </h1>

                <p
                    ref={subtitleRef}
                    className="opacity-0 mt-6 text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed"
                >
                    Experience a new dimension of interaction — fast, modern, and beautifully
                    minimal.
                </p>

                <button
                    ref={buttonRef}
                    onClick={() => setShowField(!showField)}
                    className="opacity-0 relative z-50 mt-10 py-4 px-10 text-lg font-semibold rounded-xl shadow-xl transition-all duration-300
                        bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500
                        bg-[length:200%_200%] hover:bg-[position:100%_0%]
                        hover:scale-105 active:scale-95 text-white"
                >
                    {showField ? "Close Playground" : "Start Playing"}
                </button>
            </div>
        </section>
    );
}
