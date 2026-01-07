import React, { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, isSameDay } from "date-fns";
import {
  ArrowLeft,
  Calculator,
  Calendar,
  BarChart3,
  Trash2,
  ChevronDown,
  Info,
  Scale,
  Ruler,
  CheckCircle2,
  History,
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp, collection, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
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
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({

  weight: z.coerce.number({
    required_error: "Weight is required",
    invalid_type_error: "Weight must be a number",
  }).positive("Weight must be positive"),
  height: z.coerce.number({
    required_error: "Height is required",
    invalid_type_error: "Height must be a number",
  }).positive("Height must be positive"),
  heightUnit: z.enum(["cm", "m", "ft"], {
    required_error: "Height unit is required",
  }),
  weightUnit: z.enum(["kg", "lb"], {
    required_error: "Weight unit is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;
type Step = "intro" | "calculator" | "analyzing" | "records" | "chart";

type BMIRecord = FormValues & {
  id: string;
  bmi: number;
  category: string;
  date: Date;
};

interface BMIRecordData {
  date: Timestamp | Date | string;
  height: number;
  heightUnit: string;
  weight: number;
  weightUnit: string;
  bmi: number;
  category: string;
}

const calculateBMI = (weight: number, height: number, weightUnit: string, heightUnit: string): number => {
  const weightInKg = weightUnit === "lb" ? weight * 0.453592 : weight;
  let heightInMeters: number;
  if (heightUnit === "cm") {
    heightInMeters = height / 100;
  } else if (heightUnit === "ft") {
    heightInMeters = height * 0.3048;
  } else {
    heightInMeters = height;
  }
  return parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(2));
};

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal weight";
  if (bmi < 29.9) return "Overweight";
  if (bmi < 34.9) return "Obesity Class I";
  if (bmi < 39.9) return "Obesity Class II";
  return "Obesity Class III";
};

const getBMIColor = (bmi: number): string => {
  if (bmi < 18.5) return "text-blue-500";
  if (bmi < 24.9) return "text-green-600";
  if (bmi < 29.9) return "text-yellow-500";
  if (bmi < 34.9) return "text-orange-500";
  if (bmi < 39.9) return "text-red-500";
  return "text-red-700";
};

export default function BMICalculator({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("intro");
  const [bmiRecords, setBMIRecords] = useState<BMIRecord[]>(() => {
    const saved = localStorage.getItem("pregnancyBMIRecords");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [chartRange, setChartRange] = useState<'last10' | 'all'>('last10');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  // New state for daily limit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dailyRecord, setDailyRecord] = useState<BMIRecord | null>(null);
  const [showDailyLimitDialog, setShowDailyLimitDialog] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {

      heightUnit: "cm",
      weightUnit: "kg",
    },
  });

  const previousHeightUnitRef = useRef<string>('cm');

  useEffect(() => {
    const currentWeight = form.getValues('weight');
    const currentUnit = form.getValues('weightUnit');
    if (currentWeight && currentUnit) {
      let convertedWeight: number;
      if (currentUnit === 'lb') {
        convertedWeight = currentWeight / 0.453592;
      } else {
        convertedWeight = currentWeight * 0.453592;
      }
      form.setValue('weight', parseFloat(convertedWeight.toFixed(2)));
    }
  }, [form.watch('weightUnit')]);

  useEffect(() => {
    const currentHeight = form.getValues('height');
    const currentUnit = form.getValues('heightUnit');
    if (currentHeight && currentUnit !== previousHeightUnitRef.current) {
      let convertedHeight: number;
      const prevUnit = previousHeightUnitRef.current;
      if (prevUnit === 'cm' && currentUnit === 'm') {
        convertedHeight = currentHeight / 100;
      } else if (prevUnit === 'm' && currentUnit === 'cm') {
        convertedHeight = currentHeight * 100;
      } else if (prevUnit === 'cm' && currentUnit === 'ft') {
        convertedHeight = (currentHeight / 100) * 3.28084;
      } else if (prevUnit === 'm' && currentUnit === 'ft') {
        convertedHeight = currentHeight * 3.28084;
      } else if (prevUnit === 'ft' && currentUnit === 'cm') {
        convertedHeight = (currentHeight / 3.28084) * 100;
      } else if (prevUnit === 'ft' && currentUnit === 'm') {
        convertedHeight = currentHeight / 3.28084;
      } else {
        convertedHeight = currentHeight;
      }
      form.setValue('height', parseFloat(convertedHeight.toFixed(2)));
      previousHeightUnitRef.current = currentUnit;
    }
  }, [form.watch('heightUnit')]);

  useEffect(() => {
    if (!user?.uid) return;
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(
        collection(db, "users", user.uid, "BMI"),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as BMIRecordData;
          const dateValue = data.date instanceof Timestamp ? data.date.toDate() : (data.date ? new Date(data.date) : new Date());
          return {
            id: docSnap.id,
            date: dateValue,
            height: data.height,
            heightUnit: data.heightUnit,
            weight: data.weight,
            weightUnit: data.weightUnit,
            bmi: data.bmi,
            category: data.category,
          };
        }) as BMIRecord[];
        fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setBMIRecords(fetched);
        localStorage.setItem("pregnancyBMIRecords", JSON.stringify(fetched));
      });
    } catch (e) {
      console.error(e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  const handleStartClick = () => {
    const todayRecord = bmiRecords.find(r => isSameDay(new Date(r.date), new Date()));
    if (todayRecord) {
      setDailyRecord(todayRecord);
      setShowDailyLimitDialog(true);
    } else {
      setEditingId(null);
      form.reset({
        heightUnit: "cm",
        weightUnit: "kg",
        weight: undefined,
        height: undefined,
      });
      setStep("calculator");
    }
  };

  const handleUpdateExisting = () => {
    if (dailyRecord) {
      setEditingId(dailyRecord.id);
      form.setValue("height", dailyRecord.height);
      form.setValue("heightUnit", dailyRecord.heightUnit as "cm" | "m" | "ft");
      form.setValue("weight", dailyRecord.weight);
      form.setValue("weightUnit", dailyRecord.weightUnit as "kg" | "lb");
      setStep("calculator");
      setShowDailyLimitDialog(false);
    }
  };

  const handleStartFresh = async () => {
    if (dailyRecord?.id && user?.uid) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "BMI", dailyRecord.id));
        setEditingId(null);
        form.reset({
          heightUnit: "cm",
          weightUnit: "kg",
          weight: undefined,
          height: undefined,
        });
        setStep("calculator");
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
    const minWeight = data.weightUnit === 'kg' ? 45 : 100;
    const maxWeight = data.weightUnit === 'kg' ? 93 : 200;

    if (data.weight < minWeight || data.weight > maxWeight) {
      toast({
        title: "Invalid weight",
        description: `Weight must be between ${minWeight} and ${maxWeight} ${data.weightUnit}`,
        variant: "destructive",
      });
      return;
    }

    let minHeight, maxHeight;
    if (data.heightUnit === 'cm') {
      minHeight = 140; maxHeight = 200;
    } else if (data.heightUnit === 'm') {
      minHeight = 1.4; maxHeight = 2.0;
    } else {
      minHeight = 4.58; maxHeight = 6.58;
    }

    if (data.height < minHeight || data.height > maxHeight) {
      toast({
        title: "Invalid height",
        description: `Height must be between ${minHeight} and ${maxHeight} ${data.heightUnit}`,
        variant: "destructive",
      });
      return;
    }

    setStep("analyzing");

    const bmi = calculateBMI(data.weight, data.height, data.weightUnit, data.heightUnit);
    const category = getBMICategory(bmi);

    // Use existing ID if editing, otherwise generate new one
    const newRecordId = editingId || Date.now().toString();

    if (user?.uid) {
      const recordRef = doc(db, "users", user.uid, "BMI", newRecordId);

      const recordData: any = {
        date: Timestamp.fromDate(new Date()),
        height: data.height,
        heightUnit: data.heightUnit,
        weight: data.weight,
        weightUnit: data.weightUnit,
        bmi: bmi,
        category: category,
        updatedAt: serverTimestamp(),
        source: "bmi-calculator",
      };

      // Only set createdAt for new records
      if (!editingId) {
        recordData.createdAt = serverTimestamp();
      }

      setDoc(recordRef, recordData, { merge: true }).catch(console.error);
    }

    setTimeout(() => {
      toast({
        title: editingId ? "BMI Updated" : "BMI Saved",
        description: `Your BMI is ${bmi} (${category})`,
        duration: 2000,
      });
      setStep("records");
      setEditingId(null); // Reset editing state
    }, 1500);
  }

  const deleteRecord = async () => {
    if (!recordToDelete) return;
    if (user?.uid) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "BMI", recordToDelete));
      } catch (e) {
        console.error(e);
      }
    }
    toast({
      title: "Record deleted",
      duration: 1500,
    });
    setShowConfirmDelete(false);
    setRecordToDelete(null);
  };

  const filteredRecords = bmiRecords.filter(record => {
    const searchLower = searchQuery.toLowerCase();
    const dateStr = format(new Date(record.date), "MMMM d, yyyy").toLowerCase();
    const categoryLower = record.category.toLowerCase();
    return dateStr.includes(searchLower) || categoryLower.includes(searchLower);
  });

  const paginatedRecords = filteredRecords.slice(0, visibleCount);

  const chartData = bmiRecords
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(chartRange === 'last10' ? -10 : 0)
    .map(record => ({
      date: format(new Date(record.date), "MMM d"),
      bmi: record.bmi,
    }));

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
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-pink-600 shadow-inner">
                <Calculator className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">BMI Analysis</h1>
              <p className="text-gray-600 text-lg">
                Monitor your Body Mass Index to ensure healthy weight management during your pregnancy journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleStartClick}
                className="h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
              >
                Start Calculation
                <Zap className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("records")}
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

        {step === "calculator" && (
          <motion.div
            key="calculator"
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
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Body Metrics</h2>
              </div>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-pink-600">
                          <Ruler className="h-5 w-5" />
                          <span className="text-sm font-bold uppercase tracking-tight">Height</span>
                        </div>
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="h-12 rounded-xl"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="heightUnit"
                            render={({ field }) => (
                              <FormItem className="w-24">
                                <FormControl>
                                  <select
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-gray-600"
                                    {...field}
                                  >
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                    <option value="ft">ft</option>
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-pink-600">
                          <Scale className="h-5 w-5" />
                          <span className="text-sm font-bold uppercase tracking-tight">Weight</span>
                        </div>
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="h-12 rounded-xl"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="weightUnit"
                            render={({ field }) => (
                              <FormItem className="w-24">
                                <FormControl>
                                  <select
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-gray-600"
                                    {...field}
                                  >
                                    <option value="kg">kg</option>
                                    <option value="lb">lb</option>
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100">
                      <p className="text-xs font-bold text-pink-700 uppercase tracking-wider flex items-center gap-2">
                        <Info className="h-4 w-4" /> Professional Note
                      </p>
                      <p className="text-[11px] text-pink-900/60 mt-1 leading-relaxed">
                        BMI is a general indicator. During pregnancy, weight gain is essential for fetal development. Always consult your obstetrician for specific health goals.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-lg font-black shadow-lg transition-all hover:scale-[1.02]"
                    >
                      Analyze My Metrics
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
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl"
              >
                <Calculator className="h-12 w-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-pink-400 rounded-[2rem] -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Calculating Health Data...</h2>
              <p className="text-gray-500 animate-pulse">Running diagnostic metrics</p>
            </div>
          </motion.div>
        )}

        {step === "records" && (
          <motion.div
            key="records"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl w-full space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">BMI Records</h2>
                  <p className="text-sm font-bold text-pink-600 uppercase tracking-widest">{filteredRecords.length} Record Found</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-8 px-3 rounded-lg text-[10px] font-bold uppercase transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    Grid
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-8 px-3 rounded-lg text-[10px] font-bold uppercase transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    List
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStep("chart")}
                  className="rounded-2xl h-10 px-4 font-bold text-xs uppercase border-2"
                >
                  <BarChart3 className="h-4 w-4 mr-2" /> Trends
                </Button>

              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <History className="h-4 w-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
              </div>
              <Input
                placeholder="Search records by date or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-2 border-gray-100 focus:border-pink-200 transition-all bg-white/50 backdrop-blur-sm"
              />
            </div>

            {filteredRecords.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Scale className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No entries found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className={viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3"
                }>
                  {paginatedRecords.map((record) => (
                    <Card key={record.id} className={`group border-0 shadow-md sm:shadow-lg rounded-2xl sm:rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all ${viewMode === 'list' ? 'flex items-center' : ''}`}>
                      <CardContent className={`p-4 sm:p-6 w-full ${viewMode === 'list' ? 'flex items-center justify-between py-3' : 'space-y-2 sm:space-y-4'}`}>
                        <div className={viewMode === 'list' ? 'flex items-center gap-6 flex-1' : 'space-y-1'}>
                          <div className={viewMode === 'list' ? 'w-24' : ''}>
                            <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(record.date), "MMM d, yyyy")}</p>
                            <h3 className={`text-xl sm:text-2xl font-black ${getBMIColor(record.bmi)}`}>{record.bmi}</h3>
                          </div>

                          <div className={viewMode === 'list' ? 'flex-1 grid grid-cols-3 gap-4 items-center' : ''}>
                            <Badge variant="secondary" className={`bg-gray-50 text-gray-600 font-bold text-[8px] sm:text-[9px] uppercase ${viewMode === 'list' ? 'w-fit' : 'mb-2'}`}>
                              {record.category}
                            </Badge>

                            <div className={viewMode === 'list' ? 'flex gap-6' : 'grid grid-cols-2 gap-2 sm:gap-4 pt-2 sm:pt-4 border-t border-gray-50'}>
                              <div>
                                <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-tight">Weight</p>
                                <p className="text-[10px] sm:text-xs font-black text-gray-700">{record.weight} {record.weightUnit}</p>
                              </div>
                              <div>
                                <p className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-tight">Height</p>
                                <p className="text-[10px] sm:text-xs font-black text-gray-700">{record.height} {record.heightUnit}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setRecordToDelete(record.id);
                            setShowConfirmDelete(true);
                          }}
                          className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 shrink-0 self-start"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {visibleCount < filteredRecords.length && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setVisibleCount(prev => prev + 10)}
                      className="rounded-2xl h-12 px-8 font-black text-xs uppercase border-2 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-100 transition-all"
                    >
                      Load More Records
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {step === "chart" && (
          <motion.div
            key="chart"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl w-full space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("records")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">BMI Trends</h2>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChartRange('last10')}
                  className={`h-8 px-4 rounded-lg text-[10px] font-bold uppercase transition-all ${chartRange === 'last10' ? 'bg-white shadow-sm' : ''}`}
                >
                  Last 10
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChartRange('all')}
                  className={`h-8 px-4 rounded-lg text-[10px] font-bold uppercase transition-all ${chartRange === 'all' ? 'bg-white shadow-sm' : ''}`}
                >
                  All Time
                </Button>
              </div>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white p-4 sm:p-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '1rem',
                        border: 'none',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        fontWeight: 'bold'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bmi"
                      stroke="#db2777"
                      strokeWidth={4}
                      dot={{ r: 6, fill: "#db2777", strokeWidth: 3, stroke: "#fff" }}
                      activeDot={{ r: 8, fill: "#db2777", stroke: "#fff", strokeWidth: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-3 bg-pink-100 rounded-xl text-pink-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progress Update</p>
                  <p className="text-sm font-bold text-gray-700">Tracking BMI helps visualize healthy weight trajectories across trimesters.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showDailyLimitDialog} onOpenChange={setShowDailyLimitDialog}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">One Record Per Day</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              You already have a BMI record for today. Would you like to update your existing record or start fresh?
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
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">Remove Data?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              This BMI record will be permanently deleted from your tracking history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)} className="flex-1 h-12 rounded-xl font-bold border-2">
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteRecord} className="flex-1 h-12 rounded-xl font-bold bg-red-600">
              Delete
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