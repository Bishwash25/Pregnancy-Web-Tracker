// Centralized pregnancy dashboard data and helpers.
// This acts like an internal "API" for all week-based pregnancy info.

// Baby size comparison data by week
export const babySizeData: Record<
  number,
  {
    fruit: string;
    lengthCm: string;
    lengthIn: string;
    weightG: string;
    weightLb: string;
  }
> = {
  0: {
    fruit: "Not measurable (pre-pregnancy)",
    lengthCm: "0 cm",
    lengthIn: "0 in",
    weightG: "0 g",
    weightLb: "0 oz",
  },
  1: {
    fruit: "Not measurable (zygote)",
    lengthCm: "0 cm",
    lengthIn: "0 in",
    weightG: "0 g",
    weightLb: "0 oz",
  },
  2: {
    fruit: "Not measurable (zygote)",
    lengthCm: "0 cm",
    lengthIn: "0 in",
    weightG: "0 g",
    weightLb: "0 oz",
  },
  3: {
    fruit: "Not measurable (zygote)",
    lengthCm: "0 cm",
    lengthIn: "0 in",
    weightG: "0 g",
    weightLb: "0 oz",
  },
  4: {
    fruit: "Poppy Seed",
    lengthCm: "0.1–0.2 cm",
    lengthIn: "0.04–0.08 in",
    weightG: "< 1 g",
    weightLb: "< 0.04 oz",
  },
  5: {
    fruit: "Sesame Seed",
    lengthCm: "0.2–0.3 cm",
    lengthIn: "0.08–0.1 in",
    weightG: "< 1 g",
    weightLb: "< 0.04 oz",
  },
  6: {
    fruit: "Lentil",
    lengthCm: "0.4–0.6 cm",
    lengthIn: "0.16–0.24 in",
    weightG: "< 1 g",
    weightLb: "< 0.04 oz",
  },
  7: {
    fruit: "Blueberry",
    lengthCm: "0.8–1.2 cm",
    lengthIn: "0.3–0.5 in",
    weightG: "< 1 g",
    weightLb: "< 0.04 oz",
  },
  8: {
    fruit: "Kidney Bean",
    lengthCm: "1.4–1.8 cm",
    lengthIn: "0.5–0.7 in",
    weightG: "1–2 g",
    weightLb: "0.04–0.07 oz",
  },
  9: {
    fruit: "Grape",
    lengthCm: "2.0–2.5 cm",
    lengthIn: "0.8–1 in",
    weightG: "2–3 g",
    weightLb: "0.07–0.1 oz",
  },
  10: {
    fruit: "Strawberry",
    lengthCm: "3–4 cm",
    lengthIn: "1.2–1.6 in",
    weightG: "4–5 g",
    weightLb: "0.14–0.18 oz",
  },
  11: {
    fruit: "Fig",
    lengthCm: "4–5 cm",
    lengthIn: "1.6–2 in",
    weightG: "7–8 g",
    weightLb: "0.25–0.3 oz",
  },
  12: {
    fruit: "Lime",
    lengthCm: "5–6 cm",
    lengthIn: "2–2.4 in",
    weightG: "12–16 g",
    weightLb: "0.4–0.6 oz",
  },
  13: {
    fruit: "Peach",
    lengthCm: "7–8 cm",
    lengthIn: "2.8–3.1 in",
    weightG: "20–30 g",
    weightLb: "0.7–1 oz",
  },
  14: {
    fruit: "Lemon",
    lengthCm: "8–9 cm",
    lengthIn: "3.1–3.5 in",
    weightG: "40–45 g",
    weightLb: "1.4–1.6 oz",
  },
  15: {
    fruit: "Apple",
    lengthCm: "9–10.5 cm",
    lengthIn: "3.5–4.1 in",
    weightG: "60–80 g",
    weightLb: "2–2.8 oz",
  },
  16: {
    fruit: "Avocado",
    lengthCm: "10–12 cm",
    lengthIn: "4–4.7 in",
    weightG: "90–110 g",
    weightLb: "3.2–3.9 oz",
  },
  17: {
    fruit: "Pear",
    lengthCm: "12–13.5 cm",
    lengthIn: "4.7–5.3 in",
    weightG: "130–150 g",
    weightLb: "4.6–5.3 oz",
  },
  18: {
    fruit: "Bell Pepper",
    lengthCm: "13–14.5 cm",
    lengthIn: "5.1–5.7 in",
    weightG: "180–200 g",
    weightLb: "6.3–7 oz",
  },
  19: {
    fruit: "Mango",
    lengthCm: "14.5–16 cm",
    lengthIn: "5.7–6.3 in",
    weightG: "220–260 g",
    weightLb: "7.7–9.1 oz",
  },
  20: {
    fruit: "Banana",
    lengthCm: "16–17 cm",
    lengthIn: "6.3–6.7 in",
    weightG: "280–320 g",
    weightLb: "9.8–11.3 oz",
  },
  21: {
    fruit: "Carrot",
    lengthCm: "26–27 cm",
    lengthIn: "10.2–10.6 in",
    weightG: "340–380 g",
    weightLb: "12–13.4 oz",
  },
  22: {
    fruit: "Papaya",
    lengthCm: "27–28 cm",
    lengthIn: "10.6–11 in",
    weightG: "400–450 g",
    weightLb: "14–16 oz",
  },
  23: {
    fruit: "Grapefruit",
    lengthCm: "28–29 cm",
    lengthIn: "11–11.5 in",
    weightG: "480–530 g",
    weightLb: "1.05–1.2 lbs",
  },
  24: {
    fruit: "Ear of Corn",
    lengthCm: "29–30 cm",
    lengthIn: "11.4–11.8 in",
    weightG: "550–620 g",
    weightLb: "1.2–1.4 lbs",
  },
  25: {
    fruit: "Cauliflower",
    lengthCm: "32–35 cm",
    lengthIn: "12.5–13.8 in",
    weightG: "650–750 g",
    weightLb: "1.4–1.6 lbs",
  },
  26: {
    fruit: "Lettuce",
    lengthCm: "34–36 cm",
    lengthIn: "13.5–14.2 in",
    weightG: "760–880 g",
    weightLb: "1.7–1.9 lbs",
  },
  27: {
    fruit: "Cabbage",
    lengthCm: "35–37 cm",
    lengthIn: "13.8–14.6 in",
    weightG: "850–950 g",
    weightLb: "1.9–2.1 lbs",
  },
  28: {
    fruit: "Eggplant",
    lengthCm: "36–38 cm",
    lengthIn: "14.2–15 in",
    weightG: "1000–1200 g",
    weightLb: "2.2–2.6 lbs",
  },
  29: {
    fruit: "Butternut Squash",
    lengthCm: "37–39 cm",
    lengthIn: "14.6–15.4 in",
    weightG: "1150–1300 g",
    weightLb: "2.5–2.9 lbs",
  },
  30: {
    fruit: "Cucumber",
    lengthCm: "38–40 cm",
    lengthIn: "15–15.8 in",
    weightG: "1300–1500 g",
    weightLb: "2.9–3.3 lbs",
  },
  31: {
    fruit: "Coconut",
    lengthCm: "40–41 cm",
    lengthIn: "15.8–16.2 in",
    weightG: "1500–1700 g",
    weightLb: "3.3–3.8 lbs",
  },
  32: {
    fruit: "Jicama",
    lengthCm: "41–43 cm",
    lengthIn: "16.1–16.9 in",
    weightG: "1700–1900 g",
    weightLb: "3.8–4.2 lbs",
  },
  33: {
    fruit: "Pineapple",
    lengthCm: "43–44 cm",
    lengthIn: "16.9–17.3 in",
    weightG: "1900–2100 g",
    weightLb: "4.2–4.6 lbs",
  },
  34: {
    fruit: "Cantaloupe",
    lengthCm: "44–45.5 cm",
    lengthIn: "17.3–17.8 in",
    weightG: "2100–2300 g",
    weightLb: "4.6–5 lbs",
  },
  35: {
    fruit: "Honeydew Melon",
    lengthCm: "45.5–46.5 cm",
    lengthIn: "17.8–18.2 in",
    weightG: "2300–2500 g",
    weightLb: "5.1–5.5 lbs",
  },
  36: {
    fruit: "Romaine Lettuce",
    lengthCm: "46.5–47.5 cm",
    lengthIn: "18.2–18.7 in",
    weightG: "2500–2700 g",
    weightLb: "5.5–6 lbs",
  },
  37: {
    fruit: "Winter Melon",
    lengthCm: "47.5–48.5 cm",
    lengthIn: "18.7–19 in",
    weightG: "2700–2900 g",
    weightLb: "6–6.4 lbs",
  },
  38: {
    fruit: "Mini Watermelon",
    lengthCm: "48.5–49.5 cm",
    lengthIn: "19–19.5 in",
    weightG: "2900–3100 g",
    weightLb: "6.4–6.8 lbs",
  },
  39: {
    fruit: "Watermelon",
    lengthCm: "49.5–50.5 cm",
    lengthIn: "19.5–19.9 in",
    weightG: "3100–3300 g",
    weightLb: "6.8–7.3 lbs",
  },
  40: {
    fruit: "Full-Term Baby",
    lengthCm: "50–52 cm",
    lengthIn: "19.7–20.5 in",
    weightG: "3200–3600 g",
    weightLb: "7.1–7.9 lbs",
  },
  41: {
    fruit: "Baby (Overdue)",
    lengthCm: "51–52.5 cm",
    lengthIn: "20–20.6 in",
    weightG: "3400–3800 g",
    weightLb: "7.5–8.4 lbs",
  },
  42: {
    fruit: "Baby (Post-term)",
    lengthCm: "51–53 cm",
    lengthIn: "20–20.8 in",
    weightG: "3500–4000 g",
    weightLb: "7.7–8.8 lbs",
  },
};

