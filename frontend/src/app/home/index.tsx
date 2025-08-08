import LandingSection from "@features/landing/ui";
import React from "react";

export default function Home() {
    return (
        <div className="w-screen min-h-screen bg-black relative text-white">
            <div className="z-100 absolute top-[75%] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-500/20 rounded-full blur-[80px]" />

            {/* Hero */}
            <LandingSection />

            {/* About / Intro Section */}
            <section className="relative py-20">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">What is ft_transcendence?</h2>
                    <p className="text-zinc-400 text-lg max-w-3xl mx-auto leading-relaxed">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
                    </p>
                </div>
            </section>
        </div>
    );
}
