import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Footprints,
  BarChart3,
  History,
  Timer,
  Zap,
  TrendingUp,
  CheckCircle2,
  Info,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, Timestamp, collection, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
import { format, isSameDay } from "date-fns";
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
import { Badge } from "@/components/ui/badge";

interface KickSession {
  id: string;
  date: string;
  startTime: string;
  duration: string;
  kickCount: number;
}

type Step = "intro" | "counting" | "analyzing" | "records" | "chart";

  export default function KickCounter({ onBack }: { onBack: () => void }) {
    const isMobile = useIsMobile();
    const [step, setStep] = useState<Step>("intro");
    const [isActive, setIsActive] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [kickCount, setKickCount] = useState(0);
    const [sessions, setSessions] = useState<KickSession[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [chartRange, setChartRange] = useState<'last10' | 'all'>('last10');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { toast } = useToast();
    const { user } = useAuth();


  // New state for daily limit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dailySession, setDailySession] = useState<KickSession | null>(null);
  const [showDailyLimitDialog, setShowDailyLimitDialog] = useState(false);

  useEffect(() => {
    const storedSessions = localStorage.getItem("kickSessions");
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(
        collection(db, "users", user.uid, "Kick"),
        orderBy("createdAt", "desc")
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched: KickSession[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          const dateValue = data.date instanceof Timestamp ? data.date.toDate() : (data.date ? new Date(data.date) : new Date());
          return {
            id: docSnap.id,
            date: format(dateValue, "yyyy-MM-dd"),
            startTime: data.startTime || "",
            duration: data.duration || "",
            kickCount: typeof data.kickCount === "number" ? data.kickCount : parseInt(data.kickCount ?? 0, 10),
          };
        });
        setSessions(fetched);
        localStorage.setItem("kickSessions", JSON.stringify(fetched));
      });
    } catch (e) {
      console.error(e);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  const handleStartClick = () => {
    const todaySession = sessions.find(s => isSameDay(new Date(s.date), new Date()));
    if (todaySession) {
      setDailySession(todaySession);
      setShowDailyLimitDialog(true);
    } else {
      setEditingId(null);
      handleStartSession();
    }
  };

  const handleStartSession = () => {
    setStep("counting");
    setIsActive(true);
    setStartTime(new Date());
    setKickCount(0);
    toast({
      title: "Session Started",
      description: "Tap the button each time you feel a kick",
    });
  };

  const handleResumeSession = () => {
    if (dailySession) {
      setEditingId(dailySession.id);
      setStep("counting");
      setIsActive(true);
      setStartTime(new Date());
      setKickCount(dailySession.kickCount);
      setShowDailyLimitDialog(false);
      toast({
        title: "Session Resumed",
        description: `Continuing from ${dailySession.kickCount} kicks`,
      });
    }
  };

  const handleStartFresh = async () => {
    if (dailySession?.id && user?.uid) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "Kick", dailySession.id));
        setEditingId(null);
        handleStartSession();
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

  const handleKick = () => {
    if (isActive) {
      setKickCount((prev) => prev + 1);
    }
  };

  const handleEndSession = () => {
    if (!isActive || !startTime) return;

    setStep("analyzing");
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    const durationStr = `${diffMins} min ${diffSecs} sec`;

    // Use existing ID if editing, otherwise generate new one
    const newSessionId = editingId || Date.now().toString();
    const newSession: KickSession = {
      id: newSessionId,
      date: format(now, "yyyy-MM-dd"),
      startTime: format(startTime, "HH:mm"),
      duration: durationStr,
      kickCount: kickCount,
    };

    if (user?.uid) {
      const sessionRef = doc(db, "users", user.uid, "Kick", newSessionId);

      const sessionData: any = {
        date: Timestamp.fromDate(new Date(newSession.date)),
        startTime: newSession.startTime,
        duration: newSession.duration,
        kickCount: newSession.kickCount,
        updatedAt: serverTimestamp(),
        source: "kick-counter",
      };

      // Only set createdAt for new records
      if (!editingId) {
        sessionData.createdAt = serverTimestamp();
      }

      setDoc(sessionRef, sessionData, { merge: true }).catch(console.error);
    }

    setTimeout(() => {
      setIsActive(false);
      setStartTime(null);
      setKickCount(0);
      toast({
        title: editingId ? "Session Updated" : "Session Saved",
        description: `Recorded ${newSession.kickCount} kicks`,
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
      try {
        await deleteDoc(doc(db, "users", user.uid, "Kick", sessionToDelete));
      } catch (e) {
        console.error(e);
      }
    }
    toast({
      title: "Session deleted",
      duration: 1500,
    });
    setShowConfirmDelete(false);
    setSessionToDelete(null);
  };

  const [elapsedTime, setElapsedTime] = useState("00:00");
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffMs = now.getTime() - startTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        setElapsedTime(`${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

    const filteredSessions = sessions.filter(session => 
      format(new Date(session.date), "MMMM d, yyyy").toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.kickCount.toString().includes(searchQuery)
    );

    const chartData = sessions
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(chartRange === 'last10' ? -10 : 0)
      .map(s => ({
        date: format(new Date(s.date), "MMM d"),
        kicks: s.kickCount
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
              <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-teal-600 shadow-inner">
                <Footprints className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Baby Movement Tracker</h1>
              <p className="text-gray-600 text-lg">
                Monitoring your baby's movements is a vital part of prenatal care. Track fetal activity to ensure everything is progressing perfectly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleStartClick}
                className="h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
              >
                Start Counting
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

        {step === "counting" && (
          <motion.div
            key="counting"
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
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Session</h2>
              </div>
              <Badge variant="secondary" className="bg-teal-50 text-teal-600 font-bold px-4 py-2 rounded-xl border border-teal-100 animate-pulse">
                <Timer className="h-4 w-4 mr-2" /> {elapsedTime}
              </Badge>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white text-center">
              <CardContent className="p-12 space-y-12">
                <div className="space-y-2">
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Movements</p>
                  <h3 className="text-8xl font-black text-slate-900 tracking-tighter">{kickCount}</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    size="lg"
                    onClick={handleKick}
                    className="h-32 rounded-[2rem] bg-teal-500 hover:bg-teal-600 text-white shadow-xl transition-all active:scale-95 group"
                  >
                    <div className="flex flex-col items-center">
                      <Footprints className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xl font-black uppercase tracking-tight">Record Kick</span>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleEndSession}
                    className="h-14 rounded-2xl text-red-500 hover:bg-red-50 font-bold uppercase tracking-widest text-xs"
                  >
                    Complete Session
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-2">
                    <Info className="h-4 w-4" /> Recommendation
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Try to count 10 movements within a 2-hour window. Most babies take less than 30 minutes.
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
                <Footprints className="h-12 w-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-teal-400 rounded-[2rem] -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Finalizing Data...</h2>
              <p className="text-gray-500 animate-pulse">Syncing session results</p>
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
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Session History</h2>
                  <p className="text-sm font-bold text-teal-600 uppercase tracking-widest">{sessions.length} Records Found</p>
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
                  placeholder="Search by date or kicks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl border-gray-100 bg-white shadow-sm"
                />
                <Footprints className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex bg-gray-50 rounded-2xl p-1 border border-gray-100 self-start sm:self-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-400'}`}
                >
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-10 px-4 rounded-xl font-bold text-xs ${viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-400'}`}
                >
                  List
                </Button>
              </div>
            </div>

            {filteredSessions.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Footprints className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No movements recorded yet</p>
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
                            <h3 className={`${viewMode === 'list' ? 'text-xl' : 'text-2xl sm:text-3xl'} font-black text-slate-900`}>{session.kickCount} <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase">Kicks</span></h3>
                          </div>
                          {viewMode === 'list' && (
                            <div className="flex gap-4 text-right">
                              <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Time</p>
                                <p className="text-[10px] font-black text-gray-700">{session.startTime}</p>
                              </div>
                              <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">Dur</p>
                                <p className="text-[10px] font-black text-gray-700">{session.duration.split(' ')[0]}m</p>
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
                              <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Start Time</p>
                              <p className="text-[10px] sm:text-xs font-black text-gray-700">{session.startTime}</p>
                            </div>
                            <div>
                              <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
                              <p className="text-[10px] sm:text-xs font-black text-gray-700">{session.duration}</p>
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
                    className="w-full h-12 rounded-2xl text-teal-600 font-bold hover:bg-teal-50 transition-colors"
                    onClick={() => setVisibleCount(prev => prev + 20)}
                  >
                    Load More Sessions ({filteredSessions.length - visibleCount} remaining)
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
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Activity Trends</h2>
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
                      dataKey="kicks"
                      fill="#14b8a6"
                      radius={[10, 10, 0, 0]}
                      barSize={40}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.kicks >= 10 ? '#0f766e' : '#14b8a6'} />
                      ))}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-3 bg-teal-100 rounded-xl text-teal-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Growth Observation</p>
                  <p className="text-sm font-bold text-gray-700">Consistent movement patterns often indicate baby's sleep and wake cycles.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showDailyLimitDialog} onOpenChange={setShowDailyLimitDialog}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-teal-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">One Record Per Day</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              You already have a session for today. Would you like to resume it or start fresh?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleResumeSession}
              className="h-14 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
            >
              Resume Session (Add Kicks)
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
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">Delete Record?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              This session data will be permanently removed from your history.
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