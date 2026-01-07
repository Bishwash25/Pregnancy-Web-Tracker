import React, { useEffect, useState } from "react";
import { format, differenceInDays, differenceInWeeks } from "date-fns";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Baby, Info, ChevronRight, Calendar, Heart, Key, Sparkles, Activity, Star, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { fetchDashboardSnapshot } from "@/services/dashboardApi";
import { DashboardSnapshot, clinicalPregnancyDataset, ClinicalWeekData, actionPregnancyDataset, ActionWeekData } from "@/data/pregnancyDashboardData";
import { SmartFocusCard } from "./SmartFocusCard";
import { MaternalFetalVisualization } from "./MaternalFetalVisualization";

export default function PregnancyDashboard() {
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [weeksPregnant, setWeeksPregnant] = useState(0);
  const [daysPregnant, setDaysPregnant] = useState(0);
  const [daysToGo, setDaysToGo] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const { user } = useAuth();
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [lastInteractionDate, setLastInteractionDate] = useState<Date | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const computeAndSetProgress = async (lastPeriod: Date, due: Date) => {
    setLastPeriodDate(lastPeriod);
    setDueDate(due);

    const today = new Date();
    const totalWeeks = differenceInWeeks(today, lastPeriod);
    const exactDays = differenceInDays(today, lastPeriod);
    const remainingDays = exactDays % 7;
    const daysRemaining = differenceInDays(due, today);

    let displayWeeks = totalWeeks;
    let displayDays = remainingDays;

    if ((totalWeeks === 41 && remainingDays >= 6) ||
      (totalWeeks === 41 && remainingDays === 0 && exactDays >= 294)) {
      displayWeeks = 42;
      displayDays = 0;
    }

    if (displayWeeks > 42) {
      displayWeeks = 42;
      displayDays = 0;
    }

    setWeeksPregnant(displayWeeks);
    setDaysPregnant(displayDays);
    setDaysToGo(Math.max(0, 280 - exactDays));
    setProgressPercentage(Math.min((exactDays / 280) * 100, 100));

    const data = await fetchDashboardSnapshot(displayWeeks);
    setSnapshot(data);
  };

  useEffect(() => {
    const storedLastInteraction = localStorage.getItem("lastInteractionDate");
    if (storedLastInteraction) {
      setLastInteractionDate(new Date(storedLastInteraction));
    }
    localStorage.setItem("lastInteractionDate", new Date().toISOString());

    let unsubscribe: (() => void) | undefined;
    const LocalStorageFallback = () => {
      const storedLastPeriodDate = localStorage.getItem("lastPeriodDate");
      const storedDueDate = localStorage.getItem("dueDate");
      if (storedLastPeriodDate && storedDueDate) {
        const lastPeriod = new Date(storedLastPeriodDate);
        const due = new Date(storedDueDate);
        computeAndSetProgress(lastPeriod, due);
        window.dispatchEvent(new Event("pregnancyDataUpdate"));
      }
    };

    if (user?.uid) {
      const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
      unsubscribe = onSnapshot(pregnancyDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as {
            lastPeriodDate?: Timestamp | string;
            dueDate?: Timestamp | string;
          };
          const lp = data.lastPeriodDate instanceof Timestamp ? data.lastPeriodDate.toDate() : (data.lastPeriodDate ? new Date(data.lastPeriodDate) : null);
          const dd = data.dueDate instanceof Timestamp ? data.dueDate.toDate() : (data.dueDate ? new Date(data.dueDate) : null);
          if (lp && dd) {
            localStorage.setItem("lastPeriodDate", lp.toISOString());
            localStorage.setItem("dueDate", dd.toISOString());
            void computeAndSetProgress(lp, dd);
            window.dispatchEvent(new Event("pregnancyDataUpdate"));
            return;
          }
        }
        LocalStorageFallback();
      }, () => {
        void LocalStorageFallback();
      });
    } else {
      LocalStorageFallback();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!lastPeriodDate || !dueDate) return;
    void computeAndSetProgress(lastPeriodDate, dueDate);
    const intervalId = setInterval(() => {
      void computeAndSetProgress(lastPeriodDate, dueDate);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [lastPeriodDate?.getTime?.(), dueDate?.getTime?.()]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      <motion.div variants={itemVariants}>
        {/* Header with Due Date */}
        <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-white/80 to-pink-50/50 backdrop-blur-xl border border-white/20 shadow-2xl shadow-pink-100/20">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-24 h-24 text-pink-500" />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 relative z-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {(() => {
                    let name = "User";
                    if (user?.name && user.name.trim().length > 0) {
                      name = user.name;
                    } else {
                      try {
                        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
                        if (localUser.name && localUser.name.trim().length > 0) {
                          name = localUser.name;
                        }
                      } catch { }
                    }
                    return `Welcome back, ${name}`;
                  })()}
                </span>
              </h1>

            </div>

            {dueDate && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/40 shadow-xl shadow-pink-100/10"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expected Due Date</span>
                  <div className="text-lg font-bold text-slate-900">
                    {format(dueDate, 'MMMM d, yyyy')}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>


      {/* Current Week Quick View */}
      <motion.div variants={itemVariants} className="px-1">
        <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-pink-300" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Current Week</span>
          </div>
          <span className="text-2xl font-black tabular-nums">
            {weeksPregnant || "0"} <span className="text-sm font-bold text-white/40 uppercase">of 40</span>
          </span>
        </div>
      </motion.div>


      <motion.div variants={itemVariants} className="px-1">
        <SmartFocusCard
          weeksPregnant={weeksPregnant}
          daysPregnant={daysPregnant}
          lastInteractionDate={lastInteractionDate}
        />
      </motion.div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Core Stats */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
          <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border-white/20 shadow-2xl shadow-pink-100/20 rounded-[2.5rem] p-6 sm:p-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-20" />
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6 sm:mb-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    strokeDasharray="282.7"
                    initial={{ strokeDashoffset: 282.7 }}
                    animate={{ strokeDashoffset: 282.7 - (282.7 * progressPercentage / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl sm:text-5xl font-black text-slate-900"
                  >
                    {weeksPregnant}
                  </motion.span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Weeks</span>
                  <div className="mt-2 px-3 py-1 bg-pink-100/50 rounded-full">
                    <span className="text-[10px] sm:text-xs font-bold text-pink-600">+{daysPregnant} Days</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 w-full">
                {[
                  { label: "Current Trimester", value: weeksPregnant <= 12 ? "First" : weeksPregnant >= 13 && weeksPregnant <= 27 ? "Second" : "Third", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: weeksPregnant >= 42 ? "Days Completed" : "Days to Delivery", value: weeksPregnant >= 42 ? 0 : Math.abs(daysToGo), icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Overall Progress", value: `${Math.round(progressPercentage)}%`, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-slate-500">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Column: Development & Insights */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/60 backdrop-blur-xl border-white/20 shadow-2xl shadow-pink-100/20 rounded-[2.5rem]">
              <CardHeader className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-b border-white/20 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-pink-100/50">
                      <Baby className="h-6 w-6 text-pink-500" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900">Baby Development</CardTitle>

                    </div>
                  </div>

                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center mb-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                  <div className="relative">
                    <div className="absolute inset-0 bg-pink-200 blur-2xl opacity-20" />
                    <div className="relative bg-white rounded-full p-8 shadow-xl shadow-pink-100/50">
                      <motion.div
                        animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <span role="img" aria-label="baby size" className="text-5xl">
                          {snapshot?.currentFruit.emoji ?? "🌸"}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-1">Current Size Comparison</div>
                    <div className="text-2xl font-black text-slate-900 mb-2">
                      {snapshot?.currentFruit.name.toLowerCase() === "baby"
                        ? "Your baby is ready for birth! 🎉"
                        : `Size of a ${snapshot?.currentFruit.name ?? "Poppy Seed"}`}
                    </div>
                    <p className="text-slate-500 font-medium">
                      Development information based on clinical averages for this stage.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Length (Head to Toe)</div>
                    <div className="text-3xl font-black text-pink-600">
                      {snapshot?.babySize.lengthCm}
                      <span className="ml-2 text-base font-bold opacity-60">
                        ({snapshot?.babySize.lengthIn})
                      </span>
                    </div>
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Weight</div>
                    <div className="text-3xl font-black text-pink-600">
                      {snapshot?.babySize.weightG}
                      <span className="ml-2 text-base font-bold opacity-60">
                        ({snapshot?.babySize.weightLb})
                      </span>
                    </div>
                  </div>
                </div>

                {weeksPregnant >= 40 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <Alert className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none shadow-xl shadow-pink-200 rounded-3xl p-6">
                      <Heart className="h-6 w-6 text-white animate-pulse" />
                      <AlertDescription className="text-lg font-bold ml-4">
                        Congratulations! Your pregnancy has reached full term. ❤️
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-2xl shadow-pink-100/20 rounded-[2.5rem]">
              <CardHeader className="p-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Info className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Your Body This Week</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Physiological changes & insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                {(() => {
                  const clinicalData = [...clinicalPregnancyDataset.weeks]
                    .reverse()
                    .find((d) => d.week <= weeksPregnant) || clinicalPregnancyDataset.weeks[0];

                  if (!clinicalData) return null;

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: "Uterus", value: clinicalData.uterus },
                          { label: "Circulation", value: clinicalData.circulation },
                          { label: "Musculoskeletal", value: clinicalData.musculoskeletal },
                          { label: "Other Changes", value: clinicalData.other_changes }
                        ].map((item, idx) => (
                          <div key={idx} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">{item.label}</span>
                            <p className="text-slate-700 font-medium leading-relaxed">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {clinicalData.warnings && clinicalData.warnings !== "None specific." && (
                        <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Medical Red Flags</span>
                          </div>
                          <p className="text-red-800 font-semibold">{clinicalData.warnings}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Maternal-Fetal Visualization Section */}
      <motion.div variants={itemVariants} className="px-1">
        <MaternalFetalVisualization snapshot={snapshot} weeksPregnant={weeksPregnant} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-white/60 backdrop-blur-xl border-white/20 shadow-2xl shadow-pink-100/20 rounded-[2.5rem]">
            <CardHeader className="p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">To-Do & Guidance</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Recommended actions for Week {weeksPregnant}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              {(() => {
                const displayData = actionPregnancyDataset.find(d => d.week === (weeksPregnant > 42 ? 42 : weeksPregnant));
                if (!displayData) return null;

                return (
                  <>
                    <div className="space-y-3">
                      {displayData.what_to_do.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                          <span className="text-slate-700 font-semibold">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                      <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Clinical Context</h4>
                      <p className="text-blue-900 font-medium leading-relaxed">{displayData.medical_reason}</p>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full bg-white/60 backdrop-blur-xl border-white/20 shadow-2xl shadow-pink-100/20 rounded-[2.5rem]">
            <CardHeader className="p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center">
                  <Key className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">Key Insights</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Internal metrics & fetal position</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[

                  { label: "Amniotic Fluid", value: snapshot?.medicalInsights?.amnioticFluid }
                ].map((insight, idx) => (
                  <div key={idx} className="p-5 bg-pink-50/50 rounded-2xl border border-pink-100/50">
                    <span className="text-xs font-black text-pink-400 uppercase tracking-widest block mb-1">{insight.label}</span>
                    <span className="text-lg font-bold text-slate-900">{insight.value || "Calculating..."}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { label: "Organ Development", value: snapshot?.milestones?.organ },
                  { label: "Sensory Development", value: snapshot?.milestones?.sensory },

                ].map((milestone, idx) => (
                  <div key={idx} className="flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{milestone.label}</span>
                    <span className="text-slate-800 font-bold">{milestone.value || "Coming soon"}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="pt-8">
        <div className="text-center p-8 bg-slate-50/50 rounded-[3rem] border border-slate-200/50">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Medical References: ACOG (2020)</span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">WHO Maternal Guidelines</span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Mayo Clinic Fetal Dataset</span>
          </div>
          <p className="text-sm font-bold text-slate-400 max-w-2xl mx-auto italic">
            Disclaimer: This dashboard is for educational tracking purposes only and does not constitute medical advice.
            Always consult with your healthcare professional for clinical decisions.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
