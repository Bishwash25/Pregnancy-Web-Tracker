import React, { useMemo, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Calendar, Sparkles } from "lucide-react";
import { fetchDashboardSnapshot } from "@/services/dashboardApi";
import { DashboardSnapshot } from "@/data/pregnancyDashboardData";
import { motion } from "framer-motion";

function getCurrentWeeksFromLocal(): number {
  try {
    const lp = localStorage.getItem("lastPeriodDate");
    const dd = localStorage.getItem("dueDate");
    if (!lp && !dd) return 1;

    let weeks = 0;
    if (lp) {
      const last = new Date(lp);
      if (!isNaN(last.getTime())) {
        const diffMs = Date.now() - last.getTime();
        weeks = Math.max(1, Math.min(40, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))));
      }
    } else if (dd) {
      const due = new Date(dd);
      if (!isNaN(due.getTime())) {
        const gestationWeeks = 40;
        const diffMs = due.getTime() - Date.now();
        const weeksToGo = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));
        weeks = Math.max(1, Math.min(40, gestationWeeks - weeksToGo));
      }
    }
    return weeks || 1;
  } catch {
    return 1;
  }
}

function getTrimesterFromWeeks(weeks: number): number {
  if (weeks <= 13) return 1;
  if (weeks <= 27) return 2;
  return 3;
}

// Video data structure with title, thumbnail, and YouTube ID
interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
}

