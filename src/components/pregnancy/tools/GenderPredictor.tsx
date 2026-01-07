import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Scissors,
  Sparkles,
  Baby,
  Calendar,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Heart,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface GenderPredictionProps {
  onBack: () => void;
}

interface PredictionRecord {
  id: string;
  motherAge: number;
  conceptionMonth: number;
  prediction: string;
  date: string;
}

type Step = "intro" | "input" | "analyzing" | "scratch" | "result";

function ScratchCard({
  prediction,
  onComplete,
  onBack
}: {
  prediction: PredictionRecord;
  onComplete: (isPartialCompletion?: boolean) => void;
  onBack: (percentage: number) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const maxWidth = Math.min(containerWidth - 40, 400);
        const height = Math.min(maxWidth * 0.75, 300);

        setCanvasSize({ width: maxWidth, height });

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = maxWidth;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            const gradient = ctx.createLinearGradient(0, 0, maxWidth, height);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FF6B6B');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, maxWidth, height);

            const fontSize = Math.max(16, Math.min(24, maxWidth / 16));
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('Scratch to Reveal!', maxWidth / 2, height / 2);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 20; i++) {
              const x = Math.random() * maxWidth;
              const y = Math.random() * height;
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const scratch = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const scratchRadius = isMobile ? 20 : 25;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, scratchRadius, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels * 4 / totalPixels) * 100;
    setScratchedPercentage(percentage);

    if (percentage > 55) {
      setTimeout(() => {
        onComplete(false);
      }, 500);
    }
  }, [isMobile, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">The Moment of Truth</h2>
        <p className="text-gray-500 font-medium italic">Scratch carefully to reveal your prediction</p>
      </div>

      <div ref={containerRef} className="relative w-full max-w-md mx-auto group">
        <div
          className="flex flex-col items-center justify-center bg-white rounded-[2.5rem] shadow-2xl p-8 border-4 border-pink-100 z-10"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            minHeight: '200px'
          }}
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl"
            >
              {prediction.prediction.includes('Girl') ? '👧' : '👦'}
            </motion.div>
            <p className="font-black text-pink-600 uppercase tracking-widest text-sm">
              It's a {prediction.prediction.includes('Girl') ? 'Girl' : 'Boy'}!
            </p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-[2.5rem] shadow-2xl cursor-crosshair border-4 border-pink-200 z-20 touch-none"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
          onMouseDown={() => setIsScratching(true)}
          onMouseUp={() => setIsScratching(false)}
          onMouseMove={(e) => isScratching && scratch(e)}
          onTouchStart={() => setIsScratching(true)}
          onTouchEnd={() => setIsScratching(false)}
          onTouchMove={(e) => { e.preventDefault(); if (isScratching) scratch(e); }}
        />
      </div>

      <div className="text-center space-y-4">
        <div className="w-full bg-gray-100 h-2 rounded-full max-w-xs mx-auto overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${scratchedPercentage}%` }}
            className="h-full bg-pink-500"
          />
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {Math.round(scratchedPercentage)}% Revealed
        </p>
      </div>

      <Button variant="ghost" onClick={() => onBack(scratchedPercentage)} className="text-gray-400 hover:text-gray-600">
        <ArrowLeft className="h-4 w-4 mr-2" /> Cancel & Return
      </Button>
    </div>
  );
}

