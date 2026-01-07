"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Brain,
  Search,
  CheckCircle2,
  Info,
  BookOpen,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Filter
} from "lucide-react";
import { useWhyThisWhyNow, categoryLabels, categoryColors, categoryIcons } from "@/hooks/use-why-this-why-now";
import { SymptomExplanation, WeekRange } from "@/data/whyThisWhyNowData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Activity,
  Utensils,
  Wind,
  Droplet,
  Flower2,
  Smile,
  Baby
} from "lucide-react";

// Local icon map for component rendering
const iconComponents: Record<string, React.ElementType> = {
  heart: Heart,
  bone: Activity,
  utensils: Utensils,
  brain: Brain,
  sparkles: Sparkles,
  baby: Baby,
  smile: Smile,
  wind: Wind,
  droplet: Droplet,
  flower2: Flower2,
};

type Step = "intro" | "list" | "detail";

interface WhyThisWhyNowToolProps {
  onBack: () => void;
}

export default function WhyThisWhyNowTool({ onBack }: WhyThisWhyNowToolProps) {
  const {
    currentWeek,
    getExplanation,
    getAllSymptoms,
    getCategories,
    medicalDisclaimer,
    sources,
    loading,
  } = useWhyThisWhyNow();

  const [step, setStep] = useState<Step>("intro");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState<{
    symptom: SymptomExplanation;
    weekRange: WeekRange;
    matchedRange: string;
  } | null>(null);

  const categories = getCategories();
  // Filter is implicitly handled by getAllSymptoms now using currentWeek
  const symptoms = getAllSymptoms(selectedCategory || undefined, currentWeek)
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSymptomSelect = (symptomId: string) => {
    const explanation = getExplanation(symptomId);
    if (explanation) {
      setSelectedSymptom(explanation);
      setStep("detail");
    }
  };

  const handleBackToList = () => {
    setSelectedSymptom(null);
    setStep("list");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 text-purple-500 mx-auto animate-pulse" />
          <p className="text-gray-500 font-medium">Loading clinical data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">

        {/* INTRO STEP */}
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
              <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-purple-600 shadow-inner">
                <Brain className="h-12 w-12" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Why This, Why Now?</h1>
              <p className="text-gray-600 text-lg leading-relaxed px-4">
                Understand behind your body's changes with Simple explanations tailored specifically to
                <span className="font-bold text-purple-600"> Week {currentWeek}</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
              <Button
                onClick={() => setStep("list")}
                className="h-14 text-lg font-bold rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-xl transition-all hover:scale-[1.02]"
              >
                See My Symptoms
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-purple-400 font-medium bg-purple-50 py-2 px-4 rounded-full w-fit mx-auto">
              <Stethoscope className="h-3 w-3" />
              <span>Medically Reviewed Clinical Data</span>
            </div>

            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-sm font-bold flex items-center justify-center mx-auto transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tools
            </button>
          </motion.div>
        )}

        {/* LIST STEP */}
        {step === "list" && (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl w-full space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Current Symptoms</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-bold border-0">
                      Week {currentWeek}
                    </Badge>
                    <span className="text-xs font-medium text-gray-400">
                      {currentWeek <= 13 ? "First Trimester" : currentWeek <= 26 ? "Second Trimester" : "Third Trimester"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search symptoms..."
                  className="pl-10 h-10 rounded-2xl border-gray-200 bg-white shadow-sm focus-visible:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full h-9 px-4 text-xs font-bold whitespace-nowrap ${selectedCategory === null
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`rounded-full h-9 px-4 text-xs font-bold whitespace-nowrap capitalize ${selectedCategory === cat
                      ? "bg-purple-600 text-white hover:bg-purple-700 border-0"
                      : "border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                    }`}
                >
                  {categoryLabels[cat]?.split(" ")[0] || cat}
                </Button>
              ))}
            </div>

            {/* Results Grid */}
            {symptoms.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-gray-300">
                    <Filter className="h-8 w-8" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm">No symptoms found for your search or category.</p>
                  <Button variant="link" onClick={() => { setSelectedCategory(null); setSearchQuery(""); }} className="text-purple-600 font-bold">
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {symptoms.map((symptom) => {
                  const Icon = iconComponents[categoryIcons[symptom.category]] || Sparkles;
                  return (
                    <Card
                      key={symptom.id}
                      onClick={() => handleSymptomSelect(symptom.id)}
                      className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white active:scale-[0.98]"
                    >
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className={`p-4 rounded-2xl transition-colors ${categoryColors[symptom.category].split(' ')[0]}`}>
                          <Icon className={`h-6 w-6 ${categoryColors[symptom.category].split(' ')[1]}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                            {symptom.name}
                          </h3>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                            {categoryLabels[symptom.category]}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Disclaimer Footer */}
            <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                {medicalDisclaimer}
              </p>
            </div>
          </motion.div>
        )}

        {/* DETAIL STEP */}
        {step === "detail" && selectedSymptom && (
          <motion.div
            key="detail"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl w-full space-y-6"
          >
            {/* Nav */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleBackToList} className="rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-bold text-gray-500 uppercase tracking-widest">Symptom Insight</h2>
            </div>

            {/* Header Card */}
            <Card className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  {/* Giant icon background */}
                  {React.createElement(iconComponents[categoryIcons[selectedSymptom.symptom.category]] || Sparkles, { className: "w-48 h-48" })}
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex gap-2 mb-2">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-bold backdrop-blur-md">
                      Week {currentWeek}
                    </Badge>
                    <Badge variant="outline" className="border-white/30 text-white/80 font-medium">
                      Valid for Weeks {selectedSymptom.matchedRange}
                    </Badge>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    {selectedSymptom.symptom.name}
                  </h1>

                  <div className="flex items-center gap-2 text-white/60 font-semibold">
                    {React.createElement(iconComponents[categoryIcons[selectedSymptom.symptom.category]] || Sparkles, { className: "w-5 h-5" })}
                    <span>{categoryLabels[selectedSymptom.symptom.category]}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-8 space-y-8">
                {/* Explanation */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">What's Happening?</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg pl-10 border-l-2 border-blue-100">
                    {selectedSymptom.weekRange.explanation}
                  </p>
                </section>

                {/* Clinical Reasoning */}
                <section className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h3 className="font-bold text-purple-900">The Science (Why Now?)</h3>
                  </div>
                  <p className="text-purple-800/80 italic font-medium leading-relaxed">
                    "{selectedSymptom.weekRange.clinicalReasoning}"
                  </p>
                </section>

                <Separator />

                {/* Normal vs Not Normal */}
                <div className="grid md:grid-cols-2 gap-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <h3 className="font-black text-sm uppercase tracking-wider">Totally Normal</h3>
                    </div>
                    <ul className="space-y-3">
                      {selectedSymptom.weekRange.normalWhen.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-600 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4 text-red-500">
                      <AlertTriangle className="h-5 w-5" />
                      <h3 className="font-black text-sm uppercase tracking-wider">When to Call Doctor</h3>
                    </div>
                    <ul className="space-y-3">
                      {selectedSymptom.weekRange.notNormalWhen.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-600 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <Separator />

                {/* Sources */}
                <section>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trusted Medical Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptom.weekRange.sources.map((s, i) => (
                      <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-500 hover:bg-gray-200">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {s}
                      </Badge>
                    ))}
                  </div>
                </section>

              </CardContent>
            </Card>
          </motion.div>
        )}

      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 0px;
          background: transparent;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
