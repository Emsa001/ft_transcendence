import React, { useRef, useEffect } from "react";

import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import { ShinyText } from "@shared/components/Shiny";
import { ActionButtons } from "./ActionButtons";
import { useLanguage } from "@features/language/model/useLanguage";

gsap.registerPlugin(MotionPathPlugin);

export default function LandingSection() {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const subtitleRef = useRef<HTMLParagraphElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const { getText } = useLanguage();
    const text = getText("landScreen");

    useEffect(() => {
        if (titleRef.current && subtitleRef.current) {
            gsap.fromTo(
                titleRef.current,
                { y: 80, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    ease: "power4.out",
                    duration: 1.2,
                    delay: 0.1,
                }
            );
            gsap.fromTo(
                subtitleRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "power3.out",
                    duration: 1,
                    delay: 0.6,
                }
            );

            gsap.fromTo(
                scrollRef.current,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "power3.out",
                    duration: 1,
                    delay: 1.2,
                }
            );
        }
    }, []);

    return (
        <section className="relative w-full h-full">
            <div className="relative flex flex-col items-center justify-center h-full px-4 text-center">
                <h1
                    ref={titleRef}
                    className="opacity-0 text-[clamp(3rem,6vw,10rem)] font-extrabold select-none text-white drop-shadow-xl"
                >
                    <ShinyText text={text.label} gradient="bg-logo-gradient" />
                </h1>
                <p
                    ref={subtitleRef}
                    className="opacity-0 mt-6 text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed"
                >
                    {text.welcomeText}
                </p>

                <ActionButtons />
            </div>
        </section>
    );
}
