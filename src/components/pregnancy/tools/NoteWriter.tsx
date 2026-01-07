import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Calendar,
  Clock,
  Save,
  FileText,
  Smile,
  Sparkles,
  Zap,
  History,
  CheckCircle2,
  Search,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, serverTimestamp, Timestamp, collection, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

type Step = "intro" | "write" | "analyzing" | "history";

const pregnancyEmojis = [
  "🤰", "👶", "🍼", "👼", "💕", "💖", "💝", "💗", "💓", "💞",
  "🌺", "🌸", "🌷", "🌹", "🌻", "🌼", "🌿", "🍃", "🌱", "🌳"
];

const emotionEmojis = [
  "😊", "😄", "😃", "😁", "😆", "😅", "😂", "🤣", "😉", "😋",
  "😎", "😍", "🥰", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤩"
];

export default function NoteWriter({ onBack }: { onBack: () => void }) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>("intro");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [dailyNote, setDailyNote] = useState<Note | null>(null);

  const [showDailyLimitDialog, setShowDailyLimitDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "users", user.uid, "note"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || "",
          content: data.content || "",
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
        };
      });
      setNotes(fetched);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Incomplete Note", description: "Please add both a title and content.", variant: "destructive" });
      return;
    }

    setStep("analyzing");

    try {
      if (editingNote) {
        // Change Detection
        if (editingNote.title === title.trim() && editingNote.content === content.trim()) {
          setStep("history");
          setEditingNote(null);
          setTitle("");
          setContent("");
          toast({ title: "No Changes", description: "Your note is already up to date." });
          return;
        }

        await updateDoc(doc(db, "users", user!.uid, "note", editingNote.id), {
          title: title.trim(),
          content: content.trim(),
          updatedAt: serverTimestamp(),
        });
      } else {
        const newNoteRef = doc(collection(db, "users", user!.uid, "note"));
        await setDoc(newNoteRef, {
          title: title.trim(),
          content: content.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setTimeout(() => {
        setTitle("");
        setContent("");
        setEditingNote(null);
        toast({ title: editingNote ? "Note Updated" : "Note Saved", description: "Your memory has been preserved." });
        setStep("history");
      }, 1500);
    } catch (error) {
      setStep("write");
      toast({ title: "Error", description: "Could not save note.", variant: "destructive" });
    }
  };

  const handleNewNoteClick = () => {
    const todayOne = notes.find(n => isSameDay(n.createdAt, new Date()));
    if (todayOne) {
      setDailyNote(todayOne);
      setShowDailyLimitDialog(true);
    } else {
      setEditingNote(null);
      setTitle("");
      setContent("");
      setStep("write");
    }
  };

  const handleUpdateDailyNote = () => {
    if (dailyNote) {
      setEditingNote(dailyNote);
      setTitle(dailyNote.title);
      setContent(dailyNote.content);
      setStep("write");
      setShowDailyLimitDialog(false);
    }
  };

  const handleDeleteAndStartFresh = async () => {
    if (dailyNote) {
      await deleteDoc(doc(db, "users", user!.uid, "note", dailyNote.id));
      setDailyNote(null);
      setShowDailyLimitDialog(false);
      setEditingNote(null);
      setTitle("");
      setContent("");
      setStep("write");
      toast({ title: "Started Fresh", description: "Previous daily note removed." });
    }
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const deleteNote = async () => {
    if (!noteToDelete) return;
    await deleteDoc(doc(db, "users", user!.uid, "note", noteToDelete));
    toast({ title: "Note removed" });
    setShowConfirmDelete(false);
    setNoteToDelete(null);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-inner">
                <BookOpen className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pregnancy Journal</h1>
              <p className="text-gray-600 text-lg">
                Preserve every moment, thought, and feeling of your incredible journey. Your personal space for reflection and memories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleNewNoteClick}
                className="h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
              >
                Write New Note
                <Zap className="ml-2 h-5 w-5" />
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

        {step === "write" && (
          <motion.div
            key="write"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl w-full space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{editingNote ? 'Edit Memory' : 'New Memory'}</h2>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-xl border-gray-100 font-bold text-xs uppercase tracking-widest">
                    <Smile className="h-4 w-4 mr-2" /> Emojis
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 rounded-2xl border-0 shadow-2xl">
                  <div className="grid grid-cols-5 gap-2">
                    {[...pregnancyEmojis, ...emotionEmojis].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setContent(c => c + emoji)}
                        className="text-2xl hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Title your moment..."
                    className="h-14 text-xl font-bold border-0 bg-gray-50 rounded-2xl px-6 focus-visible:ring-amber-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Describe your feelings, baby's kicks, or today's highlights..."
                    className="min-h-[300px] text-lg border-0 bg-gray-50 rounded-3xl p-6 focus-visible:ring-amber-500 resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleSaveNote}
                    className="flex-1 h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-lg font-black shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {editingNote ? 'Update Note' : 'Preserve Note'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep("intro")}
                    className="h-14 px-8 rounded-2xl font-bold text-gray-400"
                  >
                    Discard
                  </Button>
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
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl"
              >
                <FileText className="h-12 w-12 text-amber-400" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-amber-400 rounded-[2rem] -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Archiving Memory...</h2>
              <p className="text-gray-500 animate-pulse">Syncing with your digital journal</p>
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
            className="max-w-4xl w-full space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Memory Archive</h2>
                  <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">{notes.length} Entries Preserved</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search memories..."
                    className="pl-10 h-10 rounded-2xl border-gray-100 bg-white shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleNewNoteClick}
                  className="rounded-2xl bg-slate-900 h-10 px-6 font-bold text-xs uppercase"
                >
                  New Note
                </Button>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-gray-300">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No notes found matching your search</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredNotes.slice(0, visibleCount).map((note) => (
                    <Card key={note.id} className="group border-0 shadow-lg rounded-[2rem] overflow-hidden bg-white hover:shadow-xl transition-all border-l-4 border-l-amber-400">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 min-w-0 flex-1 mr-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <Calendar className="h-3 w-3" /> {format(note.createdAt, "MMMM d, yyyy")}
                            </p>
                            <h3 className="text-xl font-black text-slate-900 leading-tight truncate">{note.title}</h3>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingNote(note);
                                setTitle(note.title);
                                setContent(note.content);
                                setStep("write");
                              }}
                              className="h-8 w-8 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setNoteToDelete(note.id);
                                setShowConfirmDelete(true);
                              }}
                              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed font-medium">
                          {note.content}
                        </p>
                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                          <Badge variant="secondary" className="bg-gray-50 text-gray-400 font-bold text-[9px] uppercase">
                            Last edited {format(note.updatedAt, "HH:mm")}
                          </Badge>
                          <Sparkles className="h-4 w-4 text-amber-200" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {visibleCount < filteredNotes.length && (
                  <Button
                    variant="ghost"
                    className="w-full h-12 rounded-2xl text-amber-600 font-bold hover:bg-amber-50 transition-colors"
                    onClick={() => setVisibleCount(prev => prev + 10)}
                  >
                    Load More Memories ({filteredNotes.length - visibleCount} remaining)
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm">
          <DialogHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Trash2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">Erase Memory?</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              This note will be permanently removed from your journal and cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)} className="flex-1 h-12 rounded-xl font-bold border-2">
              Keep It
            </Button>
            <Button variant="destructive" onClick={deleteNote} className="flex-1 h-12 rounded-xl font-bold bg-red-600">
              Erase It
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
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-gray-900">One Note Per Day</DialogTitle>
            <DialogDescription className="text-gray-500 font-medium">
              You've already written a memory for today. Would you like to add to it or start over?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={handleUpdateDailyNote} className="flex-1 h-12 rounded-xl font-bold border-2">
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