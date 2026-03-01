import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

export const useLoadingProgress = () => {
    const { progress, active } = useProgress();
    const [isReady, setIsReady] = useState(false);
    const [smoothProgress, setSmoothProgress] = useState(0);

    useEffect(() => {
        // Smooth out the progress
        const target = active ? progress : 100;
        let animationFrame;

        const updateProgress = () => {
            setSmoothProgress(prev => {
                const diff = target - prev;
                if (Math.abs(diff) < 0.5) {
                    if (target === 100) setIsReady(true);
                    return target;
                }
                return prev + diff * 0.1;
            });
            
            if (smoothProgress < 100) {
                animationFrame = requestAnimationFrame(updateProgress);
            }
        };

        animationFrame = requestAnimationFrame(updateProgress);

        return () => cancelAnimationFrame(animationFrame);
    }, [progress, active, smoothProgress]);

    return { progress: smoothProgress, isReady };
};
