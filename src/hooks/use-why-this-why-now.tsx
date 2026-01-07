import { useState, useEffect, useCallback } from "react";
import { differenceInWeeks } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import {
  getExplanationForSymptom,
  getAllSymptomsByCategory,
  getSymptomCategories,
  searchSymptoms,
  whyThisWhyNowData,
  SymptomExplanation,
  WeekRange,
  categoryLabels,
  categoryIcons,
  categoryColors,
} from "@/data/whyThisWhyNowData";

export { categoryLabels, categoryIcons, categoryColors };

export interface UseWhyThisWhyNowReturn {
  currentWeek: number;
  getExplanation: (symptomId: string) => {
    symptom: SymptomExplanation;
    weekRange: WeekRange;
    matchedRange: string;
  } | null;
  getAllSymptoms: (category?: string, week?: number) => SymptomExplanation[];
  getCategories: () => string[];
  search: (query: string) => SymptomExplanation[];
  medicalDisclaimer: string;
  sources: string[];
  loading: boolean;
}

export function useWhyThisWhyNow(): UseWhyThisWhyNowReturn {
  const [currentWeek, setCurrentWeek] = useState(12);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const LocalStorageFallback = () => {
      const storedLastPeriodDate = localStorage.getItem("lastPeriodDate");
      if (storedLastPeriodDate) {
        const lastPeriod = new Date(storedLastPeriodDate);
        const today = new Date();
        const totalWeeks = differenceInWeeks(today, lastPeriod);
        setCurrentWeek(Math.min(Math.max(totalWeeks, 1), 42));
      }
      setLoading(false);
    };

    if (user?.uid) {
      const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
      unsubscribe = onSnapshot(
        pregnancyDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as {
              lastPeriodDate?: Timestamp | Date | string;
            };
            const lp =
              data.lastPeriodDate instanceof Timestamp
                ? data.lastPeriodDate.toDate()
                : data.lastPeriodDate
                  ? new Date(data.lastPeriodDate)
                  : null;
            if (lp) {
              const today = new Date();
              const totalWeeks = differenceInWeeks(today, lp);
              setCurrentWeek(Math.min(Math.max(totalWeeks, 1), 42));
              setLoading(false);
              return;
            }
          }
          LocalStorageFallback();
        },
        () => {
          LocalStorageFallback();
        }
      );
    } else {
      LocalStorageFallback();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  const getExplanation = useCallback(
    (symptomId: string) => {
      return getExplanationForSymptom(symptomId, currentWeek);
    },
    [currentWeek]
  );

  const getAllSymptoms = useCallback((category?: string, week?: number) => {
    const targetWeek = week || currentWeek;
    const all = getAllSymptomsByCategory(category);

    // Filter out symptoms that don't apply to the current week
    return all.filter(symptom => {
      // Check if any key in weekRanges covers the targetWeek
      // Keys are like "1-13", "14-27", "28-42", "1-42"
      return Object.keys(symptom.weekRanges).some(range => {
        const [start, end] = range.split('-').map(Number);
        return targetWeek >= start && targetWeek <= end;
      });
    });
  }, [currentWeek]);

  const getCategories = useCallback(() => {
    return getSymptomCategories();
  }, []);

  const search = useCallback((query: string) => {
    return searchSymptoms(query);
  }, []);

  return {
    currentWeek,
    getExplanation,
    getAllSymptoms,
    getCategories,
    search,
    medicalDisclaimer: whyThisWhyNowData.medicalDisclaimer,
    sources: whyThisWhyNowData.sources,
    loading,
  };
}
