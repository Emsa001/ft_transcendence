import React, { useEffect, useState } from "react";

interface ModalProps {
    children?: any;
    isOpen: boolean;
    onClose?: () => void;
    className?: string;
}

export const Modal = ({
    children,
    isOpen,
    onClose,
    className = "",
}: ModalProps) => {
    const [show, setShow] = useState(isOpen); // Controls rendering
    const [animate, setAnimate] = useState(false); // Controls animation

    useEffect(() => {
        if (isOpen) {
            setShow(true); // Render modal
            setTimeout(() => setAnimate(true), 10); // Start animation slightly after mount
        } else {
            setAnimate(false); // Start exit animation
            // Remove from DOM after animation
            setTimeout(() => setShow(false), 300);
        }
    }, [isOpen]);

    const handleOverlayClick = (e: any) => {
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    const animationClasses = animate
        ? "opacity-100 scale-100 transition duration-300 ease-out"
        : "opacity-0 scale-90 transition duration-300 ease-in";

    if (!show) return <div className="absolute" />;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={handleOverlayClick}
        >
            <div
                className={`relative max-w-lg w-full backdrop-blur-2xl shadow-2xl p-12 rounded-2xl transform ${animationClasses} ${className}`}
            >
                {children}
            </div>
        </div>
    );
};
