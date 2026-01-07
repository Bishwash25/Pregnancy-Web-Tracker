import React from "react";
import { motion } from "framer-motion";

interface FetalAnatomyVectorProps {
    week: number;
}

export function FetalAnatomyVector({ week }: FetalAnatomyVectorProps) {
    const w = Math.min(Math.max(week, 0), 42);

    const growthFactor = w / 40;
    const bumpScale = 1 + (w > 12 ? (w - 12) / 28 * 0.4 : 0);
    const fetalSize = w === 0 ? 0 : Math.max(0.1, (w / 40) * 0.8);
    const isCephalic = w >= 30;

    const colors = {
        silhouette: "#f5f5f4",
        uterus: "#fdf2f8",
        uterusBorder: "#fbcfe8",
        amnioticSac: "#f0f9ff",
        fetus: "#fce7f3",
        fetusBorder: "#f9a8d4",
        placenta: "#fee2e2",
    };

    const getWeekDescription = () => {
        if (w === 0) return "Pre-Pregnancy";
        if (w <= 3) return "Implantation Phase";
        if (w <= 8) return "Embryonic Stage";
        if (w <= 12) return "First Trimester";
        if (w <= 26) return "Second Trimester";
        if (w <= 36) return "Third Trimester";
        if (w <= 40) return "Full Term";
        return "Post-Term";
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 bg-white overflow-hidden">
            <svg
                viewBox="0 0 400 600"
                className="w-full h-full max-h-[500px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.path
                    d="M200 50 
             C180 50, 160 70, 160 100 
             C160 130, 180 150, 200 150 
             S240 170, 240 220 
             C240 270, 200 300, 200 350 
             S200 550, 200 550 
             H250 
             S250 350, 250 300 
             C280 250, 300 200, 300 150 
             S260 50, 200 50 Z"
                    fill={colors.silhouette}
                    transition={{ duration: 1 }}
                />

                <motion.path
                    animate={{
                        d: `M 200 200 C ${200 - (w * 1.5)} ${220 + (w * 0.5)}, ${180 - (w * 2)} 350, 200 380 L 250 380 C 280 350, 280 220, 250 200 Z`
                    }}
                    fill={colors.silhouette}
                    transition={{ type: "spring", stiffness: 50 }}
                />

                <motion.ellipse
                    animate={{
                        cx: 210 + (w * 0.2),
                        cy: 300 + (w * 0.1),
                        rx: w === 0 ? 8 : 10 + (w * 1.8),
                        ry: w === 0 ? 10 : 15 + (w * 2.2),
                        opacity: 1
                    }}
                    fill={colors.uterus}
                    stroke={colors.uterusBorder}
                    strokeWidth="2"
                    transition={{ type: "spring", stiffness: 40 }}
                />

                <motion.ellipse
                    animate={{
                        cx: 210 + (w * 0.2),
                        cy: 300 + (w * 0.1),
                        rx: w === 0 ? 6 : 8 + (w * 1.6),
                        ry: w === 0 ? 8 : 12 + (w * 2.0),
                        opacity: w >= 0 ? 0.6 : 0
                    }}
                    fill={colors.amnioticSac}
                    transition={{ type: "spring", stiffness: 40 }}
                />

                <motion.path
                    animate={{
                        d: `M${210 + (w * 1.5)} ${280} 
                A${5 + w} ${10 + w} 0 0 1 ${215 + (w * 1.5)} ${320}`,
                        opacity: w > 4 ? 0.8 : 0
                    }}
                    stroke={colors.placenta}
                    strokeWidth="8"
                    strokeLinecap="round"
                    transition={{ duration: 1 }}
                />

                <motion.g
                    animate={{
                        x: 210 + (w * 0.2),
                        y: 300 + (w * 0.1),
                        scale: fetalSize,
                        rotate: isCephalic ? 160 : 0,
                        opacity: w > 3 ? 1 : 0
                    }}
                    transition={{ type: "spring", stiffness: 30 }}
                >
                    <motion.path
                        d="M-20 -40 
               C-50 -20, -50 40, -20 60 
               S40 40, 40 0 
               S0 -60, -20 -40 Z"
                        fill={colors.fetus}
                        stroke={colors.fetusBorder}
                        strokeWidth="3"
                    />
                    <circle cx="-10" cy="-35" r="25" fill={colors.fetus} stroke={colors.fetusBorder} strokeWidth="2" />
                    <circle cx="0" cy="-40" r="2" fill={colors.fetusBorder} opacity={w > 20 ? 1 : 0} />

                    <motion.path
                        d="M20 10 C40 10, 60 0, 70 -20"
                        stroke={colors.fetusBorder}
                        strokeWidth="4"
                        fill="none"
                        opacity={0.4}
                    />
                </motion.g>

                {w === 0 && (
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <text
                            x="210"
                            y="300"
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-pink-400"
                        >
                            Uterus
                        </text>
                    </motion.g>
                )}

                {w <= 3 && w > 0 && (
                    <motion.circle
                        cx={210 + (w * 0.2)}
                        cy={300 + (w * 0.1)}
                        r={3 + w}
                        fill={colors.fetusBorder}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    />
                )}

                <text
                    x="200"
                    y="560"
                    textAnchor="middle"
                    className="text-[10px] font-black fill-slate-300 uppercase tracking-[0.2em]"
                >
                    Week {w} • {getWeekDescription()}
                </text>

                <text
                    x="200"
                    y="580"
                    textAnchor="middle"
                    className="text-[8px] fill-slate-400"
                >
                    Anatomical Model
                </text>
            </svg>
        </div>
    );
}
