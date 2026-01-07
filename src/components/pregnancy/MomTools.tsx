import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Activity, Footprints, Timer, Utensils, Baby, Smile, Calculator, FileText, TrendingUp, Heart, Stethoscope, ShieldAlert, Brain, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate, useParams } from "react-router-dom";
import { differenceInWeeks } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import WeightTracker from "./tools/WeightTracker";
import ExerciseLog from "./tools/ExerciseLog";
import KickCounter from "./tools/KickCounter";
import ContractionTimer from "./tools/ContractionTimer";
import MealPlans from "./tools/MealPlans";
import GenderPredictor from "./tools/GenderPredictor";
import MoodsTracker from "./tools/MoodsTracker";
import BMICalculator from "./tools/BMICalculator";
import NoteWriter from "./tools/NoteWriter";
import WeightGainGuide from "./tools/WeightGainGuide";
import DoctorVisitPrep from "./tools/DoctorVisitPrep";
import RedFlagSymptoms from "./tools/RedFlagSymptoms";
import WhyThisWhyNowTool from "./tools/WhyThisWhyNowTool";


interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  bgColor?: string;
}

const ToolCard = ({ icon, title, description, onClick, bgColor = "bg-white/40" }: ToolCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <Card 
      className="overflow-hidden border-white/40 bg-white/30 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-xl hover:bg-white/50 cursor-pointer h-full group" 
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className={cn(
            "rounded-2xl p-4 transition-colors duration-300 group-hover:scale-110",
            bgColor
          )}>
            {icon}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function MomTools() {
  const navigate = useNavigate();
  const { "*": subroute } = useParams();
  const [weeksPregnant, setWeeksPregnant] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const LocalStorageFallback = () => {
      const storedLastPeriodDate = localStorage.getItem("lastPeriodDate");
      if (storedLastPeriodDate) {
        const lastPeriod = new Date(storedLastPeriodDate);
        const today = new Date();
        const totalWeeks = differenceInWeeks(today, lastPeriod);
        setWeeksPregnant(Math.min(totalWeeks, 42));
      }
    };

    if (user?.uid) {
      const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
      unsubscribe = onSnapshot(pregnancyDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as {
            lastPeriodDate?: Timestamp | Date | string;
          };
          const lp = data.lastPeriodDate instanceof Timestamp ? data.lastPeriodDate.toDate() : (data.lastPeriodDate ? new Date(data.lastPeriodDate) : null);
          if (lp) {
            const today = new Date();
            const totalWeeks = differenceInWeeks(today, lp);
            setWeeksPregnant(Math.min(totalWeeks, 42));
            return;
          }
        }
        LocalStorageFallback();
      }, () => {
        LocalStorageFallback();
      });
    } else {
      LocalStorageFallback();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  const handleToolClick = (toolRoute: string) => {
    navigate(toolRoute);
  };

  const handleBack = () => {
    navigate("/pregnancy-dashboard/mom");
  };

  switch (subroute) {
    case "weight-tracker":
      return <WeightTracker onBack={handleBack} />;
    case "exercise-log":
      return <ExerciseLog onBack={handleBack} />;
    case "kick-counter":
      return <KickCounter onBack={handleBack} />;
    case "contraction-timer":
      return <ContractionTimer onBack={handleBack} />;
    case "meal-plans":
      return <MealPlans onBack={handleBack} />;
    case "gender-predictor":
      return <GenderPredictor onBack={handleBack} />;
    case "moods-tracker":
      return <MoodsTracker onBack={handleBack} />;
    case "bmi-calculator":
      return <BMICalculator onBack={handleBack} />;
    case "note-writer":
      return <NoteWriter onBack={handleBack} />;
    case "weight-gain-guide":
      return <WeightGainGuide onBack={handleBack} />;
    case "doctor-visit-prep":
        return <DoctorVisitPrep onBack={handleBack} />;
case "red-flag-symptoms":
          return <RedFlagSymptoms onBack={handleBack} />;
        case "why-this-why-now":
          return <WhyThisWhyNowTool onBack={handleBack} />;
        
        default:
      return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center sm:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Mom Tools</h1>
            

            {weeksPregnant >= 40 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6"
              >
                <Alert className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 shadow-sm">
                  <Heart className="h-5 w-5 text-pink-500 flex-shrink-0" />
                  <AlertDescription className="text-gray-700 ml-2">
                    <span className="font-bold text-pink-600">Congratulations! 🎉</span> Your pregnancy journey has reached full term.
                    Please update your pregnancy details when you're ready to start tracking again.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-pink-100/50 to-purple-100/50 shadow-inner overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-full -mr-16 -mt-16 blur-3xl" />
              <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 bg-white/60 rounded-2xl shadow-sm">
                    <Activity className="h-8 w-8 text-pink-600" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Health Monitoring Tools</h2>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      Tracking your pregnancy helps you stay healthy and informed. 
                      Regular use of these tools helps identify patterns and ensures a safer journey for you and your baby.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              icon={<Scale className="h-6 w-6 text-pink-500" />}
              title="Weight Tracker"
              description="Monitor your pregnancy weight gain progress."
              onClick={() => handleToolClick("weight-tracker")}
              bgColor="bg-pink-100"
            />
            <ToolCard
              icon={<Calculator className="h-6 w-6 text-teal-600" />}
              title="BMI Calculator"
              description="Calculate and track your Body Mass Index."
              onClick={() => handleToolClick("bmi-calculator")}
              bgColor="bg-teal-100"
            />
            <ToolCard
              icon={<TrendingUp className="h-6 w-6 text-green-600" />}
              title="Weight Gain Guide"
              description="Personalized recommendations for your body type."
              onClick={() => handleToolClick("weight-gain-guide")}
              bgColor="bg-green-100"
            />
            <ToolCard
              icon={<Activity className="h-6 w-6 text-purple-600" />}
              title="Exercise Log"
              description="Log and monitor your daily physical activity."
              onClick={() => handleToolClick("exercise-log")}
              bgColor="bg-purple-100"
            />
            <ToolCard
              icon={<Footprints className="h-6 w-6 text-orange-600" />}
              title="Kick Counter"
              description="Monitor baby's movements for peace of mind."
              onClick={() => handleToolClick("kick-counter")}
              bgColor="bg-orange-100"
            />
            <ToolCard
              icon={<Timer className="h-6 w-6 text-pink-400" />}
              title="Contraction Timer"
              description="Precision timing for when labor begins."
              onClick={() => handleToolClick("contraction-timer")}
              bgColor="bg-pink-50"
            />
            <ToolCard
              icon={<Utensils className="h-6 w-6 text-rose-500" />}
              title="Meal Plans"
              description="Nutritionist-approved pregnancy meal guides."
              onClick={() => handleToolClick("meal-plans")}
              bgColor="bg-rose-100"
            />
            <ToolCard
              icon={<Baby className="h-6 w-6 text-blue-500" />}
              title="Gender Predictor"
              description="Traditional methods for a fun prediction."
              onClick={() => handleToolClick("gender-predictor")}
              bgColor="bg-blue-100"
            />
            <ToolCard
              icon={<Smile className="h-6 w-6 text-amber-500" />}
              title="Mood Tracker"
              description="Track your emotional well-being each day."
              onClick={() => handleToolClick("moods-tracker")}
              bgColor="bg-amber-100"
            />
            <ToolCard
              icon={<FileText className="h-6 w-6 text-indigo-600" />}
              title="Pregnancy Journal"
              description="Document special moments and thoughts."
              onClick={() => handleToolClick("note-writer")}
              bgColor="bg-indigo-100"
            />
            <ToolCard
              icon={<Stethoscope className="h-6 w-6 text-cyan-600" />}
              title="Doctor Prep"
              description="Prepare checklists for your prenatal visits."
              onClick={() => handleToolClick("doctor-visit-prep")}
              bgColor="bg-cyan-100"
            />
            <ToolCard
              icon={<ShieldAlert className="h-6 w-6 text-red-500" />}
              title="Red Flags"
              description="Identify emergency vs. normal symptoms."
              onClick={() => handleToolClick("red-flag-symptoms")}
              bgColor="bg-red-50"
            />
            <ToolCard
              icon={<Brain className="h-6 w-6 text-violet-600" />}
              title="Clinical Insights"
              description="Doctor-level explanations for symptoms."
              onClick={() => handleToolClick("why-this-why-now")}
              bgColor="bg-violet-100"
            />
           
          </div>
        </div>
      );
  }
}
