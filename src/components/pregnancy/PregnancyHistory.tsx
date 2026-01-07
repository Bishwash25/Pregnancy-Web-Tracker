import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import { format } from "date-fns";
import { 
  Scale, 
  Activity, 
  Footprints, 
  Timer, 
  Calculator, 
  Smile, 
  Baby,
  Calendar,
  ChevronDown,
  ChevronUp,
  BarChart,
  History,
  CalendarDays,
  LineChart,
  Dumbbell,
  SmilePlus,
  FileText,
  Trash2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronRight,
  Heart,
  Brain,
Search,
LayoutGrid,
List
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// Types for the records
interface BaseRecord {
  id: string;
  date: string | Date;
}

function HistoryItem({ item, onDelete }: { item: { record: any; type: string; date: Date }, onDelete: (id: string, type: string) => void }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getIcon = () => {
    switch (item.type) {
      case "weight": return <Scale className="h-5 w-5" />;
      case "bmi": return <Calculator className="h-5 w-5" />;
      case "exercise": return <Activity className="h-5 w-5" />;
      case "kick": return <Footprints className="h-5 w-5" />;
      case "contraction": return <Timer className="h-5 w-5" />;
      case "mood": return <Brain className="h-5 w-5" />;
      case "gender": return <Baby className="h-5 w-5" />;
      default: return <History className="h-5 w-5" />;
    }
  };

  const getColorClass = () => {
    switch (item.type) {
      case "weight": return "from-pink-500 to-rose-600";
      case "bmi": return "from-blue-500 to-indigo-600";
      case "exercise": return "from-emerald-500 to-teal-600";
      case "kick": return "from-purple-500 to-violet-600";
      case "contraction": return "from-orange-500 to-red-600";
      case "mood": return "from-fuchsia-500 to-pink-600";
      case "gender": return "from-sky-500 to-blue-600";
      default: return "from-slate-500 to-slate-700";
    }
  };

  return (
    <Card className="group border-0 shadow-lg rounded-[2rem] overflow-hidden bg-white mb-6 hover:shadow-xl transition-all duration-300">
      <div className={`p-5 text-white bg-gradient-to-br ${getColorClass()} flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
            {getIcon()}
          </div>
          <div>
            <p className="font-black uppercase tracking-widest text-[10px] opacity-80">{item.type} Record</p>
            <p className="font-black text-sm">{format(item.date, "MMM d, yyyy")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-red-400/20 hover:bg-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-sm">
              <AlertDialogHeader className="space-y-4 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <Trash2 className="h-8 w-8" />
                </div>
                  <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter text-gray-900">Hide from view?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500 font-bold">
                    This record will be removed from this page but kept safe in your secure history. It won't be deleted permanently.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-3 pt-6">
                  <AlertDialogCancel className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-2">Keep</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item.record.id, item.type)} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-indigo-600">Hide</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <CardContent className="p-6 pt-4 space-y-4 bg-slate-50/50">
              <div className="space-y-3">
                {item.type === "weight" && (
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Recorded Weight</span>
                    <span className="text-sm font-black text-slate-900">{item.record.weight} {item.record.weightUnit || 'kg'}</span>
                  </div>
                )}
                {item.type === "bmi" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">BMI Index</p>
                        <p className="text-sm font-black text-blue-600">{item.record.bmi?.toFixed(1)}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</p>
                        <p className="text-sm font-black text-indigo-600">{item.record.category}</p>
                      </div>
                    </div>
                  </>
                )}
                {item.type === "mood" && (
                  <div className="space-y-3">
                    {Object.entries(item.record)
                      .filter(([k, v]) => typeof v === 'number' && !['id', 'date', 'other_intensity'].includes(k) && v > 0)
                      .map(([k, v]) => (
                        <div key={k} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                            <span>{k.replace(/_/g, ' ')}</span>
                            <span>{String(v)}/10</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(v as number) * 10}%` }} className="h-full bg-fuchsia-500" />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                  {item.type === "exercise" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</p>
                        <p className="text-sm font-black text-emerald-600">{item.record.exerciseType}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</p>
                        <p className="text-sm font-black text-teal-600">{item.record.duration} min</p>
                      </div>
                    </div>
                  )}
                  {item.type === "kick" && (
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Movement Count</span>
                    <span className="text-sm font-black text-purple-600">{item.record.kickCount || item.record.count} kicks / {item.record.duration}m</span>
                  </div>
                )}
                {item.type === "contraction" && (
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Frequency</span>
                      <span className="text-sm font-black text-orange-600">{item.record.contractions?.length || 0} times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Avg Interval</span>
                      <span className="text-sm font-black text-slate-700">{item.record.averageInterval || "N/A"}</span>
                    </div>
                  </div>
                )}
                {(item.record.notes || item.record.other_mood) && (
                  <div className="p-4 rounded-xl bg-white shadow-sm border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Observation Notes</p>
                    <p className="text-xs font-medium text-slate-600 italic leading-relaxed">"{item.record.notes || item.record.other_mood}"</p>
                    {item.record.other_intensity !== undefined && item.record.other_intensity !== null && (
                      <div className="mt-3">
                        <span className="text-[10px] font-black text-purple-600 uppercase">{item.record.other_intensity}/10 Intensity</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function PregnancyHistory() {
  const isMobile = useIsMobile();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("pregnancyHistoryActiveTab") || "all");
  const [allRecords, setAllRecords] = useState<{ record: any; type: string; date: Date }[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenRecordIds, setHiddenRecordIds] = useState<string[]>([]);
const [searchTerm, setSearchTerm] = useState("");
const [viewMode, setViewMode] = useState<"list" | "grid">("list");
const [visibleItemsCount, setVisibleItemsCount] = useState(10);
const itemsPerPage = 10;

  useEffect(() => {
    localStorage.setItem("pregnancyHistoryActiveTab", activeTab);
  }, [activeTab]);

  const safeParseDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) return dateValue;
    if (typeof dateValue === 'string') {
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) return parsedDate;
    }
    if (typeof dateValue === 'number') return new Date(dateValue);
    return null;
  };

  const firebaseCollections = {
    weight: "weightRecords",
    bmi: "BMI",
    exercise: "Exercise",
    kick: "Kick",
    contraction: "Contraction",
    mood: "Moods"
  };

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const unsubscribes: (() => void)[] = [];
    const recordsMap = new Map<string, { record: any; type: string; date: Date }>();
    let pendingUpdates = Object.keys(firebaseCollections).length;

    Object.entries(firebaseCollections).forEach(([type, collectionName]) => {
      const q = query(collection(db, "users", user.uid, collectionName), orderBy("createdAt", "desc"));
      unsubscribes.push(onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          const dateValue = data.date || data.createdAt;
          const parsedDate = safeParseDate(dateValue?.toDate ? dateValue.toDate() : dateValue);
          if (parsedDate) {
            recordsMap.set(`${type}-${docSnap.id}`, {
              record: { ...data, id: docSnap.id },
              type,
              date: parsedDate
            });
          }
        });
        
        snapshot.docChanges().forEach(change => {
          if (change.type === 'removed') {
            recordsMap.delete(`${type}-${change.doc.id}`);
          }
        });

        pendingUpdates--;
        if (pendingUpdates <= 0) {
          const combined = Array.from(recordsMap.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
          setAllRecords(combined);
          setLoading(false);
        }
      }, (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        pendingUpdates--;
        if (pendingUpdates <= 0) {
          setLoading(false);
        }
      }));
    });

    return () => unsubscribes.forEach(u => u());
  }, [user?.uid]);

  const loadRecords = () => {
    // Trigger re-fetch by forcing component update - actual loading happens in useEffect
  };

  const handleDeleteRecord = (id: string, type: string) => {
    if (!user?.uid) {
      toast.error("Please sign in to manage records");
      return;
    }
    
    const hiddenId = `${type}-${id}`;
    const updated = [...hiddenRecordIds, hiddenId];
    setHiddenRecordIds(updated);
    toast.success("Record removed from view");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header - matching image design
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Pregnancy Health History", pageWidth / 2, 25, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), "yyyy-MM-dd")}`, pageWidth / 2, 38, { align: "center" });
    
    let currentY = 55;
    const recordsToExport = allRecords.filter(r => !hiddenRecordIds.includes(`${r.type}-${r.record.id}`));

    // Table Styling - matching image (lavender header, black text, full borders)
    const tableConfig: any = {
      theme: "grid",
      headStyles: { 
        fillColor: [230, 230, 250], 
        textColor: [0, 0, 0], 
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [0, 0, 0]
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        fontSize: 10,
        cellPadding: 4,
        textColor: [0, 0, 0]
      },
      margin: { left: 15, right: 15 },
    };

    // 1. Weight Tracker
    const weightRecords = recordsToExport.filter(r => r.type === "weight");
    if (weightRecords.length > 0) {
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Weight Tracker", 15, currentY);
      currentY += 10;

      autoTable(doc, {
        ...tableConfig,
        startY: currentY,
        head: [["Date", "Weight", "Unit", "Notes"]],
        body: weightRecords.map(r => [
          format(r.date, "yyyy-MM-dd"),
          r.record.weight || "N/A",
          r.record.weightUnit || "kg",
          r.record.notes || "-"
        ]),
      });
      currentY = (doc as any).lastAutoTable.finalY + 18;
    }

    // 2. BMI Analysis
    const bmiRecords = recordsToExport.filter(r => r.type === "bmi");
    if (bmiRecords.length > 0) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("BMI Analysis", 15, currentY);
      currentY += 10;

      autoTable(doc, {
        ...tableConfig,
        startY: currentY,
        head: [["Date", "BMI", "Category", "Height", "Weight"]],
        body: bmiRecords.map(r => [
          format(r.date, "yyyy-MM-dd"),
          r.record.bmi?.toFixed(1) || "N/A",
          r.record.category || "N/A",
          `${r.record.height || "N/A"} cm`,
          `${r.record.weight || "N/A"} kg`
        ]),
      });
      currentY = (doc as any).lastAutoTable.finalY + 18;
    }

    // 3. Emotional Hub (Moods)
    const moodRecords = recordsToExport.filter(r => r.type === "mood");
    if (moodRecords.length > 0) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Emotional Hub", 15, currentY);
      currentY += 10;

      autoTable(doc, {
        ...tableConfig,
        startY: currentY,
        head: [["Date", "Mood Summary", "Observation"]],
        body: moodRecords.map(r => {
          const moods = Object.entries(r.record)
            .filter(([k, v]) => typeof v === 'number' && !['id', 'date', 'other_intensity'].includes(k) && v > 0)
            .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}/10`)
            .join(", ");
          const observation = r.record.other_mood || r.record.notes || "-";
          const intensity = (r.record.other_intensity !== undefined && r.record.other_intensity !== null) ? ` (${r.record.other_intensity}/10)` : "";
          return [
            format(r.date, "yyyy-MM-dd"),
            moods || "No specific moods recorded",
            observation === "-" ? "-" : `${observation}${intensity}`
          ];
        }),
      });
      currentY = (doc as any).lastAutoTable.finalY + 18;
    }

    // 4. Exercise Records
    const exerciseRecords = recordsToExport.filter(r => r.type === "exercise");
    if (exerciseRecords.length > 0) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Exercise Records", 15, currentY);
      currentY += 10;

      autoTable(doc, {
        ...tableConfig,
        startY: currentY,
        head: [["Date", "Type", "Duration", "Intensity", "Notes"]],
        body: exerciseRecords.map(r => [
          format(r.date, "yyyy-MM-dd"),
          r.record.exerciseType || "N/A",
          `${r.record.duration || "N/A"} min`,
          r.record.intensity || "N/A",
          r.record.notes || "-"
        ]),
      });
      currentY = (doc as any).lastAutoTable.finalY + 18;
    }

    // 5. Fetal Activity (Kicks)
    const kickRecords = recordsToExport.filter(r => r.type === "kick");
    if (kickRecords.length > 0) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Fetal Activity", 15, currentY);
      currentY += 10;

      autoTable(doc, {
        ...tableConfig,
        startY: currentY,
        head: [["Date", "Kick Count", "Duration", "Notes"]],
        body: kickRecords.map(r => {
          let durationStr = r.record.duration || "N/A";
          if (typeof durationStr === "number") durationStr = `${durationStr} min`;
          return [
            format(r.date, "yyyy-MM-dd"),
            r.record.kickCount || r.record.count || "N/A",
            durationStr,
            r.record.notes || "-"
          ];
        }),
      });
      currentY = (doc as any).lastAutoTable.finalY + 18;
    }

    // 6. Contraction Log
    const contractionRecords = recordsToExport.filter(r => r.type === "contraction");
    if (contractionRecords.length > 0) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Contraction Log", 15, currentY);
      currentY += 10;

      autoTable(doc, {
        ...tableConfig,
        startY: currentY,
        head: [["Date", "Frequency", "Avg Interval", "Notes"]],
        body: contractionRecords.map(r => [
          format(r.date, "yyyy-MM-dd"),
          `${r.record.contractions?.length || 0} times`,
          r.record.averageInterval || "N/A",
          r.record.notes || "-"
        ]),
      });
    }
    
    doc.save(`Pregnancy_History_Report_${format(new Date(), "yyyyMMdd")}.pdf`);
    toast.success("PDF Report Exported");
  };

const filteredRecords = allRecords
.filter(r => !hiddenRecordIds.includes(`${r.type}-${r.record.id}`))
.filter(r => activeTab === "all" || r.type === activeTab)
.filter(r => {
if (!searchTerm) return true;
const searchLower = searchTerm.toLowerCase();
return (
r.type.toLowerCase().includes(searchLower) ||
r.record.notes?.toLowerCase().includes(searchLower) ||
r.record.other_mood?.toLowerCase().includes(searchLower) ||
format(r.date, "MMM d, yyyy").toLowerCase().includes(searchLower)
);
});

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-xl">
                <History className="h-6 w-6" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">History</h1>
            </div>
            
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleDownloadPDF} className="h-12 px-8 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 font-black uppercase tracking-widest text-[10px] shadow-sm">
              <FileText className="mr-2 h-4 w-4" /> Export report
            </Button>
            <Button variant="ghost" size="icon" onClick={loadRecords} className="h-12 w-12 rounded-2xl bg-white border-2 border-slate-100 hover:bg-slate-50">
              <RefreshCw className="h-5 w-5 text-slate-400" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Filter Timeline</p>
                <div className="flex flex-col gap-2">
                    {[
                      { id: "all", label: "Master Log", icon: <History /> },
                      { id: "weight", label: "Weight Tracker", icon: <Scale /> },
                      { id: "bmi", label: "BMI Analysis", icon: <Calculator /> },
                      { id: "mood", label: "Emotional Hub", icon: <Brain /> },
                      { id: "exercise", label: "Exercise Log", icon: <Dumbbell /> },
                      { id: "kick", label: "Fetal Activity", icon: <Footprints /> },
                      { id: "contraction", label: "Contraction Log", icon: <Timer /> }
                    ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === cat.id ? 'bg-slate-900 text-white shadow-lg scale-[1.02]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === cat.id ? 'bg-white/20' : 'bg-white'}`}>
                        {React.cloneElement(cat.icon as React.ReactElement, { className: "h-3.5 w-3.5" })}
                      </div>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap className="h-24 w-24" />
              </div>
             
            </Card>
          </div>

<div className="md:col-span-3 space-y-8">
<div className="flex flex-col sm:flex-row gap-4 mb-6">
<div className="relative flex-1">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
<Input
placeholder="Search by notes, type or date..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="pl-10 h-12 rounded-2xl border-2 border-slate-100 bg-white focus:border-slate-900 transition-all font-bold"
/>
</div>
<div className="flex gap-2 bg-white p-1 rounded-2xl border-2 border-slate-100 shadow-sm">
<Button
variant={viewMode === "list" ? "default" : "ghost"}
size="icon"
onClick={() => setViewMode("list")}
className={`h-10 w-10 rounded-xl transition-all ${viewMode === "list" ? "bg-slate-900 shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
>
<List className="h-4 w-4" />
</Button>
<Button
variant={viewMode === "grid" ? "default" : "ghost"}
size="icon"
onClick={() => setViewMode("grid")}
className={`h-10 w-10 rounded-xl transition-all ${viewMode === "grid" ? "bg-slate-900 shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
>
<LayoutGrid className="h-4 w-4" />
</Button>
</div>
</div>
    
{loading ? (
<Card className="border-0 rounded-[3rem] bg-white">
<CardContent className="p-20 text-center space-y-6">
<div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
<RefreshCw className="h-10 w-10 text-slate-400 animate-spin" />
</div>
<p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading your records...</p>
</CardContent>
</Card>
) : filteredRecords.length === 0 ? (
<Card className="border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
<CardContent className="p-20 text-center space-y-6">
<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
<History className="h-10 w-10 text-slate-200" />
</div>
<div className="space-y-2">
<p className="text-slate-400 font-black uppercase tracking-widest text-xs">No entries recorded</p>
<p className="text-sm text-slate-400 font-bold">Start using our tools to populate your timeline.</p>
</div>
</CardContent>
</Card>
) : (
<div className="max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar">
<AnimatePresence mode="popLayout">
<div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6" : "space-y-0 pb-6"}>
{filteredRecords.slice(0, visibleItemsCount).map((item, idx) => (
<motion.div
key={`${item.type}-${item.record.id}`}
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ delay: Math.min(idx * 0.05, 0.5) }}
>
<HistoryItem item={item} onDelete={handleDeleteRecord} />
</motion.div>
))}
</div>
</AnimatePresence>
    
{visibleItemsCount < filteredRecords.length && (
<div className="flex justify-center pt-8 pb-12">
<Button
onClick={() => setVisibleItemsCount(prev => prev + itemsPerPage)}
className="h-12 px-10 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-all"
>
Load More Records
</Button>
</div>
)}
</div>
)}
</div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
}