// Trimester-based video organization with curated YouTube videos
const TRIMESTER_VIDEOS = {
  pregnancy: {
    first: [
      { id: "-LHNfkaaMFA", title: "First Trimester Pregnancy: Everything You Need to Know from a Fertility Doctor", thumbnail: "https://img.youtube.com/vi/-LHNfkaaMFA/maxresdefault.jpg" },
      { id: "E0i7NQsJdWY", title: "First Trimester | 3D Animated Pregnancy Guide", thumbnail: "https://img.youtube.com/vi/E0i7NQsJdWY/maxresdefault.jpg" },
      { id: "TXL5104x6AM", title: "Pregnancy - First Trimester - What to Expect", thumbnail: "https://img.youtube.com/vi/TXL5104x6AM/maxresdefault.jpg" },
      { id: "pdn85TK72jc", title: "First Trimester of Pregnancy", thumbnail: "https://img.youtube.com/vi/pdn85TK72jc/maxresdefault.jpg" },
      { id: "26R2uOeNcdE", title: "What You Need to Know About the First Trimester", thumbnail: "https://img.youtube.com/vi/26R2uOeNcdE/maxresdefault.jpg" },
      { id: "Jr4nt6XM3gA", title: "Most Commonly Asked Questions About First Trimester of Pregnancy", thumbnail: "https://img.youtube.com/vi/Jr4nt6XM3gA/maxresdefault.jpg" },
       { id: "Rpbmzm6FeMM", title: "Understanding depression and anxiety during pregnancy and postpartum", thumbnail: "https://img.youtube.com/vi/Rpbmzm6FeMM/maxresdefault.jpg" },
       { id: "ecnGRl2j7qo", title: "How to take care of your mental health during pregnancy", thumbnail: "https://img.youtube.com/vi/ecnGRl2j7qo/maxresdefault.jpg" },
       { id: "7hohvlCIzdw", title: "Emotions and Changes in Pregnancy | Kaiser Permanente", thumbnail: "https://img.youtube.com/vi/7hohvlCIzdw/maxresdefault.jpg" },
       { id: "Lm8hh85ftOk", title: "How Much Weight Should You Gain in Pregnancy? | Kaiser Permanente", thumbnail: "https://img.youtube.com/vi/Lm8hh85ftOk/maxresdefault.jpg" }



    ],
    second: [
      { id: "usxM_dhEK6M", title: "Second Trimester of Pregnancy", thumbnail: "https://img.youtube.com/vi/usxM_dhEK6M/maxresdefault.jpg" },
      { id: "k_V8axPqI34", title: "Second Trimester | 3D Animated Pregnancy Guide", thumbnail: "https://img.youtube.com/vi/k_V8axPqI34/maxresdefault.jpg" },
      { id: "IPj4dJnP85o", title: "What to expect in your Second Trimester of pregnancy ", thumbnail: "https://img.youtube.com/vi/IPj4dJnP85o/maxresdefault.jpg" }
    ],
    third: [
      { id: "ikcXKfUvpl8", title: "Third Trimester of Pregnancy", thumbnail: "https://img.youtube.com/vi/ikcXKfUvpl8/maxresdefault.jpg" },
      { id: "oyLk23TrRNQ", title: "Do's and Don'ts During 3rd Trimester of Pregnancy", thumbnail: "https://img.youtube.com/vi/oyLk23TrRNQ/maxresdefault.jpg" },
      { id: "n7BSXMvo3O4", title: "Third Trimester | 3D Animated Pregnancy Guide", thumbnail: "https://img.youtube.com/vi/n7BSXMvo3O4/maxresdefault.jpg" }
    ]
  },
  exercise: {
    first: [
      { id: "rI75dIKW6uU", title: "15-minute Prenatal yoga | First trimester with Brittany Bryden", thumbnail: "https://img.youtube.com/vi/rI75dIKW6uU/maxresdefault.jpg" },
      { id: "4NwQKXpWN_A", title: "10 minute PRENATAL YOGA for Beginners (Safe for ALL Trimesters)", thumbnail: "https://img.youtube.com/vi/4NwQKXpWN_A/maxresdefault.jpg" },
     { id: "nLgAG30Ocuo", title: "30 Min Prenatal Yoga Workout | Gentle Pregnancy Safe Workout & Stretch", thumbnail: "https://img.youtube.com/vi/nLgAG30Ocuo/maxresdefault.jpg" },
     { id: "_HYzzcgndWw", title: "Pregnancy Cardio Workout (1st Trimester, 2nd Trimester, 3rd Trimester + Postpartum Safe)", thumbnail: "https://img.youtube.com/vi/_HYzzcgndWw/maxresdefault.jpg" },
     { id: "BG7mMK0914w", title: "Feel Amazing After This 15-Min Prenatal Yoga For Morning Time!", thumbnail: "https://img.youtube.com/vi/BG7mMK0914w/maxresdefault.jpg" },
     { id: "Ia6dNwVs1M8", title: "First Trimester Pregnancy Exercises | 30 Minute Pregnancy Workout First Trimester", thumbnail: "https://img.youtube.com/vi/Ia6dNwVs1M8/maxresdefault.jpg" }
      
    ],
    second: [
      { id: "k1dNL03Ic_8", title: "Pregnancy Yoga Second Trimester (30 Minute Prenatal Yoga)", thumbnail: "https://img.youtube.com/vi/k1dNL03Ic_8/maxresdefault.jpg" },
      { id: "Wlu6HsO-pEM", title: "Full-Body Pregnancy Yoga Flow (25 Minute Prenatal Yoga Class For All Trimesters)", thumbnail: "https://img.youtube.com/vi/Wlu6HsO-pEM/maxresdefault.jpg" },
      { id: "VmKm6BPdjWM", title: "15-Minute Labor Prep Prenatal Yoga (Safe For All Trimesters!)", thumbnail: "https://img.youtube.com/vi/VmKm6BPdjWM/maxresdefault.jpg" },
      { id: "_HYzzcgndWw", title: "Pregnancy Cardio Workout (1st Trimester, 2nd Trimester, 3rd Trimester + Postpartum Safe)", thumbnail: "https://img.youtube.com/vi/_HYzzcgndWw/maxresdefault.jpg" },
      { id: "BG7mMK0914w", title: "Feel Amazing After This 15-Min Prenatal Yoga For Morning Time!", thumbnail: "https://img.youtube.com/vi/BG7mMK0914w/maxresdefault.jpg" }
    ],
    third: [
      { id: "Qd4QBIoKrJM", title: "Pregnancy Cardio Workout (NO SQUATS, NO LUNGES) 20 Min Pregnancy Walking Workout!", thumbnail: "https://img.youtube.com/vi/Qd4QBIoKrJM/maxresdefault.jpg" },
      { id: "R37pE-e-re4", title: "Train for Labor! 18-Min Third Trimester Pregnancy Strength Workout", thumbnail: "https://img.youtube.com/vi/R37pE-e-re4/maxresdefault.jpg" },
      { id: "Eadzp6T-em4", title: "Third Trimester Pregnancy Yoga (Prepare Your Body For A Positive Birth)", thumbnail: "https://img.youtube.com/vi/Eadzp6T-em4/maxresdefault.jpg" },
      { id: "_HYzzcgndWw", title: "Pregnancy Cardio Workout (1st Trimester, 2nd Trimester, 3rd Trimester + Postpartum Safe)", thumbnail: "https://img.youtube.com/vi/_HYzzcgndWw/maxresdefault.jpg" },
      { id: "-mfNatGfAbs", title: "Pregnancy Yoga For An Easier Delivery", thumbnail: "https://img.youtube.com/vi/-mfNatGfAbs/maxresdefault.jpg" },
      { id: "4JXQYXNI-S4", title: "Create an Easier Birth with This Pregnancy Strength & Labor Positions Class", thumbnail: "https://img.youtube.com/vi/4JXQYXNI-S4/maxresdefault.jpg" },
      { id: "BG7mMK0914w", title: "Feel Amazing After This 15-Min Prenatal Yoga For Morning Time!", thumbnail: "https://img.youtube.com/vi/BG7mMK0914w/maxresdefault.jpg" }
    ]
  }
};

