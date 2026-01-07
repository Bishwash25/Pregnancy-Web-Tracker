import { 
  Category, 
  Region, 
  searchMyths, 
  getMythsForWeek, 
  getMythsByCategory,
  getMythsByRegion,
  mythsFactsData,
  MythFact
} from "@/data/mythsFactsData";

export interface ClassificationResult {
  category: Category;
  confidence: number;
  regionHint: Region;
  matchedMyths: MythFact[];
}

const categoryKeywords: Record<Category, string[]> = {
  "Nutrition": [
    "eat", "food", "drink", "diet", "fruit", "vegetable", "papaya", "pineapple", 
    "fish", "meat", "milk", "coffee", "tea", "caffeine", "sugar", "spicy", 
    "saffron", "ghee", "dates", "almonds", "eggs", "chocolate", "honey",
    "watermelon", "coconut", "crab", "lamb", "duck", "rabbit", "vitamin",
    "nutrient", "calorie", "hungry", "craving", "herbal"
  ],
  "Activity": [
    "exercise", "walk", "run", "swim", "yoga", "lift", "carry", "bend", 
    "stretch", "stairs", "travel", "fly", "drive", "sex", "intercourse",
    "work", "computer", "phone", "microwave", "bath", "shower", "hot tub",
    "scissors", "clean", "move", "furniture", "funeral", "eclipse"
  ],
  "Body Changes": [
    "weight", "belly", "bump", "show", "stretch mark", "skin", "hair", 
    "glow", "swelling", "feet", "ankles", "back pain", "spotting", 
    "bleeding", "linea nigra", "heartburn", "nausea", "vomit", "morning sickness"
  ],
  "Emotions": [
    "stress", "anxiety", "worried", "sad", "cry", "happy", "mood", 
    "depressed", "nervous", "feel", "emotion", "pregnancy brain", "forget"
  ],
  "Labor": [
    "labor", "delivery", "birth", "contraction", "water break", "due date",
    "induce", "induction", "c-section", "cesarean", "breech", "drop",
    "mucus plug", "membrane", "dilate", "cervix", "preterm", "viability"
  ],
  "Gender Myths": [
    "boy", "girl", "gender", "sex", "heart rate", "belly shape", "high",
    "low", "carrying", "craving sweet", "craving salty", "chinese calendar",
    "moody", "fair", "dark", "complexion"
  ],
  "Sleep/Posture": [
    "sleep", "side", "back", "left", "right", "pillow", "position", 
    "posture", "sit", "stand", "legs crossed", "rest", "bed rest"
  ],
  "General": [
    "test", "pregnant", "safe", "dangerous", "harm", "baby", "trimester",
    "advice", "old wives", "myth", "true", "false", "believe"
  ]
};

const regionKeywords: Record<Region, string[]> = {
  "South Asia": [
    "india", "indian", "pakistan", "bangladesh", "nepal", "sri lanka",
    "saffron", "ghee", "ayurveda", "papaya", "coconut", "evil eye",
    "fair skin", "almond", "eclipse"
  ],
  "Middle East": [
    "arab", "middle east", "dates", "honey", "halal", "evil eye",
    "islamic", "muslim", "funeral"
  ],
  "Western": [
    "america", "usa", "uk", "europe", "western", "modern", "science",
    "doctor", "hospital"
  ],
  "East Asia": [
    "china", "chinese", "japan", "japanese", "korea", "korean",
    "cold food", "warm food", "yin", "yang", "acupuncture", "duck",
    "rabbit", "crab", "white foods", "calendar"
  ],
  "Global": []
};

export function classifyUserQuery(query: string, currentWeek?: number): ClassificationResult {
  const lowerQuery = query.toLowerCase();
  
  const categoryScores: Record<Category, number> = {
    "Nutrition": 0,
    "Activity": 0,
    "Body Changes": 0,
    "Emotions": 0,
    "Labor": 0,
    "Gender Myths": 0,
    "Sleep/Posture": 0,
    "General": 0
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        categoryScores[category as Category] += 1;
      }
    }
  }

  const bestCategory = Object.entries(categoryScores).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0] as Category;

  const maxScore = Math.max(...Object.values(categoryScores));
  const totalKeywords = Object.values(categoryKeywords).flat().filter(k => 
    lowerQuery.includes(k)
  ).length;
  const confidence = totalKeywords > 0 ? Math.min(maxScore / totalKeywords * 0.7 + 0.3, 1) : 0.5;

  let regionHint: Region = "Global";
  for (const [region, keywords] of Object.entries(regionKeywords)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        regionHint = region as Region;
        break;
      }
    }
    if (regionHint !== "Global") break;
  }

  let matchedMyths = searchMyths(query);

  if (matchedMyths.length === 0) {
    matchedMyths = getMythsByCategory(bestCategory);
  }

  if (currentWeek !== undefined) {
    const weekMyths = matchedMyths.filter(m => m.week === currentWeek);
    if (weekMyths.length > 0) {
      matchedMyths = weekMyths;
    } else {
      const nearbyMyths = matchedMyths.filter(m => 
        Math.abs(m.week - currentWeek) <= 4
      );
      if (nearbyMyths.length > 0) {
        matchedMyths = nearbyMyths;
      }
    }
  }

  matchedMyths = matchedMyths.slice(0, 5);

  return {
    category: bestCategory,
    confidence,
    regionHint,
    matchedMyths
  };
}

export function getRelatedMyths(myth: MythFact): MythFact[] {
  return mythsFactsData
    .filter(m => 
      m.id !== myth.id && 
      (m.category === myth.category || m.region === myth.region)
    )
    .slice(0, 3);
}

export function getTrendingMyths(): MythFact[] {
  const highRiskMyths = mythsFactsData.filter(m => m.riskLevel === "High");
  const mediumRiskMyths = mythsFactsData.filter(m => m.riskLevel === "Medium");
  
  return [...highRiskMyths.slice(0, 2), ...mediumRiskMyths.slice(0, 3)];
}

export function getPopularMythsByWeekRange(startWeek: number, endWeek: number): MythFact[] {
  return mythsFactsData.filter(m => m.week >= startWeek && m.week <= endWeek);
}

export function getMythStats() {
  const categoryCount: Record<Category, number> = {
    "Nutrition": 0,
    "Activity": 0,
    "Body Changes": 0,
    "Emotions": 0,
    "Labor": 0,
    "Gender Myths": 0,
    "Sleep/Posture": 0,
    "General": 0
  };

  const regionCount: Record<Region, number> = {
    "Global": 0,
    "South Asia": 0,
    "Middle East": 0,
    "Western": 0,
    "East Asia": 0
  };

  const riskCount = { Low: 0, Medium: 0, High: 0 };

  mythsFactsData.forEach(m => {
    categoryCount[m.category]++;
    regionCount[m.region]++;
    riskCount[m.riskLevel]++;
  });

  return {
    total: mythsFactsData.length,
    byCategory: categoryCount,
    byRegion: regionCount,
    byRisk: riskCount
  };
}
