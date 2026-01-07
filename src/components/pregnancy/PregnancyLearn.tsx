import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, XCircle, AlertCircle, ChevronDown, ExternalLink, BookOpen, Heart, Activity, ShieldAlert, Sparkles, Baby } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PregnancyLearn() {
  const [selectedTab, setSelectedTab] = useState("first");
  const [openDiseaseId, setOpenDiseaseId] = useState<string | null>(null);

  const trimesters = [
    { id: "first", label: "First Trimester", weeks: "0-12", icon: Sparkles },
    { id: "second", label: "Second Trimester", weeks: "13-27", icon: Activity },
    { id: "third", label: "Third Trimester", weeks: "28-42", icon: Heart },
  ];

  const toggleDisease = (id: string) => {
    setOpenDiseaseId(openDiseaseId === id ? null : id);
  };

  const learnLinks: Record<string, any[]> = {
    first: [
      { name: "Cleveland Clinic", desc: "Detailed fetal development, symptoms & lifestyle guide.", url: 'https://my.clevelandclinic.org/health/articles/9699-first-trimester' },
      { name: "NHS (UK)", desc: "Complete official guide for the first trimester.", url: 'https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/1st-trimester/week-4/' },
      { name: "Parenting Firstcry", desc: "9 safe yoga poses with step-by-step instructions.", url: 'https://parenting.firstcry.com/articles/yoga-during-first-trimester-of-pregnancy-benefits-poses-and-tips/' }
    ],
    second: [
      { name: "Mayo Clinic", desc: "Physical and emotional changes & symptom relief tips.", url: 'https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/in-depth/pregnancy/art-20047732' },
      { name: "American Pregnancy Association", desc: "Healthy weight gain, prenatal tests & nutrition.", url: 'https://americanpregnancy.org/healthy-pregnancy/pregnancy-health-wellness/second-trimester/' },
      { name: "Yoga International", desc: "Safe yoga sequence designed for second trimester.", url: 'https://yogainternational.com/article/view/a-prenatal-yoga-sequence-for-your-second-trimester/' }
    ],
    third: [
      { name: "UNICEF Parenting", desc: "Preparing for labor and final development milestones.", url: 'https://www.unicef.org/parenting/pregnancy-milestones/third-trimester' },
      { name: "CDC", desc: "Crucial Warning Signs: When to seek immediate care.", url: 'https://www.cdc.gov/hearher/maternal-warning-signs/index.html' },
      { name: "Ireland HSE Guide", desc: "Optimal positioning and creating your birth plan.", url: 'https://www2.hse.ie/pregnancy-birth/labour/preparing/preparing-your-body/' }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-16"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">

          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pregnancy Hub</h1>
          <p className="text-slate-500 font-medium text-lg">Your evidence-based guide to every milestone</p>
        </div>

        {/* Premium Tab Navigation */}
        <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-200/60 w-full overflow-x-auto no-scrollbar md:w-auto">
          <div className="flex min-w-full md:min-w-0">
            {trimesters.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id)}
                className={cn(
                  "relative flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                  selectedTab === t.id ? "text-white" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {selectedTab === t.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl shadow-lg shadow-pink-200"
                  />
                )}
                <t.icon className={cn("w-4 h-4 relative z-10", selectedTab === t.id ? "text-white" : "text-slate-400")} />
                <span className="relative z-10 whitespace-nowrap">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="space-y-10"
        >
          {selectedTab === "first" && (
            <div className="space-y-10">
              <TrimesterOverview
                title="First Trimester"
                weeks="Weeks 0-12"
                description="A period of rapid cellular differentiation and organogenesis where your baby's foundational systems are established."
                keyDevelopments={[
                  "Neural tube closes; brain and spinal cord form",
                  "Heart begins to beat rhythmically by week 6",
                  "All major organ systems initiate development",
                  "Fetal movement begins (though not yet felt)"
                ]}
                motherChanges={[
                  "Significant hormonal surge (hCG and progesterone)",
                  "Increased cardiovascular demand & fatigue",
                  "Heightened sensory sensitivity and nausea",
                  "Uterine expansion begins to press on bladder"
                ]}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learnLinks.first.map((link, idx) => (
                  <ResourceCard key={idx} {...link} />
                ))}
              </div>

              <RecommendationsCard
                trimester="first"
                dos={[
                  "Initiate prenatal vitamins with 400-800mcg Folic Acid",
                  "Prioritize 8-10 hours of sleep for cellular repair",
                  "Maintain hydration to support increased blood volume",
                  "Eat small, frequent protein-rich snacks for nausea",
                  "Schedule your first prenatal clinical screening"
                ]}
                donts={[
                  "Avoid tobacco, alcohol, and unprescribed medications",
                  "Exclude raw meats, unpasteurized dairy, and high-mercury fish",
                  "Avoid handling cat litter (Toxoplasmosis risk)",
                  "Limit caffeine intake to <200mg per day",
                  "Avoid hyperthermia (hot tubs or saunas)"
                ]}
                warningSymptoms={[
                  "Acute pelvic cramping or lateralized pain",
                  "Vaginal bleeding exceeding light spotting",
                  "Hyperemesis (inability to retain any fluids)",
                  "Febrile illness above 101.5°F",
                  "Painful or burning micturition"
                ]}
              />
            </div>
          )}

          {selectedTab === "second" && (
            <div className="space-y-10">
              <TrimesterOverview
                title="Second Trimester"
                weeks="Weeks 13-27"
                description="The 'Golden Phase' where early symptoms typically subside and fetal growth accelerates into visible milestones."
                keyDevelopments={[
                  "Quickening: Initial fetal movements become detectable",
                  "Auditory system matures; baby responds to sound",
                  "Fine lanugo hair and vernix caseosa protect skin",
                  "Viability milestone reached by late trimester"
                ]}
                motherChanges={[
                  "Shift in center of gravity as uterus ascends",
                  "Increased skin pigmentation (Linea Nigra)",
                  "Pelvic ligaments loosen (Relaxin effect)",
                  "Resolution of first-trimester morning sickness"
                ]}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learnLinks.second.map((link, idx) => (
                  <ResourceCard key={idx} {...link} />
                ))}
              </div>

              <RecommendationsCard
                trimester="second"
                dos={[
                  "Monitor for fetal movement patterns daily",
                  "Engage in low-impact prenatal conditioning",
                  "Sleep in left lateral position for vena cava flow",
                  "Increase caloric intake by ~300-340 kcal/day",
                  "Complete the 20-week anatomy ultrasound scan"
                ]}
                donts={[
                  "Avoid prolonged supine (flat on back) positioning",
                  "Refrain from contact sports or high-fall-risk activities",
                  "Avoid lifting objects heavier than 20 lbs",
                  "Don't skip glucose challenge screenings",
                  "Avoid unpasteurized soft cheeses"
                ]}
                warningSymptoms={[
                  "Persistent hypertension or severe headaches",
                  "Visual disturbances (blurring or flashing lights)",
                  "Sudden localized edema in face or hands",
                  "Marked decrease in fetal movement frequency",
                  "Preterm contraction patterns"
                ]}
              />
            </div>
          )}

          {selectedTab === "third" && (
            <div className="space-y-10">
              <TrimesterOverview
                title="Third Trimester"
                weeks="Weeks 28-40+"
                description="The final maturation phase focusing on fetal weight gain, lung development, and maternal preparation for labor."
                keyDevelopments={[
                  "Surfactant production matures lungs for breathing",
                  "Rapid accumulation of subcutaneous adipose tissue",
                  "Engagement of presenting part into the pelvis",
                  "Neurological development and sleep-wake cycles"
                ]}
                motherChanges={[
                  "Braxton Hicks 'practice' contractions increase",
                  "Diaphragm compression causing dyspnea",
                  "Increased pelvic pressure and gait changes",
                  "Colostrum production may begin"
                ]}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learnLinks.third.map((link, idx) => (
                  <ResourceCard key={idx} {...link} />
                ))}
              </div>

              <RecommendationsCard
                trimester="third"
                dos={[
                  "Perform formal kick counts daily",
                  "Finalize birth preferences and hospital logistics",
                  "Practice pelvic floor (Kegel) and breathing exercises",
                  "Maintain high protein and iron intake",
                  "Pack a clinical bag with labor essentials"
                ]}
                donts={[
                  "Avoid air travel after 36 weeks gestation",
                  "Don't ignore signs of membrane rupture (water breaking)",
                  "Avoid heavy abdominal exertion",
                  "Limit intake of highly processed sugars",
                  "Don't postpone calling if movement feels 'off'"
                ]}
                warningSymptoms={[
                  "Regular contractions before 37 weeks",
                  "Constant, severe abdominal pain or rigidity",
                  "Significant vaginal bleeding",
                  "Rupture of membranes (clear fluid gush/leak)",
                  "Signs of preeclampsia (headache, vision changes)"
                ]}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="space-y-6 pt-10 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Conditions Library</h2>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pregnancyConditions.map((condition) => (
            <Collapsible
              key={condition.id}
              open={openDiseaseId === condition.id}
              onOpenChange={() => toggleDisease(condition.id)}
              className="group border border-slate-200/60 bg-white rounded-[2rem] overflow-hidden hover:border-pink-200 transition-colors shadow-sm"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-6 h-auto hover:bg-slate-50 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-2xl bg-slate-50 group-hover:bg-white transition-colors", condition.bg)}>
                      <condition.icon className={cn("h-6 w-6", condition.iconColor)} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{condition.name}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Typically {condition.trimester}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform duration-300", openDiseaseId === condition.id && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{condition.description}</p>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-widest mb-2">Key Symptoms:</h4>
                    <ul className="grid grid-cols-1 gap-1.5">
                      {condition.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <h4 className="font-bold text-xs text-red-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3" />
                      When to call clinical:
                    </h4>
                    <ul className="space-y-1">
                      {condition.whenToSeekHelp.map((item, index) => (
                        <li key={index} className="text-xs text-red-700 font-bold leading-tight">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      <Card className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <ShieldAlert className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-2 h-8 bg-pink-500 rounded-full" />
            Medical Disclaimer
          </h3>
          <p className="text-slate-400 text-lg font-medium mb-8 leading-relaxed">
            This educational hub is designed to supplement, not replace, professional clinical advice.
            Pregnancy is a dynamic biological process; always prioritize the specific guidance of your
            attending OB/GYN or midwife.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <strong className="text-white block">ACOG Guidelines (2020)</strong>
              <p className="text-slate-500">Prenatal Care & Trimester Development Standards</p>
            </div>
            <div className="space-y-2">
              <strong className="text-white block">WHO Maternal Standards</strong>
              <p className="text-slate-500">Global Recommendations on Antenatal Care</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ResourceCard({ name, desc, url }: { name: string; desc: string; url: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-pink-100/20 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
          <BookOpen className="w-5 h-5 text-pink-500" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(url, '_blank')}
          className="rounded-full hover:bg-slate-100"
        >
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </Button>
      </div>
      <h4 className="font-bold text-slate-900 mb-1">{name}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TrimesterOverview({ title, weeks, description, keyDevelopments, motherChanges }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 p-8 bg-gradient-to-br from-pink-600 to-purple-600 rounded-[2.5rem] text-white shadow-2xl shadow-pink-200">
        <h2 className="text-3xl font-black mb-1">{title}</h2>
        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-6">
          {weeks}
        </div>
        <p className="text-pink-50 font-medium text-lg leading-relaxed">{description}</p>
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl rounded-[2.5rem] p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Baby className="w-5 h-5 text-pink-500" />
            Fetal Growth
          </h3>
          <ul className="space-y-4">
            {keyDevelopments.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-600 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl rounded-[2.5rem] p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Activity className="w-5 h-5 text-purple-500" />
            Maternal Physiology
          </h3>
          <ul className="space-y-4">
            {motherChanges.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-600 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function RecommendationsCard({ trimester, dos, donts, warningSymptoms }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
        <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-500" />
          'Dos'
        </h3>
        <ul className="space-y-4">
          {dos.map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3 text-sm font-bold text-emerald-700/80">
              <span className="mt-1 opacity-40">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100">
        <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500" />
          'Donts'
        </h3>
        <ul className="space-y-4">
          {donts.map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3 text-sm font-bold text-red-700/80">
              <span className="mt-1 opacity-40">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <AlertTriangle className="w-24 h-24 text-amber-900" />
        </div>
        <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-3 relative z-10">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          Red Flags
        </h3>
        <ul className="space-y-4 relative z-10">
          {warningSymptoms.map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3 text-sm font-bold text-amber-800">
              <span className="mt-1 opacity-40">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[10px] font-black text-amber-600 uppercase tracking-widest text-center relative z-10">
          Immediate Clinical Evaluation Required
        </p>
      </div>
    </div>
  );
}

const pregnancyConditions = [
  {
    id: "gestational-diabetes",
    name: "Gestational Diabetes",
    trimester: "2nd trimester",
    description: "Insulin resistance developing during pregnancy that alters maternal glucose metabolism.",
    symptoms: ["Polydipsia (excessive thirst)", "Polyuria (frequent urination)", "Recurrent infections", "Unusual fatigue"],
    whenToSeekHelp: ["Abnormal glucose screening results", "Consistent glycosuria in clinical tests", "Blurred vision"],
    icon: AlertCircle,
    iconColor: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    id: "preeclampsia",
    name: "Preeclampsia",
    trimester: "After 20 weeks",
    description: "Multi-system disorder characterized by gestational hypertension and proteinuria.",
    symptoms: ["Persistent hypertension", "Severe frontal headaches", "Upper right quadrant abdominal pain", "Proteinuria"],
    whenToSeekHelp: ["Sudden facial/hand edema", "Visual disturbances (scotoma)", "Rapid weight gain (>2lb/week)"],
    icon: ShieldAlert,
    iconColor: "text-red-500",
    bg: "bg-red-50"
  },
  {
    id: "placenta-previa",
    name: "Placenta Previa",
    trimester: "Any stage",
    description: "Placental implantation over or near the internal cervical os, risking hemorrhage.",
    symptoms: ["Painless, bright red vaginal bleeding", "Uterine irritability"],
    whenToSeekHelp: ["ANY vaginal bleeding must be evaluated immediately", "Signs of early preterm labor"],
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bg: "bg-red-50"
  }
];
