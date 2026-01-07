"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Activity,
  Utensils,
  Brain,
  Sparkles,
  Baby,
  Smile,
  Wind,
  Droplet,
  Flower2,
  Search,
  AlertTriangle,
  CheckCircle2,
  Info,
  BookOpen,
  ChevronRight,
  X,
} from "lucide-react";
import { useWhyThisWhyNow, categoryLabels } from "@/hooks/use-why-this-why-now";
import { SymptomExplanation, WeekRange } from "@/data/whyThisWhyNowData";

const categoryIconMap: Record<string, React.ReactNode> = {
  cardiovascular: <Heart className="h-4 w-4" />,
  musculoskeletal: <Activity className="h-4 w-4" />,
  gastrointestinal: <Utensils className="h-4 w-4" />,
  neurological: <Brain className="h-4 w-4" />,
  skin: <Sparkles className="h-4 w-4" />,
  fetal: <Baby className="h-4 w-4" />,
  emotional: <Smile className="h-4 w-4" />,
  respiratory: <Wind className="h-4 w-4" />,
  urinary: <Droplet className="h-4 w-4" />,
  reproductive: <Flower2 className="h-4 w-4" />,
};

interface WhyThisWhyNowSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSymptomId?: string;
}

export function WhyThisWhyNowSheet({
  open,
  onOpenChange,
  initialSymptomId,
}: WhyThisWhyNowSheetProps) {
  const {
    currentWeek,
    getExplanation,
    getAllSymptoms,
    getCategories,
    search,
    medicalDisclaimer,
    sources,
  } = useWhyThisWhyNow();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSymptom, setSelectedSymptom] = useState<{
    symptom: SymptomExplanation;
    weekRange: WeekRange;
    matchedRange: string;
  } | null>(initialSymptomId ? getExplanation(initialSymptomId) : null);

    const categories = getCategories();
    const symptoms = getAllSymptoms(selectedCategory || undefined);

    const handleSymptomSelect = (symptomId: string) => {
    const explanation = getExplanation(symptomId);
    setSelectedSymptom(explanation);
  };

  const handleBack = () => {
    setSelectedSymptom(null);
  };

  React.useEffect(() => {
    if (initialSymptomId && open) {
      const explanation = getExplanation(initialSymptomId);
      setSelectedSymptom(explanation);
    }
  }, [initialSymptomId, open, getExplanation]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] sm:h-[85vh] rounded-t-3xl p-0"
      >
        {selectedSymptom ? (
          <SymptomDetailView
            data={selectedSymptom}
            currentWeek={currentWeek}
            onBack={handleBack}
            medicalDisclaimer={medicalDisclaimer}
            sources={sources}
          />
        ) : (
            <SymptomBrowserView
              categories={categories}
              symptoms={symptoms}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              onSymptomSelect={handleSymptomSelect}
              currentWeek={currentWeek}
            />
        )}
      </SheetContent>
    </Sheet>
  );
}

  interface SymptomBrowserViewProps {
    categories: string[];
    symptoms: SymptomExplanation[];
    selectedCategory: string | null;
    onCategorySelect: (category: string | null) => void;
    onSymptomSelect: (symptomId: string) => void;
    currentWeek: number;
  }
  
  function SymptomBrowserView({
    categories,
    symptoms,
    selectedCategory,
    onCategorySelect,
    onSymptomSelect,
    currentWeek,
  }: SymptomBrowserViewProps) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-purple-600" />
            Why This, Why Now?
          </SheetTitle>
          <SheetDescription>
            Understand what's happening in your body at Week {currentWeek}
          </SheetDescription>
        </SheetHeader>
  
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-2 px-2">
              Categories
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onCategorySelect(null)}
              >
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => onCategorySelect(category)}
                >
                  {categoryIconMap[category]}
                  {categoryLabels[category] || category}
                </Badge>
              ))}
            </div>
          </div>
  
          <div className="space-y-2">
            {symptoms.map((symptom) => (
              <Card
                key={symptom.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onSymptomSelect(symptom.id)}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                      {categoryIconMap[symptom.category]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{symptom.name}</p>
                      <p className="text-xs text-gray-500">
                        {categoryLabels[symptom.category] || symptom.category}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            ))}
          </div>
  
          {symptoms.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No symptoms found in this category</p>
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

interface SymptomDetailViewProps {
  data: {
    symptom: SymptomExplanation;
    weekRange: WeekRange;
    matchedRange: string;
  };
  currentWeek: number;
  onBack: () => void;
  medicalDisclaimer: string;
  sources: string[];
}

function SymptomDetailView({
  data,
  currentWeek,
  onBack,
  medicalDisclaimer,
  sources,
}: SymptomDetailViewProps) {
  const { symptom, weekRange, matchedRange } = data;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto">
            <X className="h-5 w-5 mr-1" />
            Back
          </Button>
          <Badge variant="secondary" className="text-xs">
            Week {currentWeek} (Range: {matchedRange})
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            {categoryIconMap[symptom.category]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{symptom.name}</h2>
            <p className="text-sm text-gray-500">
              {categoryLabels[symptom.category] || symptom.category}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                What's happening in your body?
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">
              {weekRange.explanation}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Clinical Reasoning</h3>
            </div>
            <p className="text-gray-700 text-sm bg-purple-50 p-4 rounded-lg italic">
              {weekRange.clinicalReasoning}
            </p>
          </section>

          <Separator />

          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">When this is normal</h3>
            </div>
            <ul className="space-y-2">
              {weekRange.normalWhen.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-900">When to seek care</h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <ul className="space-y-2">
                {weekRange.notNormalWhen.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-red-800"
                  >
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <Separator />

          <section className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm mb-2">
              Medical References
            </h4>
            <div className="flex flex-wrap gap-1">
              {weekRange.sources.map((source, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </section>

          <section className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-900 text-sm mb-1">
                  Medical Disclaimer
                </h4>
                <p className="text-xs text-amber-800">{medicalDisclaimer}</p>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}

interface WhyThisButtonProps {
  symptomId?: string;
  symptomName?: string;
  className?: string;
}

export function WhyThisButton({
  symptomId,
  symptomName,
  className = "",
}: WhyThisButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`text-purple-600 hover:text-purple-700 hover:bg-purple-50 gap-1 ${className}`}
        onClick={() => setOpen(true)}
      >
        <Info className="h-4 w-4" />
        Why this?
      </Button>
      <WhyThisWhyNowSheet
        open={open}
        onOpenChange={setOpen}
        initialSymptomId={symptomId}
      />
    </>
  );
}

export function WhyThisInfoIcon({
  symptomId,
  className = "",
}: {
  symptomId?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center rounded-full p-1 text-purple-600 hover:bg-purple-100 transition-colors ${className}`}
        aria-label="Learn why this symptom occurs"
      >
        <Info className="h-4 w-4" />
      </button>
      <WhyThisWhyNowSheet
        open={open}
        onOpenChange={setOpen}
        initialSymptomId={symptomId}
      />
    </>
  );
}
