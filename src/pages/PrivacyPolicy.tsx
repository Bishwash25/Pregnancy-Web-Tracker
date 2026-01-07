import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, Share2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/ui/welcome/Footer";

const PrivacyPolicy: React.FC = () => {
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
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-pink-100 rounded-2xl">
              <Lock className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p className="text-lg">
              At Her Health, your privacy is our top priority. This Privacy Policy outlines how we collect, use, and protect your personal and health information.
            </p>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-pink-500" />
                <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and password when you register.</li>
                <li><strong>Pregnancy Data:</strong> Last menstrual period (LMP), due date, weight logs, and other health-related information you choose to track.</li>
                <li><strong>Usage Data:</strong> Information about how you use our app to help us improve your experience.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-6 w-6 text-pink-500" />
                <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
              </div>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide personalized pregnancy tracking and insights.</li>
                <li>Maintain and secure your account.</li>
                <li>Improve our application and develop new features.</li>
                <li>Communicate with you regarding updates or support.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="h-6 w-6 text-pink-500" />
                <h2 className="text-2xl font-semibold text-gray-900">3. Information Sharing</h2>
              </div>
              <p>
                We <strong>never sell</strong> your personal or health data. We only share information with third-party service providers who assist us in operating our application, and only to the extent necessary for them to provide their services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p>
                We implement robust security measures, including encryption and secure servers, to protect your data from unauthorized access or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information at any time through your account settings or by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@herhealth.com.
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

export default PrivacyPolicy;
