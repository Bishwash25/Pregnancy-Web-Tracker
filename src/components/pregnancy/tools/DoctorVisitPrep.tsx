import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  Save,
  Stethoscope,
  CheckCircle,
  FileText,
  PlusCircle,
  Eye,
  History,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Trash2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, Timestamp, collection, onSnapshot, query, orderBy, deleteDoc, getDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { differenceInWeeks, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface VisitPrep {
  id: string;
  trimester: number;
  visitDate: Date;
  questions: string[];
  checklist: { item: string; completed: boolean }[];
  notes: string;
  completed: boolean;
  createdAt: Date;
  isEdited: boolean;
}

interface TrimesterData {
  name: string;
  weeks: string;
  questions: string[];
  checklist: string[];
}

const trimesterData: TrimesterData[] = [
  {
    name: "First Trimester",
    weeks: "Weeks 0–12",
    questions: [
      "How is my overall health so far?",
      "What symptoms are normal in early pregnancy?",
      "What foods should I eat or avoid?",
      "Do I need to take prenatal vitamins or any supplements?",
      "When should I plan my next doctor visit?",
      "What early signs mean I should call my doctor?",
      "How is my baby growing each week?",
      "Are any genetic or blood tests needed now?",
      "How can I reduce morning sickness and tiredness?",
      "Is it safe to exercise or travel at this stage?",
      "Can I continue my daily routine or should I rest more?",
      "How can I handle mood changes or stress?",
      "What are the signs of miscarriage I should know about?",
      "Is it normal to feel cramps or light bleeding early on?",
      "How much water should I drink every day?",
      "Do I need to be careful about infections like toxoplasmosis or flu?",
      "Is my current work environment safe during pregnancy?",
      "Why am I feeling so sleepy, and how much rest do I need?",
      "How can my partner support me emotionally in this phase?",
      "When should I get my first ultrasound, and what will it show?"
    ],
    checklist: [
      "Bring your ID and health insurance card",
      "Make a list of your medicines or supplements",
      "Write down any health questions or concerns",
      "Take your partner or support person if possible",
      "Wear light and comfortable clothes for checkups",
      "Carry a water bottle and light snacks",
      "Confirm your next appointment date",
      "Start taking prenatal vitamins regularly",
      "Avoid smoking, alcohol, or unprescribed medicines",
      "Start keeping a pregnancy journal or notes"
    ]
  },
  {
    name: "Second Trimester",
    weeks: "Weeks 13–27",
    questions: [
      "How is my baby’s growth and heartbeat?",
      "What can I expect from the mid-pregnancy ultrasound?",
      "Are there any new tests needed this trimester?",
      "What changes in my body are normal right now?",
      "How can I manage back pain or leg cramps?",
      "What kind of exercise is safe to do now?",
      "How much weight gain is healthy for me?",
      "When will I start feeling the baby move?",
      "Is it normal to feel dizzy or tired sometimes?",
      "Can I still travel or work during this period?",
      "What foods or habits help with energy levels?",
      "Should I start preparing for childbirth classes?",
      "Is sex safe in this trimester?",
      "How do I know if I’m drinking enough water?",
      "When should I worry about swelling or pain?",
      "What does the anomaly scan check for?",
      "Do I need iron or calcium supplements now?",
      "What is the best sleeping position for me?",
      "Are skin darkening or hair changes normal?",
      "Is it normal to feel more emotional or anxious now?"
    ],
    checklist: [
      "Bring your ultrasound or test reports if you have them",
      "Prepare questions about your baby’s growth and scan results",
      "Discuss safe exercises and work adjustments if needed",
      "Ask about travel plans or long journeys",
      "Review healthy eating and portion sizes",
      "Plan for glucose or anemia screening tests",
      "Write down any new or strange symptoms",
      "Start reading about childbirth and parenting",
      "Begin shopping for maternity clothes",
      "Track baby movements when they start"
    ]
  },
  {
    name: "Third Trimester",
    weeks: "Weeks 28–42",
    questions: [
      "How is my baby’s position and growth right now?",
      "When should I go to the hospital for labor?",
      "What are the signs that labor has started?",
      "What should I include in my hospital bag?",
      "What are my options for pain relief during birth?",
      "How often will I have prenatal checkups now?",
      "What should I know about early labor pains?",
      "What are warning signs I shouldn’t ignore?",
      "How can I prepare my home for the baby?",
      "When should I stop working or traveling?",
      "What should I eat in the last few weeks?",
      "How do I get ready for breastfeeding?",
      "What should I know about postpartum recovery?",
      "How do I manage sleep and comfort at night?",
      "What emotions are normal before giving birth?",
      "How often should I feel my baby move each day?",
      "What if I feel anxious or scared about giving birth?",
      "Will I need a C-section or can I plan for normal delivery?",
      "How do I know if my water has broken?",
      "How can I prepare emotionally for the days after birth?"
    ],
    checklist: [
      "Pack your hospital bag and keep it ready",
      "Discuss your birth plan with your doctor or midwife",
      "Prepare baby clothes, diapers, and essentials",
      "Set up a baby sleeping area at home",
      "Discuss pain relief and labor options",
      "Write down emergency contact numbers",
      "Know the warning signs of high blood pressure or swelling",
      "Arrange transport for hospital visits",
      "Discuss feeding plans (breast or bottle)",
      "Plan for help at home after delivery",
      "Review your postpartum care and rest plan",
      "Prepare your mind for changes after birth"
    ]
  }
];

type Step = "intro" | "list" | "form" | "view" | "analyzing";

export default function DoctorVisitPrep({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [visits, setVisits] = useState<VisitPrep[]>([]);
  const [currentTrimester, setCurrentTrimester] = useState<number>(1);
  const [weeksPregnant, setWeeksPregnant] = useState<number>(0);
    const [editingVisit, setEditingVisit] = useState<VisitPrep | null>(null);
    const [viewingVisit, setViewingVisit] = useState<VisitPrep | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [formData, setFormData] = useState({


    customQuestions: [] as string[],
    customChecklist: [] as { item: string; completed: boolean }[],
    notes: ""
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingVisitId, setDeletingVisitId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPregnancyData = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            const lp = data.lastPeriodDate instanceof Timestamp ? data.lastPeriodDate.toDate() : new Date(data.lastPeriodDate);
            const totalWeeks = differenceInWeeks(new Date(), lp);
            setWeeksPregnant(Math.min(totalWeeks, 42));
            setCurrentTrimester(totalWeeks <= 12 ? 1 : totalWeeks <= 27 ? 2 : 3);
          }
        } catch (e) { console.error(e); }
      }
    };
    fetchPregnancyData();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "users", user.uid, "doctorVisitPrep"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const fetched: VisitPrep[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          trimester: data.trimester || 1,
          visitDate: data.visitDate?.toDate() || new Date(),
          questions: data.questions || [],
          checklist: data.checklist || [],
          notes: data.notes || "",
          completed: data.completed || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          isEdited: data.isEdited || false
        };
      });
      setVisits(fetched);
    });
  }, [user?.uid]);

    const filteredVisits = visits.filter(visit => 
      format(visit.visitDate, "MMMM d, yyyy").toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `Trimester ${visit.trimester}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStartPrep = () => {

    const existingVisit = visits.find(v => v.trimester === currentTrimester);
    if (existingVisit) {
      handleEdit(existingVisit);
      toast({
        title: "Existing Preparation Found",
        description: `Opening your Trimester ${currentTrimester} preparation for updates.`
      });
    } else {
      resetForm();
      setStep("form");
    }
  };

  const handleSaveVisit = async () => {
    if (!user?.uid) return;
    setStep("analyzing");

    try {
      const visitTrimesterData = trimesterData[currentTrimester - 1] || trimesterData[0];

      const newQuestions = [...visitTrimesterData.questions, ...formData.customQuestions.filter(q => q.trim())];
      const newChecklist = [
        ...visitTrimesterData.checklist.map(item => ({ item, completed: false })),
        ...formData.customChecklist.filter(c => c.item.trim())
      ];

      // For updates, preserve the completion status of existing checklist items
      const mergedChecklist = editingVisit
        ? newChecklist.map(newItem => {
          const existingItem = editingVisit.checklist.find(oldItem => oldItem.item === newItem.item);
          return existingItem ? { ...newItem, completed: existingItem.completed } : newItem;
        })
        : newChecklist;

      if (editingVisit) {
        // Change Detection Logic
        const questionsChanged = JSON.stringify(editingVisit.questions) !== JSON.stringify(newQuestions);
        // We only care if the item text or list structure changed, not completion status here (since form doesn't edit completion)
        // But wait, the checklist in editingVisit might have some completed: true.
        // The form editing logic mainly adds items. 
        // If the user adds a custom item, it changes. 
        // If the user modifies notes, it changes.

        // Actually, let's look at what editingVisit has.
        // editingVisit.checklist has {item, completed}.
        // The form generates new checklist from defaults + custom inputs.
        // The defaults always start as completed: false in this generation logic? 
        // Wait, line 261 in original code: ...visitTrimesterData.checklist.map(item => ({ item, completed: false }))
        // This resets completion on every save! That might be a bug I should fix or be aware of.
        // If I am just updating the *prep list*, maybe resetting is intent? 
        // No, if I update my prep list, I probably don't want to lose my checkmarks.

        // Let's refine the merge logic above to be safe.
        // And then compare.

        const notesChanged = editingVisit.notes !== formData.notes.trim();

        // For checklist comparison, we compare the *items* present.
        // The 'completed' status is updated in the View mode, not the Form mode.
        // The Form mode is for "planning" (adding questions/items).
        // So strict equality on the checklist array might fail if I reset completed to false.

        // Let's compare the stringified arrays of *items only* for checklist to see if structure changed
        const oldChecklistItems = editingVisit.checklist.map(c => c.item).sort();
        const newChecklistItems = mergedChecklist.map(c => c.item).sort();
        const checklistChanged = JSON.stringify(oldChecklistItems) !== JSON.stringify(newChecklistItems);

        if (!questionsChanged && !notesChanged && !checklistChanged) {
          setStep("list");
          setEditingVisit(null);
          resetForm();
          toast({ title: "No Changes", description: "No updates were made to your preparation." });
          return;
        }
      }

      const visitData = {
        trimester: currentTrimester,
        visitDate: Timestamp.fromDate(new Date()),
        isEdited: !!editingVisit,
        questions: newQuestions,
        checklist: mergedChecklist,
        notes: formData.notes.trim(),
        completed: editingVisit ? editingVisit.completed : false, // Preserve completion status
        createdAt: editingVisit ? editingVisit.createdAt : serverTimestamp()
      };

      if (editingVisit) {
        await updateDoc(doc(db, "users", user.uid, "doctorVisitPrep", editingVisit.id), visitData);
      } else {
        await setDoc(doc(collection(db, "users", user.uid, "doctorVisitPrep")), visitData);
      }

      setTimeout(() => {
        toast({ title: "Success", description: editingVisit ? "Preparation updated!" : "Preparation created!" });
        setStep("list");
        setEditingVisit(null);
        resetForm();
      }, 1500);
    } catch (e) {
      console.error(e);
      setStep("form");
      toast({ description: "Failed to save preparation", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({

      customQuestions: [],
      customChecklist: [],
      notes: ""
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleEdit = (visit: VisitPrep) => {
    setEditingVisit(visit);
    const visitTrimesterData = trimesterData[visit.trimester - 1] || trimesterData[0];
    const customQuestions = visit.questions.filter(q => !visitTrimesterData.questions.includes(q));
    const customChecklist = visit.checklist.filter(item => !visitTrimesterData.checklist.includes(item.item));
    setFormData({

      customQuestions,
      customChecklist,
      notes: visit.notes
    });
    setStep("form");
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
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-inner">
                <Stethoscope className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Clinical Preparation</h1>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                Be fully prepared for your prenatal appointments. We provide trimester-specific checklists and expert-curated questions for your doctor.
              </p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">CURRENT STAGE</p>
                <p className="text-xl font-black text-blue-600">Week {weeksPregnant}</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100" />
              <div className="text-right">
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">TRIMESTER</p>
                <p className="text-xl font-black text-blue-600">
                  {currentTrimester === 1 ? '1st' : currentTrimester === 2 ? '2nd' : '3rd'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleStartPrep}
                className="h-16 text-lg font-black rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02] uppercase tracking-widest"
              >
                Start Preparation
                <Plus className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("list")}
                className="h-16 text-lg font-black rounded-2xl border-2 border-gray-100 hover:bg-gray-50 transition-all hover:scale-[1.02] uppercase tracking-widest"
              >
                View History
                <History className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm font-black flex items-center justify-center mx-auto uppercase tracking-widest">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tools
            </button>
          </motion.div>
        )}

        {step === "list" && (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl w-full space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Visit Records</h2>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Your clinical timeline</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <Input
                    placeholder="Search visits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-2xl border-gray-100 bg-white shadow-sm"
                  />
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button onClick={handleStartPrep} className="rounded-2xl bg-slate-900 h-10 px-6 font-black text-xs uppercase tracking-widest">
                  Add New
                </Button>
              </div>
            </div>

            {filteredVisits.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
                <CardContent className="p-16 text-center space-y-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Stethoscope className="h-10 w-10 text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No preparations found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredVisits.slice(0, visibleCount).map((visit, idx) => (
                    <motion.div
                      key={visit.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="group border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white hover:shadow-2xl transition-all duration-300">
                        <div className={`p-6 text-white flex justify-between items-center ${visit.completed ? 'bg-emerald-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-white/20">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-black uppercase tracking-widest text-[10px] opacity-80">Trimester {visit.trimester}</p>
                              <p className="font-black text-xs">{visit.isEdited ? "Updated: " : ""}{format(visit.visitDate, "MMM d, yyyy h:mm a")}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20" onClick={() => handleEdit(visit)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-red-400/20 text-white hover:bg-red-500" onClick={() => { setDeletingVisitId(visit.id); setShowDeleteDialog(true); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Preparation Progress</span>
                            <Badge className={visit.completed ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}>
                              {visit.completed ? "Ready" : "In Progress"}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                              <span>Questions & Tasks</span>
                              <span>{visit.checklist.filter(c => c.completed).length} / {visit.checklist.length}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(visit.checklist.filter(c => c.completed).length / visit.checklist.length) * 100}%` }}
                                className={`h-full rounded-full ${visit.completed ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => { setViewingVisit(visit); setStep("view"); }}
                            className="w-full h-12 rounded-2xl border-2 border-gray-50 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-100 font-black uppercase tracking-widest text-xs transition-all"
                          >
                            Review & Complete
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                {visibleCount < filteredVisits.length && (
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-2xl text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                    onClick={() => setVisibleCount(prev => prev + 10)}
                  >
                    Load More Preps ({filteredVisits.length - visibleCount} remaining)
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {step === "form" && (
          <motion.div
            key="form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl w-full space-y-8"
          >
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setStep("list")} className="rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{editingVisit ? "Refine Preparation" : "New Visit Preparation"}</h2>
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Trimester {currentTrimester} Focus</p>
              </div>
            </div>

            <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Current Trimester</Label>
                    <div className="h-14 px-4 bg-blue-50/50 border-2 border-blue-100/50 rounded-2xl flex items-center text-blue-700 font-black uppercase text-xs tracking-widest">
                      <ShieldCheck className="mr-2 h-4 w-4" /> {currentTrimester === 1 ? '1st' : currentTrimester === 2 ? '2nd' : '3rd'} Trimester
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-[2rem] bg-slate-900 text-white space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-yellow-400" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Custom Questions</h3>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-blue-400 hover:text-blue-300" onClick={() => setFormData({ ...formData, customQuestions: [...formData.customQuestions, ""] })}>
                        <Plus className="mr-1 h-3 w-3" /> Add Question
                      </Button>
                    </div>
                    {formData.customQuestions.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No custom questions added yet.</p>
                    )}
                    <div className="space-y-3">
                      {formData.customQuestions.map((q, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={q}
                            placeholder="e.g. Is it safe to...?"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/30 rounded-xl"
                            onChange={(e) => {
                              const newQ = [...formData.customQuestions];
                              newQ[idx] = e.target.value;
                              setFormData({ ...formData, customQuestions: newQ });
                            }}
                          />
                          <Button size="icon" variant="ghost" className="text-white/50 hover:text-red-400" onClick={() => setFormData({ ...formData, customQuestions: formData.customQuestions.filter((_, i) => i !== idx) })}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Consultation Notes</Label>
                    <Textarea
                      placeholder="Symptoms, concerns, or things you noticed..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="min-h-[120px] rounded-3xl border-2 border-gray-50 focus:border-blue-200 focus:ring-0 p-6 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleSaveVisit}
                    className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-black shadow-lg transition-all hover:scale-[1.02] uppercase tracking-widest"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {editingVisit ? "Update Preparation" : "Finalize Preparation"}
                  </Button>
                  <Button variant="ghost" onClick={() => setStep("list")} className="text-gray-400 font-black uppercase tracking-widest text-xs">
                    Cancel Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "view" && viewingVisit && (
          <motion.div
            key="view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl w-full space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setStep("list")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Visit Dashboard</h2>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Trimester {viewingVisit.trimester} • {format(viewingVisit.visitDate, "MMMM d, yyyy")}</p>
                </div>
              </div>
              <Badge className={viewingVisit.completed ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}>
                {viewingVisit.completed ? "Mission Accomplished" : "Ready for Doctor"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Checklist Items
                  </h3>
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {viewingVisit.checklist.map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${item.completed ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900' : 'bg-white border-gray-50'}`}>
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={async (checked) => {
                            const newChecklist = [...viewingVisit.checklist];
                            newChecklist[idx] = { ...item, completed: !!checked };
                            const allDone = newChecklist.every(c => c.completed);
                            const updatedVisit = { ...viewingVisit, checklist: newChecklist, completed: allDone };
                            setViewingVisit(updatedVisit);
                            await updateDoc(doc(db, "users", user!.uid, "doctorVisitPrep", viewingVisit.id), {
                              checklist: newChecklist,
                              completed: allDone
                            });
                          }}
                          className="h-5 w-5 border-2"
                        />
                        <span className={`text-sm font-bold ${item.completed ? 'line-through opacity-50' : ''}`}>{item.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" /> Key Questions
                  </h3>
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl">
                    {viewingVisit.questions.map((q, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <p className="text-sm font-bold italic leading-relaxed">"{q}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {viewingVisit.notes && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <History className="h-4 w-4" /> Observations
                    </h3>
                    <div className="p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100 text-blue-900 text-sm font-medium italic leading-relaxed">
                      "{viewingVisit.notes}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 flex justify-center">
              <Button onClick={() => setStep("list")} className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105">
                Back to Timeline
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
                <Stethoscope className="h-12 w-12 text-blue-400" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-slate-900 rounded-full -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Preparing Visit Log...</h2>
              <p className="text-blue-500 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing with clinical guidelines</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-10 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-gray-900">Remove Log?</DialogTitle>
            <DialogDescription className="text-gray-500 font-bold">
              This preparation will be permanently deleted from your records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-6">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] border-2">
              Keep Record
            </Button>
            <Button variant="destructive" onClick={async () => {
              if (deletingVisitId) {
                await deleteDoc(doc(db, "users", user!.uid, "doctorVisitPrep", deletingVisitId));
                toast({ title: "Deleted", description: "Preparation removed" });
              }
              setShowDeleteDialog(false);
            }} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-red-600">
              Clear Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors ${className}`}>
      {children}
    </div>
  );
}
