
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TermsConditions() {
  const [accepted, setAccepted] = useState(false);
  const [isOver16, setIsOver16] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user already completed steps, fast-forward
  useEffect(() => {
    const checkProgress = async () => {
      if (!user?.uid) return;
      try {
        const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
        const pregSnap = await getDoc(pregnancyDocRef);
        if (pregSnap.exists()) {
          navigate("/pregnancy-dashboard", { replace: true });
          return;
        }

        const onboardingRef = doc(db, "users", user.uid, "onboarding", "status");
        const onboardingSnap = await getDoc(onboardingRef);
        const data: { acceptedTerms?: boolean; completedTrackingChoice?: boolean } = onboardingSnap.exists() ? onboardingSnap.data() : {};
        if (data?.acceptedTerms && data?.completedTrackingChoice) {
          navigate("/pregnancy-start", { replace: true });
          return;
        }
        if (data?.acceptedTerms) {
          navigate("/tracking-choice", { replace: true });
          return;
        }
      } catch {
        // ignore and allow page
      }
    };
    checkProgress();
  }, [user?.uid, navigate]);

  const handleContinue = async () => {
    if (!accepted || !isOver16) {
      toast({
        title: "Required Action",
        description: "You must accept the terms and confirm you are over 16 years old.",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }

    try {
      if (user?.uid) {
        const onboardingRef = doc(db, "users", user.uid, "onboarding", "status");
        await setDoc(onboardingRef, { acceptedTerms: true, acceptedAt: serverTimestamp() }, { merge: true });
      }
    } catch {
      // Non-blocking
    }

    navigate("/tracking-choice");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/30 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-pink-200/50 border border-white p-5 sm:p-8 lg:p-10"
      >
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-pink-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-500 mt-2 text-base sm:text-lg">Please review our clinical guidelines.</p>
        </div>
      
        <div className="relative mb-6 sm:mb-8">
          <ScrollArea className="h-[40vh] sm:h-80 w-full rounded-2xl border border-pink-100 bg-white/50 p-4 sm:p-6">
            <div className="text-sm sm:text-base leading-relaxed text-gray-700 space-y-5">
              <section>
                <h3 className="font-bold text-gray-900 text-lg mb-2">1. Clinical Use Case</h3>
                <p>These Terms of Service govern your use of the Her Health application. By using our Services, you agree to these terms. Please read them carefully.</p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900 text-lg mb-2">2. Eligibility & Age</h3>
                <p>You must be at least 16 years old to use our Services. If you are under 16, please do not use our Services. We prioritize the safety and privacy of all our users.</p>
              </section>

              <section className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  3. Medical Disclaimer
                </h3>
                <p className="text-amber-800 text-sm">
                  The information provided through our Services is for general informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900 text-lg mb-2">4. Data Privacy</h3>
                <p>Your privacy is important. Our Privacy Policy explains how we collect, use, and protect your personal information. Your clinical data is encrypted and handled with extreme care.</p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900 text-lg mb-2">5. Accurate Information</h3>
                <p>You agree to provide accurate, complete, and current information during the registration process to ensure the best clinical experience.</p>
              </section>
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4">
          <label 
            className={cn(
              "flex items-start gap-3 sm:gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
              accepted ? "bg-pink-50 border-pink-200" : "bg-gray-50 border-gray-100 hover:border-pink-100"
            )}
          >
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(!!checked)}
              className="mt-1 h-5 w-5 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
            />
            <span className="text-sm sm:text-base font-medium text-gray-700 leading-tight">
              I have read and accept the terms and conditions
            </span>
            {accepted && <CheckCircle2 className="h-5 w-5 text-pink-600 ml-auto flex-shrink-0" />}
          </label>

          <label 
            className={cn(
              "flex items-start gap-3 sm:gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
              isOver16 ? "bg-pink-50 border-pink-200" : "bg-gray-50 border-gray-100 hover:border-pink-100"
            )}
          >
            <Checkbox
              id="age"
              checked={isOver16}
              onCheckedChange={(checked) => setIsOver16(!!checked)}
              className="mt-1 h-5 w-5 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
            />
            <span className="text-sm sm:text-base font-medium text-gray-700 leading-tight">
              I confirm I am over 16 years old
            </span>
            {isOver16 && <CheckCircle2 className="h-5 w-5 text-pink-600 ml-auto flex-shrink-0" />}
          </label>

          <Button
            onClick={handleContinue}
            disabled={!accepted || !isOver16}
            className="w-full h-14 sm:h-16 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg sm:text-xl shadow-xl shadow-pink-200 transition-all disabled:opacity-50"
          >
            Continue to Tracking
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
