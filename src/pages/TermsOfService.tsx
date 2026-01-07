import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/ui/welcome/Footer";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50/30 font-sans overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-pink-100"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Her Health, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Medical Disclaimer</h2>
              <p className="bg-pink-50 p-4 rounded-xl border border-pink-100 italic">
                The content provided by Her Health is for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p>
                To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Privacy</h2>
              <p>
                Your use of Her Health is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and share your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Conduct</h2>
              <p>
                You agree not to use Her Health for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p>
                All content, features, and functionality on Her Health are the exclusive property of Her Health and its licensors and are protected by international copyright, trademark, patent, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these terms at any time. We will provide notice of any significant changes by posting the new terms on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@herhealth.com.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500">
            Last Updated: December 30, 2025
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
