import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Info, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { clinicalPregnancyDataset, actionPregnancyDataset } from "@/data/pregnancyDashboardData";

interface SmartFocusCardProps {
  weeksPregnant: number;
  daysPregnant: number;
  lastInteractionDate: Date | null;
}

export function SmartFocusCard({ weeksPregnant, daysPregnant, lastInteractionDate }: SmartFocusCardProps) {
  const [tipIndex, setTipIndex] = React.useState(0);

  const focusData = useMemo(() => {
    const today = new Date();
    const daysSinceLastOpen = lastInteractionDate
      ? Math.floor((today.getTime() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Intelligent Logic: If gone for more than 2 days
    if (daysSinceLastOpen > 2) {
      return {
        title: "Welcome Back! ✨",
        subtitle: "Here's what changed since your last visit",
        points: [
          `Your baby is ${daysSinceLastOpen} days older and growing fast!`,
          "Key milestones have progressed in your current trimester.",
          "Check your updated development stats below."
        ],
        type: "reassurance"
      };
    }

    // Default: Today's Focus based on gestational age
    const clinicalData = clinicalPregnancyDataset.weeks.find(w => w.week === weeksPregnant) ||
      clinicalPregnancyDataset.weeks.find(w => w.week === Math.floor(weeksPregnant / 4) * 4) ||
      clinicalPregnancyDataset.weeks[0];

    const actionData = actionPregnancyDataset.find(a => a.week === weeksPregnant) || actionPregnancyDataset[0];

    // Daily variety logic: Use daysPregnant + timer to rotate focus points
    const points = [];
    const rotationIndex = daysPregnant + tipIndex;

    // Point 1: Symptom/Body Focus (from clinical data)
    if (rotationIndex % 3 === 0) {
      points.push(clinicalData.musculoskeletal);
    } else if (rotationIndex % 3 === 1) {
      points.push(clinicalData.circulation);
    } else {
      points.push(clinicalData.other_changes);
    }

    // Point 2: Fetal Focus or Safety Note (Rotate between medical reason and safety notes if available)
    if (actionData.safety_notes && actionData.safety_notes.length > 0 && tipIndex % 2 === 1) {
      points.push(actionData.safety_notes[0]); // Show safety note every other rotation
    } else {
      points.push(actionData.medical_reason);
    }

    // Point 3: Action/Nutrition Focus
    if (actionData.what_to_do && actionData.what_to_do.length > 0) {
      const actionItem = actionData.what_to_do[rotationIndex % actionData.what_to_do.length];
      points.push(actionItem);
    }

    return {
      title: `Today's Focus (${weeksPregnant}w${daysPregnant}d)`,

      points: points,
      type: "focus"
    };
  }, [weeksPregnant, daysPregnant, lastInteractionDate, tipIndex]);

  // Rotate tips every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-[#FFF5F7] to-[#F0F4FF] border-[#E2E8F0] shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Sparkles className="h-12 w-12 text-pink-400" />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#1A202C]">
            {focusData.type === "reassurance" ? <RefreshCw className="h-5 w-5 text-blue-500" /> : <Sparkles className="h-5 w-5 text-pink-500" />}
            {focusData.title}
          </CardTitle>
          <p className="text-xs text-[#4A5568] font-medium">
            {focusData.subtitle}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {focusData.points.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/60 p-2.5 rounded-lg border border-white/40 shadow-sm transition-all hover:bg-white/80">
              <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shrink-0" />
              <p className="text-sm text-[#2D3748] leading-tight">
                {point}
              </p>
            </div>
          ))}

          <div className="pt-1 flex items-center gap-1.5 text-[10px] text-[#718096] uppercase tracking-wider font-semibold">
            <Info className="h-3 w-3" />
            Medically Proven Priorities (ACOG/NICE)
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
