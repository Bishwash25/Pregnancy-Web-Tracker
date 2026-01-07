import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative overflow-hidden">
      

     

      {/* Left side - Hero section */}
     
      {/* Right side - Auth form */}
      <div className="flex-1 p-8 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md "
        >
          <AuthForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
