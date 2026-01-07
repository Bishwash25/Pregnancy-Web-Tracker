"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  BookOpen,
  Lightbulb,
  Globe,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Info,
  ExternalLink,
  Heart
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { differenceInWeeks, differenceInDays } from "date-fns";
import {
  MythFact,
  Category,
  Region,
  getMythsForWeek,
  getRandomMyth,
  categories,
  regions,
  mythsFactsData
} from "@/data/mythsFactsData";
import { getTrendingMyths } from "@/services/mythClassificationService";

function MythCard({ myth, expanded = false }: { myth: MythFact; expanded?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const riskColor = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    High: "bg-red-100 text-red-800 border-red-200"
  };

  const riskIcon = {
    Low: <CheckCircle2 className="h-4 w-4" />,
    Medium: <AlertTriangle className="h-4 w-4" />,
    High: <AlertCircle className="h-4 w-4" />
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              Week {myth.week}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {myth.category}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {myth.region}
            </Badge>
            <Badge className={`text-xs flex items-center gap-1 ${riskColor[myth.riskLevel]}`}>
              {riskIcon[myth.riskLevel]}
              {myth.riskLevel} Risk
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r">
            <div className="flex items-start gap-2">
              <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Myth</p>
                <p className="text-red-700">{myth.myth}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800 text-sm">Medical Fact</p>
                <p className="text-green-700">{myth.medicalFact}</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-800 text-sm">Why People Believe This</p>
                      <p className="text-blue-700 text-sm">{myth.beliefReason}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Heart className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-800 text-sm">Medical Guidance</p>
                      <p className="text-purple-700 text-sm">{myth.medicalGuidance}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-800 text-sm">What You Can Do</p>
                      <p className="text-amber-700 text-sm">{myth.actionableAdvice}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    Medical Sources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {myth.sources.map((source, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {source.org}: {source.reference}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-pink-600 hover:text-pink-700 hover:bg-pink-50"
          >
            {isExpanded ? "Show Less" : "Learn More"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MythsVsFacts() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(20);
    const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
    const selectedRegion = "all";
    const [activeTab, setActiveTab] = useState("weekly");
  const [randomMyth, setRandomMyth] = useState<MythFact | null>(null);

  useEffect(() => {
    const loadUserWeek = () => {
      const storedLastPeriodDate = localStorage.getItem("lastPeriodDate");
      if (storedLastPeriodDate) {
        const lastPeriod = new Date(storedLastPeriodDate);
        const today = new Date();
        const weeks = differenceInWeeks(today, lastPeriod);
        setCurrentWeek(Math.min(Math.max(weeks, 1), 42));
      }
    };

    if (user?.uid) {
      const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
      const unsubscribe = onSnapshot(pregnancyDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as { lastPeriodDate?: Timestamp | string };
          const lp = data.lastPeriodDate instanceof Timestamp 
            ? data.lastPeriodDate.toDate() 
            : (data.lastPeriodDate ? new Date(data.lastPeriodDate) : null);
          if (lp) {
            const today = new Date();
            const weeks = differenceInWeeks(today, lp);
            setCurrentWeek(Math.min(Math.max(weeks, 1), 42));
            return;
          }
        }
        loadUserWeek();
      }, () => {
        loadUserWeek();
      });
      return () => unsubscribe();
    } else {
      loadUserWeek();
    }
  }, [user?.uid]);

  const allMyths = useMemo(() => {
    let myths = mythsFactsData;
    
    if (activeTab === "weekly") {
      // If user chooses from categories, show all myths in that category regardless of week
      if (selectedCategory !== "all") {
        myths = myths.filter(m => m.category === selectedCategory);
      } else {
        // Default: show running week myths
        myths = myths.filter(m => m.week === currentWeek);
      }
    } else if (activeTab === "all") {
      if (selectedCategory !== "all") {
        myths = myths.filter(m => m.category === selectedCategory);
      }
    }
    
    if (selectedRegion !== "all") {
      myths = myths.filter(m => m.region === selectedRegion);
    }
    
    return myths;
  }, [currentWeek, selectedCategory, selectedRegion, activeTab]);

  const trendingMyths = useMemo(() => getTrendingMyths(), []);

  const handleRandomMyth = () => {
    setRandomMyth(getRandomMyth());
  };

  const handleWeekChange = (direction: "prev" | "next") => {
    setCurrentWeek(prev => {
      if (direction === "prev") return Math.max(1, prev - 1);
      return Math.min(42, prev + 1);
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-pink-100">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Pregnancy Myths vs Medical Facts
          </h1>
        </div>
        
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleWeekChange("prev")}
            disabled={currentWeek <= 1 || activeTab === "all"}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className={`bg-pink-100 px-4 py-2 rounded-full ${activeTab === "all" ? "opacity-50" : ""}`}>
            <span className="font-semibold text-pink-700">Week {currentWeek}</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleWeekChange("next")}
            disabled={currentWeek >= 42 || activeTab === "all"}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Select 
            value={String(currentWeek)} 
            onValueChange={(v) => setCurrentWeek(Number(v))}
            disabled={activeTab === "all"}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {Array.from({ length: 42 }, (_, i) => i + 1).map((week) => (
                  <SelectItem key={week} value={String(week)}>
                    Week {week}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleRandomMyth}
            className="flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            <span className="hidden sm:inline">Random Myth</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly Insights</TabsTrigger>
          <TabsTrigger value="all">Browse All</TabsTrigger>
          <TabsTrigger value="important">High Risk Myths</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select 
              value={selectedCategory} 
              onValueChange={(v) => setSelectedCategory(v as Category | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

            <Alert className="bg-pink-50 border-pink-200">
              <Info className="h-4 w-4 text-pink-600" />
              <AlertDescription className="text-pink-700">
                {selectedCategory === "all" ? (
                  <>
                    Showing myths specific to <span className="font-bold underline">Week {currentWeek}</span>. 
                    Switch to "Browse All" to see more across your entire journey.
                  </>
                ) : (
                  <>
                    Showing all myths for category <span className="font-bold underline">{selectedCategory}</span>.
                  </>
                )}
              </AlertDescription>
            </Alert>

          {allMyths.length > 0 ? (
            <div className="grid gap-4">
              {allMyths.map((myth) => (
                <MythCard key={myth.id} myth={myth} />
              ))}
            </div>
            ) : (
              <Card className="p-8 text-center">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {selectedCategory === "all" 
                    ? `No myths found for Week ${currentWeek}.`
                    : `No myths found for category "${selectedCategory}".`
                  }
                </p>
                {selectedCategory === "all" && (
                  <p className="text-sm text-gray-500 mt-2">Try selecting "Browse All" to see myths from other weeks.</p>
                )}
              </Card>
            )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Select 
              value={selectedCategory} 
              onValueChange={(v) => setSelectedCategory(v as Category | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {allMyths.slice(0, 50).map((myth) => (
              <MythCard key={myth.id} myth={myth} />
            ))}
            {allMyths.length > 50 && (
              <p className="text-center text-gray-500 text-sm py-4">
                Showing first 50 myths. Filter by category to see more.
              </p>
            )}
            {allMyths.length === 0 && (
              <Card className="p-8 text-center">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No myths found with selected filters.</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="important" className="space-y-4 mt-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              These myths involve medium to high risk misinformation. Understanding these facts is critical for safety.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {trendingMyths.map((myth) => (
              <MythCard key={myth.id} myth={myth} expanded />
            ))}
          </div>
        </TabsContent>
      </Tabs>


      <AnimatePresence>
        {randomMyth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setRandomMyth(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-auto"
            >
              <Card className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setRandomMyth(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 pr-8">
                    <Shuffle className="h-5 w-5 text-pink-600" />
                    Random Pregnancy Myth
                  </CardTitle>
                  <CardDescription>Did you know this one?</CardDescription>
                </CardHeader>
                <CardContent>
                  <MythCard myth={randomMyth} expanded />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Disclaimer:</span> This content is educational and does not replace medical advice. 
            Always consult your healthcare provider for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
