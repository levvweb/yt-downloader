import { useRef, useEffect } from "react";

interface WaveProps {
    fill?: string;
    paused?: boolean;
    className?: string;
}

export const Wave = ({ fill = "rgba(255, 255, 255, 0.02)", paused = false, className }: WaveProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        let animationFrameId: number;
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        // Wave parameters
        let time = 0;
        const waves = [
            { y: height * 0.8, length: 0.01, amplitude: 50, speed: 0.01 },
            { y: height * 0.8, length: 0.005, amplitude: 70, speed: 0.005 },
            { y: height * 0.8, length: 0.02, amplitude: 30, speed: 0.02 }
        ];

        const resize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        const draw = () => {
            if (!paused) {
                time += 0.5;
            }

            context.clearRect(0, 0, width, height);

            waves.forEach((wave) => {
                context.beginPath();
                context.moveTo(0, height);

                for (let i = 0; i < width; i++) {
                    context.lineTo(i, wave.y + Math.sin(i * wave.length + time * wave.speed) * wave.amplitude);
                }

                context.lineTo(width, height);
                context.lineTo(0, height);
                context.closePath();
                context.fillStyle = fill;
                context.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [fill, paused]);

    return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
};
