import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Shiny from "@shared/components/Shiny";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);
    const layer1Ref = useRef(null);

    useEffect(() => {
        // Initial animations
        const tl = gsap.timeline();
        tl.from(titleRef.current, { y: -100, opacity: 0, duration: 1.5, ease: "power3.out" }).from(
            subtitleRef.current,
            { y: 50, opacity: 0, duration: 1.2, ease: "power3.out" },
            "-=0.8"
        );

        // Parallax scrolling effects
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.to(layer1Ref.current, { scale: Math.max(1, 1 + progress * 5), duration: 0.3 });
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="relative overflow-hidden">
            {/* Sky Layer */}
            <div
                ref={layer1Ref}
                className="fixed inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-800 z-10"
            >
                <div className="absolute inset-0 opacity-30">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-40 min-h-screen flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <h1 ref={titleRef} className="text-[clamp(3rem,5vw,9rem)]  font-black py-8">
                        <Shiny text="ft_transcendence" />
                    </h1>

                    <p
                        ref={subtitleRef}
                        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
                    >
                        Deep beneath the digital realm lies an ancient power waiting to be awakened.
                        Journey through layers of code and consciousness to discover your true
                        potential.
                    </p>

                    <button
                        ref={buttonRef}
                        className="group relative px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-full shadow-2xl hover:shadow-orange-500/50 transform hover:scale-110 transition-all duration-300 border-4 border-yellow-400"
                        style={{
                            boxShadow:
                                "0 0 40px rgba(255, 165, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <span className="relative z-10">BEGIN THE DESCENT</span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 opacity-0 group-hover:opacity-50 group-hover:animate-pulse"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
