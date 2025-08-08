import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ShinyText } from "@shared/components/Shiny";
import BallField from "@features/landing/ui/BallField";

gsap.registerPlugin(MotionPathPlugin);

export default function LandingSection() {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const subtitleRef = useRef<HTMLParagraphElement | null>(null);
    const [showField, setShowField] = useState(false);

    useEffect(() => {
        if (titleRef.current && subtitleRef.current) {
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
        }
    }, []);

    return (
        <section className="relative w-full h-screen overflow-x-hidden bg-gradient-to-b from-black via-zinc-900 to-black">
            {/* Decorative blurred blobs */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]" />
            <div className="absolute top-40 -right-40 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px]" />

            {showField && <BallField />}


            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                <h1
                    ref={titleRef}
                    className="text-[clamp(3rem,6vw,10rem)] font-extrabold select-none text-white drop-shadow-xl"
                >
                    <ShinyText
                        text="ft_transcendence"
                        gradient="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                    />
                </h1>

                <p
                    ref={subtitleRef}
                    className="mt-6 text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed"
                >
                    Experience a new dimension of interaction — fast, modern, and beautifully minimal.
                </p>

                <button
                    onClick={() => setShowField(!showField)}
                    className="mt-10 py-4 px-10 text-lg font-semibold rounded-xl shadow-xl transition-all duration-300
                        bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500
                        hover:scale-105 active:scale-95 text-white"
                >
                    {showField ? "Close Playground" : "Start Playing"}
                </button>

                {/* Scroll down indicator */}
                <div className="absolute bottom-6 flex flex-col items-center text-zinc-400 animate-bounce">
                    <span className="text-sm">Scroll Down</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
