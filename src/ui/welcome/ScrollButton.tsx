import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollButtonProps {
    targetId: string;
}

export const ScrollButton: React.FC<ScrollButtonProps> = ({ targetId }) => {
    const scrollToSection = () => {
        const section = document.getElementById(targetId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.button
            onClick={scrollToSection}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-3 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 text-pink-900 hover:bg-white/50 transition-colors cursor-pointer z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1, duration: 0.8 }
            }}
            whileHover={{ scale: 1.1 }}
        >
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <ChevronDown className="w-6 h-6" />
            </motion.div>
        </motion.button>
    );
};