// Fruit emoji mapping by key weeks of each trimester
export const fruitEmojis: Record<number, { emoji: string; name: string }> = {
  0: { emoji: "⏳", name: "Pre-Pregnancy / Menstrual Prep (Not measurable)" },
  1: { emoji: "🩸", name: "Menstrual Cycle (Not measurable)" },
  2: { emoji: "✨", name: "Ovulation & Fertilization (Not measurable)" },
  3: { emoji: "🧬", name: "Blastocyst 'Implantation' (Not measurable)" },
  4: { emoji: "🌸", name: "Poppy Seed" },
  5: { emoji: "🌱", name: "Sesame Seed" },
  6: { emoji: "🟢", name: "Lentil" },
  7: { emoji: "🫐", name: "Blueberry" },
  8: { emoji: "🫘", name: "Kidney Bean" },
  9: { emoji: "🍇", name: "Grape" },
  10: { emoji: "🍓", name: "Strawberry" },
  11: { emoji: "🍹", name: "Fig" },
  12: { emoji: "🍑", name: "Lime/Plum" },
  13: { emoji: "🍑", name: "Peach" },
  14: { emoji: "🍋", name: "Lemon" },
  15: { emoji: "🍎", name: "Apple" },
  16: { emoji: "🥑", name: "Avocado" },
  17: { emoji: "🍐", name: "Pear" },
  18: { emoji: "🫑", name: "Bell Pepper" },
  19: { emoji: "🥭", name: "Mango" },
  20: { emoji: "🍌", name: "Banana" },
  21: { emoji: "🍊", name: "Carrot/Pomegranate" },
  22: { emoji: "🥭", name: "Papaya" },
  23: { emoji: "🍊", name: "Grapefruit" },
  24: { emoji: "🥒", name: "Ear of Corn" },
  25: { emoji: "🥦", name: "Cauliflower" },
  26: { emoji: "🥬", name: "Lettuce" },
  27: { emoji: "🥬", name: "Cabbage" },
  28: { emoji: "🍆", name: "Eggplant" },
  29: { emoji: "🎃", name: "Butternut Squash" },
  30: { emoji: "🥒", name: "Cucumber" },
  31: { emoji: "🥥", name: "Coconut" },
  32: { emoji: "🥔", name: "Jicama" },
  33: { emoji: "🍍", name: "Pineapple" },
  34: { emoji: "🍈", name: "Cantaloupe" },
  35: { emoji: "🍈", name: "Honeydew Melon" },
  36: { emoji: "🥬", name: "Romaine Lettuce" },
  37: { emoji: "🍉", name: "Winter Melon" },
  38: { emoji: "🍉", name: "Mini Watermelon" },
  39: { emoji: "🍉", name: "Watermelon" },
  40: { emoji: "👶", name: "Full-Term Baby" },
  41: { emoji: "👶", name: "Baby (Overdue)" },
  42: { emoji: "👶", name: "Baby (Post-term)" },
};

// Key medically proven insights data
export const medicalInsightsData: Record<
  number,
  { uterusSize: string; amnioticFluid: string }
