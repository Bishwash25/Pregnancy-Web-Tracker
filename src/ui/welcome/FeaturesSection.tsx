import {
    Activity,
    Heart,
    Baby,
    BookOpen,
    FileText,
    Youtube
} from "lucide-react";
import { motion } from "framer-motion";
import { BackgroundAmbience } from "./BackgroundAmbience";

const features = [
    {
        icon: Activity,
        title: "Intelligent Tracking",
        description: "Sophisticated data-driven insights that evolve with your pregnancy, providing personalized milestones daily.",
        color: "from-pink-500 to-rose-400"
    },
    {
        icon: Heart,
        title: "Curated Mother's Suite",
        description: "A collection of tools including kick counters, contraction timers, and nutrition planners and many more designed for ease.",
        color: "from-purple-500 to-indigo-400"
    },
    {
        icon: Baby,
        title: "Growth Visualizer",
        description: "Witness your baby's development through beautiful visual comparisons and detailed medical growth indicators.",
        color: "from-blue-500 to-cyan-400"
    },
    {
        icon: BookOpen,
        title: "Expert Knowledge Base",
        description: "Access a world-class library of articles and prenatal care tips vetted by leading health professionals.",
        color: "from-amber-500 to-orange-400"
    },
    {
        icon: FileText,
        title: "Clinical Reports",
        description: "Generate professional-grade PDF summaries of your health data to seamlessly share with your obstetrician.",
        color: "from-emerald-500 to-teal-400"
    },
    {
        icon: Youtube,
        title: "Visual Content",
        description: "Expertly curated video series covering everything from yoga to preparation for the big day.",
        color: "from-red-500 to-rose-400"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const FeaturesSection: React.FC = () => {
    return (
        <section id="features" className="py-32 relative overflow-hidden bg-transparent">
            <BackgroundAmbience variant="blue" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-pink-600 uppercase bg-pink-50 rounded-full will-change-transform"
                    >
                        Features
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight will-change-transform"
                    >
                        Crafted for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">Perfect Journey</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium will-change-transform"
                    >
                        Experience the gold standard in pregnancy tracking with our comprehensive suite of features.
                    </motion.p>
                </div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: typeof window !== 'undefined' && window.innerWidth > 768 ? -10 : 0 }}
                            className="relative group bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_40px_80px_rgba(236,72,153,0.1)] will-change-transform"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500 will-change-transform`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                            
                            <div className="mt-8 pt-8 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm font-bold text-pink-600 flex items-center gap-2">
                                    Learn more <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
