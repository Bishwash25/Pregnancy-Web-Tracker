import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function AuthForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signInWithGoogle, loading } = useFirebaseAuth();
  const [postLoginLoading, setPostLoginLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();

      if (!user?.uid) {
        navigate("/terms");
        return;
      }

      setPostLoginLoading(true);

      try {
        const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
        const pregSnap = await getDoc(pregnancyDocRef);
        if (pregSnap.exists()) {
          navigate("/pregnancy-dashboard");
          return;
        }

        const onboardingRef = doc(db, "users", user.uid, "onboarding", "status");
        const onboardingSnap = await getDoc(onboardingRef);
        const onboardingData = onboardingSnap.exists() ? onboardingSnap.data() : {};

        if (!onboardingData?.acceptedTerms) {
          navigate("/terms");
          return;
        }
        if (!onboardingData?.completedTrackingChoice) {
          navigate("/tracking-choice");
          return;
        }
        navigate("/pregnancy-start");
      } catch {
        navigate("/terms");
      } finally {
        setPostLoginLoading(false);
      }
    } catch (error) {
      console.error('Login Failed:', error);
      setPostLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl shadow-pink-200/40 rounded-[2.5rem] p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-20" />
          
          <div className="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-pink-100">
            <Sparkles className="h-10 w-10 text-pink-600" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Her Health
          </h1>
          <p className="text-lg text-gray-500 font-medium mb-10">
            Clinical excellence meets personalized maternal care.
          </p>

          <Button
            variant="outline"
            className="w-full h-16 rounded-2xl bg-white border-pink-100 hover:border-pink-300 hover:bg-pink-50/30 text-gray-700 font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-3 group"
            onClick={handleGoogleLogin}
            disabled={loading || postLoginLoading}
          >
            {postLoginLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
                Validating Session...
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 transition-transform group-hover:scale-110">
                  <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.22 1.2-1.37 3.5-5.1 3.5-3.07 0-5.57-2.54-5.57-5.7S8.93 5.9 12 5.9c1.75 0 2.93.74 3.6 1.37l2.45-2.37C16.65 3.39 14.5 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12S6.7 21.5 12 21.5c6.9 0 9.5-4.78 9.5-7.1 0-.48-.05-.86-.11-1.2H12z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="mt-8 text-xs text-gray-400 font-medium leading-relaxed">
            By continuing, you agree to our <br />
            <span className="text-pink-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-pink-600 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

export default AuthForm;