> = {
  0: { uterusSize: "5 cm", amnioticFluid: "0 mL" },
  1: { uterusSize: "5 cm", amnioticFluid: "0 mL" },
  2: { uterusSize: "5 cm", amnioticFluid: "0 mL" },
  3: { uterusSize: "5 cm", amnioticFluid: "0–5 mL" },
  4: { uterusSize: "5–6 cm", amnioticFluid: "20–30 mL" },
  5: { uterusSize: "6 cm", amnioticFluid: "25–40 mL" },
  6: { uterusSize: "6–7 cm", amnioticFluid: "30–50 mL" },
  7: { uterusSize: "7–8 cm", amnioticFluid: "40–60 mL" },
  8: { uterusSize: "8 cm", amnioticFluid: "60–80 mL" },
  9: { uterusSize: "8–9 cm", amnioticFluid: "70–90 mL" },
  10: { uterusSize: "9–10 cm", amnioticFluid: "80–100 mL" },
  11: { uterusSize: "9–11 cm", amnioticFluid: "90–110 mL" },
  12: { uterusSize: "10–12 cm", amnioticFluid: "90–120 mL" },
  13: { uterusSize: "11–13 cm", amnioticFluid: "110–130 mL" },
  14: { uterusSize: "12–14 cm", amnioticFluid: "120–150 mL" },
  15: { uterusSize: "13–15 cm", amnioticFluid: "130–160 mL" },
  16: { uterusSize: "14–16 cm", amnioticFluid: "150–200 mL" },
  17: { uterusSize: "15–17 cm", amnioticFluid: "170–220 mL" },
  18: { uterusSize: "16–18 cm", amnioticFluid: "200–250 mL" },
  19: { uterusSize: "17–19 cm", amnioticFluid: "220–280 mL" },
  20: { uterusSize: "18–20 cm", amnioticFluid: "300–350 mL" },
  21: { uterusSize: "19–21 cm", amnioticFluid: "320–380 mL" },
  22: { uterusSize: "20–22 cm", amnioticFluid: "350–400 mL" },
  23: { uterusSize: "21–23 cm", amnioticFluid: "370–420 mL" },
  24: { uterusSize: "22–24 cm", amnioticFluid: "450–500 mL" },
  25: { uterusSize: "23–25 cm", amnioticFluid: "470–520 mL" },
  26: { uterusSize: "24–26 cm", amnioticFluid: "550–650 mL" },
  27: { uterusSize: "25–27 cm", amnioticFluid: "600–700 mL" },
  28: { uterusSize: "26–28 cm", amnioticFluid: "650–750 mL" },
  29: { uterusSize: "27–29 cm", amnioticFluid: "700–800 mL" },
  30: { uterusSize: "28–30 cm", amnioticFluid: "700–850 mL" },
  31: { uterusSize: "29–31 cm", amnioticFluid: "750–850 mL" },
  32: { uterusSize: "30–32 cm", amnioticFluid: "800–900 mL" },
  33: { uterusSize: "31–33 cm", amnioticFluid: "850–950 mL" },
  34: { uterusSize: "32–34 cm", amnioticFluid: "850–950 mL" },
  35: { uterusSize: "33–35 cm", amnioticFluid: "900–1000 mL" },
  36: { uterusSize: "34–35 cm", amnioticFluid: "900–1000 mL" },
  37: { uterusSize: "35–36 cm", amnioticFluid: "850–950 mL" },
  38: { uterusSize: "35–36 cm", amnioticFluid: "800–950 mL" },
  39: { uterusSize: "35–37 cm", amnioticFluid: "750–900 mL" },
  40: { uterusSize: "35–37 cm", amnioticFluid: "700–900 mL" },
  41: { uterusSize: "36–38 cm", amnioticFluid: "700–800 mL" },
  42: { uterusSize: "36–38 cm", amnioticFluid: "600–800 mL" },
};

// Week-by-week milestones (0 - 42). Each week: { organ, sensory, position }
export const fetalMilestonesWeeks0to42: Record<
  number,
  { organ: string; sensory: string; position: string }
