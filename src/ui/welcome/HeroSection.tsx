import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollButton } from "./ScrollButton";
import { BackgroundAmbience } from "./BackgroundAmbience";
import { ChevronRight, Sparkles } from "lucide-react";

export const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
            <BackgroundAmbience variant="pink" />
            
            {/* Animated Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: typeof window !== 'undefined' && window.innerWidth > 768 ? [1, 1.2, 1] : 1,
                        rotate: typeof window !== 'undefined' && window.innerWidth > 768 ? [0, 90, 0] : 0,
                        opacity: typeof window !== 'undefined' && window.innerWidth > 768 ? [0.1, 0.2, 0.1] : 0.1
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -right-24 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20 will-change-transform"
                />
                <motion.div 
                    animate={{ 
                        scale: typeof window !== 'undefined' && window.innerWidth > 768 ? [1, 1.1, 1] : 1,
                        x: typeof window !== 'undefined' && window.innerWidth > 768 ? [0, 50, 0] : 0,
                        opacity: typeof window !== 'undefined' && window.innerWidth > 768 ? [0.1, 0.15, 0.1] : 0.1
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] bg-rose-100 rounded-full blur-3xl opacity-20 will-change-transform"
                />
            </div>

            <div className="container mx-auto px-4 z-10 text-center max-w-5xl pt-28 md:pt-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-sm font-semibold mb-8 shadow-sm will-change-transform"
                >
                    
                    <span>The Choice for Modern Mothers</span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-[1.05] will-change-transform"
                >
                    <span className="block text-gray-900 drop-shadow-sm">
                        Your Pregnancy,
                    </span>
                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">
                        Elevated & Beautiful
                       
                    </span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-medium will-change-transform"
                >
                    Experience a journey as unique as you are. Her Health provides tracking tools, 
                    trusted medical insights, and a beautiful space to cherish every milestone.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto px-4 will-change-transform"
                >
                    <button
                        onClick={() => navigate('/auth')}
                        className="group relative w-full sm:w-auto px-10 py-5 bg-gray-900 text-white rounded-full font-bold text-lg transition-all overflow-hidden shadow-2xl hover:shadow-pink-500/20 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Start Your Journey
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/contact')}
                        className="w-full sm:w-auto px-10 py-5 bg-white text-gray-800 rounded-full font-bold text-lg transition-all border-2 border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 active:scale-95"
                    >
                        Contact Us
                    </button>
                </motion.div>

                {/* Hero Feature Badges */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4"
                >
                    {[
                        { label: "Trusted Data", value: "100%" },
                        { label: "Active Mothers", value: "50k+" },
                        { label: "Health Insights", value: "24/7" },
                        { label: "Community", value: "Global" }
                    ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/50 border border-gray-100 backdrop-blur-sm will-change-transform">
                            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            <ScrollButton targetId="features" />
        </section>
    );
};
