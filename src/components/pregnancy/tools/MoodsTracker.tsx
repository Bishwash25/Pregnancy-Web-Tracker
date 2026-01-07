import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, isSameDay } from "date-fns";
import {
  Smile,
  Save,
  Plus,
  Minus,
  ArrowLeft,
  Trash2,
  ChevronDown,
  ChevronRight,
  History,
  Sparkles,
  Heart,
  Brain,
  Zap,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp, collection, onSnapshot, query, orderBy, deleteDoc, getDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { differenceInWeeks } from "date-fns";

const moods = [
  "Happiness/Joy",
  "Anxiety/Worry",
  "Sadness",
  "Irritability",
  "Fatigue/Exhaustion",
  "Calm/Relaxed",
  "Stress",
  "Anger/Frustration",
  "Excitement",
  "Fear",
  "Loneliness",
  "Confusion",
  "Empowerment",
  "Overwhelm"
];

const formSchemaFields: Record<string, any> = {};
moods.forEach(mood => {
  const fieldName = mood.toLowerCase().replace(/[^a-z0-9]/g, '_');
  formSchemaFields[fieldName] = z.number({
    required_error: `${mood} intensity is required`,
  }).min(0).max(10);
});

formSchemaFields.other_mood = z.string().optional();
formSchemaFields.other_intensity = z.number().min(0).max(10).optional();
formSchemaFields.date = z.date({
  required_error: "Date is required",
});

const formSchema = z.object(formSchemaFields).refine(data => {
  if (data.other_mood && data.other_mood.trim() !== '') {
    return data.other_intensity !== undefined;
  }
  return true;
}, {
  message: "Intensity for Other mood is required",
  path: ["other_intensity"]
});

type FormValues = z.infer<typeof formSchema>;
type Step = "intro" | "record" | "history" | "analyzing";

  export default function MoodsTracker({ onBack }: { onBack: () => void }) {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const { user } = useAuth();
    const [step, setStep] = useState<Step>("intro");
    const [weeks, setWeeks] = useState<number>(12);
    const [currentTrimester, setCurrentTrimester] = useState<number>(1);
    const [savedMoods, setSavedMoods] = useState<(FormValues & { id: string })[]>([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [moodToDelete, setMoodToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');


  // New state for daily limit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dailyMood, setDailyMood] = useState<(FormValues & { id: string }) | null>(null);
  const [showDailyLimitDialog, setShowDailyLimitDialog] = useState(false);

  const confirmDeleteMood = (id: string) => {
    setMoodToDelete(id);
    setShowConfirmDelete(true);
  };

  const defaultValues: Partial<FormValues> = {
    date: new Date(),
    other_mood: "",
  };

  moods.forEach(mood => {
    const fieldName = mood.toLowerCase().replace(/[^a-z0-9]/g, '_');
    defaultValues[fieldName as keyof FormValues] = 0;
  });
  defaultValues.other_intensity = 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

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

  useEffect(() => {
    if (!user?.uid) return;
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(
        collection(db, "users", user.uid, "Moods"),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          const dateValue = data.date instanceof Timestamp ? data.date.toDate() : (data.date ? new Date(data.date) : new Date());
          return {
            id: docSnap.id,
            ...data,
            date: dateValue,
          } as any;
        }) as (FormValues & { id: string })[];
        setSavedMoods(fetched);
        localStorage.setItem("pregnancyMoodTracking", JSON.stringify(fetched));
      });
    } catch (e) {
      console.error(e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  const handleLogClick = () => {
    const todayMood = savedMoods.find(m => isSameDay(new Date(m.date), new Date()));
    if (todayMood) {
      setDailyMood(todayMood);
      setShowDailyLimitDialog(true);
    } else {
      setEditingId(null);
      form.reset(defaultValues);
      setStep("record");
    }
  };

  const handleUpdateExisting = () => {
    if (dailyMood) {
      setEditingId(dailyMood.id);
      form.reset(dailyMood); // This should populate all fields since dailyMood implements FormValues
      setStep("record");
      setShowDailyLimitDialog(false);
    }
  };

  const handleStartFresh = async () => {
    if (dailyMood?.id && user?.uid) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "Moods", dailyMood.id));
        setEditingId(null);
        form.reset(defaultValues);
        setStep("record");
        setShowDailyLimitDialog(false);
      } catch (error) {
        console.error("Error deleting old record:", error);
        toast({
          title: "Error",
          description: "Failed to start fresh. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  function onSubmit(data: FormValues) {
    if (data.other_mood && data.other_mood.trim() !== "") {
      const wordCount = data.other_mood.trim().split(/\s+/).length;
      if (wordCount > 15) {
        toast({
          title: "Too many words",
          description: "Please enter upto 15 words only ",
          variant: "destructive",
          duration: 1500,
        });
        return;
      }
    }

    let usedCount = 0;
    moods.forEach(mood => {
      const fieldName = mood.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const value = (data as any)[fieldName] as number | undefined;
      if ((value ?? 0) > 0) usedCount += 1;
    });
    if ((data.other_mood?.trim() || '').length > 0 && (data.other_intensity ?? 0) > 0) {
      usedCount += 1;
    }

    if (usedCount < 5) {
      toast({
        title: "Not enough moods selected",
        description: "Please set intensity for at least 5 moods before saving.",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }

    setStep("analyzing");

    // Use existing ID if editing, otherwise generate new one
    const newMoodId = editingId || Date.now().toString();
    const newMood = {
      ...data,
      id: newMoodId,
    };

    if (user?.uid) {
      const moodRef = doc(db, "users", user.uid, "Moods", newMoodId);
      const { date, ...rest } = newMood as any;

      const moodData: any = {
        ...rest,
        date: Timestamp.fromDate(new Date(data.date)),
        updatedAt: serverTimestamp(),
        source: "moods-tracker",
      };

      // Only set createdAt for new records
      if (!editingId) {
        moodData.createdAt = serverTimestamp();
      }

      setDoc(moodRef, moodData, { merge: true }).catch(console.error);
    }

    setTimeout(() => {
      toast({
        title: editingId ? "Mood updated" : "Mood record saved",
        duration: 1500,
      });
      form.reset(defaultValues);
      setStep("history");
      setEditingId(null);
    }, 2000);
  }

  const deleteMood = async () => {
    if (!moodToDelete) return;

    if (user?.uid) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "Moods", moodToDelete));
      } catch (e) {
        console.error(e);
      }
    }

    toast({
      title: "Mood deleted",
      duration: 1500,
    });

    setShowConfirmDelete(false);
    setMoodToDelete(null);
  };

  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const filteredMoods = savedMoods.filter(record => {
    const dateStr = formatDate(record.date).toLowerCase();
    const otherMood = (record.other_mood || "").toLowerCase();
    const search = searchQuery.toLowerCase();
    return dateStr.includes(search) || otherMood.includes(search);
  });

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
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-purple-600 shadow-inner">
                <Brain className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Emotional Well-being</h1>
              <p className="text-gray-600 text-lg">
                Track your emotional journey through pregnancy. Understanding your moods helps manage the hormonal changes and stay balanced.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">PREGNANCY PROGRESS</p>
                <p className="text-xl font-bold text-purple-600">Week {weeks}</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100" />
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">TRIMESTER</p>
                <p className="text-xl font-bold text-purple-600">
                  {currentTrimester === 1 ? '1st' : currentTrimester === 2 ? '2nd' : '3rd'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleLogClick}
                className="h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
              >
                Log New Mood
                <Plus className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("history")}
                className="h-14 text-lg font-semibold rounded-2xl border-2 border-gray-100 hover:bg-gray-50 transition-all hover:scale-[1.02]"
              >
                View History
                <History className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center justify-center mx-auto">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tools
            </button>
          </motion.div>
        )}

        {step === "record" && (
          <motion.div
            key="record"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl w-full space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">How are you feeling?</h2>
                  <p className="text-sm font-bold text-purple-600 uppercase tracking-widest">Stage: Trimester {currentTrimester}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-50 text-purple-600 font-bold px-3 py-1">
                {format(new Date(), "MMM d, yyyy")}
              </Badge>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 mb-6">
                        <p className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-2">
                          <Info className="h-4 w-4" /> Quick Tip
                        </p>
                        <p className="text-sm text-purple-900/70 mt-1 font-medium italic">
                          Hormonal changes are normal. Select at least 5 moods to help us provide better insights.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                        {moods.map((mood, index) => {
                          const fieldName = mood.toLowerCase().replace(/[^a-z0-9]/g, '_');
                          return (
                            <div key={fieldName} className="group p-5 rounded-3xl bg-white border-2 border-gray-50 hover:border-purple-100 hover:shadow-lg transition-all duration-300">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{index + 1}. {mood}</span>
                                <Badge className={`text-[10px] font-black uppercase ${form.watch(fieldName as any) > 0 ? 'bg-purple-500' : 'bg-gray-100 text-gray-400'}`}>
                                  Intensity: {form.watch(fieldName as any)}
                                </Badge>
                              </div>
                              <FormField
                                control={form.control}
                                name={fieldName as any}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex items-center gap-4">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-10 w-10 rounded-xl hover:bg-purple-50 text-purple-600"
                                          onClick={() => field.onChange(Math.max(0, (field.value ?? 0) - 1))}
                                        >
                                          <Minus className="h-5 w-5" />
                                        </Button>
                                        <Slider
                                          min={0}
                                          max={10}
                                          step={1}
                                          value={[field.value ?? 0]}
                                          onValueChange={(vals) => field.onChange(vals[0])}
                                          className="flex-1"
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-10 w-10 rounded-xl hover:bg-purple-50 text-purple-600"
                                          onClick={() => field.onChange(Math.min(10, (field.value ?? 0) + 1))}
                                        >
                                          <Plus className="h-5 w-5" />
                                        </Button>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          );
                        })}

                        <div className="p-5 rounded-3xl bg-slate-900 text-white border-2 border-slate-800 shadow-xl mt-4">
                          <div className="flex items-center gap-3 mb-4 text-purple-400">
                            <Sparkles className="h-5 w-5" />
                            <span className="text-sm font-black uppercase tracking-tight">Something else?</span>
                          </div>
                          <FormField
                            control={form.control}
                            name="other_mood"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormControl>
                                  <Input
                                    placeholder="Describe in 15 words or less..."
                                    {...field}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 rounded-2xl h-12"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="other_intensity"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center gap-4">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-10 w-10 text-white hover:bg-white/10"
                                      onClick={() => field.onChange(Math.max(0, (field.value ?? 0) - 1))}
                                    >
                                      <Minus className="h-5 w-5" />
                                    </Button>
                                    <Slider
                                      min={0}
                                      max={10}
                                      step={1}
                                      value={[field.value ?? 0]}
                                      onValueChange={(vals) => field.onChange(vals[0])}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-10 w-10 text-white hover:bg-white/10"
                                      onClick={() => field.onChange(Math.min(10, (field.value ?? 0) + 1))}
                                    >
                                      <Plus className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-lg font-black shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      Save My Progress
                    </Button>
                  </form>
                </Form>
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
                <Heart className="h-12 w-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-slate-900 rounded-full -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Saving Your Reflection...</h2>
              <p className="text-gray-500 animate-pulse">Building your emotional map</p>
            </div>
            <div className="max-w-xs mx-auto space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Cataloging Intensities
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Securing Private Data
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Syncing with Week {weeks}
              </div>
            </div>
          </motion.div>
        )}

        {step === "history" && (
          <motion.div
            key="history"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl w-full space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Reflection Hub</h2>
                  <p className="text-sm font-bold text-purple-600 uppercase tracking-widest">{savedMoods.length} Records Found</p>
                </div>
              </div>
              
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by date or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-gray-100 bg-white shadow-sm"
                />
                <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex bg-gray-50 rounded-2xl p-1 border border-gray-100 self-start sm:self-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('detailed')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'detailed' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-400'}`}
                >
                  Detailed
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('compact')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'compact' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-400'}`}
                >
                  Compact
                </Button>
              </div>
            </div>

            {filteredMoods.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Smile className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No entries found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className={`grid gap-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar ${viewMode === 'compact' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {filteredMoods.slice(0, visibleCount).map((record, recordIdx) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: recordIdx * 0.05 }}
                    >
                      <Card className={`group border-0 shadow-xl rounded-[2rem] overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 ${viewMode === 'compact' ? 'rounded-2xl shadow-md' : ''}`}>
                        <div className={`bg-gradient-to-br from-purple-500 to-indigo-600 p-4 sm:p-5 text-white flex justify-between items-center ${viewMode === 'compact' ? 'p-3' : ''}`}>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 sm:p-2 rounded-xl bg-white/20">
                              <Clock className="h-3.5 w-3.5 sm:h-4 w-4" />
                            </div>
                            <p className={`font-black uppercase tracking-widest ${viewMode === 'compact' ? 'text-[8px]' : 'text-xs'}`}>{formatDate(record.date)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDeleteMood(record.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className={`p-4 sm:p-6 space-y-4 ${viewMode === 'compact' ? 'p-3 space-y-2' : ''}`}>
                          <div className={`space-y-3 ${viewMode === 'compact' ? 'space-y-1.5' : ''}`}>
                            {moods.map((mood) => {
                              const fieldName = mood.toLowerCase().replace(/[^a-z0-9]/g, '_');
                              const intensity = (record as any)[fieldName] as number;
                              if (intensity > 0) {
                                return (
                                  <div key={fieldName} className="space-y-1">
                                    <div className={`flex justify-between font-black uppercase text-gray-400 ${viewMode === 'compact' ? 'text-[7px]' : 'text-[10px]'}`}>
                                      <span className="truncate max-w-[80%]">{mood}</span>
                                      <span className="text-purple-600">{intensity}/10</span>
                                    </div>
                                    <div className={`w-full bg-gray-50 rounded-full overflow-hidden ${viewMode === 'compact' ? 'h-1' : 'h-1.5'}`}>
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${intensity * 10}%` }}
                                        className="h-full bg-purple-500 rounded-full"
                                      />
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}

                            {record.other_mood && (
                              <div className={`p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 relative ${viewMode === 'compact' ? 'p-2 rounded-xl' : 'mt-4'}`}>
                                <Sparkles className="absolute top-2 right-2 h-3 w-3 text-purple-400 opacity-30" />
                                <p className={`font-black uppercase text-slate-400 mb-1 ${viewMode === 'compact' ? 'text-[7px]' : 'text-[10px]'}`}>Observation</p>
                                <p className={`font-bold text-slate-700 italic leading-relaxed line-clamp-2 ${viewMode === 'compact' ? 'text-[10px]' : 'text-sm'}`}>"{record.other_mood}"</p>
                                {viewMode !== 'compact' && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <div className="h-1 w-12 bg-purple-500 rounded-full" />
                                    <span className="text-[10px] font-black text-purple-600 uppercase">{(record as any).other_intensity}/10 Intensity</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                {visibleCount < filteredMoods.length && (
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-2xl text-purple-600 font-bold hover:bg-purple-50 transition-colors"
                    onClick={() => setVisibleCount(prev => prev + 20)}
                  >
                    Load More Entries ({filteredMoods.length - visibleCount} remaining)
                  </Button>
                )}
              </div>
            )}

           
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showDailyLimitDialog} onOpenChange={setShowDailyLimitDialog}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">One Record Per Day</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              You already have a mood record for today. Would you like to update it or start fresh?
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
              onClick={() => setShowDailyLimitDialog(false)}
              className="h-12 rounded-xl font-bold text-gray-400"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">Clear entry?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              This reflection will be permanently removed from your emotional journey history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)} className="flex-1 h-12 rounded-xl font-bold border-2">
              Keep It
            </Button>
            <Button variant="destructive" onClick={deleteMood} className="flex-1 h-12 rounded-xl font-bold bg-red-600">
              Clear It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