> = {
  0: {
    organ: "🧬 Fertilization occurs; zygote forms and begins cell division.",
    sensory: "N/A",
    position: "N/A",
  },
  1: {
    organ: "🫄 Blastocyst implants in uterine lining; early placental structures begin.",
    sensory: "N/A",
    position: "N/A",
  },
  2: {
    organ: "🧬 Formation of germ layers (ectoderm, mesoderm, endoderm).",
    sensory: "N/A",
    position: "N/A",
  },
  3: {
    organ: "🧠 Neural plate and primitive streak form; early CNS development begins.",
    sensory: "N/A",
    position: "N/A",
  },
  4: {
    organ: "🫀 Primitive heart tube forms; early circulation begins.",
    sensory: "N/A",
    position: "N/A",
  },
  5: {
    organ: "🦵 Limb buds appear; rapid embryonic folding continues.",
    sensory: "Neural connections begin forming (no sensation)",
    position: "Free-floating embryo",
  },
  6: {
    organ: "🧠 Neural tube closes; brain and spinal cord structure established.",
    sensory: "Reflex pathways forming (not sensory perception)",
    position: "Free-floating",
  },
  7: {
    organ: "🫀 Major organ systems present as early structures (organogenesis).",
    sensory: "No functional sensory perception",
    position: "Mobile",
  },
  8: {
    organ: "👶 Embryonic period ends; fetal stage begins.",
    sensory: "Primitive neural responsiveness only",
    position: "Mobile",
  },
  9: {
    organ: "🫀 Organs continue differentiation; external features more distinct.",
    sensory: "No conscious sensory processing",
    position: "Mobile",
  },
  10: {
    organ: "🫘 Early kidney structures develop; urine production begins soon after.",
    sensory: "Reflex circuitry developing",
    position: "Mobile",
  },
  11: {
    organ: "👶 Facial features refine; limb movements visible on ultrasound.",
    sensory: "Non-conscious reflex movements",
    position: "Mobile",
  },
  12: {
    organ: "🫀 Organogenesis largely complete; growth phase begins.",
    sensory: "Basic touch reflexes possible",
    position: "Mobile",
  },
  13: {
    organ: "🫀 Rapid growth; organs increase in size and function.",
    sensory: "Primitive touch responsiveness",
    position: "Mobile",
  },
  14: {
    organ: "🦵 External genitalia differentiate; skeletal ossification progresses.",
    sensory: "Neural sensory pathways forming",
    position: "Mobile",
  },
  15: {
    organ: "🦵 Continued skeletal and muscle development.",
    sensory: "Reflexive responses to movement",
    position: "Mobile",
  },
  16: {
    organ: "👂 Inner ear structures mature; nervous system refines.",
    sensory: "Sound transmission possible (not conscious hearing)",
    position: "Mobile",
  },
  17: {
    organ: "🦵 Improved neuromuscular coordination.",
    sensory: "Response to loud vibrations",
    position: "Mobile",
  },
  18: {
    organ: "🫀 Immune system structures (thymus) develop.",
    sensory: "Auditory pathways maturing",
    position: "Variable",
  },
  19: {
    organ: "🫘 Digestive tract matures; meconium begins forming.",
    sensory: "Increased responsiveness to stimuli",
    position: "Variable",
  },
  20: {
    organ: "🫀 Mid-pregnancy milestone; organs continue maturation.",
    sensory: "Hearing apparatus functional; movement often felt by mother",
    position: "Variable",
  },
  21: {
    organ: "🦴 Bone marrow increases blood cell production.",
    sensory: "Auditory responses more consistent",
    position: "Variable",
  },
  22: {
    organ: "🧠 Detectable brain electrical activity; CNS maturation continues.",
    sensory: "Sound and light responsiveness increasing",
    position: "Variable",
  },
  23: {
    organ: "🫁 Lungs enter canalicular stage; airways developing.",
    sensory: "Improved tactile sensitivity",
    position: "Variable",
  },
  24: {
    organ: "🫁 Early surfactant production begins; viability improves.",
    sensory: "Clearer stimulus-response patterns",
    position: "Variable",
  },
  25: {
    organ: "🫁 Continued lung maturation; fat deposition begins.",
    sensory: "Auditory recognition patterns possible",
    position: "Often variable; some head-down",
  },
  26: {
    organ: "👁️ Eyelids formed; ocular development progresses.",
    sensory: "Response to light changes",
    position: "Variable",
  },
  27: {
    organ: "🧠 Rapid brain growth; third trimester begins.",
    sensory: "Startle reflex present",
    position: "Increasing head-down tendency",
  },
  28: {
    organ: "🫁 Alveolar development; respiratory practice movements.",
    sensory: "Vision (light/dark) and hearing well developed",
    position: "Many head-down",
  },
  29: {
    organ: "🫀 Increased fat accumulation for temperature regulation.",
    sensory: "Stronger sensory integration",
    position: "Mostly head-down",
  },
  30: {
    organ: "🧠 Ongoing myelination; lung maturation continues.",
    sensory: "Sleep–wake cycles emerging",
    position: "Often head-down",
  },
  31: {
    organ: "🧠 Brain surface complexity increases.",
    sensory: "Refined responses to stimuli",
    position: "Head-down common",
  },
  32: {
    organ: "🫁 Continued lung and CNS maturation.",
    sensory: "Improved visual and auditory processing",
    position: "Usually head-down",
  },
  33: {
    organ: "🫀 Rapid weight gain; functional maturity increases.",
    sensory: "Integrated sensory responses",
    position: "Head-down typical",
  },
  34: {
    organ: "🫁 Surfactant levels rise; lungs near maturity.",
    sensory: "Consistent responses to voice and light",
    position: "Head-down",
  },
  35: {
    organ: "🫁 Final organ maturation; lanugo decreases.",
    sensory: "Well-developed sensory systems",
    position: "Head-down",
  },
  36: {
    organ: "🫁 Near-term lung and brain maturity.",
    sensory: "Prepared for extrauterine sensory input",
    position: "Cephalic (head-first)",
  },
  37: {
    organ: "👶 Early term; organs support life outside womb.",
    sensory: "All primary senses functional",
    position: "Head-down",
  },
  38: {
    organ: "🤱 Continued growth; organs fully functional.",
    sensory: "Neonatal sensory readiness",
    position: "Engaged in pelvis for many",
  },
  39: {
    organ: "🍼 Full-term; optimal readiness for birth.",
    sensory: "Fully functional sensory systems",
    position: "Head-down and engaged",
  },
  40: {
    organ: "👼 Term pregnancy; awaiting labor.",
    sensory: "Normal newborn sensory capacity",
    position: "Head-down",
  },
  41: {
    organ: "🧸 Post-term monitoring advised.",
    sensory: "No new milestones",
    position: "Head-down",
  },
  42: {
    organ: "🎀 Extended post-term; clinical evaluation recommended.",
    sensory: "No new milestones",
    position: "Head-down",
  },

};

