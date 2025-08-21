import LandingSection from "@features/landing/ui";
import { Footer } from "@shared/components/Footer";
import React from "react";

export default function Home() {
    return (
        <div className="w-screen h-screen overflow-x-hidden relative text-white">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]" />
            <div className="absolute top-40 -right-40 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px]" />
            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-500/20 rounded-full blur-[80px]" />

            <LandingSection />
            <Footer />
        </div>
    );
}
