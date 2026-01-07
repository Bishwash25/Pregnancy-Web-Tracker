import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Play,
  Square,
  Timer,
  Trash2,
  BarChart3,
  History,
  Zap,
  TrendingUp,
  CheckCircle2,
  Info,
  Clock,
  Activity,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp, collection, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface Contraction {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
}

interface ContractionSession {
  id: string;
  date: string;
  contractions: {
    startTime: string;
    duration: string;
    interval: string;
  }[];
  averageDuration: string;
  averageInterval: string;
}

type Step = "intro" | "tracking" | "analyzing" | "records" | "chart";

  export default function ContractionTimer({ onBack }: { onBack: () => void }) {
    const [step, setStep] = useState<Step>("intro");
    const [isTracking, setIsTracking] = useState(false);
    const [currentContraction, setCurrentContraction] = useState<Contraction | null>(null);
    const [contractions, setContractions] = useState<Contraction[]>([]);
    const [elapsedTime, setElapsedTime] = useState("00:00");
    const [sessions, setSessions] = useState<ContractionSession[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [chartRange, setChartRange] = useState<'last5' | 'all'>('last5');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { toast } = useToast();
    const { user } = useAuth();


  useEffect(() => {
    const storedSessions = localStorage.getItem("contractionSessions");
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(
        collection(db, "users", user.uid, "Contraction"),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched: ContractionSession[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          const dateValue = data.date instanceof Timestamp ? data.date.toDate() : (data.date ? new Date(data.date) : new Date());
          return {
            id: docSnap.id,
            date: format(dateValue, "yyyy-MM-dd"),
            contractions: Array.isArray(data.contractions) ? data.contractions : [],
            averageDuration: data.averageDuration || "0m 0s",
            averageInterval: data.averageInterval || "0m 0s",
          };
        });
        setSessions(fetched);
        localStorage.setItem("contractionSessions", JSON.stringify(fetched));
      });
    } catch (e) {
      console.error(e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentContraction && !currentContraction.endTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffSecs = Math.floor((now.getTime() - currentContraction.startTime.getTime()) / 1000);
        const mins = Math.floor(diffSecs / 60);
        const secs = diffSecs % 60;
        setElapsedTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentContraction]);

  // New state for daily limit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dailySession, setDailySession] = useState<ContractionSession | null>(null);
  const [showDailyLimitDialog, setShowDailyLimitDialog] = useState(false);

  const handleStartClick = () => {
    const todaySession = sessions.find(s => isSameDay(new Date(s.date), new Date()));
    if (todaySession) {
      setDailySession(todaySession);
      setShowDailyLimitDialog(true);
    } else {
      setEditingId(null);
      startContraction();
    }
  };

  const handleResumeSession = () => {
    if (dailySession) {
      setEditingId(dailySession.id);
      // Reconstruct contractions from dailySession
      // Note: dailySession.contractions has strings for duration/interval.
      // We need to be careful. The ContractionSession interface stores strings.
      // But the state 'contractions' uses 'Contraction' interface with Dates.
      // It's hard to reconstruct exact Dates from "HH:mm:ss" strings without date info.
      // However, for resuming purposes, maybe we just want to ADD to it?
      // But 'handleEndSession' replaces the entire list.
      // If we can't reconstruct, we might overwrite old data if we just start empty.
      // Strategy: Since ContractionSession stores `contractions` as an array of objects with string times,
      // and we want to append, we probably need to handle 'handleEndSession' to MERGE or we need to parse.
      // Parsing "HH:mm:ss" from "today" is possible assuming they were today.

      const parsedContractions: Contraction[] = dailySession.contractions.map((c, i) => {
        // Assume c.startTime is "HH:mm:ss"
        const [hours, minutes, seconds] = c.startTime.split(":").map(Number);
        const date = new Date(dailySession.date);
        date.setHours(hours, minutes, seconds);

        // Parse duration "Xm Ys"
        const durParts = c.duration.split("m ");
        const durMins = parseInt(durParts[0]);
        const durSecs = parseInt(durParts[1]);
        const durationSeconds = durMins * 60 + durSecs;

        const endTime = new Date(date.getTime() + durationSeconds * 1000);

        return {
          id: `${dailySession.id}_${i}`,
          startTime: date,
          endTime: endTime,
          duration: durationSeconds
        };
      });

      setContractions(parsedContractions);
      setStep("tracking");
      // Don't start a contraction immediately, just open tracking view logic?
      // But 'startContraction' starts a contraction.
      // We want to be in "tracking" mode but Idle?
      // ContractionTimer logic: "Start Tracking" button calls startContraction() which starts a contraction.
      // Ideally we want to land on the screen where we can start a *next* contraction.
      // If isTracking is false, we see "Start Next".

      setIsTracking(false);
      setElapsedTime("00:00");
      setCurrentContraction(null);
      setShowDailyLimitDialog(false);
      toast({
        title: "Session Resumed",
        description: `Loaded ${parsedContractions.length} previous contractions`,
      });
    }
  };

  const handleStartFresh = async () => {
    if (dailySession?.id && user?.uid) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "Contraction", dailySession.id));
        setEditingId(null);
        setContractions([]);
        startContraction();
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

  const startContraction = () => {
    setStep("tracking");
    setIsTracking(true);
    setElapsedTime("00:00");
    setCurrentContraction({
      id: Date.now().toString(),
      startTime: new Date(),
      endTime: null,
      duration: null,
    });
    toast({
      title: "Contraction Started",
      description: "Keep breathing deeply",
    });
  };

  const stopContraction = () => {
    if (!currentContraction) return;
    const endTime = new Date();
    const durationSecs = Math.round((endTime.getTime() - currentContraction.startTime.getTime()) / 1000);
    setContractions([...contractions, { ...currentContraction, endTime, duration: durationSecs }]);
    setCurrentContraction(null);
    setIsTracking(false);
    toast({
      title: "Contraction Ended",
    });
  };

  const handleEndSession = () => {
    if (contractions.length === 0) return;
    setStep("analyzing");

    const durations = contractions.map(c => c.duration || 0);
    const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);

    const intervals: number[] = [];
    for (let i = 1; i < contractions.length; i++) {
      intervals.push(Math.round((contractions[i].startTime.getTime() - contractions[i - 1].startTime.getTime()) / 1000));
    }
    const avgInterval = intervals.length > 0 ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length) : 0;

    const formattedContractions = contractions.map((c, i) => ({
      startTime: format(c.startTime, "HH:mm:ss"),
      duration: `${Math.floor((c.duration || 0) / 60)}m ${(c.duration || 0) % 60}s`,
      interval: i > 0 ? `${Math.floor(intervals[i - 1] / 60)}m ${intervals[i - 1] % 60}s` : "-"
    }));

    const newSessionId = editingId || Date.now().toString();
    if (user?.uid) {
      const sessionData: any = {
        date: Timestamp.fromDate(new Date()),
        contractions: formattedContractions,
        averageDuration: `${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`,
        averageInterval: `${Math.floor(avgInterval / 60)}m ${avgInterval % 60}s`,
        updatedAt: serverTimestamp(),
        source: "contraction-timer",
      };

      if (!editingId) {
        sessionData.createdAt = serverTimestamp();
      }

      setDoc(doc(db, "users", user.uid, "Contraction", newSessionId), sessionData, { merge: true }).catch(console.error);
    }

    setTimeout(() => {
      setContractions([]);
      toast({
        title: editingId ? "Session Updated" : "Session Saved",
        description: "Your contraction history has been updated",
      });
      setStep("records");
      setEditingId(null);
    }, 1500);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const deleteSession = async () => {
    if (!sessionToDelete) return;
    if (user?.uid) {
      await deleteDoc(doc(db, "users", user.uid, "Contraction", sessionToDelete)).catch(console.error);
    }
    toast({ title: "Session deleted" });
    setShowConfirmDelete(false);
    setSessionToDelete(null);
  };

    const filteredSessions = sessions.filter(session => 
      format(new Date(session.date), "MMMM d, yyyy").toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.contractions.length.toString().includes(searchQuery)
    );

    const chartData = sessions
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(chartRange === 'last5' ? -5 : 0)
      .map(s => {
        const durParts = s.averageDuration.split('m ');
        const duration = parseInt(durParts[0]) * 60 + parseInt(durParts[1]);
        const intParts = s.averageInterval.split('m ');
        const interval = parseInt(intParts[0]) * 60 + parseInt(intParts[1]);
        return {
          date: format(new Date(s.date), "MMM d"),
          duration,
          interval,
          count: s.contractions.length
        };
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
              <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-rose-600 shadow-inner">
                <Activity className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Labor Timer</h1>
              <p className="text-gray-600 text-lg">
                Precisely track contraction duration and frequency to monitor your progress and know when it's time to head to the hospital.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleStartClick}
                className="h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
              >
                Start Tracking
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

        {step === "tracking" && (
          <motion.div
            key="tracking"
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
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Labor</h2>
              </div>
              <Badge variant="secondary" className="bg-rose-50 text-rose-600 font-bold px-4 py-2 rounded-xl border border-rose-100">
                Session Active
              </Badge>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white text-center">
              <CardContent className="p-12 space-y-12">
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-3xl font-black text-slate-900">{contractions.length}</p>
                  </div>
                  <div className="h-12 w-[1px] bg-gray-100" />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last</p>
                    <p className="text-3xl font-black text-rose-600">
                      {contractions.length > 0 ? contractions[contractions.length - 1].duration + 's' : '--'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {isTracking ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Duration</p>
                        <h3 className="text-7xl font-black text-slate-900 tracking-tighter animate-pulse">{elapsedTime}</h3>
                      </div>
                      <Button
                        size="lg"
                        onClick={stopContraction}
                        className="w-full h-24 rounded-[2rem] bg-rose-500 hover:bg-rose-600 text-white shadow-xl transition-all active:scale-95"
                      >
                        <Square className="h-8 w-8 mr-3" />
                        <span className="text-xl font-black uppercase tracking-tight">Stop Timer</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      onClick={startContraction}
                      className="w-full h-24 rounded-[2rem] bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all active:scale-95"
                    >
                      <Play className="h-8 w-8 mr-3 fill-white" />
                      <span className="text-xl font-black uppercase tracking-tight">Start Next</span>
                    </Button>
                  )}

                  {!isTracking && contractions.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={handleEndSession}
                      className="w-full h-14 rounded-2xl text-rose-600 hover:bg-rose-50 font-bold uppercase tracking-widest text-xs"
                    >
                      Finalize Session
                    </Button>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center justify-center gap-2">
                    <Info className="h-4 w-4" /> 5-1-1 Rule
                  </p>
                  <p className="text-[11px] text-rose-900/60 mt-1">
                    Contractions 5 mins apart, lasting 1 min, for 1 hour? Call your doctor.
                  </p>
                </div>
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
                className="absolute inset-0 bg-rose-400 rounded-[2rem] -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Processing Session...</h2>
              <p className="text-gray-500 animate-pulse">Calculating frequency & intensity</p>
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
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Labor Records</h2>
                  <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">{sessions.length} Recorded Phases</p>
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
                  placeholder="Search by date or waves..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-gray-100 bg-white shadow-sm"
                />
                <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex bg-gray-50 rounded-2xl p-1 border border-gray-100 self-start sm:self-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'grid' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-400'}`}
                >
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'list' ? 'bg-white shadow-sm text-rose-600' : 'text-gray-400'}`}
                >
                  List
                </Button>
              </div>
            </div>

            {filteredSessions.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Timer className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No contractions recorded</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className={`grid gap-4 max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {filteredSessions.slice(0, visibleCount).map((session) => (
                    <Card key={session.id} className={`group border-0 shadow-lg rounded-3xl overflow-hidden bg-white hover:shadow-xl transition-all ${viewMode === 'list' ? 'p-1' : ''}`}>
                      <CardContent className={`p-4 sm:p-6 space-y-3 sm:space-y-4 ${viewMode === 'list' ? 'p-3' : ''}`}>
                        <div className={`flex justify-between items-start ${viewMode === 'list' ? 'items-center gap-4' : ''}`}>
                          <div className={`space-y-1 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(session.date), "MMMM d, yyyy")}</p>
                            <h3 className={`${viewMode === 'list' ? 'text-xl' : 'text-2xl sm:text-3xl'} font-black text-slate-900`}>{session.contractions.length} <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">Waves</span></h3>
                          </div>
                          {viewMode === 'list' && (
                            <div className="flex gap-4 text-right">
                              <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Avg Dur</p>
                                <p className="text-[10px] font-black text-rose-600">{session.averageDuration}</p>
                              </div>
                              <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Avg Int</p>
                                <p className="text-[10px] font-black text-slate-700">{session.averageInterval}</p>
                              </div>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSessionToDelete(session.id);
                              setShowConfirmDelete(true);
                            }}
                            className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {viewMode === 'grid' && (
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-50">
                            <div>
                              <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Avg Duration</p>
                              <p className="text-[10px] sm:text-xs font-black text-rose-600">{session.averageDuration}</p>
                            </div>
                            <div>
                              <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Avg Interval</p>
                              <p className="text-[10px] sm:text-xs font-black text-slate-700">{session.averageInterval}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {visibleCount < filteredSessions.length && (
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-2xl text-rose-600 font-bold hover:bg-rose-50 transition-colors"
                    onClick={() => setVisibleCount(prev => prev + 20)}
                  >
                    Load More Records ({filteredSessions.length - visibleCount} remaining)
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
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Labor Intensity</h2>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-white p-8">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Bar dataKey="duration" name="Avg Duration (s)" fill="#f43f5e" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="interval" name="Avg Interval (s)" fill="#475569" radius={[10, 10, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Labor Progress</p>
                  <p className="text-sm font-bold text-gray-700">Decreasing intervals and increasing durations typically signal active labor.</p>
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
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">Remove Record?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              This labor session will be permanently deleted from your tracking history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)} className="flex-1 h-12 rounded-xl font-bold border-2">
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteSession} className="flex-1 h-12 rounded-xl font-bold bg-red-600">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDailyLimitDialog} onOpenChange={setShowDailyLimitDialog}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">One Record Per Day</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              You already have a labor session for today. Would you like to resume it or start fresh?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleResumeSession}
              className="h-14 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
            >
              Resume Session
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