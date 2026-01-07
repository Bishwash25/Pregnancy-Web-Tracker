import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Baby, Sparkles, ArrowRight, Heart, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function TrackingChoice() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const { name } = JSON.parse(userData);
        setUserName(name);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [navigate]);

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
        const data: { completedTrackingChoice?: boolean } = onboardingSnap.exists() ? onboardingSnap.data() : {};
        if (data?.completedTrackingChoice) {
          navigate("/pregnancy-start", { replace: true });
        }
      } catch {
        // ignore
      }
    };
    checkProgress();
  }, [user?.uid, navigate]);

  const handleStartTracking = async () => {
    try {
      if (user?.uid) {
        const onboardingRef = doc(db, "users", user.uid, "onboarding", "status");
        await setDoc(onboardingRef, { completedTrackingChoice: true, trackingChoiceAt: serverTimestamp() }, { merge: true });
      }
    } catch {
      // non-blocking
    }
    navigate("/pregnancy-start");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm mb-4 sm:mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Welcome to Her Health
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-3 sm:mb-4 px-2">
            {userName ? `Welcome, ${userName}!` : 'Start Your Journey'}
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium px-4">
            Select your clinical tracking preference to begin your personalized experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 sm:gap-8 max-w-2xl mx-auto">
          <motion.div
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="h-full border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl shadow-pink-200/40 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group">
              <CardHeader className="text-center pb-6 sm:pb-8 pt-8 sm:pt-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-pink-200 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Baby className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Pregnancy Tracking</CardTitle>
                <CardDescription className="text-base sm:text-lg text-gray-500 font-medium px-4">
                  Comprehensive clinical monitoring for your entire journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 sm:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                  {[
                    { icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />, text: "Week-by-week progress" },
                    { icon: <Heart className="h-4 w-4 sm:h-5 sm:w-5" />, text: "Symptom tracking" },
                    { icon: <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />, text: "Baby development" },
                    { icon: <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />, text: "Labor preparation" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/40 border border-white/60">
                      <div className="text-pink-500 flex-shrink-0">{item.icon}</div>
                      <span className="text-xs sm:text-sm font-bold text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-6 sm:px-12 pb-8 sm:pb-10">
                <Button
                  onClick={handleStartTracking}
                  className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg sm:text-xl shadow-xl shadow-pink-200 group/btn transition-all flex items-center justify-center gap-2 sm:gap-3"
                >
                  Start Tracking Now
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
