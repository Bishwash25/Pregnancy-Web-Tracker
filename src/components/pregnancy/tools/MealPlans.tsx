import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Utensils,
  Info,
  ChevronRight,
  Apple,
  Droplets,
  CheckCircle2,
  Stethoscope,
  ChevronDown,
  Clock,
  Sparkles,
  Search,
  ChefHat,
  Loader2
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface PregnancyData {
  lastPeriodDate?: Timestamp | Date | null;
}

interface NutritionTips {
  [key: string]: string;
}

interface DailyMealPlan {
  breakfast: {
    name: string;
    instructions: string;
    nutrients: string[];
  };
  lunch: {
    name: string;
    instructions: string;
    nutrients: string[];
  };
  dinner: {
    name: string;
    instructions: string;
    nutrients: string[];
  };
  snacks: {
    name: string;
    instructions: string;
    nutrients: string[];
  };
  ingredient_nutrients: {
    [key: string]: string[];
  };
}

type ViewMode = "tips" | "customMeal";
type Step = "intro" | "analyzing" | "content";

export default function MealPlans({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [currentTrimester, setCurrentTrimester] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>("tips");
  const [ingredients, setIngredients] = useState<string>("");
  const [generatedMeal, setGeneratedMeal] = useState<DailyMealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { user } = useFirebaseAuth();

  useEffect(() => {
    const calculatePregnancyWeek = (lastPeriodDate: Date) => {
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastPeriodDate.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      return diffWeeks;
    };

    const LocalStorageFallback = () => {
      const storedLastPeriodDate = localStorage.getItem("lastPeriodDate");
      if (storedLastPeriodDate) {
        const lastPeriod = new Date(storedLastPeriodDate);
        const weeks = calculatePregnancyWeek(lastPeriod);
        setCurrentWeek(weeks);
        updateTrimester(weeks);
      }
    };

    const updateTrimester = (weeks: number) => {
      if (weeks < 13) {
        setCurrentTrimester(1);
      } else if (weeks <= 27) {
        setCurrentTrimester(2);
      } else {
        setCurrentTrimester(3);
      }
    };

    if (user?.uid) {
      const pregnancyDocRef = doc(db, "users", user.uid, "pregnancyDetails", "current");
      const unsubscribe = onSnapshot(pregnancyDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as PregnancyData;
          const lastPeriodDate = data.lastPeriodDate instanceof Timestamp
            ? data.lastPeriodDate.toDate()
            : (data.lastPeriodDate ? new Date(data.lastPeriodDate) : null);

          if (lastPeriodDate) {
            localStorage.setItem("lastPeriodDate", lastPeriodDate.toISOString());
            const weeks = calculatePregnancyWeek(lastPeriodDate);
            const clampedWeeks = Math.min(weeks, 42);
            setCurrentWeek(clampedWeeks);
            updateTrimester(clampedWeeks);
            return;
          }
        }
        LocalStorageFallback();
      }, () => {
        LocalStorageFallback();
      });

      return () => unsubscribe();
    } else {
      LocalStorageFallback();
    }

    const storedViewMode = localStorage.getItem("mealPlansViewMode");
    if (storedViewMode && ["tips", "customMeal"].includes(storedViewMode)) {
      setViewMode(storedViewMode as ViewMode);
    }
  }, [user?.uid]);

  useEffect(() => {
    localStorage.setItem("mealPlansViewMode", viewMode);
  }, [viewMode]);

  const getNutritionTips = (): NutritionTips => {
    if (currentWeek === 0) {
      return {
        "Hydration": "Drink at least 8 glasses of water daily to maintain optimal hydration.",
        "Essential Nutrients": "Folic acid (400–800 mcg/day), Iron, Vitamin D, and a balanced multivitamin if advised by your doctor.",
        "Healthy Lifestyle": "Maintain a healthy weight, exercise regularly, avoid alcohol, smoking, and recreational drugs.",
        "Meal Strategy": "Eat a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats.",
        "Medical Advisory": "Consult your healthcare provider for preconception check-up and guidance."
      };
    } else if (1 <= currentWeek && currentWeek <= 12) {
      return {
        "Hydration": "Drink at least 8–10 glasses of water daily to stay hydrated and support amniotic fluid levels.",
        "Essential Nutrients": "Folic acid (leafy greens, fortified cereals), Vitamin B6 (bananas, nuts), Iron (lean meats, spinach).",
        "Small and Frequent Meals": "Eat small meals every 2–3 hours to manage nausea and morning sickness.",
        "Foods to Avoid": "Raw seafood, unpasteurized dairy, high-mercury fish (shark, swordfish), processed meats, excessive caffeine.",
        "Exercises": "Walking, prenatal yoga, light stretching, and deep breathing exercises (avoid strenuous workouts)."
      };
    } else if (13 <= currentWeek && currentWeek <= 27) {
      return {
        "Hydration": "Increase fluid intake; include natural fruit juices and coconut water for electrolytes.",
        "Essential Nutrients": "Calcium (milk, yogurt), Vitamin D (sunlight, fortified foods), Omega-3s (salmon, walnuts), Protein (chicken, lentils).",
        "Small and Frequent Meals": "Maintain balanced meals to support baby's growth and prevent heartburn.",
        "Foods to Avoid": "Raw eggs, excessive sugar, unpasteurized foods, high-mercury fish.",
        "Exercises": "Swimming, stationary cycling, moderate strength training, prenatal pilates, pelvic floor exercises (Kegels)."
      };
    } else if (28 <= currentWeek && currentWeek <= 40) {
      return {
        "Hydration": "Stay hydrated to reduce swelling and constipation. Herbal teas like ginger and peppermint may help digestion if approved by your doctor.",
        "Essential Nutrients": "Iron (red meat, legumes), Fiber (whole grains, fruits), Healthy Fats (avocado, nuts).",
        "Small and Frequent Meals": "Eat fiber-rich meals and avoid heavy, greasy foods to prevent bloating and reflux.",
        "Foods to Avoid": "Too much salt, fried foods, carbonated drinks, undercooked meats.",
        "Exercises": "Gentle stretching, prenatal yoga, walking, cat-cow stretch for back relief."
      };
    } else if (currentWeek > 40 && currentWeek <= 42) {
      return {
        "Hydration": "Maintain 8–10 glasses of water daily.",
        "Essential Nutrients": "Magnesium (pumpkin seeds, almonds), Potassium (bananas, sweet potatoes), Iron & Vitamin C combo (beans + citrus fruits).",
        "Meal Strategy": "Light, frequent meals including smoothies, soups, and fiber-rich foods.",
        "Foods to Avoid": "Greasy, fried, and overly processed foods; avoid laxatives unless advised by your doctor.",
        "Exercises": "Gentle walking, pelvic tilts, deep breathing exercises (avoid lying flat for long periods).",
        "Lifestyle Tips": "Practice relaxation techniques: meditation, warm baths, gentle music; stay mentally active; monitor fetal movements regularly.",
        "Medical Advisory": "Discuss labor induction options with your healthcare provider; weekly fetal monitoring and ultrasounds may be recommended."
      };
    } else {
      return {
        "Message": "Invalid week number. Please provide a week between 0 and 42."
      };
    }
  };



  const startAnalysis = () => {
    setStep("analyzing");
    setTimeout(() => setStep("content"), 2000);
  };

  const generateMeal = async () => {
    if (!ingredients.trim()) return;

    setIsGenerating(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are a maternal nutrition expert and registered dietitian.

Create a pregnancy-safe daily meal plan using ONLY the following ingredients:
${ingredients}

The meal plan must include:
1. Breakfast
2. Lunch
3. Dinner
4. Snacks

STRICT REQUIREMENTS:
- Use ONLY the listed ingredients
- Avoid pregnancy-unsafe foods (raw fish, undercooked eggs, unpasteurized dairy, high-mercury fish, excessive caffeine)
- Ensure balanced nutrition suitable for pregnancy
- Keep instructions simple and easy to follow
- No medical claims, only nutritional guidance

For EACH meal, provide:
- Recipe name
- Step-by-step cooking instructions
- Key pregnancy-relevant nutrients

Additionally, provide a nutrient breakdown for EACH INDIVIDUAL INGREDIENT used, highlighting:
- Macronutrients (protein, carbohydrates, fats)
- Key micronutrients relevant to pregnancy (folate, iron, calcium, iodine, vitamin D, vitamin B12, fiber, omega-3 if applicable)

OUTPUT FORMAT:
Respond with VALID JSON ONLY. Do not include explanations, markdown, or extra text.

Use the following JSON structure exactly:

{
  "breakfast": {
    "name": "Recipe Name",
    "instructions": "Step-by-step instructions",
    "nutrients": ["Nutrient1", "Nutrient2"]
  },
  "lunch": {
    "name": "Recipe Name",
    "instructions": "Step-by-step instructions",
    "nutrients": ["Nutrient1", "Nutrient2"]
  },
  "dinner": {
    "name": "Recipe Name",
    "instructions": "Step-by-step instructions",
    "nutrients": ["Nutrient1", "Nutrient2"]
  },
  "snacks": {
    "name": "Recipe Name",
    "instructions": "Step-by-step instructions",
    "nutrients": ["Nutrient1", "Nutrient2"]
  },
  "ingredient_nutrients": {
    "Ingredient Name": ["Nutrient1", "Nutrient2", "Nutrient3"],
    "Ingredient Name 2": ["Nutrient1", "Nutrient2"]
  }
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      console.log(response)

      // Clean the response text to extract JSON
      text = text.trim();
      if (text.startsWith('```json')) {
        text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }

      // Parse the JSON response
      const mealData = JSON.parse(text.trim());
      setGeneratedMeal(mealData);
    } catch (error) {
      console.error("Error generating meal:", error);
      // You could add error handling UI here
    } finally {
      setIsGenerating(false);
    }
  };

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
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-orange-600 shadow-inner">
                <Utensils className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pregnancy Meal Plans</h1>
              <p className="text-gray-600 text-lg">
                Personalized nutrition guidance and meal ideas tailored to your current pregnancy stage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">YOUR CURRENT STATUS</p>
                <p className="text-xl font-bold text-orange-600">Week {currentWeek}</p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100" />
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">TRIMESTER</p>
                <p className="text-xl font-bold text-orange-600">
                  {currentTrimester === 1 ? '1st' : currentTrimester === 2 ? '2nd' : '3rd'}
                </p>
              </div>
            </div>

            <Button
              onClick={startAnalysis}
              className="w-full h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl transition-all hover:scale-[1.02]"
            >
              Generate My Plan
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center justify-center mx-auto">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Tools
            </button>
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
                <Apple className="h-12 w-12" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-slate-900 rounded-full -z-10"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Customizing Your Nutrition...</h2>
              <p className="text-gray-500 animate-pulse">Mapping trimester-specific needs</p>
            </div>
            <div className="max-w-xs mx-auto space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Identifying Key Nutrients
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Cross-referencing Week {currentWeek}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 justify-center font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500" /> Building Daily Meal Plan
              </div>
            </div>
          </motion.div>
        )}

        {step === "content" && (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl w-full space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setStep("intro")} className="rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Nutrition Guide</h2>
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">Trimester {currentTrimester} • Week {currentWeek}</p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-6 bg-white text-gray-900 border-2 border-gray-100 font-bold rounded-2xl shadow-sm hover:border-orange-500 hover:text-orange-600 transition-all duration-200 min-w-[200px]"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {viewMode === 'tips' ? 'Nutrition Tips' : 'Custom Meal Generator'}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] p-2 bg-white border-2 border-gray-50 shadow-2xl rounded-2xl overflow-hidden">
                  <DropdownMenuItem
                    onClick={() => setViewMode('tips')}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <Info className="h-4 w-4" /> Nutrition Tips
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setViewMode('customMeal')}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <ChefHat className="h-4 w-4" /> Custom Meal Generator
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {viewMode === "tips" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden">
                  <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-8 text-white">
                    <Sparkles className="h-10 w-10 mb-4 opacity-80" />
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Essential Insights</h3>
                    <p className="text-white/80 font-medium">Specific focus for Week {currentWeek}</p>
                  </div>
                  <CardContent className="p-8 space-y-6 bg-white">
                    {Object.entries(getNutritionTips()).map(([category, tip], idx) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group flex gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0"
                      >
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                          {category === "Hydration" ? <Droplets className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{category}</h4>
                          <p className="text-sm font-bold text-gray-700 leading-relaxed">{tip}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="border-2 border-gray-50 shadow-xl rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                          <Stethoscope className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Clinical Guidelines</h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { t: "1st Trimester", d: "Focus on folate, iron, and B vitamins. Small meals help with nausea." },
                          { t: "2nd Trimester", d: "Boost calcium and Vitamin D for bone growth. Increase protein." },
                          { t: "3rd Trimester", d: "Omega-3s for brain growth. Smaller meals prevent heartburn." }
                        ].map((item, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{item.t}</h4>
                            <p className="text-sm font-bold text-gray-700">{item.d}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="p-8 rounded-[2.5rem] bg-orange-50 border-2 border-orange-100/50 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <h3 className="text-sm font-black text-orange-700 uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Pro-Tip
                    </h3>
                    <p className="text-sm font-bold text-orange-900 leading-relaxed relative z-10">
                      "These meal plans are medically-aligned suggestions. Always sync with your healthcare provider for specific dietary needs or conditions."
                    </p>
                  </div>
                </div>
              </div>
            )}



            {viewMode === "customMeal" && (
              <div className="space-y-8">
                <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white">
                    <ChefHat className="h-10 w-10 mb-4 opacity-80" />
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Custom Meal Generator</h3>
                    <p className="text-white/80 font-medium">Create personalized recipes based on your available ingredients</p>
                  </div>
                  <CardContent className="p-8 space-y-6 bg-white">
                    <div className="space-y-4">
                      <label className="text-sm font-black text-gray-700 uppercase tracking-widest">
                        Available Ingredients
                      </label>
                      <Textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Enter ingredients you have available (e.g., chicken, rice, broccoli, garlic, olive oil)"
                        className="min-h-[120px] resize-none rounded-2xl border-2 border-gray-100 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <Button
                        onClick={generateMeal}
                        disabled={!ingredients.trim() || isGenerating}
                        className="w-full h-14 text-lg font-semibold rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating Recipe...
                          </>
                        ) : (
                          <>
                            <ChefHat className="mr-2 h-5 w-5" />
                            Generate Meal
                          </>
                        )}
                      </Button>
                    </div>

                    {generatedMeal && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 space-y-6"
                      >
                        <h4 className="text-2xl font-black text-gray-900 text-center">Your Daily Meal Plan</h4>

                        {/* Breakfast */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-purple-100 text-purple-600">
                              <ChefHat className="h-6 w-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <h5 className="text-xl font-black text-gray-900">Breakfast: {generatedMeal.breakfast.name}</h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Instructions</h6>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{generatedMeal.breakfast.instructions}</p>
                                </div>
                                <div>
                                  <h6 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Key Nutrients</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {generatedMeal.breakfast.nutrients.map((nutrient, index) => (
                                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-tight py-1 px-3 rounded-lg border-0">
                                        {nutrient}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lunch */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-100">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-green-100 text-green-600">
                              <ChefHat className="h-6 w-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <h5 className="text-xl font-black text-gray-900">Lunch: {generatedMeal.lunch.name}</h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Instructions</h6>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{generatedMeal.lunch.instructions}</p>
                                </div>
                                <div>
                                  <h6 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Key Nutrients</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {generatedMeal.lunch.nutrients.map((nutrient, index) => (
                                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 text-xs font-bold uppercase tracking-tight py-1 px-3 rounded-lg border-0">
                                        {nutrient}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dinner */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                              <ChefHat className="h-6 w-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <h5 className="text-xl font-black text-gray-900">Dinner: {generatedMeal.dinner.name}</h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Instructions</h6>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{generatedMeal.dinner.instructions}</p>
                                </div>
                                <div>
                                  <h6 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Key Nutrients</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {generatedMeal.dinner.nutrients.map((nutrient, index) => (
                                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-tight py-1 px-3 rounded-lg border-0">
                                        {nutrient}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Snacks */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-yellow-100 text-yellow-600">
                              <ChefHat className="h-6 w-6" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <h5 className="text-xl font-black text-gray-900">Snacks: {generatedMeal.snacks.name}</h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Instructions</h6>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{generatedMeal.snacks.instructions}</p>
                                </div>
                                <div>
                                  <h6 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Key Nutrients</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {generatedMeal.snacks.nutrients.map((nutrient, index) => (
                                      <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-tight py-1 px-3 rounded-lg border-0">
                                        {nutrient}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ingredient Nutrients */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-100">
                          <h5 className="text-xl font-black text-gray-900 mb-4">Ingredient Nutrient Breakdown</h5>
                          <div className="space-y-3">
                            {Object.entries(generatedMeal.ingredient_nutrients).map(([ingredient, nutrients], index) => (
                              <div key={index} className="flex items-start gap-4">
                                <div className="p-2 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm">
                                  {ingredient}
                                </div>
                                <div className="flex flex-wrap gap-2 flex-1">
                                  {nutrients.map((nutrient, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-tight py-1 px-3 rounded-lg border-0">
                                      {nutrient}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-center pt-8">
                  <Button
                    onClick={onBack}
                    className="h-14 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold shadow-xl transition-transform hover:scale-105"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
