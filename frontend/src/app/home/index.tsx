import { BallField } from "@features/balls/ui/BallField";
import LandingSection from "@features/landing/ui";
import { Footer } from "@shared/components/Footer";
import React from "react";

export default function Home() {
    return (
        <div className="w-screen h-screen overflow-x-hidden relative text-white">
            <LandingSection />
            <Footer />
            <BallField amount={20} delay={1200} />
        </div>
    );
}
