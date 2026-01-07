import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="flex-1 flex flex-col md:flex-row items-center justify-center pb-10 md:pb-20 px-4 sm:px-6 relative z-10">
      <div className="md:w-1/2 text-center md:pr-8 mb-8 md:mb-0">
        <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-heading font-black text-pink-500 mb-4">
              Her Health
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black mb-6">
              Your Complete Guide to a Healthy Pregnancy Journey
            </p>
            <motion.ul
              className="space-y-3 mb-8 text-justify text-gray-800"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              <motion.li
                className="flex items-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <span className="text-pink-600 mr-2 text-lg sm:text-xl">•</span>
                <span className="font-bold text-base sm:text-lg md:text-xl text-justify text-black">pregnancy progress week by week + Days.</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <span className="text-pink-600 mr-2 text-lg sm:text-xl">•</span>
                <span className="font-bold text-base sm:text-lg md:text-xl text-justify text-black">All the tools that is needed.</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <span className="text-pink-600 mr-2 text-lg sm:text-xl">•</span>
                <span className="font-bold text-base sm:text-lg md:text-xl text-justify text-black">Educational resources tailored to your journey.</span>
              </motion.li>
            </motion.ul>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Button
              asChild
              size="lg"
              className="w-full bg-pink-400 hover:bg-pink-400 text-black px-4 sm:px-8 md:px-12 lg:px-20 py-3 sm:py-4 md:py-5 rounded-lg font-bold text-sm sm:text-base md:text-lg shadow-lg"
            >
              <Link to="/auth" className="flex items-center gap-2">
                Start Your Journey ❤️
                <ArrowRight />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
