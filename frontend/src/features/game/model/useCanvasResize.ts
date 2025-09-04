import { useEffect } from "react";

export const useCanvasResize = (
    canvasRef: RefObject<HTMLCanvasElement | null>
) => {
    const setCanvasSize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement as HTMLElement;
        const rect = parent.getBoundingClientRect();
        const parentW = rect.width;
        const parentH = rect.height;
        let width = parentW;
        let height = (parentW * 9) / 16;
        if (height > parentH) {
            height = parentH;
            width = (parentH * 16) / 9;
        }
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${Math.floor(width)}px`;
        canvas.style.height = `${Math.floor(height)}px`;
    };

    useEffect(() => {
        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);
        return () => window.removeEventListener("resize", setCanvasSize);
    }, []);
};
