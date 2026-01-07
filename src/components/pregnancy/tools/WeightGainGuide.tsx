import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, getDocs, query, orderBy, limit, doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Scale,
  Calculator,
  Target,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Zap,
  ShieldCheck,
  TrendingUp,
  Ruler,
  Stethoscope,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { differenceInWeeks } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

interface WeightGainRecommendation {
  category: string;
  bmiRange: string;
  totalGain: string;
  totalGainKg: string;
  firstTrimester: string;
  secondTrimesterRate: string;
  thirdTrimesterRate: string;
  risksIfLow: string[];
  risksIfHigh: string[];
  sources: string[];
}

type Step = "intro" | "inputs" | "analyzing" | "results";

export default function WeightGainGuide({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [prePregnancyWeight, setPrePregnancyWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [recommendation, setRecommendation] = useState<WeightGainRecommendation | null>(null);
  const [currentBMI, setCurrentBMI] = useState<number | null>(null);
  const [targetWeightRange, setTargetWeightRange] = useState<{ min: number; max: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [weeks, setWeeks] = useState<number>(12);
  const [currentTrimester, setCurrentTrimester] = useState<number>(1);

  // New state for single record limit
  const [showOneRecordDialog, setShowOneRecordDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  const { toast } = useToast();
  const { user } = useAuth();

  const calculateBMI = (weight: number, heightInCm: number): number => {
    const heightInM = heightInCm / 100;
    return parseFloat((weight / (heightInM * heightInM)).toFixed(1));
  };

  const getWeightGainRecommendation = (bmi: number): WeightGainRecommendation => {
    if (bmi < 18.5) {
      return {
        category: "Underweight",
        bmiRange: "< 18.5 kg/m²",
        totalGain: "28-40 lbs",
        totalGainKg: "12.5-18 kg",
        firstTrimester: "1-2 kg",
        secondTrimesterRate: "0.5 kg/week",
        thirdTrimesterRate: "0.5 kg/week",
        risksIfLow: [
          "Low birth weight",
          "Preterm birth",
          "Poor fetal growth"
        ],
        risksIfHigh: [
          "Gestational diabetes",
          "High blood pressure"
        ],
        sources: ["Canada.ca", "CDC"]
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        category: "Normal Weight",
        bmiRange: "18.5-24.9 kg/m²",
        totalGain: "25-35 lbs",
        totalGainKg: "11.5-16 kg",
        firstTrimester: "1-2 kg",
        secondTrimesterRate: "0.4 kg/week",
        thirdTrimesterRate: "0.4 kg/week",
        risksIfLow: [
          "Low birth weight",
          "Preterm birth"
        ],
        risksIfHigh: [
          "Gestational diabetes",
          "Large for gestational age"
        ],
        sources: ["CDC", "ACOG"]
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        category: "Overweight",
        bmiRange: "25.0-29.9 kg/m²",
        totalGain: "15-25 lbs",
        totalGainKg: "6.8-11.3 kg",
        firstTrimester: "1-2 kg",
        secondTrimesterRate: "0.3 kg/week",
        thirdTrimesterRate: "0.3 kg/week",
        risksIfLow: [
          "Nutritional deficiencies",
          "Reduced maternal reserves"
        ],
        risksIfHigh: [
          "Gestational diabetes",
          "Increased cesarean risk"
        ],
        sources: ["ACOG", "CDC"]
      };
    } else {
      return {
        category: "Obese",
        bmiRange: "≥ 30.0 kg/m²",
        totalGain: "11-20 lbs",
        totalGainKg: "5-9 kg",
        firstTrimester: "1-2 kg",
        secondTrimesterRate: "0.23 kg/week",
        thirdTrimesterRate: "0.23 kg/week",
        risksIfLow: [
          "Early birth",
          "Growth restriction"
        ],
        risksIfHigh: [
          "Long-term obesity risk",
          "Metabolic complications"
        ],
        sources: ["ACOG", "CDC"]
      };
    }
  };

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

    const fetchLatestRecord = async () => {
      try {
        const userId = user?.uid;
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const q = query(
          collection(db, `users/${userId}/gain`),
          orderBy('createdAt', 'desc'),
          limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setRecords(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          const latestRecord = querySnapshot.docs[0].data();

          let displayWeight = latestRecord.weight;
          let displayHeight = latestRecord.height;

          if (latestRecord.unit === 'lbs') {
            displayWeight = (displayWeight * 2.20462).toFixed(1);
          }
          if (latestRecord.heightUnit === 'ft') {
            displayHeight = (displayHeight / 30.48).toFixed(1);
          }

          setPrePregnancyWeight(displayWeight.toString());
          setHeight(displayHeight.toString());
          setUnit(latestRecord.unit);
          setHeightUnit(latestRecord.heightUnit);

          const bmi = calculateBMI(latestRecord.weight, latestRecord.height);
          setCurrentBMI(bmi);
          const rec = getWeightGainRecommendation(bmi);
          setRecommendation(rec);

          const weightGainRange = bmi < 18.5 ? { min: 12.5, max: 18 } :
            bmi < 25 ? { min: 11.5, max: 16 } :
              bmi < 30 ? { min: 6.8, max: 11.3 } : { min: 5, max: 9 };

          setTargetWeightRange({
            min: parseFloat((latestRecord.weight + weightGainRange.min).toFixed(1)),
            max: parseFloat((latestRecord.weight + weightGainRange.max).toFixed(1))
          });

          setHasExistingData(true);
          setStep("results");
        }
      } catch (error) {
        console.error("Error fetching record:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPregnancyData();
    fetchLatestRecord();
  }, [user]);

  const handleCalculate = async () => {
    if (!prePregnancyWeight || !height) {
      toast({ description: "Please enter both weight and height", variant: "destructive" });
      return;
    }

    const weightValue = parseFloat(prePregnancyWeight);
    const heightValue = parseFloat(height);

    if (isNaN(weightValue) || isNaN(heightValue)) {
      toast({ description: "Please enter valid numerical values", variant: "destructive" });
      return;
    }

    const minWeight = unit === 'kg' ? 45 : 100;
    const maxWeight = unit === 'kg' ? 93 : 200;

    let minHeight, maxHeight;
    if (heightUnit === 'cm') {
      minHeight = 140;
      maxHeight = 200;
    } else {
      minHeight = 4.58;
      maxHeight = 6.58;
    }

    if (weightValue < minWeight || weightValue > maxWeight) {
      toast({
        description: `Weight must be between ${minWeight} and ${maxWeight} ${unit}`,
        variant: "destructive"
      });
      return;
    }

    if (heightValue < minHeight || heightValue > maxHeight) {
      toast({
        description: `Height must be between ${minHeight} and ${maxHeight} ${heightUnit}`,
        variant: "destructive"
      });
      return;
    }

    let weightInKg = weightValue;
    let heightInCm = heightValue;

    if (unit === 'lbs') weightInKg = weightValue / 2.20462;
    if (heightUnit === 'ft') heightInCm = heightValue * 30.48;

    setStep("analyzing");

    try {
      const bmi = calculateBMI(weightInKg, heightInCm);
      setCurrentBMI(bmi);
      const rec = getWeightGainRecommendation(bmi);
      setRecommendation(rec);

      const userId = getAuth().currentUser?.uid;
      if (userId) {
        const recordId = editingId || Date.now().toString();
        const recordRef = doc(db, `users/${userId}/gain`, recordId);

        await setDoc(recordRef, {
          weight: weightInKg,
          height: heightInCm,
          unit,
          heightUnit,
          updatedAt: Timestamp.now(),
          ...(editingId ? {} : { createdAt: Timestamp.now() })
        }, { merge: true });
      }

      const weightGainRange = bmi < 18.5 ? { min: 12.5, max: 18 } :
        bmi < 25 ? { min: 11.5, max: 16 } :
          bmi < 30 ? { min: 6.8, max: 11.3 } : { min: 5, max: 9 };

      setTargetWeightRange({
        min: parseFloat((weightInKg + weightGainRange.min).toFixed(1)),
        max: parseFloat((weightInKg + weightGainRange.max).toFixed(1))
      });

      setTimeout(() => setStep("results"), 2500);
    } catch (error) {
      setStep("inputs");
      toast({ description: "Failed to calculate. Please try again.", variant: "destructive" });
    }
  };

  const handleStartClick = () => {
    if (hasExistingData) {
      setShowOneRecordDialog(true);
    } else {
      setEditingId(null);
      setStep("inputs");
    }
  };

  const handleUpdateExisting = () => {
    if (records.length > 0) {
      const latest = records[0];
      setEditingId(latest.id);
      // Data is already in state from fetchLatestRecord, but making sure:
      setStep("inputs");
      setShowOneRecordDialog(false);
    }
  };

  const handleStartFresh = async () => {
    const userId = user?.uid;
    if (userId) {
      try {
        // Delete existing records in this collection
        for (const record of records) {
          await deleteDoc(doc(db, `users/${userId}/gain`, record.id));
        }
        setRecords([]);
        setHasExistingData(false);
      } catch (e) {
        console.error("Error deleting:", e);
      }
    }
    setEditingId(null);
    setPrePregnancyWeight("");
    setHeight("");
    setStep("inputs");
    setShowOneRecordDialog(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
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
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-pink-600 shadow-inner">
                <TrendingUp className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Weight Gain Guide</h1>
              <p className="text-gray-600 text-lg">
                Understand your healthy weight gain targets based on your pre-pregnancy BMI. This guide follows clinical standards for a safe pregnancy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">YOUR CURRENT STATUS</p>
                <p className="text-xl font-bold text-pink-600">Week {weeks}</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100" />
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">TRIMESTER</p>
                <p className="text-xl font-bold text-pink-600">
                  {currentTrimester === 1 ? '1st' : currentTrimester === 2 ? '2nd' : '3rd'}
                </p>
              </div>
            </div>

            <Button
              onClick={handleStartClick}
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

        {step === "inputs" && (
          <motion.div
            key="inputs"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-xl w-full space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Scale className="h-6 w-6 text-pink-500" />
                Pre-Pregnancy Profile
              </h2>
              <p className="text-gray-600">Enter your starting details for accurate targets.</p>
            </div>

            <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden ring-1 ring-gray-100">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      Pre-pregnancy Weight
                    </label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => setUnit('kg')}
                        className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${unit === 'kg' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400'}`}
                      >KG</button>
                      <button
                        onClick={() => setUnit('lbs')}
                        className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${unit === 'lbs' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400'}`}
                      >LBS</button>
                    </div>
                  </div>
                  <Input
                    type="number"
                    value={prePregnancyWeight}
                    onChange={(e) => setPrePregnancyWeight(e.target.value)}
                    placeholder="00.0"
                    min={unit === 'kg' ? 45 : 100}
                    max={unit === 'kg' ? 93 : 200}
                    className="h-16 text-3xl rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-pink-500 text-center font-black"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      Your Height
                    </label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => setHeightUnit('cm')}
                        className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${heightUnit === 'cm' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                      >CM</button>
                      <button
                        onClick={() => setHeightUnit('ft')}
                        className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${heightUnit === 'ft' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                      >FT</button>
                    </div>
                  </div>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={heightUnit === 'cm' ? "165" : "5.5"}
                    min={heightUnit === 'cm' ? 140 : 4.58}
                    max={heightUnit === 'cm' ? 200 : 6.58}
                    className="h-16 text-3xl rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-blue-500 text-center font-black"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep("intro")} className="flex-1 h-14 rounded-2xl text-lg font-semibold border-2">
                Back
              </Button>
              <Button onClick={handleCalculate} className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-lg font-bold shadow-xl">
                Analyze Profile
              </Button>
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
              <h2 className="text-2xl font-bold text-gray-900">Calculating Recommendations...</h2>
              <p className="text-gray-500 animate-pulse">Mapping clinical growth standards</p>
            </div>
            <div className="max-w-xs mx-auto space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Computing Starting BMI
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Cross-referencing Guidelines
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Mapping Growth Trimesters
              </div>
            </div>
          </motion.div>
        )}


        {step === "results" && recommendation && currentBMI && targetWeightRange && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl w-full"
          >
            <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl ring-4 ring-pink-50">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white text-center relative overflow-hidden">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="relative z-10"
                >
                  <ShieldCheck className="h-20 w-20 mx-auto mb-4 opacity-90" />
                </motion.div>
                <h2 className="text-3xl font-black uppercase tracking-tight relative z-10">Healthy Growth Strategy</h2>
                <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-bold mt-2 relative z-10">
                  BMI: {currentBMI} ({recommendation.category})
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-900/10 rounded-full -ml-16 -mb-16 blur-2xl" />
              </div>

              <CardContent className="p-8 space-y-8 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-blue-50 border-2 border-blue-100 text-center">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Total Target Gain</p>
                    <p className="text-3xl font-black text-blue-900">{recommendation.totalGain}</p>
                    <p className="text-sm font-bold text-blue-700/70">{recommendation.totalGainKg}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-teal-50 border-2 border-teal-100 text-center">
                    <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1">Final Weight Range</p>
                    <p className="text-2xl font-black text-teal-900">
                      {targetWeightRange.min} - {targetWeightRange.max} {unit.toUpperCase()}
                    </p>
                    <p className="text-sm font-bold text-teal-700/70">Estimated Delivery Weight</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-pink-500" /> Trimester Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trimester 1</p>
                      <p className="text-lg font-bold text-gray-800">{recommendation.firstTrimester}</p>
                      <p className="text-[10px] text-gray-500">Total (Weeks 0-12)</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trimester 2</p>
                      <p className="text-lg font-bold text-gray-800">{recommendation.secondTrimesterRate}</p>
                      <p className="text-[10px] text-gray-500">Per Week (Weeks 13-27)</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trimester 3</p>
                      <p className="text-lg font-bold text-gray-800">{recommendation.thirdTrimesterRate}</p>
                      <p className="text-[10px] text-gray-500">Per Week (Weeks 28-40)</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-red-600 flex items-center gap-2 uppercase tracking-tight">
                      <AlertTriangle className="h-4 w-4" /> Risk of Low Gain
                    </h4>
                    <ul className="space-y-2">
                      {recommendation.risksIfLow.map((risk, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-400" /> {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-orange-600 flex items-center gap-2 uppercase tracking-tight">
                      <AlertTriangle className="h-4 w-4" /> Risk of High Gain
                    </h4>
                    <ul className="space-y-2">
                      {recommendation.risksIfHigh.map((risk, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-400" /> {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                  <p className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider text-[10px]">
                    <Target className="h-4 w-4 text-pink-600" />
                    Medical Reference
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    These recommendations are based on guidelines from: {recommendation.sources.join(", ")}.
                    Individual needs may vary based on health conditions or multiple pregnancy. Always consult your provider.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={() => setShowOneRecordDialog(true)}
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl text-lg font-semibold border-2"
                  >
                    Recalculate
                  </Button>
                  <Button
                    onClick={onBack}
                    className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold shadow-lg"
                  >
                    Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showOneRecordDialog} onOpenChange={setShowOneRecordDialog}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-pink-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">One Record Allowed</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              You already have an analysis. Would you like to update your details or start fresh with a new one?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleUpdateExisting}
              className="h-14 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
            >
              Update Existing
            </Button>
            <Button
              variant="outline"
              onClick={handleStartFresh}
              className="h-14 rounded-xl font-bold border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
            >
              Start Fresh (Delete Old)
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowOneRecordDialog(false)}
              className="h-12 rounded-xl font-bold text-gray-400"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
