import React from "react";

type Variant = 'pink' | 'blue' | 'green' | 'purple';

interface BackgroundAmbienceProps {
    variant?: Variant;
}

export const BackgroundAmbience: React.FC<BackgroundAmbienceProps> = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Ambient Blobs - Static for performance */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-pink-200/20"
            />
            <div
                className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[80px] bg-pink-300/10"
            />
        </div>
    );
};
