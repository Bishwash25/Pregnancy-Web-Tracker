import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ShieldAlert, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardSnapshot } from "@/data/pregnancyDashboardData";
import { FetalAnatomyVector } from "./FetalAnatomyVector";

interface MaternalFetalVisualizationProps {
    snapshot: DashboardSnapshot | null;
    weeksPregnant: number;
}

export function MaternalFetalVisualization({ snapshot, weeksPregnant }: MaternalFetalVisualizationProps) {
    if (!snapshot) return null;

    const getImageUrl = (w: number) => {
        if (w >= 1 && w <= 4) return "/images/maternal-fetal/w1_4.png";
        if (w >= 5 && w <= 7) return "/images/maternal-fetal/w5_7.png";
        if (w >= 8 && w <= 10) return "/images/maternal-fetal/w8_10.png";
        if (w >= 11 && w <= 13) return "/images/maternal-fetal/w11_13.png";
        if (w >= 14 && w <= 17) return "/images/maternal-fetal/w14_17.png";
        if (w >= 18 && w <= 22) return "/images/maternal-fetal/w18_22.png";
        return null;
    };

    const imageUrl = getImageUrl(weeksPregnant);

    return (
        <Card className="overflow-hidden bg-white/60 backdrop-blur-xl border-white/20 shadow-2xl shadow-pink-100/20 rounded-[2.5rem]">
            <CardHeader className="p-8 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-100/50">
                            <BookOpen className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-slate-900">
                                {snapshot.trimester} Trimester Overview
                            </CardTitle>
                            <CardDescription className="text-sm font-bold text-indigo-500 uppercase tracking-widest">
                                {snapshot.weekRangeLabel} • {imageUrl ? "Clinical Illustration" : "Anatomical Overlay"}
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Illustration Section */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-200 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-xl flex items-center justify-center"
                        >
                            {imageUrl ? (
                                <img 
                                    src={imageUrl} 
                                    alt={`Week ${weeksPregnant} visualization`}
                                    className="w-full h-full object-contain p-4"
                                />
                            ) : (
                                <FetalAnatomyVector week={weeksPregnant} />
                            )}
                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <span className="px-4 py-1.5 bg-slate-900/10 backdrop-blur-md rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    {imageUrl ? "Medical Illustration" : "Scientific Illustration"}: Week {weeksPregnant}
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Educational Content Section */}
                    <div className="space-y-6">
                        <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Info className="w-4 h-4 text-indigo-600" />
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Fatal position?</span>
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed">
                                {snapshot.milestones?.position || "Your baby is developing and moving frequently at this stage. Position varies significantly between individuals."}
                            </p>
                        </div>
                        <div className="p-6 bg-white/60 rounded-[2rem] border border-white/40 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Developments</span>
                            </div>
                            <p className="text-base text-slate-700 font-semibold leading-relaxed">
                                {snapshot.development.keyDevelopments}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                                    <span className="text-lg">👶</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Development Phase</h4>
                                    <p className="text-slate-700 font-bold">{snapshot.development.description}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                                    <span className="text-lg">🏥</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Clinical Note</h4>
                                    <p className="text-slate-700 font-bold">Uterus is approximately {snapshot.medicalInsights?.uterusSize || "growing"}.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldAlert className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Disclaimer</span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 leading-tight italic">
                                Illustration for educational purposes only. Medically reviewed. Not diagnostic. Sources: ACOG / Mayo Clinic.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
