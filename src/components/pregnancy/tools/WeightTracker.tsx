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
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp, collection, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
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

interface WeightRecord {
  id: string;
  date: string;
  weight: number;
}

  type Step = "intro" | "log" | "analyzing" | "records" | "chart";
  
  export default function WeightTracker({ onBack }: { onBack: () => void }) {
    const isMobile = useIsMobile();
    const [step, setStep] = useState<Step>("intro");
    const [weight, setWeight] = useState<string>("");
    const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
    const [records, setRecords] = useState<WeightRecord[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [dailyRecord, setDailyRecord] = useState<WeightRecord | null>(null);
    const [showDailyLimitDialog, setShowDailyLimitDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [chartRange, setChartRange] = useState<'last10' | 'all'>('last10');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { toast } = useToast();

  const { user } = useAuth();

  useEffect(() => {
    const storedRecords = localStorage.getItem("weightRecords");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(
        collection(db, "users", user.uid, "weightRecords"),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched: WeightRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          const dateValue = data.date instanceof Timestamp ? data.date.toDate() : (data.date ? new Date(data.date) : new Date());
          return {
            id: docSnap.id,
            date: format(dateValue, "yyyy-MM-dd"),
            weight: typeof data.weight === "number" ? data.weight : parseFloat(data.weight || "0"),
          };
        });
        setRecords(fetched);
        localStorage.setItem("weightRecords", JSON.stringify(fetched));
      });
    } catch (e) {
      console.error(e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  const handleAddRecord = () => {
    if (!weight || isNaN(parseFloat(weight))) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid weight number.",
        variant: "destructive"
      });
      return;
    }

    let weightValue = parseFloat(weight);
    if (unit === 'lbs') {
      weightValue = parseFloat((weightValue * 0.453592).toFixed(2));
    }

    if (weightValue < 30 || weightValue > 250) {
      toast({
        title: "Out of Range",
        description: "Please enter a realistic weight value.",
        variant: "destructive"
      });
      return;
    }

    setStep("analyzing");

    setStep("analyzing");

    const newRecordId = editingId || Date.now().toString();
    const newRecord: WeightRecord = {
      id: newRecordId,
      date: format(new Date(), "yyyy-MM-dd"),
      weight: weightValue,
    };

    if (user?.uid) {
      const recordRef = doc(db, "users", user.uid, "weightRecords", newRecordId);
      const data: any = {
        date: Timestamp.fromDate(new Date(newRecord.date)),
        weight: newRecord.weight,
        updatedAt: serverTimestamp(),
        source: "weight-tracker",
      };
      if (!editingId) {
        data.createdAt = serverTimestamp();
      }
      setDoc(recordRef, data, { merge: true }).catch(console.error);
    }

    setTimeout(() => {
      setWeight("");
      setEditingId(null);
      toast({
        title: editingId ? "Weight Updated" : "Weight Saved",
        description: "Your progress has been updated."
      });
      setStep("records");
    }, 1500);
  };

  const handleLogClick = () => {
    const todayRecord = records.find(r => isSameDay(new Date(r.date), new Date()));
    if (todayRecord) {
      setDailyRecord(todayRecord);
      setShowDailyLimitDialog(true);
    } else {
      setEditingId(null);
      setWeight("");
      setStep("log");
    }
  };

  const handleUpdateDailyRecord = () => {
    if (dailyRecord) {
      setEditingId(dailyRecord.id);
      setWeight(dailyRecord.weight.toString());
      setStep("log");
      setShowDailyLimitDialog(false);
    }
  };

  const handleDeleteAndStartFresh = async () => {
    if (dailyRecord) {
      await deleteDoc(doc(db, "users", user!.uid, "weightRecords", dailyRecord.id));
      setDailyRecord(null);
      setShowDailyLimitDialog(false);
      setEditingId(null);
      setWeight("");
      setStep("log");
      toast({ title: "Started Fresh", description: "Previous daily record removed." });
    }
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const deleteRecord = async () => {
    if (!recordToDelete) return;
    if (user?.uid) {
      await deleteDoc(doc(db, "users", user.uid, "weightRecords", recordToDelete)).catch(console.error);
    }
    toast({ title: "Record deleted" });
    setShowConfirmDelete(false);
    setRecordToDelete(null);
  };

    const filteredRecords = records
      .filter(r => 
        format(new Date(r.date), "MMMM d, yyyy").toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.weight.toString().includes(searchQuery)
      );

    const chartData = records
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(chartRange === 'last10' ? -10 : 0)
      .map(r => ({
        date: format(new Date(r.date), "MMM d"),
        weight: r.weight
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
              <div className="bg-blue-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-inner">
                <Scale className="h-10 w-10"  />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Weight Progress</h1>
              <p className="text-gray-600 text-lg">
                Track your healthy weight gain journey throughout your pregnancy to ensure optimal health for you and your baby.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleLogClick}
                className="h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
              >
                Log Weight
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
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">New Entry</h2>
              </div>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">


                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Weight</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.0"
                        step="0.1"
                        className="h-12 rounded-xl border-gray-100 bg-gray-50 flex-1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                      <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUnit('kg')}
                          className={`h-9 px-4 rounded-lg font-bold text-xs ${unit === 'kg' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                        >
                          KG
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUnit('lbs')}
                          className={`h-9 px-4 rounded-lg font-bold text-xs ${unit === 'lbs' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                        >
                          LBS
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                    <Info className="h-4 w-4" /> Recommendation
                  </p>
                  <p className="text-[11px] text-blue-900/60 mt-1">
                    Try to weigh yourself at the same time each day, preferably in the morning before breakfast.
                  </p>
                </div>

                <Button
                  onClick={handleAddRecord}
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-black shadow-lg transition-all hover:scale-[1.02]"
                >
                  Save Measurement
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
                  y: [0, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl"
              >
                <Activity className="h-12 w-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-400 rounded-[2rem] -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Recording Entry...</h2>
              <p className="text-gray-500 animate-pulse">Syncing with health profile</p>
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
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Weight History</h2>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{records.length} Record Found</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("chart")}
                  className="rounded-2xl h-10 px-4 font-bold text-xs uppercase"
                >
                  <BarChart3 className="h-4 w-4 mr-2" /> Trends
                </Button>
                
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by date or weight..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-gray-100 bg-white shadow-sm"
                />
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex bg-gray-50 rounded-2xl p-1 border border-gray-100 self-start sm:self-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                >
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                >
                  List
                </Button>
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Scale className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No records found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className={`grid gap-4 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {filteredRecords.slice(0, visibleCount).map((record, idx) => {
                    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    const currentIdx = sorted.findIndex(r => r.id === record.id);
                    const prev = sorted[currentIdx - 1];
                    let diff = 0;
                    if (prev) diff = record.weight - prev.weight;

                    return (
                      <Card key={record.id} className={`group border-0 shadow-md sm:shadow-lg rounded-2xl sm:rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}>
                        <CardContent className={`p-3 sm:p-6 space-y-2 sm:space-y-4 w-full ${viewMode === 'list' ? 'p-0 flex items-center justify-between space-y-0' : ''}`}>
                          <div className={`flex justify-between items-start ${viewMode === 'list' ? 'flex-1 items-center gap-4' : ''}`}>
                            <div className="space-y-0.5 sm:space-y-1">
                              <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(record.date), "MMMM d, yyyy")}</p>
                              <h3 className={`${viewMode === 'list' ? 'text-lg sm:text-xl' : 'text-xl sm:text-3xl'} font-black text-slate-900`}>{record.weight} <span className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-tight">KG</span></h3>
                            </div>
                            {viewMode === 'list' && (
                              <div className={`flex items-center gap-1 font-black text-xs ${diff > 0 ? 'text-green-500' : diff < 0 ? 'text-blue-500' : 'text-gray-400'}`}>
                                {diff > 0 ? <ArrowUpRight className="h-3 w-3" /> : diff < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                {Math.abs(diff).toFixed(1)} KG
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
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          {viewMode === 'grid' && (
                            <div className="pt-2 sm:pt-4 border-t border-gray-50 flex items-center justify-between">
                              <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Progress</p>
                              <div className={`flex items-center gap-0.5 sm:gap-1 font-black text-[10px] sm:text-xs ${diff > 0 ? 'text-green-500' : diff < 0 ? 'text-blue-500' : 'text-gray-400'}`}>
                                {diff > 0 ? <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : diff < 0 ? <ArrowDownRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                                {Math.abs(diff).toFixed(1)} KG
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {visibleCount < filteredRecords.length && (
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-2xl text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                    onClick={() => setVisibleCount(prev => prev + 20)}
                  >
                    Load More Records ({filteredRecords.length - visibleCount} remaining)
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("records")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Weight Trends</h2>
              </div>
              <div className="flex bg-gray-50 rounded-2xl p-1 border border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChartRange('last10')}
                  className={`h-9 px-4 rounded-xl font-bold text-xs ${chartRange === 'last10' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                >
                  Last 10
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChartRange('all')}
                  className={`h-9 px-4 rounded-xl font-bold text-xs ${chartRange === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                >
                  All Time
                </Button>
              </div>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white p-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={chartData}>
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
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{
                        borderRadius: '1rem',
                        border: 'none',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        fontWeight: 'bold'
                      }}
                    />
                    <Bar
                      dataKey="weight"
                      fill="#3b82f6"
                      radius={[10, 10, 0, 0]}
                      barSize={chartRange === 'all' ? undefined : 40}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index % 4]} />
                      ))}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth Observation</p>
                  <p className="text-sm font-bold text-gray-700">Healthy weight gain is a positive indicator of your baby's continuous development.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">Delete Record?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              This measurement will be permanently removed from your progress history.
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

      <Dialog open={showDailyLimitDialog} onOpenChange={setShowDailyLimitDialog}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500">
              <Calendar className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">One Record Per Day</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              You've already logged your weight today. Would you like to update it or start fresh?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={handleUpdateDailyRecord} className="flex-1 h-12 rounded-xl font-bold border-2">
              Update Existing
            </Button>
            <Button variant="default" onClick={handleDeleteAndStartFresh} className="flex-1 h-12 rounded-xl font-bold bg-slate-900 text-white">
              Start Fresh
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