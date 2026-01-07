import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BarChart3,
  History,
  Zap,
  TrendingUp,
  CheckCircle2,
  Info,
  Calendar,
  Dumbbell,
  Timer,
  Activity,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp, collection, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
import { format, isSameDay } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ExerciseRecord {
  id: string;
  date: string;
  type: string;
  duration: number;
  intensity: string;
  note: string;
}

type Step = "intro" | "log" | "analyzing" | "records" | "chart";

const exerciseTypes = [
  "Walking",
  "Swimming",
  "Prenatal Yoga",
  "Stationary Cycling",
  "Light Strength Training",
  "Stretching",
  "Pelvic Floor Exercises",
  "Other"
];

const intensityLevels = ["Low", "Moderate", "High"];

  export default function ExerciseLog({ onBack }: { onBack: () => void }) {
    const isMobile = useIsMobile();
    const [step, setStep] = useState<Step>("intro");
    const [exerciseType, setExerciseType] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [intensity, setIntensity] = useState<string>("Low");
    const [note, setNote] = useState<string>("");
    const [records, setRecords] = useState<ExerciseRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');


  // New state for daily limit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dailyRecord, setDailyRecord] = useState<ExerciseRecord | null>(null);
  const [showDailyLimitDialog, setShowDailyLimitDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storedRecords = localStorage.getItem("exerciseRecords");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(
        collection(db, "users", user.uid, "Exercise"),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched: ExerciseRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          const dateValue = data.date instanceof Timestamp ? data.date.toDate() : (data.date ? new Date(data.date) : new Date());
          return {
            id: docSnap.id,
            date: format(dateValue, "yyyy-MM-dd"),
            type: data.type || "",
            duration: typeof data.duration === "number" ? data.duration : parseFloat(String(data.duration ?? 0)),
            intensity: data.intensity || "Low",
            note: data.note || "",
          };
        });
        setRecords(fetched);
        localStorage.setItem("exerciseRecords", JSON.stringify(fetched));
      });
    } catch (e) {
      console.error(e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  const handleLogClick = () => {
    const todayRecord = records.find(r => isSameDay(new Date(r.date), new Date()));
    if (todayRecord) {
      setDailyRecord(todayRecord);
      setShowDailyLimitDialog(true);
    } else {
      setEditingId(null);
      setExerciseType("");
      setDuration("");
      setIntensity("Low");
      setNote("");
      setStep("log");
    }
  };

  const handleUpdateExisting = () => {
    if (dailyRecord) {
      setEditingId(dailyRecord.id);
      setExerciseType(dailyRecord.type);
      setDuration(dailyRecord.duration.toString());
      setIntensity(dailyRecord.intensity);
      setNote(dailyRecord.note);
      setStep("log");
      setShowDailyLimitDialog(false);
    }
  };

  const handleStartFresh = async () => {
    if (dailyRecord?.id && user?.uid) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "Exercise", dailyRecord.id));
        setEditingId(null);
        setExerciseType("");
        setDuration("");
        setIntensity("Low");
        setNote("");
        setStep("log");
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

  const handleAddRecord = () => {
    if (!exerciseType || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in both type and duration.",
        variant: "destructive"
      });
      return;
    }

    setStep("analyzing");



    // Use existing ID if editing, otherwise generate new one
    const newRecordId = editingId || Date.now().toString();
    const newRecord: ExerciseRecord = {
      id: newRecordId,
      date: format(new Date(), "yyyy-MM-dd"),
      type: exerciseType,
      duration: parseFloat(duration),
      intensity: intensity,
      note: note,
    };

    if (user?.uid) {
      const recordRef = doc(db, "users", user.uid, "Exercise", newRecordId);
      setDoc(recordRef, {
        date: Timestamp.fromDate(new Date(newRecord.date)),
        type: newRecord.type,
        duration: newRecord.duration,
        intensity: newRecord.intensity,
        note: newRecord.note || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        source: "exercise-log",
      }, { merge: true }).catch(console.error);
    }

    setTimeout(() => {
      setExerciseType("");
      setDuration("");
      setIntensity("Low");
      setNote("");
      toast({
        title: "Activity Saved",
        description: "Your exercise record has been updated."
      });
      setStep("records");
    }, 1500);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const deleteRecord = async () => {
    if (!recordToDelete) return;
    if (user?.uid) {
      await deleteDoc(doc(db, "users", user.uid, "Exercise", recordToDelete)).catch(console.error);
    }
    toast({ title: "Record deleted" });
    setShowConfirmDelete(false);
    setRecordToDelete(null);
  };

    const filteredRecords = records.filter(record => 
      format(new Date(record.date), "MMMM d, yyyy").toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.note.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const chartData = Array.from(
      records.reduce((acc, curr) => {
        acc.set(curr.type, (acc.get(curr.type) || 0) + curr.duration);
        return acc;
      }, new Map<string, number>()),
      ([type, duration]) => ({ type, duration })
    ).slice(0, 5);


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
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-orange-600 shadow-inner">
                <Dumbbell className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Activity Log</h1>
              <p className="text-gray-600 text-lg">
                Stay active and healthy! Track your prenatal exercises to maintain energy levels and prepare your body for motherhood.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleLogClick}
                className="h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
              >
                Log Exercise
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

        {step === "log" && (
          <motion.div
            key="log"
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
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">New Activity</h2>
              </div>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Exercise Type</label>
                    <Select value={exerciseType} onValueChange={setExerciseType}>
                      <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Duration (Min)</label>
                    <Input
                      type="number"
                      placeholder="e.g. 30"
                      className="h-12 rounded-xl border-gray-100 bg-gray-50"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Intensity Level</label>
                  <div className="flex gap-2">
                    {intensityLevels.map((level) => (
                      <Button
                        key={level}
                        type="button"
                        variant={intensity === level ? "default" : "outline"}
                        onClick={() => setIntensity(level)}
                        className={`flex-1 h-12 rounded-xl font-bold ${intensity === level ? 'bg-orange-500 hover:bg-orange-600' : 'border-gray-100 text-gray-500'}`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Additional Notes</label>
                  <Input
                    placeholder="How did you feel?"
                    className="h-12 rounded-xl border-gray-100 bg-gray-50"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-2">
                    <Info className="h-4 w-4" /> Safety First
                  </p>
                  <p className="text-[11px] text-orange-900/60 mt-1">
                    Stay hydrated and stop immediately if you feel dizzy or short of breath.
                  </p>
                </div>

                <Button
                  onClick={handleAddRecord}
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-black shadow-lg transition-all hover:scale-[1.02]"
                >
                  Save Activity
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
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl"
              >
                <Activity className="h-12 w-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-orange-400 rounded-[2rem] -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Logging Movement...</h2>
              <p className="text-gray-500 animate-pulse">Updating your fitness journey</p>
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
            className="max-w-3xl w-full space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Exercise History</h2>
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">{records.length} Activities Found</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("chart")}
                  className="rounded-2xl h-10 px-4 font-bold text-xs uppercase"
                >
                  <BarChart3 className="h-4 w-4 mr-2" /> Summary
                </Button>
                
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by date, type or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-gray-100 bg-white shadow-sm"
                />
                <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex bg-gray-50 rounded-2xl p-1 border border-gray-100 self-start sm:self-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
                >
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
                >
                  List
                </Button>
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Dumbbell className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No exercises found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className={`grid gap-4 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {filteredRecords.slice(0, visibleCount).map((record) => (
                    <Card key={record.id} className={`group border-0 shadow-md sm:shadow-lg rounded-2xl sm:rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all ${viewMode === 'list' ? 'p-1' : ''}`}>
                      <CardContent className={`p-3 sm:p-6 space-y-2 sm:space-y-4 ${viewMode === 'list' ? 'p-3 flex items-center justify-between space-y-0' : ''}`}>
                        <div className={`flex justify-between items-start ${viewMode === 'list' ? 'flex-1 items-center gap-4' : ''}`}>
                          <div className={`space-y-0.5 sm:space-y-1 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(record.date), "MMMM d, yyyy")}</p>
                            <h3 className={`${viewMode === 'list' ? 'text-lg' : 'text-base sm:text-xl'} font-black text-slate-900 leading-tight`}>{record.type}</h3>
                            <Badge variant="secondary" className="bg-orange-50 text-orange-600 font-bold text-[8px] sm:text-[9px] uppercase">
                              {record.intensity} Intensity
                            </Badge>
                          </div>
                          {viewMode === 'list' && (
                            <div className="flex items-center gap-2 px-4 border-x border-gray-50 mx-4">
                              <Timer className="h-4 w-4 text-orange-400" />
                              <p className="text-xs font-black text-gray-700">{record.duration}m</p>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setRecordToDelete(record.id);
                              setShowConfirmDelete(true);
                            }}
                            className="h-7 w-7 sm:h-8 sm:w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 w-4" />
                          </Button>
                        </div>
                        {viewMode === 'grid' && (
                          <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2 sm:pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Timer className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                              <p className="text-[10px] sm:text-xs font-black text-gray-700">{record.duration} Min</p>
                            </div>
                            {record.note && (
                              <div className="col-span-2 mt-0.5 sm:mt-2">
                                <p className="text-[8px] sm:text-[10px] italic text-gray-400 font-medium line-clamp-2">"{record.note}"</p>
                              </div>
                            )}
                          </div>
                        )}
                        {viewMode === 'list' && record.note && (
                          <div className="hidden lg:block max-w-[200px] truncate">
                            <p className="text-[10px] italic text-gray-400">"{record.note}"</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {visibleCount < filteredRecords.length && (
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-2xl text-orange-600 font-bold hover:bg-orange-50 transition-colors"
                    onClick={() => setVisibleCount(prev => prev + 20)}
                  >
                    Load More Entries ({filteredRecords.length - visibleCount} remaining)
                  </Button>
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
            className="max-w-3xl w-full space-y-6"
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setStep("records")} className="rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Fitness Summary</h2>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white p-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="type"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 'bold' }}
                      width={100}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="duration" fill="#f97316" radius={[0, 10, 10, 0]} barSize={30}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'][index % 5]} />
                      ))}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth Observation</p>
                  <p className="text-sm font-bold text-gray-700">Consistency is key! Most of your time is spent on healthy {chartData[0]?.type || 'activities'}.</p>
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
              You already have an exercise record for today. Would you like to update it or start fresh?
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
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">Delete Entry?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              This activity data will be permanently removed from your history.
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

      <style>{`
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