// Function to get pregnancy development information based on week
export function getPregnancyDevelopment(week: number) {
  if (week === 0) {
    return {
      description:
        "Pre-pregnancy phase. Your body prepares for ovulation and potential conception.",
      keyDevelopments:
        "The uterine lining thickens and follicles mature in the ovaries, ready for ovulation.",
    };
  } else if (week === 1 || week === 2) {
    return {
      description: "Ovulation and conception window.",
      keyDevelopments:
        "Ovulation occurs around week 2. If fertilization happens, a zygote forms and begins traveling toward the uterus.",
    };
  } else if (week === 3) {
    return {
      description: "Implantation phase.",
      keyDevelopments:
        "The fertilized egg (blastocyst) implants into the uterine wall. Pregnancy hormones (hCG) start rising.",
    };
  } else if (week === 4) {
    return {
      description: "Pregnancy confirmation period.",
      keyDevelopments:
        "Placenta starts forming. hCG levels rise enough for detection. Missed period often occurs.",
    };
  } else if (week === 5) {
    return {
      description: "Early embryonic development begins.",
      keyDevelopments:
        "Neural tube (brain and spinal cord) forms. Heart and primitive circulatory system start developing.",
    };
  } else if (week === 6) {
    return {
      description: "Heart begins to beat.",
      keyDevelopments:
        "Heartbeat detectable via ultrasound. Early facial features and limb buds appear.",
    };
  } else if (week === 7) {
    return {
      description: "Brain and organ development accelerates.",
      keyDevelopments:
        "Brain grows rapidly. Arm and leg buds lengthen. Eyes and nostrils start forming.",
    };
  } else if (week === 8) {
    return {
      description: "Embryo begins to move.",
      keyDevelopments:
        "Fingers and toes begin forming. Major organs are taking shape. Size ≈ 1.6 cm.",
    };
  } else if (week === 9) {
    return {
      description: "Transition from embryo to fetus.",
      keyDevelopments:
        "Head becomes more rounded. Internal organs continue developing. Tail-like structure disappears.",
    };
  } else if (week === 10) {
    return {
      description: "All major organs are formed.",
      keyDevelopments:
        "Vital organs begin functioning. Facial structure becomes more defined. Baby can make small movements.",
    };
  } else if (week === 11) {
    return {
      description: "Rapid growth and reflexes develop.",
      keyDevelopments:
        "Bones start hardening. Fetal movements increase. External genitalia begin differentiating.",
    };
  } else if (week === 12) {
    return {
      description: "End of first trimester.",
      keyDevelopments:
        "All major organs are in place. Fingernails form. Baby is about 5–6 cm long.",
    };
  }

  // SECOND TRIMESTER: Weeks 13–27
  else if (week >= 13 && week <= 27) {
    switch (week) {

      case 13:
        return {
          description: "Baby’s features become more distinct.",
          keyDevelopments:
            "Facial muscles allow expressions. Baby starts making spontaneous movements.",
        };
      case 14:
        return {
          description: "Second trimester begins.",
          keyDevelopments:
            "Facial muscles allow expressions. Baby starts making spontaneous movements.",
        };
      case 15:
        return {
          description: "Skeletal development continues.",
          keyDevelopments:
            "Bones harden. Scalp hair begins to form. Ears are positioned correctly.",
        };
      case 16:
        return {
          description: "Growth spurt phase.",
          keyDevelopments:
            "Muscle tissue and bones continue strengthening. You may begin to show.",
        };
      case 17:
        return {
          description: "Fat tissue begins forming.",
          keyDevelopments:
            "Adipose tissue starts accumulating, essential for temperature regulation after birth.",
        };
      case 18:
        return {
          description: "Senses develop.",
          keyDevelopments:
            "Ears begin to hear. Myelin (nerve coating) starts forming around nerves.",
        };
      case 19:
        return {
          description: "Skin and sensory systems mature.",
          keyDevelopments:
            "Vernix caseosa (protective waxy layer) covers the skin.",
        };
      case 20:
        return {
          description: "Halfway point of pregnancy.",
          keyDevelopments:
            "Baby can hear sounds. Fetal anatomy scan usually done. Length ≈ 25 cm.",
        };
      case 21:
        return {
          description: "Digestive system functional.",
          keyDevelopments:
            "Baby swallows amniotic fluid and produces meconium (first stool).",
        };
      case 22:
        return {
          description: "Facial features refine.",
          keyDevelopments:
            "Lips and eyebrows form. Sleep cycles start emerging.",
        };
      case 23:
        return {
          description: "Premature viability approaches.",
          keyDevelopments:
            "Lungs produce surfactant. Baby begins practicing breathing movements.",
        };
      case 24:
        return {
          description: "Fetal viability milestone.",
          keyDevelopments:
            "Baby can survive with medical care if born. Rapid lung and brain development.",
        };
      case 25:
        return {
          description: "Growth and strength increase.",
          keyDevelopments:
            "Baby gains weight steadily. Reflexes improve, including grasping.",
        };
      case 26:
        return {
          description: "End of second trimester.",
          keyDevelopments:
            "Lungs continue maturing. Eyes start to open. Hearing well established.",
        };
      case 27:
        return {
          description: "Second trimester concludes.",
          keyDevelopments:
            "Brain tissue expands. Baby begins opening and closing eyes. Lungs capable of breathing air.",
        };
    }
  }

  // THIRD TRIMESTER: Weeks 28–42
  else if (week >= 28 && week <= 42) {
    switch (week) {
      case 28:
        return {
          description: "Rapid brain development.",
          keyDevelopments:
            "Baby can blink. Sleep and wake cycles become established.",
        };
      case 29:
        return {
          description: "Muscle and fat accumulation.",
          keyDevelopments:
            "Baby adds fat layers. Movements are strong and noticeable.",
        };
      case 30:
        return {
          description: "Brain folds form.",
          keyDevelopments:
            "Neural connections increase. Lungs continue to mature.",
        };
      case 31:
        return {
          description: "Baby grows rapidly.",
          keyDevelopments:
            "Arms and legs fill out. Movements may feel rhythmic.",
        };
      case 32:
        return {
          description: "Weight gain accelerates.",
          keyDevelopments:
            "Baby practices breathing. Toenails and fingernails form.",
        };
      case 33:
        return {
          description: "Immune system strengthens.",
          keyDevelopments:
            "Antibodies transferred from mother. Baby gains about 200g per week.",
        };
      case 34:
        return {
          description: "Body systems mature.",
          keyDevelopments:
            "Central nervous system and lungs near maturity.",
        };
      case 35:
        return {
          description: "Birth preparation begins.",
          keyDevelopments:
            "Baby turns head-down. Space becomes tight, movement decreases slightly.",
        };
      case 36:
        return {
          description: "Late preterm stage.",
          keyDevelopments:
            "Baby practices sucking and breathing. Fat fills out cheeks.",
        };
      case 37:
        return {
          description: "Full-term threshold.",
          keyDevelopments:
            "All organs functional. Baby considered early term and ready for birth.",
        };
      case 38:
        return {
          description: "Final growth and positioning.",
          keyDevelopments:
            "Baby descends into pelvis. Fine-tuning of lungs and brain continues.",
        };
      case 39:
        return {
          description: "Early term.",
          keyDevelopments:
            "Baby fully mature. Placenta at peak function. Ideal birth window.",
        };
      case 40:
        return {
          description: "Full term.",
          keyDevelopments: "Baby ready for delivery.",
        };
      case 41:
        return {
          description: "Third Trimester — Post-Term Phase",
          keyDevelopments:
            "Baby continues gaining weight. Monitoring frequency increases.",
        };
      case 42:
        return {
          description: "Third Trimester — Post-Term Phase",
          keyDevelopments:
            "Extended post-term. Induction often recommended.",
        };
    }
  } else {
    return {
      description: "Invalid or completed week range.",
      keyDevelopments: "Consult your healthcare provider for next steps.",
    };
  }
}

// Get the appropriate fruit emoji based on week
export const getFruitForWeek = (week: number) => {
  if (week < 0) return { emoji: "No Fruit", name: "No Fruit" };
  if (week > 42) return { emoji: "👶", name: "baby" };
  return fruitEmojis[week] || { emoji: "No Fruit", name: "No Fruit" };
};

export type DashboardSnapshot = {
  week: number;
  trimester: string;
  weekRangeLabel: string;
  currentFruit: { emoji: string; name: string };
  babySize: {
    fruit: string;
    lengthCm: string;
    lengthIn: string;
    weightG: string;
    weightLb: string;
  };
  medicalInsights: { uterusSize: string; amnioticFluid: string } | null;
  milestones: { organ: string; sensory: string; position: string } | null;
  development: { description: string; keyDevelopments: string };
  maternalFetalImage: string;
};

