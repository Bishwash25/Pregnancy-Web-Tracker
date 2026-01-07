import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Search
} from "lucide-react";
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

interface Meal {
  name: string;
  description: string;
  nutrients: string[];
  recipe?: string;
}

interface DailyMeal {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

interface NutritionTips {
  [key: string]: string;
}

type ViewMode = "tips" | "mealPlan";
type Step = "intro" | "analyzing" | "content";

export default function MealPlans({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [activeTab, setActiveTab] = useState("trimester1");
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [currentTrimester, setCurrentTrimester] = useState<number>(1);
  const [showRecipe, setShowRecipe] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("tips");
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
        setActiveTab("trimester1");
      } else if (weeks <= 27) {
        setCurrentTrimester(2);
        setActiveTab("trimester2");
      } else {
        setCurrentTrimester(3);
        setActiveTab("trimester3");
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
    if (storedViewMode && ["tips", "mealPlan"].includes(storedViewMode)) {
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

  const mealPlans: Record<string, DailyMeal[]> = {
    trimester1: [
      {
        breakfast: {
          name: "Ginger Oatmeal with Berries",
          description: "Steel-cut oats topped with fresh berries, a drizzle of honey, and a sprinkle of ginger to help with morning sickness.",
          nutrients: ["Fiber", "Antioxidants", "Vitamin C", "Iron"],
          recipe: "Ingredients:\n- 1/2 cup steel-cut oats\n- 1 cup water\n- 1/2 cup milk of choice\n- 1/4 tsp ground ginger\n- 1 tbsp honey\n- 1/2 cup mixed berries\n\nInstructions:\n1. Combine oats, water, and milk in a pot. Bring to a boil, then reduce heat.\n2. Simmer for 15-20 minutes, stirring occasionally until creamy.\n3. Stir in ground ginger.\n4. Transfer to a bowl, drizzle with honey, and top with fresh berries."
        },
        lunch: {
          name: "Lentil Soup with Whole Grain Bread",
          description: "A hearty lentil soup packed with vegetables, served with a slice of whole grain bread.",
          nutrients: ["Protein", "Folate", "Iron", "Fiber"],
          recipe: "Ingredients:\n- 1 cup red lentils\n- 1 onion, diced\n- 2 carrots, diced\n- 2 celery stalks, diced\n- 2 garlic cloves, minced\n- 4 cups vegetable broth\n- 1 tsp cumin\n- 1/2 tsp turmeric\n- Salt and pepper to taste\n- 1 slice whole grain bread\n\nInstructions:\n1. Rinse lentils thoroughly.\n2. In a pot, sauté onion, carrots, celery, and garlic until softened.\n3. Add lentils, broth, and spices. Bring to a boil, then simmer for 25 minutes.\n4. Blend partially for creamier texture if desired.\n5. Serve with whole grain bread."
        },
        dinner: {
          name: "Baked Salmon with Quinoa and Steamed Broccoli",
          description: "Omega-3 rich salmon fillet baked with lemon and herbs, served with quinoa and steamed broccoli.",
          nutrients: ["Omega-3 Fatty Acids", "Protein", "Calcium", "Iron", "Vitamin B12"],
          recipe: "Ingredients:\n- 4 oz salmon fillet\n- 1/2 cup quinoa\n- 1 cup water\n- 1 cup broccoli florets\n- 1 lemon, sliced\n- 2 sprigs fresh dill\n- 1 tbsp olive oil\n- Salt and pepper to taste\n\nInstructions:\n1. Preheat oven to 375°F (190°C).\n2. Place salmon on a baking sheet, drizzle with olive oil, top with lemon slices and dill.\n3. Bake for 15-18 minutes until salmon flakes easily.\n4. Meanwhile, rinse quinoa and cook with water according to package instructions.\n5. Steam broccoli until tender-crisp, about 5 minutes.\n6. Serve salmon with quinoa and broccoli."
        },
        snacks: [
          {
            name: "Apple Slices with Almond Butter",
            description: "Fresh apple slices served with a tablespoon of almond butter for protein and healthy fats.",
            nutrients: ["Fiber", "Healthy Fats", "Vitamin E"]
          },
          {
            name: "Greek Yogurt with Honey",
            description: "Plain Greek yogurt drizzled with honey for a protein-rich snack to combat nausea.",
            nutrients: ["Protein", "Calcium", "Probiotics"]
          }
        ]
      }
    ],
    trimester2: [
      {
        breakfast: {
          name: "Avocado Toast with Egg",
          description: "Whole grain toast topped with mashed avocado, a poached egg, and a sprinkle of hemp seeds.",
          nutrients: ["Healthy Fats", "Protein", "Fiber", "Vitamin E"],
          recipe: "Ingredients:\n- 1 slice whole grain bread\n- 1/2 ripe avocado\n- 1 egg\n- 1 tsp hemp seeds\n- Salt and pepper to taste\n- Red pepper flakes (optional)\n\nInstructions:\n1. Toast the bread until golden brown.\n2. Meanwhile, bring a small pot of water to a gentle simmer for poaching the egg.\n3. Add a splash of vinegar to the water, create a gentle whirlpool, and crack egg into the center.\n4. Poach for 3-4 minutes for a runny yolk.\n5. Mash avocado and spread on toast. Season with salt and pepper.\n6. Top with poached egg, sprinkle with hemp seeds and red pepper flakes if using."
        },
        lunch: {
          name: "Grilled Chicken and Vegetable Wrap",
          description: "Whole grain wrap filled with grilled chicken, mixed salad greens, bell peppers, and hummus.",
          nutrients: ["Protein", "Fiber", "Vitamin C", "Iron"],
          recipe: "Ingredients:\n- 1 whole grain wrap\n- 4 oz grilled chicken breast, sliced\n- 1 cup mixed salad greens\n- 1/4 bell pepper, sliced\n- 2 tbsp hummus\n- 1 tsp olive oil\n- 1 tsp lemon juice\n- Salt and pepper to taste\n\nInstructions:\n1. Warm wrap slightly to make it more pliable.\n2. Spread hummus over the center of the wrap.\n3. Top with chicken, greens, and bell pepper.\n4. Drizzle with olive oil and lemon juice, season with salt and pepper.\n5. Fold in sides and roll up tightly.\n6. Cut in half and serve."
        },
        dinner: {
          name: "Shrimp and Vegetable Stir-Fry with Brown Rice",
          description: "Shrimp stir-fried with a colorful mix of vegetables, served over brown rice.",
          nutrients: ["Protein", "Iron", "Zinc", "B Vitamins", "Fiber"],
          recipe: "Ingredients:\n- 4 oz shrimp, peeled and deveined\n- 1/2 cup brown rice\n- 1 cup mixed vegetables (broccoli, carrots, snap peas)\n- 1 garlic clove, minced\n- 1 tsp ginger, grated\n- 1 tbsp low-sodium soy sauce\n- 1 tsp sesame oil\n- 1 tbsp vegetable oil\n- 1 green onion, sliced (for garnish)\n\nInstructions:\n1. Cook brown rice according to package instructions.\n2. Heat vegetable oil in a wok or large pan over high heat.\n3. Add garlic and ginger, stir-fry for 30 seconds.\n4. Add vegetables, stir-fry for 3-4 minutes until crisp-tender.\n5. Add shrimp, cook for 2-3 minutes until pink and opaque.\n6. Add soy sauce and sesame oil, toss to coat.\n7. Serve over brown rice, garnish with green onion."
        },
        snacks: [
          {
            name: "Hummus with Vegetable Sticks",
            description: "Homemade or store-bought hummus served with carrot, cucumber, and bell pepper sticks.",
            nutrients: ["Protein", "Fiber", "Vitamin A", "Vitamin C"]
          },
          {
            name: "Banana Smoothie",
            description: "A smoothie made with banana, milk, yogurt, and a tablespoon of nut butter.",
            nutrients: ["Potassium", "Calcium", "Protein", "Vitamin D"]
          }
        ]
      }
    ],
    trimester3: [
      {
        breakfast: {
          name: "Chia Seed Pudding with Berries",
          description: "Chia seeds soaked in almond milk overnight, topped with mixed berries and a sprinkle of granola.",
          nutrients: ["Omega-3 Fatty Acids", "Fiber", "Calcium", "Protein"],
          recipe: "Ingredients:\n- 2 tbsp chia seeds\n- 1/2 cup almond milk\n- 1/2 tsp vanilla extract\n- 1 tsp honey or maple syrup\n- 1/4 cup mixed berries\n- 1 tbsp granola\n\nInstructions:\n1. Mix chia seeds, almond milk, vanilla, and sweetener in a jar or container.\n2. Stir well, then refrigerate overnight or for at least 4 hours.\n3. When ready to eat, stir again and top with berries and granola."
        },
        lunch: {
          name: "Tuna Salad Sandwich with Vegetable Soup",
          description: "Whole grain bread with tuna salad made with Greek yogurt instead of mayo, served with a cup of vegetable soup.",
          nutrients: ["Protein", "Omega-3 Fatty Acids", "Fiber", "Antioxidants"],
          recipe: "Ingredients:\n- 3 oz canned tuna in water, drained\n- 2 tbsp Greek yogurt\n- 1 tbsp diced celery\n- 1 tbsp diced red onion\n- 1 tsp lemon juice\n- 2 slices whole grain bread\n- Lettuce leaf\n- 1 cup vegetable soup (homemade or low-sodium store-bought)\n- Salt and pepper to taste\n\nInstructions:\n1. In a bowl, mix tuna, Greek yogurt, celery, red onion, lemon juice, salt, and pepper.\n2. Toast bread if desired.\n3. Assemble sandwich with lettuce and tuna mixture.\n4. Serve with a cup of warmed vegetable soup."
        },
        dinner: {
          name: "Turkey Meatballs with Whole Wheat Pasta and Tomato Sauce",
          description: "Lean turkey meatballs served with whole wheat pasta and a vegetable-rich tomato sauce.",
          nutrients: ["Protein", "Iron", "Fiber", "Vitamin C"],
          recipe: "Ingredients:\n- 4 oz lean ground turkey\n- 1 tbsp breadcrumbs\n- 1 tbsp grated parmesan cheese\n- 1 small garlic clove, minced\n- 1 tbsp fresh parsley, chopped\n- 1/2 cup whole wheat pasta\n- 1/2 cup tomato sauce\n- 1/4 cup each diced carrot, zucchini, and bell pepper\n- 1 tsp olive oil\n- Salt and pepper to taste\n\nInstructions:\n1. Mix ground turkey, breadcrumbs, parmesan, garlic, parsley, salt, and pepper.\n2. Form into small meatballs.\n3. Heat olive oil in a pan over medium heat.\n4. Cook meatballs for 8-10 minutes, turning occasionally, until cooked through.\n5. In another pan, sauté diced vegetables until tender.\n6. Add tomato sauce to vegetables and simmer for 5 minutes.\n7. Meanwhile, cook pasta according to package instructions.\n8. Serve meatballs and sauce over pasta."
        },
        snacks: [
          {
            name: "Mixed Nuts and Dried Fruits",
            description: "A handful of mixed nuts and dried fruits for energy and nutrients.",
            nutrients: ["Healthy Fats", "Protein", "Iron", "Fiber"]
          },
          {
            name: "Smoothie Bowl",
            description: "A thick smoothie made with spinach, banana, almond milk, and topped with granola and seeds.",
            nutrients: ["Iron", "Potassium", "Fiber", "Antioxidants"]
          }
        ]
      }
    ]
  };

  const startAnalysis = () => {
    setStep("analyzing");
    setTimeout(() => setStep("content"), 2000);
  };

  const getCurrentDayOfWeek = () => new Date().getDay();

  const getCurrentDayMealPlan = () => {
    const dayOfWeek = getCurrentDayOfWeek();
    const currentTrimesterMeals = mealPlans[activeTab] || mealPlans.trimester1;
    return currentTrimesterMeals[dayOfWeek] || currentTrimesterMeals[0];
  };

  const renderMeal = (meal: Meal, title: string) => (
    <div className="group relative p-6 rounded-3xl bg-white border-2 border-gray-50 hover:border-pink-100 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
          </div>
          <h3 className="text-xl font-black text-gray-900 leading-tight">{meal.name}</h3>
        </div>
        {meal.recipe && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-pink-500 hover:text-white transition-colors"
            onClick={() => setShowRecipe(showRecipe === `${title}-${meal.name}` ? null : `${title}-${meal.name}`)}
          >
            {showRecipe === `${title}-${meal.name}` ? "Hide" : "Recipe"}
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4">{meal.description}</p>

      <AnimatePresence>
        {showRecipe === `${title}-${meal.name}` && meal.recipe && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-4 bg-gray-50 p-5 rounded-2xl text-xs font-medium text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-line">
              {meal.recipe}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2">
        {meal.nutrients.map((nutrient, index) => (
          <Badge key={index} variant="secondary" className="bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-tight py-1 px-3 rounded-lg border-0">
            {nutrient}
          </Badge>
        ))}
      </div>
    </div>
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
                    {viewMode === 'tips' ? 'Nutrition Tips' : 'Weekly Meal Plan'}
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
                    onClick={() => setViewMode('mealPlan')}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <Utensils className="h-4 w-4" /> Weekly Meal Plan
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

            {viewMode === "mealPlan" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {renderMeal(getCurrentDayMealPlan().breakfast, "Breakfast")}
                    {renderMeal(getCurrentDayMealPlan().lunch, "Lunch")}
                  </div>
                  <div className="space-y-6">
                    {renderMeal(getCurrentDayMealPlan().dinner, "Dinner")}

                    <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-slate-900 text-white overflow-hidden">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-white/10">
                            <Sparkles className="h-6 w-6 text-orange-400" />
                          </div>
                          <h3 className="text-xl font-black uppercase tracking-tight">Healthy Snacks</h3>
                        </div>
                        <div className="space-y-4">
                          {getCurrentDayMealPlan().snacks.map((snack, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                              <p className="text-sm font-black text-orange-400 uppercase tracking-widest mb-1">{snack.name}</p>
                              <p className="text-sm font-medium text-white/80 leading-relaxed mb-3">{snack.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {snack.nutrients.map((n, i) => (
                                  <span key={i} className="text-[9px] font-black bg-white/10 px-2 py-1 rounded-md uppercase tracking-tighter">{n}</span>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

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

function AlertCircle(props: any) {
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
