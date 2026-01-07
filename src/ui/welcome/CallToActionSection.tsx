import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BackgroundAmbience } from "./BackgroundAmbience";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const CallToActionSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="py-32 relative overflow-hidden bg-transparent">
            <BackgroundAmbience variant="purple" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto rounded-[3rem] bg-gray-900 p-12 md:p-20 relative overflow-hidden shadow-2xl will-change-transform"
                >
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 will-change-transform" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 will-change-transform" />

                    <div className="relative z-10 text-center">
                        <motion.h2 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight will-change-transform"
                        >
                            Ready to Begin Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300"> Journey?</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed will-change-transform"
                        >
                            Join a global community of modern mothers who choose excellence. 
                            Get started today and experience the Easiest way to track your pregnancy.
                        </motion.p>

                        <div className="flex flex-wrap justify-center gap-6 mb-12">
                            {["No credit card", "All features", "Expertly vetted"].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-300 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-pink-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/auth')}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-full font-bold text-xl transition-all shadow-xl hover:shadow-pink-500/40"
                        >
                            Get Started Free
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        
                        <p className="mt-8 text-sm text-gray-500 font-medium uppercase tracking-widest">
                           Every thing is Free
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