// Helper to map week to maternal-fetal image bucket
export function getMaternalFetalBucket(week: number): string {
  // Now using FetalAnatomyVector for primary visualization.
  // These buckets serve as documentation of the intended ranges if static assets are added back.
  if (week === 0) return "w0";
  if (week <= 4) return "w1_4";
  if (week <= 7) return "w5_7";
  if (week <= 10) return "w8_10";
  if (week <= 13) return "w11_13";
  if (week <= 17) return "w14_17";
  if (week <= 22) return "w18_22";
  if (week <= 27) return "w23_27";
  if (week <= 32) return "w28_32";
  if (week <= 36) return "w33_36";
  return "w37_42";
}

// Pure function "API" to get an aggregated snapshot by week
export function getDashboardSnapshotForWeek(rawWeek: number): DashboardSnapshot {
  const week = Math.min(Math.max(rawWeek, 0), 42);

  const trimester =
    week <= 12 ? "First" : week >= 13 && week <= 27 ? "Second" : "Third";

  const weekRangeLabel =
    week <= 12
      ? "Weeks 0-12"
      : week >= 13 && week <= 27
        ? "Weeks 13-27"
        : week >= 28 && week <= 42
          ? "Weeks 28-40+"
          : "Week 40+";

  const fruit = getFruitForWeek(week);
  const weekKey = Math.min(Math.max(week, 0), 42);
  const size = babySizeData[weekKey];

  return {
    week,
    trimester,
    weekRangeLabel,
    currentFruit: fruit,
    babySize: size,
    medicalInsights: medicalInsightsData[week] ?? null,
    milestones: fetalMilestonesWeeks0to42[week] ?? null,
    development: getPregnancyDevelopment(week),
    maternalFetalImage: `/images/maternal-fetal/${getMaternalFetalBucket(week)}.png`,
  };
}

export interface ClinicalWeekData {
  week: number;
  uterus: string;
  circulation: string;
  musculoskeletal: string;
  other_changes: string;
  warnings: string;
}

export const clinicalPregnancyDataset = {
  version: "1.0",
  source: ["ACOG", "WHO", "Williams Obstetrics"],
  weeks: [
    {
      week: 0,
      uterus: "Normal size (small pear); no pregnancy changes yet.",
      circulation: "Regular menstrual cycle circulation.",
      musculoskeletal: "No pregnancy-related changes.",
      other_changes: "Hormonal shifts preparing for ovulation.",
      warnings: "None specific."
    },
    {
      week: 1,
      uterus: "Uterus remains pelvic; no visible enlargement.",
      circulation: "Hormonal changes begin; blood volume unchanged.",
      musculoskeletal: "No pregnancy-related changes yet.",
      other_changes: "Hormonal preparation for implantation.",
      warnings: "None specific."
    },
    {
      week: 4,
      uterus: "Early uterine softening begins.",
      circulation: "Blood flow to uterus increases.",
      musculoskeletal: "Mild pelvic heaviness possible.",
      other_changes: "Missed period, breast tenderness.",
      warnings: "Severe pain or bleeding requires evaluation."
    },
    {
      week: 8,
      uterus: "Uterus enlarges to orange size, still pelvic.",
      circulation: "Blood volume begins gradual rise.",
      musculoskeletal: "Pelvic ligaments begin softening.",
      other_changes: "Fatigue, nausea common.",
      warnings: "Persistent vomiting or dehydration."
    },
    {
      week: 12,
      uterus: "Uterus rises just above pubic bone.",
      circulation: "Blood volume increasing.",
      musculoskeletal: "Postural changes begin.",
      other_changes: "Nausea may improve.",
      warnings: "Vaginal bleeding should be assessed."
    },
    {
      week: 16,
      uterus: "Midway between pubic bone and umbilicus.",
      circulation: "Heart rate increases slightly.",
      musculoskeletal: "Round ligament stretching begins.",
      other_changes: "Increased energy levels.",
      warnings: "Sharp persistent abdominal pain."
    },
    {
      week: 20,
      uterus: "Reaches level of the belly button.",
      circulation: "Blood volume ~30–40% increased.",
      musculoskeletal: "Groin pain with movement common.",
      other_changes: "Fetal movements noticeable.",
      warnings: "Persistent severe breathlessness."
    },
    {
      week: 21,
      uterus: "At or slightly above the belly button.",
      circulation: "Increased cardiac output may cause mild breathlessness.",
      musculoskeletal: "Ligament stretching continues.",
      other_changes: "Skin pigmentation changes.",
      warnings: "Reduced fetal movement later requires attention."
    },
    {
      week: 24,
      uterus: "Above the umbilicus, steady upward growth.",
      circulation: "Blood volume continues to rise.",
      musculoskeletal: "Lower back discomfort possible.",
      other_changes: "Increased appetite.",
      warnings: "Regular painful contractions."
    },
    {
      week: 28,
      uterus: "Several centimeters above the umbilicus.",
      circulation: "Blood volume increase approaches peak.",
      musculoskeletal: "Back and hip strain common.",
      other_changes: "Sleep discomfort begins.",
      warnings: "Sudden swelling or headaches."
    },
    {
      week: 32,
      uterus: "Near rib cage; fundal height peaks soon.",
      circulation: "Cardiac output at maximum.",
      musculoskeletal: "Pelvic pressure may begin.",
      other_changes: "Shortness of breath common.",
      warnings: "Persistent reduced fetal movement."
    },
    {
      week: 36,
      uterus: "Reaches xiphisternum; growth stabilizes.",
      circulation: "Blood volume remains elevated.",
      musculoskeletal: "Pelvic girdle discomfort.",
      other_changes: "Heartburn may improve as baby settles.",
      warnings: "Signs of preterm labor."
    },
    {
      week: 37,
      uterus: "May stop rising as baby descends.",
      circulation: "Circulation remains high until delivery.",
      musculoskeletal: "Increased pelvic pressure.",
      other_changes: "Frequent urination returns.",
      warnings: "Fluid leakage or bleeding."
    },
    {
      week: 38,
      uterus: "Baby may engage into pelvis.",
      circulation: "Stable cardiovascular load.",
      musculoskeletal: "Lightning pelvic pain possible.",
      other_changes: "Braxton Hicks contractions.",
      warnings: "Painful regular contractions."
    },
    {
      week: 40,
      uterus: "Fundal height stable or slightly reduced.",
      circulation: "Blood volume remains elevated.",
      musculoskeletal: "Pelvic discomfort common.",
      other_changes: "Awaiting onset of labor.",
      warnings: "Reduced fetal movement requires urgent care."
    },
    {
      week: 41,
      uterus: "No further uterine growth; monitoring increases.",
      circulation: "Physiological changes persist.",
      musculoskeletal: "Increased fatigue.",
      other_changes: "Post-date pregnancy.",
      warnings: "Close medical monitoring advised."
    },
    {
      week: 42,
      uterus: "Post-term pregnancy.",
      circulation: "Pregnancy physiology maintained.",
      musculoskeletal: "Pelvic pressure continues.",
      other_changes: "Induction often recommended.",
      warnings: "Immediate medical supervision required."
    }
  ]
};

