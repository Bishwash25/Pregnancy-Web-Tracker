export interface WeeklyTip {
  week: number;
  tip: string;
  emoji: string;
}

export const weeklyTips: WeeklyTip[] = [

  { week: 0, tip: "Maintain a regular sleep schedule and manage daily stress.", emoji: "🌙" },
  { week: 1, tip: "Track your menstrual cycle and stay well hydrated.", emoji: "💧" },
  { week: 2, tip: "Focus on balanced home-cooked meals with fruits and vegetables.", emoji: "🥗" },
  { week: 3, tip: "Avoid alcohol, smoking, and secondhand smoke exposure.", emoji: "🚫" },
  { week: 4, tip: "Establish a consistent meal and sleep routine.", emoji: "⏰" },
  { week: 5, tip: "Eat small, frequent meals to reduce nausea.", emoji: "🍽️" },
  { week: 6, tip: "Rest when tired—early fatigue is common.", emoji: "😴" },
  { week: 7, tip: "Avoid strong smells and greasy foods if nausea worsens.", emoji: "🍋" },
  { week: 8, tip: "Wash fruits and vegetables thoroughly before eating.", emoji: "🚿" },
  { week: 9, tip: "Light walking can help circulation and energy.", emoji: "🚶‍♀️" },
  { week: 10, tip: "Maintain good posture to reduce back strain.", emoji: "🪑" },
  { week: 11, tip: "Stay active with gentle daily movement.", emoji: "🤸‍♀️" },
  { week: 12, tip: "Take short breaks during the day to reduce fatigue.", emoji: "☕" },

  { week: 13, tip: "Begin gentle pelvic floor awareness exercises.", emoji: "💪" },
  { week: 14, tip: "Listen to your body as energy levels improve.", emoji: "⚡" },
  { week: 15, tip: "Increase fiber-rich foods to support digestion.", emoji: "🥬" },
  { week: 16, tip: "Notice early fetal movements—often described as fluttering.", emoji: "🦋" },
  { week: 17, tip: "Sleep on your side to improve circulation.", emoji: "🛏️" },
  { week: 18, tip: "Wear comfortable footwear as balance changes.", emoji: "👟" },
  { week: 19, tip: "Avoid standing for long periods without breaks.", emoji: "⏸️" },
  { week: 20, tip: "Talk or sing to your baby—hearing develops now.", emoji: "🎵" },
  { week: 21, tip: "Stretch hips and pelvis gently to reduce discomfort.", emoji: "🧘‍♀️" },
  { week: 22, tip: "Practice slow breathing to help relaxation.", emoji: "🌬️" },
  { week: 23, tip: "Elevate feet when resting to reduce swelling.", emoji: "🦵" },
  { week: 24, tip: "Eat balanced meals spaced evenly through the day.", emoji: "🍱" },
  { week: 25, tip: "Use pillows to support your back and abdomen during sleep.", emoji: "🛋️" },
  { week: 26, tip: "Begin daily awareness of fetal movement patterns.", emoji: "👣" },

  { week: 27, tip: "Avoid lying flat on your back for long periods.", emoji: "↩️" },
  { week: 28, tip: "Keep prenatal appointments consistent.", emoji: "📅" },
  { week: 29, tip: "Rest more frequently as oxygen demand increases.", emoji: "🧊" },
  { week: 30, tip: "Practice upright sitting to support breathing.", emoji: "🪑" },
  { week: 31, tip: "Change positions slowly to avoid dizziness.", emoji: "⚠️" },
  { week: 32, tip: "Continue side sleeping for optimal blood flow.", emoji: "💤" },
  { week: 33, tip: "Eat regular meals to maintain steady energy.", emoji: "🍎" },
  { week: 34, tip: "Practice gentle perineal relaxation techniques.", emoji: "🌷" },
  { week: 35, tip: "Prepare essentials for birth and hospital stay.", emoji: "🎒" },
  { week: 36, tip: "Notice changes in breathing as the baby lowers.", emoji: "⬇️" },
  { week: 37, tip: "Stay close to your planned delivery location.", emoji: "🏥" },
  { week: 38, tip: "Use relaxation techniques to manage anticipation.", emoji: "🧘" },
  { week: 39, tip: "Rest, hydrate, and conserve energy.", emoji: "💧" },
  { week: 40, tip: "Trust your body’s natural timing.", emoji: "⏳" },
  { week: 41, tip: "Stay alert to movement changes and follow guidance.", emoji: "👀" },
  { week: 42, tip: "Remain under close medical observation.", emoji: "🌟" }
];

export function getWeeklyTip(week: number): WeeklyTip {
  const clampedWeek = Math.min(Math.max(week, 0), 42);
  return weeklyTips.find(t => t.week === clampedWeek) || weeklyTips[0];
}

export function getPregnancyWeekFromStorage(): number {
  try {
    // Check for consolidated data first
    const storedData = localStorage.getItem("pregnancyData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (parsed.weeksPregnant !== undefined) {
        return Math.min(Math.max(parsed.weeksPregnant, 0), 42);
      }
      if (parsed.lmp || parsed.lastPeriodDate) {
        const lmpDate = new Date(parsed.lmp || parsed.lastPeriodDate);
        const today = new Date();
        const diffTime = today.getTime() - lmpDate.getTime();
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        return Math.min(Math.max(diffWeeks, 0), 42);
      }
    }

    // Fallback to individual keys used in PregnancyStart.tsx
    const lastPeriodDate = localStorage.getItem("lastPeriodDate");
    if (lastPeriodDate) {
      const lmpDate = new Date(lastPeriodDate);
      const today = new Date();
      const diffTime = today.getTime() - lmpDate.getTime();
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      return Math.min(Math.max(diffWeeks, 0), 42);
    }
  } catch (e) {
    console.error("Error reading pregnancy week from storage:", e);
  }
  return 0;
} 