export default function GenderPredictor({ onBack }: GenderPredictionProps) {
  const [step, setStep] = useState<Step>("intro");
  const [motherAge, setMotherAge] = useState<number | "">("");
  const [conceptionMonth, setConceptionMonth] = useState<number | "">("");
  const [finalPrediction, setFinalPrediction] = useState<PredictionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // New state for single record limit
  const [showOneRecordDialog, setShowOneRecordDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const checkExisting = async () => {
      setLoading(true);
      if (user?.uid) {
        try {
          const metaRef = doc(db, "users", user.uid, "GenderMeta", "status");
          const snap = await getDoc(metaRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.usedPrediction && data.finalRecord && data.scratchCompleted) {
              setFinalPrediction(data.finalRecord);
              setStep("result");
              setLoading(false);
              return;
            }
          }
        } catch (e) { console.error(e); }
      }

      const local = localStorage.getItem('genderPrediction');
      if (local) {
        try {
          const pred = JSON.parse(local);
          if (pred.scratchCompleted) {
            setFinalPrediction(pred);
            setStep("result");
          }
        } catch (e) { console.error(e); }
      }
      setLoading(false);
    };
    checkExisting();
  }, [user?.uid]);

  const predictGender = () => {
    if (typeof motherAge !== "number" || typeof conceptionMonth !== "number") {
      toast({ title: "Details required", description: "Please enter your age and month", variant: "destructive" });
      return;
    }
    if (motherAge < 18 || motherAge > 75) {
      toast({ title: "Invalid Age", description: "Age must be between 18-75", variant: "destructive" });
      return;
    }

    setStep("analyzing");
    setTimeout(() => {
      const result = (motherAge % 2 === conceptionMonth % 2) ? "Predicted Gender: Girl" : "Predicted Gender: Boy";
      const newRecord: PredictionRecord = {
        id: editingId || Date.now().toString(),
        motherAge,
        conceptionMonth,
        prediction: result,
        date: new Date().toLocaleString(),
      };
      setFinalPrediction(newRecord);
      setStep("scratch");
    }, 2500);
  };

  const savePrediction = async (record: PredictionRecord) => {
    const completedRecord = { ...record, scratchCompleted: true };
    localStorage.setItem('genderPrediction', JSON.stringify(completedRecord));

    if (user?.uid) {
      try {
        await setDoc(doc(db, "users", user.uid, "Gender", record.id), { ...completedRecord, createdAt: serverTimestamp() });
        await setDoc(doc(db, "users", user.uid, "GenderMeta", "status"), {
          usedPrediction: true,
          finalRecord: completedRecord,
          scratchCompleted: true,
          lastUpdated: serverTimestamp()
        });
      } catch (e) { console.error(e); }
    }
    return completedRecord;
  };

  const handleScratchComplete = async () => {
    if (!finalPrediction) return;
    const completedRecord = await savePrediction(finalPrediction);
    setFinalPrediction(completedRecord);
    setStep("result");
  };

  const handleScratchBack = async (percentage: number) => {
    if (finalPrediction && percentage > 1) {
      // If user scratched more than 10%, save it as revealed so they see result next time
      await savePrediction(finalPrediction);
      setFinalPrediction(null); // Clear current state to return to input cleanly
    }
    setStep("input");
  };

  const handleResetClick = () => {
    if (finalPrediction) {
      setShowOneRecordDialog(true);
    } else {
      setStep("input");
    }
  };

  const handleUpdateExisting = () => {
    if (finalPrediction) {
      setEditingId(finalPrediction.id);
      setMotherAge(finalPrediction.motherAge);
      setConceptionMonth(finalPrediction.conceptionMonth);
      setStep("input");
      setShowOneRecordDialog(false);
    }
  };

  const handleStartFresh = async () => {
    if (user?.uid) {
      try {
        // Clear metadata
        await setDoc(doc(db, "users", user.uid, "GenderMeta", "status"), {
          usedPrediction: false,
          finalRecord: null,
          scratchCompleted: false,
          lastUpdated: serverTimestamp()
        });
        // Note: In a real app we might delete specific records from "Gender" collection
        // but since we only care about the single "active" one for this tool:
        if (finalPrediction?.id) {
          await deleteDoc(doc(db, "users", user.uid, "Gender", finalPrediction.id));
        }
      } catch (e) {
        console.error("Error resetting:", e);
      }
    }
    localStorage.removeItem('genderPrediction');
    setFinalPrediction(null);
    setEditingId(null);
    setMotherAge("");
    setConceptionMonth("");
    setStep("input");
    setShowOneRecordDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
        <p className="text-gray-500 font-medium">Synchronizing records...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

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
              <div className="bg-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-pink-600 shadow-inner">
                <Baby className="h-12 w-12" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ancient Wisdom</h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Discover the traditional Gender Prediction method. Based on ancient charts used for centuries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <ShieldCheck className="h-5 w-5" />, label: "Private" },
                { icon: <Zap className="h-5 w-5" />, label: "Instant" },
                { icon: <Sparkles className="h-5 w-5" />, label: "Fun" }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2">
                  <div className="text-pink-500">{item.icon}</div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => {
                  if (finalPrediction) {
                    setShowOneRecordDialog(true);
                  } else {
                    setStep("input");
                  }
                }}
                className="w-full h-16 text-lg font-black rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02] uppercase tracking-widest"
              >
                Start Prediction
              </Button>
              <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm font-bold flex items-center justify-center mx-auto transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tools
              </button>
            </div>

            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
              Disclaimer: For entertainment purposes only. Not a medical diagnostic.
            </p>
          </motion.div>
        )}

        {step === "input" && (
          <motion.div
            key="input"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-md w-full space-y-8"
          >
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Tell us about yourself</h2>
                <p className="text-xs font-bold text-pink-500 uppercase tracking-widest">Input Data for Analysis</p>
              </div>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Mother's Age at Conception</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="e.g. 28"
                      value={motherAge}
                      onChange={(e) => setMotherAge(e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="h-14 rounded-2xl border-2 border-gray-50 focus:border-pink-200 focus:ring-0 text-lg font-bold pl-12"
                    />
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Month of Conception</Label>
                  <Select
                    onValueChange={(v) => setConceptionMonth(parseInt(v))}
                    value={conceptionMonth?.toString()}
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-2 border-gray-50 focus:border-pink-200 focus:ring-0 text-lg font-bold">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-pink-300" />
                        <SelectValue placeholder="Select Month" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-0 shadow-2xl">
                      {months.map((m, i) => (
                        <SelectItem key={i} value={(i + 1).toString()} className="h-12 font-bold focus:bg-pink-50 focus:text-pink-600 rounded-xl mx-2 my-1">
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={predictGender}
                  className="w-full h-16 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-lg font-black shadow-lg transition-all hover:scale-[1.02] uppercase tracking-widest mt-4"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Prediction
                </Button>
              </CardContent>
            </Card>
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
                <Zap className="h-12 w-12 text-yellow-400" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-slate-900 rounded-full -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Consulting the Chart...</h2>
              <p className="text-pink-500 font-bold animate-pulse uppercase tracking-widest text-xs">Aligning with the Chart</p>
            </div>
            <div className="max-w-xs mx-auto space-y-3">
              {[
                "Mapping Mother's Age",
                "Calculating Conception Month",
                "Applying Qing Dynasty Formulas"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600 justify-center font-bold">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> {text}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "scratch" && finalPrediction && (
          <motion.div
            key="scratch"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            <ScratchCard
              prediction={finalPrediction}
              onComplete={handleScratchComplete}
              onBack={handleScratchBack}
            />
          </motion.div>
        )}

        {step === "result" && finalPrediction && (
          <motion.div
            key="result"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-xl w-full space-y-8 text-center"
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">PREDICTION COMPLETE</h1>
              <p className="text-sm font-bold text-pink-500 uppercase tracking-[0.3em]">Historical Analysis Result</p>
            </div>

            <Card className="relative border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-white group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
              <CardContent className="p-12 space-y-8">
                <div className="relative inline-block">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl"
                  >
                    {finalPrediction.prediction.includes('Girl') ? '👧' : '👦'}
                  </motion.div>
                  <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-yellow-400 animate-spin-slow" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-gray-900 leading-tight">
                    Congratulations!<br /> It's a <span className="text-pink-600">"{finalPrediction.prediction.includes('Girl') ? 'Girl' : 'Boy'}"</span>
                  </h2>
                  <div className="flex items-center justify-center gap-3">
                    <Badge className="bg-purple-50 text-purple-600 border-purple-100 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest">
                      Age: {finalPrediction.motherAge}
                    </Badge>
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest">
                      Month: {months[finalPrediction.conceptionMonth - 1]}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 text-left">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Medical Context
                  </h3>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                    "Gender is biologically determined by chromosomes at fertilization. While ancient methods are part of cultural heritage, they are for entertainment only. Always consult medical scans for accuracy."
                  </p>
                  <p className="text-[10px] font-black text-slate-300 uppercase">Sources: ACOG, Historical Archives</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                onClick={handleResetClick}
                className="h-16 text-lg font-black rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02] uppercase tracking-widest"
              >
                Reset Prediction
              </Button>
              <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-gray-600 font-bold uppercase tracking-widest text-xs">
                Return to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

      <Dialog open={showOneRecordDialog} onOpenChange={setShowOneRecordDialog}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-pink-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">One Record Allowed</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              You already have a prediction. Would you like to update your details or start fresh with a new one?
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

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