export interface ActionWeekData {
  week: number;
  trimester: number;
  what_to_do: string[];
  medical_reason: string;
  safety_notes: string[];
}

export const actionPregnancyDataset: ActionWeekData[] = [
  {
    "week": 0,
    "trimester": 1,
    "what_to_do": [
      "Track your menstrual cycle",
      "Start prenatal vitamins if planning",
      "Identify your fertile window"
    ],
    "medical_reason": "Optimizing health before conception improves pregnancy outcomes.",
    "safety_notes": ["Begin lifestyle adjustments if planning pregnancy"]
  },
  {
    "week": 1,
    "trimester": 1,
    "what_to_do": [
      "Start folic acid 400–800 mcg daily",
      "Avoid alcohol, smoking, and recreational drugs",
      "Maintain a balanced diet"
    ],
    "medical_reason": "Folic acid reduces neural tube defect risk by up to 70%.",
    "safety_notes": ["Avoid X-rays unless medically necessary"]
  },
  {
    "week": 2,
    "trimester": 1,
    "what_to_do": [
      "Track ovulation and cycle dates",
      "Continue folic acid supplementation"
    ],
    "medical_reason": "Accurate dating improves prenatal care outcomes.",
    "safety_notes": ["Avoid unprescribed medications"]
  },
  {
    "week": 3,
    "trimester": 1,
    "what_to_do": [
      "Continue prenatal vitamins",
      "Stay hydrated",
      "Avoid high-mercury fish"
    ],
    "medical_reason": "Early embryonic cell division is sensitive to toxins.",
    "safety_notes": ["Avoid raw seafood and unpasteurized foods"]
  },
  {
    "week": 4,
    "trimester": 1,
    "what_to_do": [
      "Confirm pregnancy with a test",
      "Schedule first antenatal visit",
      "Continue folic acid"
    ],
    "medical_reason": "Early antenatal booking reduces complications.",
    "safety_notes": ["Seek care if bleeding or severe pain occurs"]
  },

  {
    "week": 5,
    "trimester": 1,
    "what_to_do": [
      "Manage nausea with small frequent meals",
      "Get adequate rest",
      "Avoid strong smells if nauseated"
    ],
    "medical_reason": "Hormonal rise (hCG) commonly causes nausea.",
    "safety_notes": ["Persistent vomiting may indicate hyperemesis"]
  },
  {
    "week": 6,
    "trimester": 1,
    "what_to_do": [
      "Continue prenatal vitamins",
      "Light physical activity (walking)",
      "Avoid overheating"
    ],
    "medical_reason": "Neural tube closes around this time.",
    "safety_notes": ["Fever above 38°C requires medical review"]
  },
  {
    "week": 7,
    "trimester": 1,
    "what_to_do": [
      "Eat iron-rich foods",
      "Increase fluid intake"
    ],
    "medical_reason": "Blood volume expansion begins.",
    "safety_notes": ["Dizziness or fainting should be evaluated"]
  },
  {
    "week": 8,
    "trimester": 1,
    "what_to_do": [
      "Book ultrasound if advised",
      "Continue gentle exercise"
    ],
    "medical_reason": "Organogenesis is ongoing.",
    "safety_notes": ["Avoid contact sports"]
  },

  {
    "week": 9,
    "trimester": 1,
    "what_to_do": [
      "Manage fatigue with rest",
      "Maintain protein intake"
    ],
    "medical_reason": "Placenta is forming.",
    "safety_notes": ["Extreme fatigue may indicate anemia"]
  },
  {
    "week": 10,
    "trimester": 1,
    "what_to_do": [
      "Discuss genetic screening options",
      "Maintain healthy sleep habits"
    ],
    "medical_reason": "Screening detects chromosomal risks early.",
    "safety_notes": ["Counseling recommended before tests"]
  },
  {
    "week": 11,
    "trimester": 1,
    "what_to_do": [
      "Continue calcium intake (1000 mg/day)",
      "Posture awareness"
    ],
    "medical_reason": "Fetal skeletal development accelerates.",
    "safety_notes": ["Avoid heavy lifting"]
  },
  {
    "week": 12,
    "trimester": 1,
    "what_to_do": [
      "First trimester scan if scheduled",
      "Maintain hydration"
    ],
    "medical_reason": "Miscarriage risk significantly declines after this week.",
    "safety_notes": ["Report persistent abdominal pain"]
  },

  {
    "week": 13,
    "trimester": 2,
    "what_to_do": [
      "Increase calorie intake slightly (~300 kcal/day)",
      "Begin pelvic floor exercises"
    ],
    "medical_reason": "Second trimester growth phase begins.",
    "safety_notes": ["Avoid prolonged standing"]
  },
  {
    "week": 14,
    "trimester": 2,
    "what_to_do": [
      "Maintain moderate exercise",
      "Monitor weight gain"
    ],
    "medical_reason": "Healthy weight gain reduces gestational diabetes risk.",
    "safety_notes": ["Rapid weight gain should be evaluated"]
  },
  {
    "week": 15,
    "trimester": 2,
    "what_to_do": [
      "Iron supplementation if advised",
      "Increase fiber intake"
    ],
    "medical_reason": "Constipation is common due to progesterone.",
    "safety_notes": ["Severe constipation may need treatment"]
  },
  {
    "week": 16,
    "trimester": 2,
    "what_to_do": [
      "Attend routine antenatal visit",
      "Practice good posture"
    ],
    "medical_reason": "Uterus begins noticeable enlargement.",
    "safety_notes": ["Back pain worsening suddenly needs review"]
  },

  {
    "week": 17,
    "trimester": 2,
    "what_to_do": [
      "Sleep on side (preferably left)",
      "Stretch daily"
    ],
    "medical_reason": "Improves uteroplacental blood flow.",
    "safety_notes": ["Avoid lying flat for long periods"]
  },
  {
    "week": 18,
    "trimester": 2,
    "what_to_do": [
      "Anomaly scan if scheduled",
      "Monitor fetal movements (if felt)"
    ],
    "medical_reason": "Major fetal anatomy assessment.",
    "safety_notes": ["Report reduced movements later in pregnancy"]
  },
  {
    "week": 19,
    "trimester": 2,
    "what_to_do": [
      "Supportive footwear",
      "Adequate hydration"
    ],
    "medical_reason": "Ligament laxity increases.",
    "safety_notes": ["Sudden leg pain may indicate clot"]
  },
  {
    "week": 20,
    "trimester": 2,
    "what_to_do": [
      "Track fetal movements",
      "Continue antenatal care"
    ],
    "medical_reason": "Mid-pregnancy milestone.",
    "safety_notes": ["Severe swelling needs evaluation"]
  },

  {
    "week": 21,
    "trimester": 2,
    "what_to_do": [
      "Stretch hips and pelvis",
      "Adequate protein intake"
    ],
    "medical_reason": "Rapid fetal muscle development.",
    "safety_notes": ["Pelvic pain worsening should be assessed"]
  },
  {
    "week": 22,
    "trimester": 2,
    "what_to_do": [
      "Practice breathing exercises",
      "Avoid smoking exposure"
    ],
    "medical_reason": "Lung development begins.",
    "safety_notes": ["Breathlessness at rest requires evaluation"]
  },
  {
    "week": 23,
    "trimester": 2,
    "what_to_do": [
      "Continue prenatal vitamins",
      "Monitor blood pressure"
    ],
    "medical_reason": "Pre-eclampsia screening period.",
    "safety_notes": ["Headache + vision changes are warning signs"]
  },
  {
    "week": 24,
    "trimester": 2,
    "what_to_do": [
      "Glucose screening if advised",
      "Maintain balanced meals"
    ],
    "medical_reason": "Gestational diabetes screening window.",
    "safety_notes": ["Excess thirst or urination should be reported"]
  },

  {
    "week": 25,
    "trimester": 2,
    "what_to_do": [
      "Sleep with pillow support",
      "Hydration focus"
    ],
    "medical_reason": "Uterus expansion affects sleep quality.",
    "safety_notes": ["Insomnia severe enough to impair function needs support"]
  },
  {
    "week": 26,
    "trimester": 2,
    "what_to_do": [
      "Monitor fetal movement daily",
      "Stretch calves"
    ],
    "medical_reason": "Fetal neurological development.",
    "safety_notes": ["Reduced movement requires immediate review"]
  },
  {
    "week": 27,
    "trimester": 2,
    "what_to_do": [
      "Prepare for third trimester",
      "Iron intake review"
    ],
    "medical_reason": "Blood volume peaks soon.",
    "safety_notes": ["Palpitations should be assessed"]
  },

  {
    "week": 28,
    "trimester": 3,
    "what_to_do": [
      "Attend antenatal appointment",
      "Kick-count awareness"
    ],
    "medical_reason": "Third trimester growth acceleration.",
    "safety_notes": ["Sudden swelling or pain is concerning"]
  },
  {
    "week": 29,
    "trimester": 3,
    "what_to_do": [
      "Light exercise only",
      "Adequate rest"
    ],
    "medical_reason": "Increased oxygen demand.",
    "safety_notes": ["Chest pain needs urgent care"]
  },
  {
    "week": 30,
    "trimester": 3,
    "what_to_do": [
      "Practice labor breathing",
      "Pelvic floor exercises"
    ],
    "medical_reason": "Prepares muscles for delivery.",
    "safety_notes": ["Pelvic pressure with pain needs assessment"]
  },
  {
    "week": 31,
    "trimester": 3,
    "what_to_do": [
      "Sleep on side",
      "Monitor blood pressure"
    ],
    "medical_reason": "Supine hypotension risk increases.",
    "safety_notes": ["Dizziness lying flat is common but should be avoided"]
  },
  {
    "week": 32,
    "trimester": 3,
    "what_to_do": [
      "Hospital bag planning",
      "Discuss birth preferences"
    ],
    "medical_reason": "Preterm labor risk exists.",
    "safety_notes": ["Regular contractions require evaluation"]
  },
  {
    "week": 33,
    "trimester": 3,
    "what_to_do": [
      "Adequate hydration",
      "Rest breaks"
    ],
    "medical_reason": "Amniotic fluid maintenance.",
    "safety_notes": ["Leaking fluid should be reported"]
  },
  {
    "week": 34,
    "trimester": 3,
    "what_to_do": [
      "Perineal massage (if advised)",
      "Gentle walking"
    ],
    "medical_reason": "May reduce perineal trauma.",
    "safety_notes": ["Bleeding requires immediate care"]
  },
  {
    "week": 35,
    "trimester": 3,
    "what_to_do": [
      "Finalize birth plan",
      "Attend antenatal visits"
    ],
    "medical_reason": "Delivery preparation phase.",
    "safety_notes": ["Decreased fetal movement is urgent"]
  },
  {
    "week": 36,
    "trimester": 3,
    "what_to_do": [
      "Monitor contractions",
      "Rest frequently"
    ],
    "medical_reason": "Baby may engage into pelvis.",
    "safety_notes": ["Painful regular contractions indicate labor"]
  },
  {
    "week": 37,
    "trimester": 3,
    "what_to_do": [
      "Daily fetal movement monitoring",
      "Stay near delivery facility"
    ],
    "medical_reason": "Term pregnancy begins.",
    "safety_notes": ["Rupture of membranes requires immediate care"]
  },
  {
    "week": 38,
    "trimester": 3,
    "what_to_do": [
      "Light activity only",
      "Mental relaxation"
    ],
    "medical_reason": "Labor may begin anytime.",
    "safety_notes": ["Severe headache or vision changes are emergencies"]
  },
  {
    "week": 39,
    "trimester": 3,
    "what_to_do": [
      "Await spontaneous labor",
      "Continue hydration"
    ],
    "medical_reason": "Optimal delivery timing.",
    "safety_notes": ["Reduced fetal movement is urgent"]
  },
  {
    "week": 40,
    "trimester": 3,
    "what_to_do": [
      "Attend post-date monitoring if advised",
      "Stay active as tolerated"
    ],
    "medical_reason": "Placental function monitoring is important.",
    "safety_notes": ["Any bleeding requires evaluation"]
  },
  {
    "week": 41,
    "trimester": 3,
    "what_to_do": [
      "Increased fetal surveillance",
      "Discuss induction options"
    ],
    "medical_reason": "Post-term risks increase.",
    "safety_notes": ["Reduced movement is critical"]
  },
  {
    "week": 42,
    "trimester": 3,
    "what_to_do": [
      "Induction or delivery planning",
      "Close medical supervision"
    ],
    "medical_reason": "Stillbirth risk increases beyond 42 weeks.",
    "safety_notes": ["Immediate care if any concern arises"]
  }
];