function VideoGrid({ videos }: { videos: VideoData[] }) {
  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">No videos added for this week yet.</CardContent>
      </Card>
    );
  }
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map(video => (
        <Card key={video.id} className="overflow-hidden">
          <div className="aspect-video bg-muted relative">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base leading-snug line-clamp-2">{video.title}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default function PregnancyVideos() {
  const [weeksPregnant, setWeeksPregnant] = useState(() => getCurrentWeeksFromLocal());
  const [trimester, setTrimester] = useState<number>(() => getTrimesterFromWeeks(weeksPregnant));
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);

  useEffect(() => {
    // If the selected trimester matches the current weeks, use current weeks for snapshot
    // Otherwise use a representative week for that trimester
    let weekToFetch = weeksPregnant;
    const currentTrimester = getTrimesterFromWeeks(weeksPregnant);
    
    if (trimester !== currentTrimester) {
      if (trimester === 1) weekToFetch = 7;
      else if (trimester === 2) weekToFetch = 20;
      else weekToFetch = 34;
    }

    void fetchDashboardSnapshot(weekToFetch).then(setSnapshot);
  }, [trimester, weeksPregnant]);

  const pregnancyVideos = useMemo(() => {
    const trimesterKey = trimester === 1 ? 'first' : trimester === 2 ? 'second' : 'third';
    return TRIMESTER_VIDEOS.pregnancy[trimesterKey] ?? [];
  }, [trimester]);

  const exerciseVideos = useMemo(() => {
    const trimesterKey = trimester === 1 ? 'first' : trimester === 2 ? 'second' : 'third';
    return TRIMESTER_VIDEOS.exercise[trimesterKey] ?? [];
  }, [trimester]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
            Youtube Videos
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            Curated guidance for every stage
          </p>
        </div>
        
        <Select value={String(trimester)} onValueChange={(v) => setTrimester(Number(v))}>
          <SelectTrigger className="w-full sm:w-[250px] bg-white/60 backdrop-blur-md border-pink-100 hover:border-pink-300 text-pink-600 font-bold rounded-2xl shadow-lg shadow-pink-100/20 h-14 transition-all">
            <SelectValue placeholder="Select Trimester" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-xl border-pink-100 rounded-2xl shadow-2xl p-2">
            <SelectItem value="1" className="rounded-xl focus:bg-pink-50 focus:text-pink-600 font-semibold py-3 cursor-pointer">First Trimester</SelectItem>
            <SelectItem value="2" className="rounded-xl focus:bg-pink-50 focus:text-pink-600 font-semibold py-3 cursor-pointer">Second Trimester</SelectItem>
            <SelectItem value="3" className="rounded-xl focus:bg-pink-50 focus:text-pink-600 font-semibold py-3 cursor-pointer">Third Trimester</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pregnancy" className="w-full">
        <div className="flex justify-center mb-8 px-1">
          <TabsList className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-pink-100/50 h-auto gap-2">
            <TabsTrigger
              value="pregnancy"
              className="px-6 py-3 rounded-xl font-bold transition-all data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-200 text-slate-600"
            >
              Medical Info
            </TabsTrigger>
            <TabsTrigger
              value="exercise"
              className="px-6 py-3 rounded-xl font-bold transition-all data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-200 text-slate-600"
            >
              Workouts & Yoga
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pregnancy" className="mt-0 px-1">
          <VideoGrid videos={pregnancyVideos} />
        </TabsContent>

        <TabsContent value="exercise" className="mt-0 px-1">
          <VideoGrid videos={exerciseVideos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
