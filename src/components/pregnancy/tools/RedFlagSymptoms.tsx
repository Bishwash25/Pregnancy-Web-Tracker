import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Activity,
  ShieldCheck,
  Phone,
  Info,
  ChevronRight,
  ChevronLeft,
  Heart,
  Stethoscope,
  Waves,
  Zap
} from "lucide-react";
import { redFlagRules, SymptomRule, redFlagGeneralInfo } from "@/data/redFlagSymptoms";
import { differenceInWeeks } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface RedFlagSymptomsProps {
  onBack: () => void;
}

type Step = "intro" | "emergency" | "normal" | "fetal" | "analyzing" | "results";

export default function RedFlagSymptoms({ onBack }: RedFlagSymptomsProps) {
  const [step, setStep] = useState<Step>("intro");
  const [weeks, setWeeks] = useState<number>(12);
  const [currentTrimester, setCurrentTrimester] = useState<number>(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [fetalKicks, setFetalKicks] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPregnancyData = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const lpDate = data.lastPeriodDate instanceof Timestamp
              ? data.lastPeriodDate.toDate()
              : new Date(data.lastPeriodDate);

            const calculatedWeeks = differenceInWeeks(new Date(), lpDate);
            setWeeks(calculatedWeeks);

            if (calculatedWeeks < 13) setCurrentTrimester(1);
            else if (calculatedWeeks <= 27) setCurrentTrimester(2);
            else setCurrentTrimester(3);
          }
        } catch (error) {
          console.error("Error fetching pregnancy data:", error);
        }
      }
    };
    fetchPregnancyData();
  }, [user]);

  const getTrimesterRules = () => {
    switch (currentTrimester) {
      case 1: return redFlagRules.trimester1;
      case 2: return redFlagRules.trimester2;
      case 3: return redFlagRules.trimester3;
      default: return redFlagRules.trimester1;
    }
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const evaluateRisk = () => {
    const findings: SymptomRule[] = [];
    redFlagRules.universal.forEach(rule => {
      if (selectedSymptoms.includes(rule.id)) findings.push(rule);
    });
    const trimesterRules = getTrimesterRules();
    trimesterRules.forEach(rule => {
      if (selectedSymptoms.includes(rule.id)) findings.push(rule);
    });
    if (weeks >= 24 && fetalKicks) {
      const kicks = parseInt(fetalKicks);
      if (!isNaN(kicks) && kicks < redFlagRules.fetalMovementStrick.minKicks) {
        findings.push({
          id: "fetal_movement_low",
          label: "Reduced Fetal Movement",
          severity: redFlagRules.fetalMovementStrick.severity,
          action: redFlagRules.fetalMovementStrick.action,
          medicalReason: redFlagRules.fetalMovementStrick.medicalReason,
          requiresImmediate: true
        });
      }
    }
    return findings;
  };

  const findings = evaluateRisk();
  const isEmergency = findings.some(f => f.severity === "Emergency");
  const isMonitor = findings.some(f => f.severity === "Monitor");
  const isNormal = findings.length > 0 && findings.every(f => f.severity === "Normal");

  const startAnalysis = () => {
    setStep("analyzing");
    setTimeout(() => setStep("results"), 2500);
  };

  const nextStep = () => {
    if (step === "intro") setStep("emergency");
    else if (step === "emergency") setStep("normal");
    else if (step === "normal") {
      if (weeks >= 24) setStep("fetal");
      else startAnalysis();
    } else if (step === "fetal") startAnalysis();
  };

  const prevStep = () => {
    if (step === "emergency") setStep("intro");
    else if (step === "normal") setStep("emergency");
    else if (step === "fetal") setStep("normal");
    else if (step === "results") setStep("intro");
  };

  const emergencySymptoms = [...redFlagRules.universal, ...getTrimesterRules()].filter(r => r.severity !== "Normal");
  const normalVariations = [...redFlagRules.universal, ...getTrimesterRules()].filter(r => r.severity === "Normal");

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-xl w-full text-center space-y-8"
          >
            <div className="space-y-4">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-inner">
                <ShieldAlert className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Symptom Analysis</h1>
              <p className="text-gray-600 text-lg">
                Let's check how you're feeling. This medically-backed tool helps you distinguish between normal changes and emergency signs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium">YOUR CURRENT STATUS</p>
                <p className="text-xl font-bold text-teal-600">Week {weeks}</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100" />
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">TRIMESTER</p>
                <p className="text-xl font-bold text-teal-600">
                  {currentTrimester === 1 ? '1st' : currentTrimester === 2 ? '2nd' : '3rd'}
                </p>
              </div>
            </div>

            <Button
              onClick={nextStep}
              className="w-full h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
            >
              Start My Analysis
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center justify-center mx-auto">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tools
            </button>
          </motion.div>
        )}

        {step === "emergency" && (
          <motion.div
            key="emergency"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl w-full space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                Any Emergency Signs?
              </h2>
              <p className="text-gray-600">Select any symptoms you are currently experiencing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencySymptoms.map(rule => (
                <div
                  key={rule.id}
                  onClick={() => toggleSymptom(rule.id)}
                  className={`
                    p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3
                    ${selectedSymptoms.includes(rule.id)
                      ? 'border-red-500 bg-red-50 text-red-900 shadow-md'
                      : 'border-gray-100 bg-white hover:border-red-200 hover:bg-red-50/30 text-gray-700'}
                  `}
                >
                  <div className={`
                    flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center
                    ${selectedSymptoms.includes(rule.id) ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300'}
                  `}>
                    {selectedSymptoms.includes(rule.id) && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <span className="font-medium text-sm sm:text-base">{rule.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-12 rounded-xl">Back</Button>
              <Button onClick={nextStep} className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800">Next</Button>
            </div>
          </motion.div>
        )}

        {step === "normal" && (
          <motion.div
            key="normal"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl w-full space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Info className="h-6 w-6 text-teal-500" />
                Common Changes?
              </h2>
              <p className="text-gray-600">Are you noticing any of these common pregnancy sensations?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {normalVariations.map(rule => (
                <div
                  key={rule.id}
                  onClick={() => toggleSymptom(rule.id)}
                  className={`
                    p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3
                    ${selectedSymptoms.includes(rule.id)
                      ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-md'
                      : 'border-gray-100 bg-white hover:border-teal-200 hover:bg-teal-50/30 text-gray-700'}
                  `}
                >
                  <div className={`
                    flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center
                    ${selectedSymptoms.includes(rule.id) ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-300'}
                  `}>
                    {selectedSymptoms.includes(rule.id) && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <span className="font-medium text-sm sm:text-base">{rule.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-12 rounded-xl">Back</Button>
              <Button onClick={nextStep} className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800">
                {weeks >= 24 ? "Next" : "Analyze My Symptoms"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "fetal" && (
          <motion.div
            key="fetal"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-xl w-full space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
                <Waves className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Baby's Movement</h2>
              <p className="text-gray-600 leading-relaxed">
                At {weeks} weeks, monitoring baby's movement is vital. How many kicks or movements have you felt in the last 2 hours?
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Number of movements"
                value={fetalKicks}
                onChange={(e) => setFetalKicks(e.target.value)}
                className="h-16 text-2xl text-center rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-center text-blue-600 font-medium bg-blue-50 p-3 rounded-xl border border-blue-100">
                A healthy count is typically 10 or more movements in a 2-hour window.
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-12 rounded-xl">Back</Button>
              <Button onClick={startAnalysis} className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-lg">Analyze Now</Button>
            </div>
          </motion.div>
        )}

        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: 360,
                  borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-slate-900 flex items-center justify-center text-white"
              >
                <Stethoscope className="h-12 w-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-slate-900 rounded-full -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Analyzing Your Symptoms...</h2>
              <p className="text-gray-500 animate-pulse">Running medically-backed cross-references</p>
            </div>
            <div className="max-w-xs mx-auto space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Checking Trimester Context
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Verifying Red Flag Markers
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Processing Fetal Data
              </div>
            </div>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl w-full"
          >
            {findings.length > 0 ? (
              <Card className={`border-0 shadow-2xl overflow-hidden rounded-3xl ${isEmergency ? 'ring-4 ring-red-100' : isNormal ? 'ring-4 ring-teal-100' : 'ring-4 ring-yellow-100'
                }`}>
                <div className={`p-8 text-white text-center ${isEmergency ? 'bg-red-600' : isNormal ? 'bg-teal-600' : 'bg-yellow-500'
                  }`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    {isEmergency ? (
                      <ShieldAlert className="h-20 w-20 mx-auto mb-4" />
                    ) : isNormal ? (
                      <ShieldCheck className="h-20 w-20 mx-auto mb-4" />
                    ) : (
                      <AlertCircle className="h-20 w-20 mx-auto mb-4" />
                    )}
                  </motion.div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">
                    {isEmergency ? "Action Required" : isNormal ? "All Looks Good" : "Needs Monitoring"}
                  </h2>
                  <p className="text-white/90 text-lg font-medium mt-2">
                    {isEmergency ? "Please Consult Your Care Provider" : isNormal ? "Standard Pregnancy Variations" : "Keep a Close Eye on Symptoms"}
                  </p>
                </div>

                <CardContent className="p-8 space-y-8 bg-white">
                  <div className="space-y-4">
                    {findings.map((finding, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex gap-5 p-6 rounded-2xl border-2 ${finding.severity === 'Emergency' ? 'bg-red-50 border-red-100' :
                            finding.severity === 'Normal' ? 'bg-teal-50 border-teal-100' :
                              'bg-yellow-50 border-yellow-100'
                          }`}
                      >
                        <div className="mt-1 flex-shrink-0">
                          {finding.severity === "Emergency" ? (
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          ) : finding.severity === "Normal" ? (
                            <CheckCircle2 className="h-6 w-6 text-teal-600" />
                          ) : (
                            <Info className="h-6 w-6 text-yellow-600" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold text-gray-900">{finding.label}</h4>
                          <p className="text-gray-700 leading-relaxed">
                            <span className="font-semibold">What it means:</span> {finding.medicalReason}
                          </p>
                          {finding.normalInfo && (
                            <div className="mt-3 bg-white/60 p-4 rounded-xl border border-dashed border-gray-200">
                              <p className="text-sm font-medium text-gray-600">
                                <span className="text-teal-700 font-bold uppercase text-[10px] tracking-widest block mb-1">Knowledge Hub</span>
                                {finding.normalInfo}
                              </p>
                            </div>
                          )}
                          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm ${finding.severity === 'Emergency' ? 'bg-red-600 text-white' :
                              finding.severity === 'Normal' ? 'bg-teal-600 text-white' :
                                'bg-yellow-600 text-white'
                            }`}>
                            <Zap className="h-4 w-4" />
                            {finding.action}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm text-gray-600 space-y-3">
                    <p className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider text-xs">
                      <Stethoscope className="h-4 w-4 text-teal-600" />
                      Medical Disclaimer
                    </p>
                    <p className="leading-relaxed italic">{redFlagGeneralInfo.disclaimer}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => setStep("intro")}
                      variant="outline"
                      className="flex-1 h-14 rounded-2xl text-lg font-semibold border-2"
                    >
                      New Analysis
                    </Button>
                    <button onClick={onBack} className="flex-1 h-14 rounded-2xl text-lg font-semibold border-2"> Back</button>
                    
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden ring-4 ring-green-100">
                <div className="bg-green-600 p-12 text-white text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                  >
                    <Heart className="h-24 w-24 mx-auto mb-6 fill-white/20" />
                  </motion.div>
                  <h2 className="text-4xl font-black uppercase tracking-tight">System Normal</h2>
                  <p className="text-white/90 text-xl font-medium mt-2">No danger signs detected.</p>
                </div>
                <CardContent className="p-12 text-center space-y-8 bg-white">
                  <div className="max-w-md mx-auto space-y-6">
                    <p className="text-gray-600 text-lg leading-relaxed italic">
                      "A healthy pregnancy involves many changes. Based on your inputs, your body is adapting as expected."
                    </p>
                    <div className="bg-green-50 text-green-800 p-6 rounded-3xl text-lg font-semibold border-2 border-green-100 shadow-sm">
                      Continue your daily care routine and keep shining! ✨
                    </div>
                  </div>
                  <Button
                    onClick={() => setStep("intro")}
                    className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-lg font-bold"
                  >
                    Done
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
