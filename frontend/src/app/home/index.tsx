import React, { useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ShinyText } from "@shared/components/Shiny";
import { Ball } from "@features/landing/ui/Ball";
import BallField from "@features/landing/ui/BallField";

gsap.registerPlugin(MotionPathPlugin);

export default function Home() {
    const titleRef = useRef<HTMLHeadingElement>(null);

    const [showField, setShowField] = useState(false);

    return (
        <div className="w-screen h-screen bg-black relative">
            <div className="flex flex-col items-center justify-center h-full">
                <h1
                    ref={titleRef}
                    className="z-10 text-[clamp(3rem,6vw,10rem)] font-bold select-none pointer-events-none text-white"
                >
                    <ShinyText
                        text="ft_transcendence"
                        gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
                    />
                </h1>

                <button className="z-10 mt-8 py-3 px-8 text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-200" onClick={() => setShowField(!showField)}>
                    Play
                </button>
            </div>

            {showField && <BallField />}
        </div>
    );
}
