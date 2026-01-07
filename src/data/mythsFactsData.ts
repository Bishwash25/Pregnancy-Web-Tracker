export type RiskLevel = "Low" | "Medium" | "High";
export type Region = "South Asia" | "Middle East" | "Western" | "East Asia" | "Global";
export type Category = "Nutrition" | "Activity" | "Body Changes" | "Emotions" | "Labor" | "Gender Myths" | "Sleep/Posture" | "General";

export interface MedicalSource {
  org: string;
  reference: string;
}

export interface MythFact {
  id: string;
  week: number;
  category: Category;
  region: Region;
  myth: string;
  beliefReason: string;
  medicalFact: string;
  riskLevel: RiskLevel;
  medicalGuidance: string;
  sources: MedicalSource[];
  actionableAdvice: string;
}

export const mythsFactsData: MythFact[] = [
  {
    id: "w1-1",
    week: 1,
    category: "Nutrition",
    region: "Global",
    myth: "You must start eating for two as soon as you find out you're pregnant.",
    beliefReason: "The idea that pregnancy requires double the food intake has been passed down through generations.",
    medicalFact: "In the first trimester, you don't need any extra calories. Quality of nutrition matters more than quantity.",
    riskLevel: "Low",
    medicalGuidance: "Focus on nutrient-dense foods, especially folate-rich vegetables and lean proteins.",
    sources: [
      { org: "ACOG", reference: "Nutrition During Pregnancy Guidelines" },
      { org: "WHO", reference: "Maternal Nutrition Guidelines 2020" }
    ],
    actionableAdvice: "Take prenatal vitamins with 400-800mcg folic acid daily instead of increasing food quantity."
  },
  {
    id: "w1-2",
    week: 1,
    category: "Activity",
    region: "South Asia",
    myth: "You should avoid all physical activity during early pregnancy.",
    beliefReason: "Fear that movement might dislodge the newly implanted embryo.",
    medicalFact: "Light to moderate exercise is safe and beneficial during early pregnancy for most women.",
    riskLevel: "Low",
    medicalGuidance: "Continue normal activities unless advised otherwise by your doctor.",
    sources: [
      { org: "ACOG", reference: "Physical Activity and Exercise During Pregnancy" },
      { org: "NHS", reference: "Exercise in Pregnancy" }
    ],
    actionableAdvice: "Walking, swimming, and prenatal yoga are excellent choices throughout pregnancy."
  },
  {
    id: "w1-3",
    week: 1,
    category: "General",
    region: "Western",
    myth: "Pregnancy tests are only accurate after a missed period.",
    beliefReason: "Traditional understanding of when hCG becomes detectable.",
    medicalFact: "Modern pregnancy tests can detect hCG as early as 10 days after conception, sometimes before a missed period.",
    riskLevel: "Low",
    medicalGuidance: "For most accurate results, test after your expected period date.",
    sources: [
      { org: "FDA", reference: "Home Pregnancy Test Information" },
      { org: "NHS", reference: "Doing a Pregnancy Test" }
    ],
    actionableAdvice: "Use first morning urine for testing when hCG concentration is highest."
  },
  {
    id: "w2-1",
    week: 2,
    category: "Nutrition",
    region: "East Asia",
    myth: "Cold foods and drinks can harm the developing embryo.",
    beliefReason: "Traditional medicine beliefs about maintaining warmth in the body for fertility.",
    medicalFact: "Temperature of food and drinks does not affect embryo implantation or development.",
    riskLevel: "Low",
    medicalGuidance: "Stay hydrated with whatever temperature beverages you prefer.",
    sources: [
      { org: "ACOG", reference: "Nutrition During Pregnancy" },
      { org: "WHO", reference: "Healthy Diet During Pregnancy" }
    ],
    actionableAdvice: "Focus on staying well-hydrated; the temperature of drinks doesn't matter."
  },
  {
    id: "w2-2",
    week: 2,
    category: "Activity",
    region: "Global",
    myth: "Stressful events can prevent implantation.",
    beliefReason: "Stress hormones are believed to interfere with reproduction.",
    medicalFact: "While chronic severe stress may affect fertility, normal daily stress does not prevent implantation.",
    riskLevel: "Low",
    medicalGuidance: "Practice stress management but don't worry that stress will prevent pregnancy.",
    sources: [
      { org: "ASRM", reference: "Stress and Infertility" },
      { org: "RCOG", reference: "Mental Health in Pregnancy" }
    ],
    actionableAdvice: "Continue normal activities; managing stress is good for overall health regardless."
  },
  {
    id: "w2-3",
    week: 2,
    category: "Body Changes",
    region: "Western",
    myth: "You should feel symptoms immediately after conception.",
    beliefReason: "Anticipation and hyperawareness of body changes when trying to conceive.",
    medicalFact: "Most women don't experience noticeable symptoms until after implantation, around weeks 4-6.",
    riskLevel: "Low",
    medicalGuidance: "Lack of symptoms in early pregnancy is completely normal.",
    sources: [
      { org: "Mayo Clinic", reference: "Pregnancy Week by Week" },
      { org: "NHS", reference: "Signs and Symptoms of Pregnancy" }
    ],
    actionableAdvice: "Don't worry if you don't feel different; symptoms vary greatly between women."
  },
  {
    id: "w3-1",
    week: 3,
    category: "Nutrition",
    region: "South Asia",
    myth: "Eating saffron will make the baby fair-skinned.",
    beliefReason: "Cultural belief that certain foods can influence baby's skin color.",
    medicalFact: "Skin color is determined by genetics, not by foods consumed during pregnancy.",
    riskLevel: "Low",
    medicalGuidance: "Saffron in culinary amounts is safe but won't affect baby's appearance.",
    sources: [
      { org: "WHO", reference: "Maternal Nutrition Guidelines" },
      { org: "AAP", reference: "Genetics and Skin Pigmentation" }
    ],
    actionableAdvice: "Enjoy saffron in normal cooking amounts; focus on nutritious foods for baby's health."
  },
  {
    id: "w3-2",
    week: 3,
    category: "Activity",
    region: "Middle East",
    myth: "Announcing pregnancy early brings bad luck.",
    beliefReason: "Superstition about protecting the pregnancy from evil eye or misfortune.",
    medicalFact: "When you share pregnancy news has no impact on pregnancy outcomes.",
    riskLevel: "Low",
    medicalGuidance: "Share your news whenever you feel comfortable.",
    sources: [
      { org: "ACOG", reference: "Early Pregnancy Guidelines" },
      { org: "WHO", reference: "Pregnancy Care Recommendations" }
    ],
    actionableAdvice: "Choose to share based on your comfort level; many wait until after first trimester screening."
  },
  {
    id: "w3-3",
    week: 3,
    category: "General",
    region: "Global",
    myth: "A positive test means a healthy pregnancy is guaranteed.",
    beliefReason: "Understandable hope that a positive test ensures success.",
    medicalFact: "Early pregnancy loss occurs in 10-20% of known pregnancies, often due to chromosomal abnormalities.",
    riskLevel: "Low",
    medicalGuidance: "Schedule prenatal care to monitor pregnancy development.",
    sources: [
      { org: "ACOG", reference: "Early Pregnancy Loss" },
      { org: "NHS", reference: "Miscarriage Information" }
    ],
    actionableAdvice: "Book your first prenatal appointment and follow recommended care schedules."
  },
  {
    id: "w4-1",
    week: 4,
    category: "Nutrition",
    region: "Global",
    myth: "All herbal teas are safe during pregnancy.",
    beliefReason: "Natural products are often assumed to be harmless.",
    medicalFact: "Some herbal teas contain compounds that may be harmful during pregnancy.",
    riskLevel: "Medium",
    medicalGuidance: "Stick to pregnancy-safe teas like ginger or peppermint in moderation.",
    sources: [
      { org: "ACOG", reference: "Herbal Products During Pregnancy" },
      { org: "NHS", reference: "Foods to Avoid in Pregnancy" }
    ],
    actionableAdvice: "Avoid herbal teas with unknown safety profiles; consult your provider about specific herbs."
  },
  {
    id: "w4-2",
    week: 4,
    category: "Body Changes",
    region: "Western",
    myth: "Morning sickness only happens in the morning.",
    beliefReason: "The misleading name 'morning sickness' suggests timing.",
    medicalFact: "Nausea and vomiting can occur at any time of day or night.",
    riskLevel: "Low",
    medicalGuidance: "Eat small, frequent meals and stay hydrated regardless of when nausea occurs.",
    sources: [
      { org: "ACOG", reference: "Nausea and Vomiting of Pregnancy" },
      { org: "NHS", reference: "Vomiting and Morning Sickness" }
    ],
    actionableAdvice: "Keep crackers by your bedside and eat before getting up; ginger may help some women."
  },
  {
    id: "w4-3",
    week: 4,
    category: "Activity",
    region: "South Asia",
    myth: "Hot baths will harm the baby.",
    beliefReason: "Concern about heat affecting the developing embryo.",
    medicalFact: "Warm baths are safe; avoid water above 100°F (38°C) and hot tubs/saunas.",
    riskLevel: "Medium",
    medicalGuidance: "Keep bath water warm, not hot, and limit time to 10-15 minutes.",
    sources: [
      { org: "ACOG", reference: "Hyperthermia and Pregnancy" },
      { org: "Mayo Clinic", reference: "Hot Tubs and Pregnancy" }
    ],
    actionableAdvice: "Enjoy warm baths but avoid raising your core body temperature above 101°F."
  },
  {
    id: "w5-1",
    week: 5,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating crab will make the baby 'crabby' or difficult.",
    beliefReason: "Wordplay and folklore associating food characteristics with baby's personality.",
    medicalFact: "Well-cooked shellfish is safe and nutritious during pregnancy.",
    riskLevel: "Low",
    medicalGuidance: "Enjoy well-cooked crab in moderation; avoid raw or undercooked shellfish.",
    sources: [
      { org: "FDA", reference: "Seafood Safety During Pregnancy" },
      { org: "ACOG", reference: "Nutrition During Pregnancy" }
    ],
    actionableAdvice: "Cooked crab is a good source of protein and omega-3s; ensure it's thoroughly cooked."
  },
  {
    id: "w5-2",
    week: 5,
    category: "Emotions",
    region: "Global",
    myth: "Feeling ambivalent about pregnancy means you'll be a bad parent.",
    beliefReason: "Societal pressure to feel only joy about pregnancy.",
    medicalFact: "Mixed feelings about pregnancy are completely normal and don't predict parenting ability.",
    riskLevel: "Low",
    medicalGuidance: "Discuss your feelings with your healthcare provider or a counselor if needed.",
    sources: [
      { org: "RCOG", reference: "Maternal Mental Health" },
      { org: "ACOG", reference: "Perinatal Mental Health" }
    ],
    actionableAdvice: "Allow yourself to feel all emotions; seek support if feelings become overwhelming."
  },
  {
    id: "w5-3",
    week: 5,
    category: "Body Changes",
    region: "Western",
    myth: "Spotting always means miscarriage.",
    beliefReason: "Bleeding is associated with loss of pregnancy.",
    medicalFact: "Light spotting in early pregnancy is common and often harmless; it can be from implantation.",
    riskLevel: "Medium",
    medicalGuidance: "Contact your provider about any bleeding, but don't assume the worst.",
    sources: [
      { org: "ACOG", reference: "First Trimester Bleeding" },
      { org: "NHS", reference: "Bleeding in Pregnancy" }
    ],
    actionableAdvice: "Note the amount and color of bleeding; contact your doctor for evaluation."
  },
  {
    id: "w6-1",
    week: 6,
    category: "Nutrition",
    region: "South Asia",
    myth: "Eating ghee will make delivery easier.",
    beliefReason: "Traditional belief that ghee 'lubricates' the birth canal.",
    medicalFact: "Ghee consumption doesn't affect labor or delivery outcomes.",
    riskLevel: "Low",
    medicalGuidance: "Ghee in moderation is fine but won't influence delivery.",
    sources: [
      { org: "WHO", reference: "Nutrition During Pregnancy" },
      { org: "ACOG", reference: "Healthy Weight Gain in Pregnancy" }
    ],
    actionableAdvice: "Enjoy ghee in normal amounts as part of a balanced diet; focus on overall nutrition."
  },
  {
    id: "w6-2",
    week: 6,
    category: "Gender Myths",
    region: "Global",
    myth: "Severe morning sickness means you're having a girl.",
    beliefReason: "Old wives' tale connecting symptom severity to baby's sex.",
    medicalFact: "Morning sickness severity is related to hormone levels, not baby's sex.",
    riskLevel: "Low",
    medicalGuidance: "The only reliable ways to know sex are ultrasound or genetic testing.",
    sources: [
      { org: "ACOG", reference: "Prenatal Genetic Testing" },
      { org: "BMJ", reference: "Nausea in Pregnancy Studies" }
    ],
    actionableAdvice: "Enjoy the mystery or ask about sex determination during your anatomy scan."
  },
  {
    id: "w6-3",
    week: 6,
    category: "Activity",
    region: "Middle East",
    myth: "Using a microwave during pregnancy harms the baby.",
    beliefReason: "Fear of radiation from electronic devices.",
    medicalFact: "Microwave ovens in good condition produce non-ionizing radiation that doesn't harm pregnancy.",
    riskLevel: "Low",
    medicalGuidance: "Use microwaves normally; ensure they're in good working condition.",
    sources: [
      { org: "FDA", reference: "Microwave Oven Radiation" },
      { org: "WHO", reference: "Electromagnetic Fields and Pregnancy" }
    ],
    actionableAdvice: "Microwaves are safe; stand a few feet away while operating if concerned."
  },
  {
    id: "w7-1",
    week: 7,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating rabbit during pregnancy will give the baby a cleft lip.",
    beliefReason: "Association between the animal's appearance and physical conditions.",
    medicalFact: "Cleft lip is caused by genetic and environmental factors, not by eating any particular animal.",
    riskLevel: "Low",
    medicalGuidance: "Eat a varied, balanced diet; no foods cause cleft lip.",
    sources: [
      { org: "CDC", reference: "Cleft Lip and Palate Facts" },
      { org: "WHO", reference: "Congenital Anomalies" }
    ],
    actionableAdvice: "Take folic acid, which can help reduce risk of certain birth defects."
  },
  {
    id: "w7-2",
    week: 7,
    category: "Activity",
    region: "South Asia",
    myth: "Looking at beautiful things will make the baby beautiful.",
    beliefReason: "Belief in the power of mother's experiences to shape the baby.",
    medicalFact: "Baby's appearance is determined by genetics, not by what the mother looks at.",
    riskLevel: "Low",
    medicalGuidance: "Enjoy art and beauty for your own wellbeing, not for baby's appearance.",
    sources: [
      { org: "AAP", reference: "Genetics and Development" },
      { org: "NIH", reference: "Human Genetics" }
    ],
    actionableAdvice: "Appreciate beautiful things for stress relief and enjoyment."
  },
  {
    id: "w7-3",
    week: 7,
    category: "Body Changes",
    region: "Western",
    myth: "Your hair will definitely become thicker during pregnancy.",
    beliefReason: "Common experience that became generalized as universal.",
    medicalFact: "Hair changes vary; some women experience thicker hair, others may have no change or even hair loss.",
    riskLevel: "Low",
    medicalGuidance: "Hair changes are individual; consult your doctor if you experience significant hair loss.",
    sources: [
      { org: "AAD", reference: "Hair Changes During Pregnancy" },
      { org: "NHS", reference: "Pregnancy Body Changes" }
    ],
    actionableAdvice: "Maintain good nutrition for healthy hair; changes typically normalize after pregnancy."
  },
  {
    id: "w8-1",
    week: 8,
    category: "Nutrition",
    region: "Global",
    myth: "You should avoid all caffeine during pregnancy.",
    beliefReason: "Caffeine is a stimulant, leading to concerns about its effects.",
    medicalFact: "Up to 200mg caffeine daily (about one 12oz coffee) is considered safe during pregnancy.",
    riskLevel: "Low",
    medicalGuidance: "Moderate caffeine intake is acceptable; track total daily intake from all sources.",
    sources: [
      { org: "ACOG", reference: "Moderate Caffeine Consumption During Pregnancy" },
      { org: "WHO", reference: "Caffeine and Pregnancy" }
    ],
    actionableAdvice: "One cup of coffee daily is fine; remember chocolate and tea also contain caffeine."
  },
  {
    id: "w8-2",
    week: 8,
    category: "Activity",
    region: "South Asia",
    myth: "Crossing your legs will cause the umbilical cord to wrap around baby.",
    beliefReason: "Visual analogy between crossed legs and tangled cord.",
    medicalFact: "Your sitting position cannot affect the umbilical cord inside the uterus.",
    riskLevel: "Low",
    medicalGuidance: "Sit comfortably; avoid positions that restrict your circulation.",
    sources: [
      { org: "ACOG", reference: "Fetal Development" },
      { org: "NHS", reference: "Common Pregnancy Concerns" }
    ],
    actionableAdvice: "Change positions regularly for comfort and circulation; crossing legs is fine."
  },
  {
    id: "w8-3",
    week: 8,
    category: "Emotions",
    region: "Global",
    myth: "Being stressed will harm the baby.",
    beliefReason: "General knowledge that stress affects health.",
    medicalFact: "Normal daily stress doesn't harm babies; chronic severe stress may have effects.",
    riskLevel: "Low",
    medicalGuidance: "Practice healthy stress management; seek help for severe anxiety or depression.",
    sources: [
      { org: "ACOG", reference: "Mental Health During Pregnancy" },
      { org: "RCOG", reference: "Stress and Pregnancy" }
    ],
    actionableAdvice: "Normal stress won't harm your baby; focus on self-care and seek support when needed."
  },
  {
    id: "w9-1",
    week: 9,
    category: "Nutrition",
    region: "Middle East",
    myth: "Eating dates guarantees an easier delivery.",
    beliefReason: "Traditional recommendation in some cultures.",
    medicalFact: "Some studies suggest dates in late pregnancy may help, but they don't guarantee easy delivery.",
    riskLevel: "Low",
    medicalGuidance: "Dates are nutritious; eating them in third trimester may have benefits.",
    sources: [
      { org: "Journal of Midwifery", reference: "Date Fruit Consumption and Labor" },
      { org: "ACOG", reference: "Labor and Delivery" }
    ],
    actionableAdvice: "Dates are healthy snacks; consider adding them to your diet in third trimester."
  },
  {
    id: "w9-2",
    week: 9,
    category: "Gender Myths",
    region: "East Asia",
    myth: "The Chinese gender calendar can predict baby's sex.",
    beliefReason: "Ancient tradition claiming accuracy based on mother's age and month of conception.",
    medicalFact: "Gender calendars have about 50% accuracy - the same as random guessing.",
    riskLevel: "Low",
    medicalGuidance: "Only ultrasound or genetic testing can reliably determine baby's sex.",
    sources: [
      { org: "ACOG", reference: "Prenatal Determination of Sex" },
      { org: "BMJ", reference: "Gender Prediction Methods" }
    ],
    actionableAdvice: "Enjoy the calendar as fun; don't make decisions based on its prediction."
  },
  {
    id: "w9-3",
    week: 9,
    category: "Body Changes",
    region: "Western",
    myth: "Heartburn during pregnancy means baby will have lots of hair.",
    beliefReason: "Old wives' tale connecting two unrelated experiences.",
    medicalFact: "Interestingly, some research shows a correlation, possibly due to hormones affecting both.",
    riskLevel: "Low",
    medicalGuidance: "Manage heartburn with diet changes and safe antacids if needed.",
    sources: [
      { org: "Birth Journal", reference: "Pregnancy Heartburn and Newborn Hair Study" },
      { org: "ACOG", reference: "Heartburn During Pregnancy" }
    ],
    actionableAdvice: "Eat smaller meals, avoid spicy foods, and elevate your head when sleeping."
  },
  {
    id: "w10-1",
    week: 10,
    category: "Nutrition",
    region: "South Asia",
    myth: "Eating coconut will give the baby a fair complexion.",
    beliefReason: "Association of white coconut with light skin color.",
    medicalFact: "Skin color is determined by genetics, not diet.",
    riskLevel: "Low",
    medicalGuidance: "Coconut is nutritious; enjoy it without expectations about baby's appearance.",
    sources: [
      { org: "AAP", reference: "Genetics and Pigmentation" },
      { org: "WHO", reference: "Pregnancy Nutrition" }
    ],
    actionableAdvice: "Coconut is healthy; focus on nutrition rather than appearance myths."
  },
  {
    id: "w10-2",
    week: 10,
    category: "Activity",
    region: "Global",
    myth: "You shouldn't fly during pregnancy.",
    beliefReason: "Concerns about cabin pressure and radiation.",
    medicalFact: "Flying is generally safe until 36 weeks; some restrictions apply for complications.",
    riskLevel: "Low",
    medicalGuidance: "Most airlines allow pregnant women to fly until 36 weeks with medical clearance.",
    sources: [
      { org: "ACOG", reference: "Air Travel During Pregnancy" },
      { org: "WHO", reference: "International Travel and Pregnancy" }
    ],
    actionableAdvice: "Stay hydrated, move regularly, and wear compression socks on long flights."
  },
  {
    id: "w10-3",
    week: 10,
    category: "Sleep/Posture",
    region: "Western",
    myth: "You must sleep only on your left side from day one.",
    beliefReason: "Left-side sleeping is recommended later in pregnancy.",
    medicalFact: "In early pregnancy, any comfortable sleeping position is fine; left side matters more after 20 weeks.",
    riskLevel: "Low",
    medicalGuidance: "Sleep however is comfortable in early pregnancy; transition to left side preference later.",
    sources: [
      { org: "ACOG", reference: "Sleep During Pregnancy" },
      { org: "NHS", reference: "Sleeping Safely in Pregnancy" }
    ],
    actionableAdvice: "Prioritize sleep quality now; focus on side sleeping as your belly grows."
  },
  {
    id: "w11-1",
    week: 11,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating duck will cause webbed feet in the baby.",
    beliefReason: "Magical thinking connecting animal characteristics to baby.",
    medicalFact: "What you eat cannot cause physical abnormalities in babies.",
    riskLevel: "Low",
    medicalGuidance: "Well-cooked duck is safe and nutritious during pregnancy.",
    sources: [
      { org: "FDA", reference: "Food Safety During Pregnancy" },
      { org: "ACOG", reference: "Nutrition Guidelines" }
    ],
    actionableAdvice: "Enjoy well-cooked duck; ensure all poultry reaches safe internal temperature."
  },
  {
    id: "w11-2",
    week: 11,
    category: "Activity",
    region: "Middle East",
    myth: "Using computers will harm the developing baby.",
    beliefReason: "Fear of radiation from electronic devices.",
    medicalFact: "Computers emit no harmful radiation that affects pregnancy.",
    riskLevel: "Low",
    medicalGuidance: "Use computers normally; take breaks for ergonomic reasons.",
    sources: [
      { org: "WHO", reference: "Electromagnetic Fields" },
      { org: "ACOG", reference: "Environmental Exposures" }
    ],
    actionableAdvice: "Take regular breaks from screens for eye comfort and posture."
  },
  {
    id: "w11-3",
    week: 11,
    category: "Body Changes",
    region: "Global",
    myth: "Pregnancy glow happens to everyone.",
    beliefReason: "Popular media portrayal of pregnancy.",
    medicalFact: "Some women experience clearer skin; others have acne or skin changes.",
    riskLevel: "Low",
    medicalGuidance: "Skin changes vary; use pregnancy-safe skincare products.",
    sources: [
      { org: "AAD", reference: "Skin Changes During Pregnancy" },
      { org: "NHS", reference: "Common Pregnancy Changes" }
    ],
    actionableAdvice: "Maintain a gentle skincare routine; avoid retinoids and certain ingredients."
  },
  {
    id: "w12-1",
    week: 12,
    category: "Nutrition",
    region: "South Asia",
    myth: "Eating iron-rich foods will make the baby dark-skinned.",
    beliefReason: "Association of dark-colored foods with skin color.",
    medicalFact: "Iron is essential for preventing anemia; it doesn't affect skin color.",
    riskLevel: "Medium",
    medicalGuidance: "Iron deficiency is dangerous; take iron supplements if prescribed.",
    sources: [
      { org: "WHO", reference: "Iron Supplementation in Pregnancy" },
      { org: "ACOG", reference: "Anemia in Pregnancy" }
    ],
    actionableAdvice: "Ensure adequate iron intake through food and supplements as recommended."
  },
  {
    id: "w12-2",
    week: 12,
    category: "Activity",
    region: "Western",
    myth: "You shouldn't raise your arms above your head during pregnancy.",
    beliefReason: "Old belief that arm movement causes cord complications.",
    medicalFact: "Raising arms has no effect on the umbilical cord.",
    riskLevel: "Low",
    medicalGuidance: "Normal arm movements are completely safe throughout pregnancy.",
    sources: [
      { org: "ACOG", reference: "Exercise During Pregnancy" },
      { org: "NHS", reference: "Pregnancy Myths" }
    ],
    actionableAdvice: "Stretch freely; reaching and light stretching are good for pregnancy."
  },
  {
    id: "w12-3",
    week: 12,
    category: "General",
    region: "Global",
    myth: "The first trimester is the most dangerous; after 12 weeks you're safe.",
    beliefReason: "Miscarriage risk decreases significantly after first trimester.",
    medicalFact: "While first trimester has higher miscarriage risk, complications can occur anytime.",
    riskLevel: "Low",
    medicalGuidance: "Continue prenatal care throughout pregnancy; each trimester has considerations.",
    sources: [
      { org: "ACOG", reference: "Prenatal Care" },
      { org: "WHO", reference: "Antenatal Care Guidelines" }
    ],
    actionableAdvice: "Celebrate reaching second trimester but continue all recommended care."
  },
  {
    id: "w13-1",
    week: 13,
    category: "Nutrition",
    region: "Global",
    myth: "Craving certain foods means your body needs those nutrients.",
    beliefReason: "Logical assumption that cravings indicate deficiency.",
    medicalFact: "Cravings are more related to hormones and psychology than nutritional needs.",
    riskLevel: "Low",
    medicalGuidance: "It's okay to indulge cravings in moderation; maintain overall balanced nutrition.",
    sources: [
      { org: "ACOG", reference: "Pregnancy Cravings" },
      { org: "NIH", reference: "Food Cravings in Pregnancy" }
    ],
    actionableAdvice: "Enjoy cravings moderately; ensure you're meeting nutritional requirements."
  },
  {
    id: "w13-2",
    week: 13,
    category: "Gender Myths",
    region: "South Asia",
    myth: "If you crave sweets, you're having a girl; salty foods mean a boy.",
    beliefReason: "Long-standing folk belief about cravings and baby's sex.",
    medicalFact: "Cravings are unrelated to baby's sex; they're influenced by hormones.",
    riskLevel: "Low",
    medicalGuidance: "Ultrasound after 18-20 weeks or genetic testing can determine sex.",
    sources: [
      { org: "ACOG", reference: "Sex Determination" },
      { org: "BMJ", reference: "Pregnancy Cravings Study" }
    ],
    actionableAdvice: "Have fun with predictions but don't rely on them for planning."
  },
  {
    id: "w13-3",
    week: 13,
    category: "Body Changes",
    region: "Western",
    myth: "You should be showing by now if pregnant.",
    beliefReason: "Expectation based on other women's experiences.",
    medicalFact: "First-time mothers often don't show until 16-20 weeks; body type varies.",
    riskLevel: "Low",
    medicalGuidance: "Not showing early is normal; fundal height is monitored at appointments.",
    sources: [
      { org: "ACOG", reference: "Physical Changes in Pregnancy" },
      { org: "NHS", reference: "Your Pregnancy Week by Week" }
    ],
    actionableAdvice: "Don't compare your bump to others; every pregnancy is different."
  },
  {
    id: "w14-1",
    week: 14,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating spicy food during pregnancy will blind the baby.",
    beliefReason: "Traditional belief about 'heating' foods.",
    medicalFact: "Spicy food does not cause blindness or harm the baby.",
    riskLevel: "Low",
    medicalGuidance: "Eat spicy foods if you tolerate them; they may worsen heartburn.",
    sources: [
      { org: "ACOG", reference: "Diet During Pregnancy" },
      { org: "NHS", reference: "Foods and Pregnancy" }
    ],
    actionableAdvice: "If spicy food causes heartburn, reduce intake; otherwise enjoy moderately."
  },
  {
    id: "w14-2",
    week: 14,
    category: "Activity",
    region: "Global",
    myth: "You shouldn't exercise now that you're in second trimester.",
    beliefReason: "Overcautious approach to pregnancy activity.",
    medicalFact: "Second trimester is often the best time for exercise; energy typically increases.",
    riskLevel: "Low",
    medicalGuidance: "Continue moderate exercise unless contraindicated by your doctor.",
    sources: [
      { org: "ACOG", reference: "Physical Activity in Pregnancy" },
      { org: "WHO", reference: "Physical Activity Guidelines" }
    ],
    actionableAdvice: "Enjoy walking, swimming, and prenatal exercise classes during second trimester."
  },
  {
    id: "w14-3",
    week: 14,
    category: "Emotions",
    region: "South Asia",
    myth: "Being sad or crying will affect the baby negatively.",
    beliefReason: "Belief that mother's emotions directly transfer to baby.",
    medicalFact: "Normal emotional fluctuations don't harm babies; hormones cause mood swings.",
    riskLevel: "Low",
    medicalGuidance: "Allow yourself to feel emotions; seek help if depression persists.",
    sources: [
      { org: "RCOG", reference: "Mental Health in Pregnancy" },
      { org: "ACOG", reference: "Mood Changes During Pregnancy" }
    ],
    actionableAdvice: "Crying is normal; persistent sadness lasting more than 2 weeks needs attention."
  },
  {
    id: "w15-1",
    week: 15,
    category: "Nutrition",
    region: "Middle East",
    myth: "Honey is dangerous during pregnancy.",
    beliefReason: "Confusion with honey danger for infants under 1 year.",
    medicalFact: "Honey is safe for pregnant women; only infants shouldn't consume it.",
    riskLevel: "Low",
    medicalGuidance: "Enjoy honey in moderation as a natural sweetener.",
    sources: [
      { org: "CDC", reference: "Botulism and Honey" },
      { org: "ACOG", reference: "Food Safety" }
    ],
    actionableAdvice: "Honey is safe during pregnancy; avoid giving it to your baby after birth until age 1."
  },
  {
    id: "w15-2",
    week: 15,
    category: "Activity",
    region: "South Asia",
    myth: "Attending funerals while pregnant brings bad luck to the baby.",
    beliefReason: "Superstition about negative energy affecting pregnancy.",
    medicalFact: "Attending funerals has no effect on pregnancy outcomes.",
    riskLevel: "Low",
    medicalGuidance: "Make decisions based on your emotional needs, not superstition.",
    sources: [
      { org: "ACOG", reference: "Mental Health Support" },
      { org: "WHO", reference: "Pregnancy Care" }
    ],
    actionableAdvice: "Prioritize your emotional wellbeing; support from loved ones matters."
  },
  {
    id: "w15-3",
    week: 15,
    category: "Body Changes",
    region: "Global",
    myth: "All women get stretch marks during pregnancy.",
    beliefReason: "Common occurrence makes it seem universal.",
    medicalFact: "About 50-90% of women get stretch marks; genetics plays a significant role.",
    riskLevel: "Low",
    medicalGuidance: "Moisturize for comfort; stretch marks largely depend on genetics and weight gain.",
    sources: [
      { org: "AAD", reference: "Stretch Marks in Pregnancy" },
      { org: "NHS", reference: "Stretch Marks" }
    ],
    actionableAdvice: "Stay hydrated, moisturize, and maintain healthy weight gain; marks often fade postpartum."
  },
  {
    id: "w16-1",
    week: 16,
    category: "Nutrition",
    region: "South Asia",
    myth: "Eating papaya will cause miscarriage.",
    beliefReason: "Unripe papaya contains latex that may cause contractions.",
    medicalFact: "Ripe papaya is safe in moderate amounts; only unripe papaya should be avoided.",
    riskLevel: "Medium",
    medicalGuidance: "Enjoy fully ripe papaya; avoid green/unripe papaya.",
    sources: [
      { org: "WHO", reference: "Maternal Nutrition Guidelines" },
      { org: "NHS", reference: "Foods to Avoid in Pregnancy" }
    ],
    actionableAdvice: "If unsure whether papaya is ripe, avoid it or consult your doctor."
  },
  {
    id: "w16-2",
    week: 16,
    category: "Gender Myths",
    region: "Global",
    myth: "Heart rate above 140 means it's a girl; below means a boy.",
    beliefReason: "Long-standing folk belief about fetal heart rate and sex.",
    medicalFact: "Fetal heart rate varies based on activity, not sex; normal range is 110-160 bpm.",
    riskLevel: "Low",
    medicalGuidance: "Heart rate indicates baby's wellbeing, not sex.",
    sources: [
      { org: "ACOG", reference: "Fetal Heart Monitoring" },
      { org: "BMJ", reference: "Heart Rate and Fetal Sex Study" }
    ],
    actionableAdvice: "Heart rate is checked for health; wait for ultrasound for sex determination."
  },
  {
    id: "w16-3",
    week: 16,
    category: "Activity",
    region: "Western",
    myth: "You should stop coloring your hair during pregnancy.",
    beliefReason: "Concern about chemicals being absorbed through scalp.",
    medicalFact: "Hair dye in second trimester is generally considered safe; avoid in first trimester if concerned.",
    riskLevel: "Low",
    medicalGuidance: "Use dye in well-ventilated areas; highlights are safer than full color.",
    sources: [
      { org: "ACOG", reference: "Hair Treatments During Pregnancy" },
      { org: "NHS", reference: "Hair Dye and Pregnancy" }
    ],
    actionableAdvice: "Second trimester hair coloring is generally safe; use in ventilated space."
  },
  {
    id: "w17-1",
    week: 17,
    category: "Nutrition",
    region: "Global",
    myth: "You must drink milk daily for a healthy baby.",
    beliefReason: "Emphasis on calcium intake during pregnancy.",
    medicalFact: "Calcium is important but can be obtained from many non-dairy sources.",
    riskLevel: "Low",
    medicalGuidance: "Get 1000mg calcium daily from dairy or alternatives like fortified foods, leafy greens.",
    sources: [
      { org: "ACOG", reference: "Calcium in Pregnancy" },
      { org: "NIH", reference: "Calcium Fact Sheet" }
    ],
    actionableAdvice: "If lactose intolerant, choose fortified alternatives, leafy greens, or supplements."
  },
  {
    id: "w17-2",
    week: 17,
    category: "Activity",
    region: "East Asia",
    myth: "Moving furniture or reorganizing the home will disturb the baby.",
    beliefReason: "Traditional beliefs about disturbing spirits or energy.",
    medicalFact: "Light reorganizing is fine; avoid heavy lifting or overexertion.",
    riskLevel: "Low",
    medicalGuidance: "Don't lift heavy objects; ask for help with furniture.",
    sources: [
      { org: "ACOG", reference: "Physical Activity Guidelines" },
      { org: "NHS", reference: "Exercise in Pregnancy" }
    ],
    actionableAdvice: "Nesting is normal; get help for heavy items and avoid climbing ladders."
  },
  {
    id: "w17-3",
    week: 17,
    category: "Body Changes",
    region: "Western",
    myth: "You'll definitely feel the baby move by now.",
    beliefReason: "General timeline expectations for quickening.",
    medicalFact: "First-time mothers typically feel movement between 18-22 weeks.",
    riskLevel: "Low",
    medicalGuidance: "Not feeling movement yet is normal for first pregnancies.",
    sources: [
      { org: "ACOG", reference: "Fetal Movement" },
      { org: "NHS", reference: "Baby Movements in Pregnancy" }
    ],
    actionableAdvice: "Be patient; you'll likely feel flutters soon. Report concerns at your next visit."
  },
  {
    id: "w18-1",
    week: 18,
    category: "Nutrition",
    region: "South Asia",
    myth: "Pineapple will cause miscarriage.",
    beliefReason: "Bromelain in pineapple is thought to soften the cervix.",
    medicalFact: "You'd need to eat 7-10 whole pineapples at once for any cervical effect.",
    riskLevel: "Low",
    medicalGuidance: "Normal pineapple consumption is safe during pregnancy.",
    sources: [
      { org: "ACOG", reference: "Nutrition During Pregnancy" },
      { org: "NHS", reference: "Foods to Avoid" }
    ],
    actionableAdvice: "Enjoy pineapple in normal amounts; it's nutritious and vitamin-rich."
  },
  {
    id: "w18-2",
    week: 18,
    category: "Sleep/Posture",
    region: "Global",
    myth: "Sleeping on your back will immediately harm the baby.",
    beliefReason: "Back sleeping can reduce blood flow in late pregnancy.",
    medicalFact: "Occasional back sleeping won't harm baby; your body will prompt you to move if uncomfortable.",
    riskLevel: "Low",
    medicalGuidance: "Try to sleep on your side; don't panic if you wake on your back.",
    sources: [
      { org: "ACOG", reference: "Sleep Positions in Pregnancy" },
      { org: "NHS", reference: "Sleeping Safely" }
    ],
    actionableAdvice: "Use pillows to stay on your side; waking on your back occasionally is okay."
  },
  {
    id: "w18-3",
    week: 18,
    category: "Gender Myths",
    region: "Middle East",
    myth: "If you're carrying high, it's a girl; low means a boy.",
    beliefReason: "Visual differences in how women carry pregnancy.",
    medicalFact: "Belly shape depends on muscle tone, body shape, and baby's position, not sex.",
    riskLevel: "Low",
    medicalGuidance: "Belly shape indicates nothing about baby's sex.",
    sources: [
      { org: "ACOG", reference: "Myths About Pregnancy" },
      { org: "BMJ", reference: "Belly Shape and Fetal Sex" }
    ],
    actionableAdvice: "Enjoy people's guesses as fun; anatomy scan or NIPT reveals actual sex."
  },
  {
    id: "w19-1",
    week: 19,
    category: "Nutrition",
    region: "Western",
    myth: "You should avoid all fish during pregnancy.",
    beliefReason: "Concerns about mercury in fish.",
    medicalFact: "Low-mercury fish 2-3 times per week is recommended for omega-3 benefits.",
    riskLevel: "Low",
    medicalGuidance: "Eat salmon, sardines, tilapia; avoid shark, swordfish, king mackerel, tilefish.",
    sources: [
      { org: "FDA", reference: "Advice About Eating Fish" },
      { org: "ACOG", reference: "Seafood During Pregnancy" }
    ],
    actionableAdvice: "Low-mercury fish provides essential DHA for baby's brain development."
  },
  {
    id: "w19-2",
    week: 19,
    category: "Activity",
    region: "South Asia",
    myth: "Using scissors during pregnancy will cause the baby to have cleft lip.",
    beliefReason: "Symbolic association between cutting and facial splits.",
    medicalFact: "Using scissors has absolutely no effect on fetal development.",
    riskLevel: "Low",
    medicalGuidance: "Use scissors normally for any activities.",
    sources: [
      { org: "CDC", reference: "Cleft Lip Causes" },
      { org: "WHO", reference: "Birth Defects" }
    ],
    actionableAdvice: "Folic acid is what helps prevent neural tube defects, not avoiding scissors."
  },
  {
    id: "w19-3",
    week: 19,
    category: "Body Changes",
    region: "Global",
    myth: "Your feet growing during pregnancy is permanent.",
    beliefReason: "Some women experience lasting foot size changes.",
    medicalFact: "Foot size changes are usually temporary from swelling; some permanent change can occur.",
    riskLevel: "Low",
    medicalGuidance: "Wear comfortable, supportive shoes; elevation helps reduce swelling.",
    sources: [
      { org: "ACOG", reference: "Physical Changes in Pregnancy" },
      { org: "AAP", reference: "Postpartum Recovery" }
    ],
    actionableAdvice: "Buy comfortable shoes; most swelling resolves within weeks after delivery."
  },
  {
    id: "w20-1",
    week: 20,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating watermelon will cause the baby to have big head.",
    beliefReason: "Visual association between large fruit and baby's size.",
    medicalFact: "Baby's head size is determined by genetics, not fruits consumed.",
    riskLevel: "Low",
    medicalGuidance: "Watermelon is hydrating and nutritious during pregnancy.",
    sources: [
      { org: "ACOG", reference: "Nutrition Guidelines" },
      { org: "AAP", reference: "Fetal Growth Factors" }
    ],
    actionableAdvice: "Enjoy watermelon for hydration; it's especially good in summer pregnancy."
  },
  {
    id: "w20-2",
    week: 20,
    category: "Activity",
    region: "Global",
    myth: "Sexual intercourse should stop at 20 weeks.",
    beliefReason: "Fear of harming the baby or triggering labor.",
    medicalFact: "Sex is safe throughout pregnancy unless doctor advises otherwise.",
    riskLevel: "Low",
    medicalGuidance: "Continue intimacy unless you have placenta previa, preterm labor risk, or other contraindications.",
    sources: [
      { org: "ACOG", reference: "Sex During Pregnancy" },
      { org: "NHS", reference: "Sex in Pregnancy" }
    ],
    actionableAdvice: "Communicate with your partner about comfort; try different positions as belly grows."
  },
  {
    id: "w20-3",
    week: 20,
    category: "Labor",
    region: "Western",
    myth: "The anatomy scan can predict when you'll go into labor.",
    beliefReason: "Belief that scans can predict delivery timing.",
    medicalFact: "Anatomy scan checks baby's development; it cannot predict labor timing.",
    riskLevel: "Low",
    medicalGuidance: "Use the scan to check baby's health, not delivery timing.",
    sources: [
      { org: "ACOG", reference: "Second Trimester Ultrasound" },
      { org: "RCOG", reference: "Fetal Anomaly Screening" }
    ],
    actionableAdvice: "Ask questions during your anatomy scan about baby's development."
  },
  {
    id: "w21-1",
    week: 21,
    category: "Nutrition",
    region: "South Asia",
    myth: "Eating almonds will make the baby intelligent.",
    beliefReason: "Almonds are considered 'brain food' in many cultures.",
    medicalFact: "While nuts are nutritious, intelligence depends on genetics and many factors.",
    riskLevel: "Low",
    medicalGuidance: "Nuts are healthy snacks; they provide good fats but don't guarantee intelligence.",
    sources: [
      { org: "ACOG", reference: "Nutrition During Pregnancy" },
      { org: "NIH", reference: "Child Development Factors" }
    ],
    actionableAdvice: "Enjoy almonds as a healthy snack; balanced nutrition supports brain development."
  },
  {
    id: "w21-2",
    week: 21,
    category: "Activity",
    region: "Middle East",
    myth: "Lifting arms above head causes cord entanglement.",
    beliefReason: "Visual imagery of movement affecting cord position.",
    medicalFact: "The umbilical cord is not affected by mother's arm movements.",
    riskLevel: "Low",
    medicalGuidance: "Normal stretching and reaching are completely safe.",
    sources: [
      { org: "ACOG", reference: "Umbilical Cord Facts" },
      { org: "NHS", reference: "Pregnancy Myths" }
    ],
    actionableAdvice: "Stretch comfortably; prenatal yoga poses with arms raised are safe."
  },
  {
    id: "w21-3",
    week: 21,
    category: "Body Changes",
    region: "Global",
    myth: "A dark linea nigra means you're having a boy.",
    beliefReason: "Color intensity linked to male hormones myth.",
    medicalFact: "Linea nigra darkness is due to hormonal changes, not baby's sex.",
    riskLevel: "Low",
    medicalGuidance: "The line typically fades after pregnancy; it's unrelated to sex.",
    sources: [
      { org: "AAD", reference: "Skin Changes in Pregnancy" },
      { org: "ACOG", reference: "Physical Changes" }
    ],
    actionableAdvice: "This normal skin change fades postpartum; sun protection can help minimize it."
  },
  {
    id: "w22-1",
    week: 22,
    category: "Nutrition",
    region: "Western",
    myth: "You can eat as much sugar as you want if you don't have gestational diabetes.",
    beliefReason: "Belief that only diabetics need to watch sugar.",
    medicalFact: "Excessive sugar can contribute to excessive weight gain and other issues.",
    riskLevel: "Medium",
    medicalGuidance: "Maintain balanced sugar intake regardless of diabetes status.",
    sources: [
      { org: "ACOG", reference: "Weight Gain During Pregnancy" },
      { org: "WHO", reference: "Sugar Guidelines" }
    ],
    actionableAdvice: "Enjoy sweets in moderation; focus on nutrient-dense foods for energy."
  },
  {
    id: "w22-2",
    week: 22,
    category: "Activity",
    region: "South Asia",
    myth: "Eclipses during pregnancy will cause birth defects.",
    beliefReason: "Ancient superstitions about celestial events and babies.",
    medicalFact: "Eclipses have no effect on pregnancy or fetal development.",
    riskLevel: "Low",
    medicalGuidance: "Continue normal activities during eclipses.",
    sources: [
      { org: "NASA", reference: "Eclipse Safety" },
      { org: "ACOG", reference: "Environmental Factors" }
    ],
    actionableAdvice: "Enjoy eclipses safely with proper eye protection like anyone else."
  },
  {
    id: "w22-3",
    week: 22,
    category: "Emotions",
    region: "Global",
    myth: "Pregnancy brain is just an excuse for forgetfulness.",
    beliefReason: "Skepticism about pregnancy-related cognitive changes.",
    medicalFact: "Studies confirm pregnancy affects memory and concentration due to hormonal changes.",
    riskLevel: "Low",
    medicalGuidance: "'Pregnancy brain' is real but temporary.",
    sources: [
      { org: "NIH", reference: "Cognitive Changes in Pregnancy" },
      { org: "BMJ", reference: "Pregnancy and Memory Studies" }
    ],
    actionableAdvice: "Use lists, reminders, and calendars; cognitive function typically returns postpartum."
  },
  {
    id: "w23-1",
    week: 23,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating lamb will make the baby prone to seizures.",
    beliefReason: "Traditional association based on folklore.",
    medicalFact: "Well-cooked lamb is nutritious and safe during pregnancy.",
    riskLevel: "Low",
    medicalGuidance: "Enjoy well-cooked lamb as a protein source.",
    sources: [
      { org: "FDA", reference: "Meat Safety in Pregnancy" },
      { org: "ACOG", reference: "Protein Requirements" }
    ],
    actionableAdvice: "Ensure all meat is cooked to proper temperature; lamb is a good iron source."
  },
  {
    id: "w23-2",
    week: 23,
    category: "Labor",
    region: "Global",
    myth: "Viability means the baby would be fine if born now.",
    beliefReason: "Media coverage of miracle preemies.",
    medicalFact: "While survival is possible at 23 weeks, babies face significant challenges and risks.",
    riskLevel: "Medium",
    medicalGuidance: "Each additional week in utero significantly improves outcomes.",
    sources: [
      { org: "ACOG", reference: "Periviable Birth" },
      { org: "WHO", reference: "Preterm Birth" }
    ],
    actionableAdvice: "Continue prenatal care; every day in the womb matters for baby's development."
  },
  {
    id: "w23-3",
    week: 23,
    category: "Sleep/Posture",
    region: "Western",
    myth: "You need a pregnancy pillow to sleep comfortably.",
    beliefReason: "Marketing of pregnancy products.",
    medicalFact: "Regular pillows work fine; pregnancy pillows are optional comfort items.",
    riskLevel: "Low",
    medicalGuidance: "Use whatever pillow arrangement helps you sleep comfortably.",
    sources: [
      { org: "ACOG", reference: "Sleep During Pregnancy" },
      { org: "NHS", reference: "Sleeping Well" }
    ],
    actionableAdvice: "Try pillows between knees and under belly; buy special pillows only if needed."
  },
  {
    id: "w24-1",
    week: 24,
    category: "Nutrition",
    region: "South Asia",
    myth: "Avoiding eggs will prevent allergies in the baby.",
    beliefReason: "Fear of passing allergens to baby.",
    medicalFact: "Eating eggs during pregnancy doesn't cause allergies and may even reduce risk.",
    riskLevel: "Low",
    medicalGuidance: "Eggs are excellent protein; eat them unless you have an allergy.",
    sources: [
      { org: "ACOG", reference: "Nutrition and Allergies" },
      { org: "AAP", reference: "Allergy Prevention" }
    ],
    actionableAdvice: "Well-cooked eggs are safe and nutritious; they provide choline for brain development."
  },
  {
    id: "w24-2",
    week: 24,
    category: "Activity",
    region: "Global",
    myth: "You should stop all exercise if you feel Braxton Hicks contractions.",
    beliefReason: "Concern that activity causes contractions.",
    medicalFact: "Braxton Hicks are normal; mild exercise is usually fine.",
    riskLevel: "Low",
    medicalGuidance: "Stop if contractions become regular, painful, or don't resolve with rest.",
    sources: [
      { org: "ACOG", reference: "Braxton Hicks vs Labor" },
      { org: "NHS", reference: "Braxton Hicks Contractions" }
    ],
    actionableAdvice: "Hydrate and change positions; contact provider if contractions become regular."
  },
  {
    id: "w24-3",
    week: 24,
    category: "Body Changes",
    region: "Middle East",
    myth: "Round belly means a girl; pointy belly means a boy.",
    beliefReason: "Traditional belly shape gender prediction.",
    medicalFact: "Belly shape depends on your body, muscle tone, and baby's position.",
    riskLevel: "Low",
    medicalGuidance: "Belly shape indicates nothing about baby's sex.",
    sources: [
      { org: "ACOG", reference: "Pregnancy Myths" },
      { org: "BMJ", reference: "Gender Prediction Methods" }
    ],
    actionableAdvice: "Your bump is unique to you; it changes shape as baby moves and grows."
  },
  {
    id: "w25-1",
    week: 25,
    category: "Nutrition",
    region: "Global",
    myth: "You should stop taking prenatal vitamins after first trimester.",
    beliefReason: "Belief that vitamins are only needed early.",
    medicalFact: "Prenatal vitamins should be taken throughout pregnancy and breastfeeding.",
    riskLevel: "Medium",
    medicalGuidance: "Continue prenatal vitamins; iron and DHA are especially important now.",
    sources: [
      { org: "ACOG", reference: "Prenatal Vitamin Guidelines" },
      { org: "WHO", reference: "Micronutrient Supplementation" }
    ],
    actionableAdvice: "Take prenatal vitamins throughout pregnancy; they support ongoing development."
  },
  {
    id: "w25-2",
    week: 25,
    category: "Activity",
    region: "Western",
    myth: "Swimming will cause water to enter the uterus.",
    beliefReason: "Misunderstanding of anatomy.",
    medicalFact: "The cervix and mucus plug prevent water from entering the uterus.",
    riskLevel: "Low",
    medicalGuidance: "Swimming is one of the best exercises during pregnancy.",
    sources: [
      { org: "ACOG", reference: "Exercise During Pregnancy" },
      { org: "NHS", reference: "Swimming in Pregnancy" }
    ],
    actionableAdvice: "Swimming relieves pressure, reduces swelling, and is gentle on joints."
  },
  {
    id: "w25-3",
    week: 25,
    category: "Emotions",
    region: "South Asia",
    myth: "Reading religious texts will make the baby pious.",
    beliefReason: "Belief in prenatal spiritual influence.",
    medicalFact: "Reading to baby promotes bonding; content doesn't determine personality.",
    riskLevel: "Low",
    medicalGuidance: "Read whatever brings you peace and joy.",
    sources: [
      { org: "AAP", reference: "Prenatal Bonding" },
      { org: "NIH", reference: "Fetal Learning" }
    ],
    actionableAdvice: "Reading aloud helps baby recognize your voice; content is your choice."
  },
  {
    id: "w26-1",
    week: 26,
    category: "Nutrition",
    region: "East Asia",
    myth: "Drinking too much water will cause fluid retention.",
    beliefReason: "Logical but incorrect assumption about fluids.",
    medicalFact: "Adequate water intake actually helps reduce swelling; dehydration worsens it.",
    riskLevel: "Low",
    medicalGuidance: "Drink 8-12 cups of water daily to support pregnancy.",
    sources: [
      { org: "ACOG", reference: "Hydration During Pregnancy" },
      { org: "NHS", reference: "Water and Pregnancy" }
    ],
    actionableAdvice: "Stay well-hydrated; water helps maintain amniotic fluid and reduces swelling."
  },
  {
    id: "w26-2",
    week: 26,
    category: "Activity",
    region: "Global",
    myth: "You can't travel by car in third trimester.",
    beliefReason: "Concern about seatbelts and long journeys.",
    medicalFact: "Car travel is fine; wear seatbelt correctly and take breaks every 1-2 hours.",
    riskLevel: "Low",
    medicalGuidance: "Position lap belt under belly, shoulder belt between breasts.",
    sources: [
      { org: "ACOG", reference: "Car Safety During Pregnancy" },
      { org: "NHTSA", reference: "Seatbelt Use in Pregnancy" }
    ],
    actionableAdvice: "Stop every 1-2 hours to walk; keep emergency numbers handy for long trips."
  },
  {
    id: "w26-3",
    week: 26,
    category: "Labor",
    region: "Western",
    myth: "The glucose test will hurt the baby.",
    beliefReason: "Concern about sugar effects.",
    medicalFact: "The glucose screening is safe and important for detecting gestational diabetes.",
    riskLevel: "Low",
    medicalGuidance: "Complete the glucose screening; early detection protects you and baby.",
    sources: [
      { org: "ACOG", reference: "Gestational Diabetes Screening" },
      { org: "WHO", reference: "Diabetes in Pregnancy" }
    ],
    actionableAdvice: "The sweet drink is temporary; this test helps keep you and baby healthy."
  },
  {
    id: "w27-1",
    week: 27,
    category: "Nutrition",
    region: "South Asia",
    myth: "Eating fish will make the baby mute or cause speech delays.",
    beliefReason: "Fish don't make sounds, leading to superstitious association.",
    medicalFact: "Low-mercury fish supports brain development including speech centers.",
    riskLevel: "Low",
    medicalGuidance: "Eat low-mercury fish 2-3 times weekly for DHA benefits.",
    sources: [
      { org: "FDA", reference: "Fish Consumption Guidelines" },
      { org: "NIH", reference: "Omega-3 and Brain Development" }
    ],
    actionableAdvice: "Salmon, sardines, and tilapia support your baby's brain development."
  },
  {
    id: "w27-2",
    week: 27,
    category: "Activity",
    region: "Middle East",
    myth: "Walking too much will cause early labor.",
    beliefReason: "Movement is thought to trigger contractions.",
    medicalFact: "Walking is beneficial and doesn't cause preterm labor in normal pregnancies.",
    riskLevel: "Low",
    medicalGuidance: "Continue moderate walking unless advised otherwise.",
    sources: [
      { org: "ACOG", reference: "Physical Activity Guidelines" },
      { org: "WHO", reference: "Physical Activity in Pregnancy" }
    ],
    actionableAdvice: "Walking improves circulation, reduces swelling, and may help prepare for labor."
  },
  {
    id: "w27-3",
    week: 27,
    category: "Body Changes",
    region: "Global",
    myth: "Third trimester weight gain is mostly baby weight.",
    beliefReason: "Focus on baby's growth in final trimester.",
    medicalFact: "Weight gain includes baby, placenta, amniotic fluid, blood volume, and maternal stores.",
    riskLevel: "Low",
    medicalGuidance: "Healthy third trimester gain is about 1 pound per week.",
    sources: [
      { org: "ACOG", reference: "Weight Gain During Pregnancy" },
      { org: "IOM", reference: "Gestational Weight Gain" }
    ],
    actionableAdvice: "Track weight gain; about 25-35 lbs total is typical for normal BMI."
  },
  {
    id: "w28-1",
    week: 28,
    category: "Nutrition",
    region: "Global",
    myth: "Eating chocolate is bad for pregnant women.",
    beliefReason: "Concern about caffeine and sugar in chocolate.",
    medicalFact: "Dark chocolate in moderation may have benefits; excessive amounts should be avoided.",
    riskLevel: "Low",
    medicalGuidance: "Enjoy chocolate in moderation; be mindful of caffeine content.",
    sources: [
      { org: "ACOG", reference: "Caffeine Consumption" },
      { org: "Yale", reference: "Chocolate and Pregnancy Study" }
    ],
    actionableAdvice: "A small amount of dark chocolate can be a healthy treat; count caffeine intake."
  },
  {
    id: "w28-2",
    week: 28,
    category: "Sleep/Posture",
    region: "Western",
    myth: "You must sleep exclusively on your left side now.",
    beliefReason: "Left side is optimal for blood flow.",
    medicalFact: "Left side is best, but switching sides throughout night is fine.",
    riskLevel: "Low",
    medicalGuidance: "Avoid prolonged back sleeping; either side is acceptable.",
    sources: [
      { org: "ACOG", reference: "Sleep Positions" },
      { org: "Lancet", reference: "Sleep Position Study" }
    ],
    actionableAdvice: "Don't stress about perfect positioning; any side sleeping is beneficial."
  },
  {
    id: "w28-3",
    week: 28,
    category: "Labor",
    region: "South Asia",
    myth: "The baby will be born on the exact due date.",
    beliefReason: "Due date is given as a specific date.",
    medicalFact: "Only 5% of babies are born on their due date; normal range is 37-42 weeks.",
    riskLevel: "Low",
    medicalGuidance: "Think of due date as the middle of a window, not exact date.",
    sources: [
      { org: "ACOG", reference: "Estimated Due Date" },
      { org: "WHO", reference: "Term Pregnancy" }
    ],
    actionableAdvice: "Be prepared anytime from 37 weeks; most babies arrive within 2 weeks of due date."
  },
  {
    id: "w29-1",
    week: 29,
    category: "Nutrition",
    region: "East Asia",
    myth: "Cold drinks will make the baby catch cold after birth.",
    beliefReason: "Traditional beliefs about 'cold' entering the body.",
    medicalFact: "Temperature of beverages doesn't affect baby's health or immunity.",
    riskLevel: "Low",
    medicalGuidance: "Drink beverages at any temperature you prefer.",
    sources: [
      { org: "ACOG", reference: "Nutrition Guidelines" },
      { org: "AAP", reference: "Newborn Health" }
    ],
    actionableAdvice: "Stay hydrated with whatever temperature drinks are appealing."
  },
  {
    id: "w29-2",
    week: 29,
    category: "Activity",
    region: "Global",
    myth: "You should start avoiding stairs in third trimester.",
    beliefReason: "Fear of falls or triggering labor.",
    medicalFact: "Stairs are fine unless you have balance issues or specific restrictions.",
    riskLevel: "Low",
    medicalGuidance: "Use handrails and take your time; stairs are generally safe.",
    sources: [
      { org: "ACOG", reference: "Physical Activity" },
      { org: "NHS", reference: "Staying Active" }
    ],
    actionableAdvice: "Hold handrails and go slowly; climbing stairs is good exercise."
  },
  {
    id: "w29-3",
    week: 29,
    category: "Emotions",
    region: "Western",
    myth: "Feeling nervous about labor means you're not ready to be a mother.",
    beliefReason: "Idealized notion that mothers should feel only confidence.",
    medicalFact: "Anxiety about labor is completely normal and doesn't reflect parenting ability.",
    riskLevel: "Low",
    medicalGuidance: "Take childbirth classes to increase knowledge and reduce anxiety.",
    sources: [
      { org: "ACOG", reference: "Preparing for Childbirth" },
      { org: "RCOG", reference: "Birth Anxiety" }
    ],
    actionableAdvice: "Education and birth plans can help reduce anxiety; talk to your provider."
  },
  {
    id: "w30-1",
    week: 30,
    category: "Nutrition",
    region: "South Asia",
    myth: "You should eat for three now that baby is bigger.",
    beliefReason: "Baby's rapid growth suggests more calories needed.",
    medicalFact: "Third trimester needs only about 450 extra calories daily.",
    riskLevel: "Low",
    medicalGuidance: "Focus on nutrient-dense foods rather than quantity.",
    sources: [
      { org: "ACOG", reference: "Calorie Needs in Pregnancy" },
      { org: "WHO", reference: "Nutrition Guidelines" }
    ],
    actionableAdvice: "Choose protein, whole grains, and vegetables over empty calories."
  },
  {
    id: "w30-2",
    week: 30,
    category: "Activity",
    region: "Middle East",
    myth: "Sitting with legs crossed will cause the cord to wrap around baby.",
    beliefReason: "Visual connection between crossed legs and tangled cord.",
    medicalFact: "Your sitting position cannot affect the umbilical cord.",
    riskLevel: "Low",
    medicalGuidance: "Sit however is comfortable; change positions to prevent circulation issues.",
    sources: [
      { org: "ACOG", reference: "Umbilical Cord" },
      { org: "NHS", reference: "Pregnancy Comfort" }
    ],
    actionableAdvice: "Change positions often for circulation; crossing legs briefly is fine."
  },
  {
    id: "w30-3",
    week: 30,
    category: "Gender Myths",
    region: "Global",
    myth: "If you're moody, you're having a girl; calm means a boy.",
    beliefReason: "Stereotyped association of emotions with females.",
    medicalFact: "Mood changes are caused by hormones, not baby's sex.",
    riskLevel: "Low",
    medicalGuidance: "All pregnant women experience mood variations regardless of baby's sex.",
    sources: [
      { org: "ACOG", reference: "Mood Changes in Pregnancy" },
      { org: "BMJ", reference: "Hormones and Emotions" }
    ],
    actionableAdvice: "Manage mood changes with support and self-care; they're unrelated to sex."
  },
  {
    id: "w31-1",
    week: 31,
    category: "Nutrition",
    region: "Global",
    myth: "Spicy food in late pregnancy will induce labor.",
    beliefReason: "Some women try this as a natural induction method.",
    medicalFact: "No evidence that spicy food triggers labor; it may cause heartburn.",
    riskLevel: "Low",
    medicalGuidance: "Eat spicy food if you enjoy it; it won't start labor.",
    sources: [
      { org: "ACOG", reference: "Natural Induction Methods" },
      { org: "Cochrane", reference: "Labor Induction Studies" }
    ],
    actionableAdvice: "If spicy food causes discomfort, avoid it; it won't affect when baby comes."
  },
  {
    id: "w31-2",
    week: 31,
    category: "Activity",
    region: "Western",
    myth: "You should start bed rest to prevent preterm birth.",
    beliefReason: "Historical recommendation that has been disproven.",
    medicalFact: "Bed rest doesn't prevent preterm birth and can have negative effects.",
    riskLevel: "Medium",
    medicalGuidance: "Maintain normal activity unless specifically advised by your doctor.",
    sources: [
      { org: "ACOG", reference: "Bed Rest Guidelines" },
      { org: "Cochrane", reference: "Bed Rest for Preterm Prevention" }
    ],
    actionableAdvice: "Stay active unless your provider gives specific restrictions."
  },
  {
    id: "w31-3",
    week: 31,
    category: "Labor",
    region: "South Asia",
    myth: "If the baby hasn't dropped by now, labor won't happen naturally.",
    beliefReason: "Engagement is expected at certain times.",
    medicalFact: "First babies often don't drop until labor begins; subsequent babies may never drop until labor.",
    riskLevel: "Low",
    medicalGuidance: "Baby dropping isn't a reliable predictor of labor timing.",
    sources: [
      { org: "ACOG", reference: "Signs of Labor" },
      { org: "NHS", reference: "Baby Engagement" }
    ],
    actionableAdvice: "Don't worry if baby hasn't dropped; it's not required before labor."
  },
  {
    id: "w32-1",
    week: 32,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating too much will make the baby too big for vaginal delivery.",
    beliefReason: "Large babies are associated with difficult births.",
    medicalFact: "Genetics plays a larger role in baby size than maternal diet.",
    riskLevel: "Low",
    medicalGuidance: "Eat balanced meals; excessive weight gain should be monitored.",
    sources: [
      { org: "ACOG", reference: "Macrosomia" },
      { org: "WHO", reference: "Birth Weight Factors" }
    ],
    actionableAdvice: "Maintain healthy eating patterns; most babies are appropriate size for birth."
  },
  {
    id: "w32-2",
    week: 32,
    category: "Activity",
    region: "Global",
    myth: "You should install the car seat now and not drive anymore.",
    beliefReason: "Extreme precaution in late pregnancy.",
    medicalFact: "You can safely drive until labor unless uncomfortable or restricted.",
    riskLevel: "Low",
    medicalGuidance: "Have car seat installed by 37 weeks; driving is fine until delivery.",
    sources: [
      { org: "NHTSA", reference: "Pregnant Driver Safety" },
      { org: "AAP", reference: "Car Seat Guidelines" }
    ],
    actionableAdvice: "Get car seat installed and inspected; continue driving if comfortable."
  },
  {
    id: "w32-3",
    week: 32,
    category: "Body Changes",
    region: "Western",
    myth: "Braxton Hicks contractions mean you're going into labor soon.",
    beliefReason: "Contractions are associated with labor.",
    medicalFact: "Braxton Hicks can occur for weeks before labor; they're not predictive.",
    riskLevel: "Low",
    medicalGuidance: "Practice contractions are normal; true labor contractions are regular and intensify.",
    sources: [
      { org: "ACOG", reference: "Braxton Hicks Contractions" },
      { org: "NHS", reference: "Recognizing Labor" }
    ],
    actionableAdvice: "Time contractions; call provider if they become regular and don't stop with rest."
  },
  {
    id: "w33-1",
    week: 33,
    category: "Nutrition",
    region: "South Asia",
    myth: "Drinking castor oil will safely induce labor.",
    beliefReason: "Traditional method passed down through generations.",
    medicalFact: "Castor oil can cause severe diarrhea and dehydration; not recommended.",
    riskLevel: "High",
    medicalGuidance: "Never use castor oil without medical supervision; it can be dangerous.",
    sources: [
      { org: "ACOG", reference: "Labor Induction Methods" },
      { org: "Cochrane", reference: "Castor Oil for Induction" }
    ],
    actionableAdvice: "Let baby come naturally; discuss safe induction options with your provider."
  },
  {
    id: "w33-2",
    week: 33,
    category: "Activity",
    region: "Global",
    myth: "Squatting will cause the baby to fall out.",
    beliefReason: "Fear of gravity affecting baby.",
    medicalFact: "Squatting is a beneficial position that can help prepare for birth.",
    riskLevel: "Low",
    medicalGuidance: "Squatting exercises are safe and can help open the pelvis.",
    sources: [
      { org: "ACOG", reference: "Exercises for Labor Preparation" },
      { org: "NHS", reference: "Preparing for Birth" }
    ],
    actionableAdvice: "Practice supported squats to strengthen legs and prepare for birth positions."
  },
  {
    id: "w33-3",
    week: 33,
    category: "Labor",
    region: "Western",
    myth: "If baby is breech at 33 weeks, you'll need a C-section.",
    beliefReason: "Breech position is associated with cesarean delivery.",
    medicalFact: "Many babies turn head-down before labor; there's still time.",
    riskLevel: "Low",
    medicalGuidance: "Most babies turn by 36 weeks; discuss options if baby stays breech.",
    sources: [
      { org: "ACOG", reference: "Breech Presentation" },
      { org: "RCOG", reference: "External Cephalic Version" }
    ],
    actionableAdvice: "Try positions that encourage turning; discuss ECV if baby doesn't turn."
  },
  {
    id: "w34-1",
    week: 34,
    category: "Nutrition",
    region: "Middle East",
    myth: "Eating dates now will ensure labor starts on time.",
    beliefReason: "Traditional recommendation for date consumption in late pregnancy.",
    medicalFact: "Some studies show dates may help ripen cervix; they don't guarantee timing.",
    riskLevel: "Low",
    medicalGuidance: "Dates are nutritious and may have benefits; eat if you enjoy them.",
    sources: [
      { org: "Journal of Midwifery", reference: "Date Fruit and Labor" },
      { org: "ACOG", reference: "Preparing for Labor" }
    ],
    actionableAdvice: "6 dates daily from 36 weeks may help; they're a healthy snack regardless."
  },
  {
    id: "w34-2",
    week: 34,
    category: "Activity",
    region: "East Asia",
    myth: "Cleaning the house means baby is coming within days.",
    beliefReason: "Nesting instinct is associated with imminent labor.",
    medicalFact: "Nesting can happen weeks before delivery; it's not predictive of timing.",
    riskLevel: "Low",
    medicalGuidance: "Nesting is normal; avoid overexertion and heavy lifting.",
    sources: [
      { org: "ACOG", reference: "Signs of Labor" },
      { org: "NIH", reference: "Nesting Behavior" }
    ],
    actionableAdvice: "Enjoy nesting but pace yourself; get help for physical tasks."
  },
  {
    id: "w34-3",
    week: 34,
    category: "Body Changes",
    region: "Global",
    myth: "Swollen feet means something is wrong.",
    beliefReason: "Swelling can be a sign of preeclampsia.",
    medicalFact: "Some foot swelling is normal; sudden severe swelling needs evaluation.",
    riskLevel: "Medium",
    medicalGuidance: "Normal swelling improves with elevation; sudden swelling needs medical attention.",
    sources: [
      { org: "ACOG", reference: "Edema in Pregnancy" },
      { org: "NHS", reference: "Swelling in Pregnancy" }
    ],
    actionableAdvice: "Elevate feet, stay hydrated; report sudden facial swelling or severe headache."
  },
  {
    id: "w35-1",
    week: 35,
    category: "Nutrition",
    region: "Global",
    myth: "You should stop eating to have a smaller baby and easier delivery.",
    beliefReason: "Desire for easier birth leads to dangerous ideas.",
    medicalFact: "Restricting food is dangerous and doesn't significantly affect baby size.",
    riskLevel: "High",
    medicalGuidance: "Continue eating nutritiously; baby needs nutrients for final development.",
    sources: [
      { org: "ACOG", reference: "Nutrition in Late Pregnancy" },
      { org: "WHO", reference: "Maternal Nutrition" }
    ],
    actionableAdvice: "Eat regular balanced meals; baby's brain is rapidly developing now."
  },
  {
    id: "w35-2",
    week: 35,
    category: "Labor",
    region: "South Asia",
    myth: "Full moon will trigger your labor.",
    beliefReason: "Ancient beliefs about lunar effects on birth.",
    medicalFact: "Multiple studies show no correlation between moon phases and birth rates.",
    riskLevel: "Low",
    medicalGuidance: "Labor timing is unrelated to lunar cycles.",
    sources: [
      { org: "ACOG", reference: "Labor Onset" },
      { org: "BMJ", reference: "Moon Phase and Birth Study" }
    ],
    actionableAdvice: "Baby will come when ready; moon phase doesn't influence labor."
  },
  {
    id: "w35-3",
    week: 35,
    category: "Activity",
    region: "Western",
    myth: "Sex in late pregnancy will definitely induce labor.",
    beliefReason: "Prostaglandins in semen may soften cervix.",
    medicalFact: "Sex may help if body is ready but won't induce labor in an unripe cervix.",
    riskLevel: "Low",
    medicalGuidance: "Sex is safe unless you have placenta previa or other restrictions.",
    sources: [
      { org: "ACOG", reference: "Sex and Labor Induction" },
      { org: "Cochrane", reference: "Sexual Intercourse for Induction" }
    ],
    actionableAdvice: "Intimacy can be enjoyable but don't rely on it to start labor."
  },
  {
    id: "w36-1",
    week: 36,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating white foods will help with milk production.",
    beliefReason: "Color association between white foods and breast milk.",
    medicalFact: "Milk production is stimulated by baby's feeding, not food color.",
    riskLevel: "Low",
    medicalGuidance: "Stay well-nourished and hydrated; food color doesn't affect milk.",
    sources: [
      { org: "AAP", reference: "Breastfeeding Guidelines" },
      { org: "WHO", reference: "Breastfeeding Nutrition" }
    ],
    actionableAdvice: "Eat a varied diet; frequent nursing establishes milk supply."
  },
  {
    id: "w36-2",
    week: 36,
    category: "Labor",
    region: "Global",
    myth: "Group B Strep positive means you'll have a difficult delivery.",
    beliefReason: "Concern about any positive test result.",
    medicalFact: "GBS is common and easily managed with antibiotics during labor.",
    riskLevel: "Low",
    medicalGuidance: "GBS positive simply means IV antibiotics during labor; delivery is unaffected.",
    sources: [
      { org: "ACOG", reference: "Group B Streptococcus" },
      { org: "CDC", reference: "GBS Prevention" }
    ],
    actionableAdvice: "Arrive at hospital promptly in labor to allow time for antibiotics."
  },
  {
    id: "w36-3",
    week: 36,
    category: "Body Changes",
    region: "South Asia",
    myth: "Your pelvis is too small for vaginal birth because of your body size.",
    beliefReason: "Visual assessment of body proportions.",
    medicalFact: "Pelvis size can't be determined by looking; most women can birth vaginally.",
    riskLevel: "Low",
    medicalGuidance: "True cephalopelvic disproportion is rare and diagnosed during labor.",
    sources: [
      { org: "ACOG", reference: "Cephalopelvic Disproportion" },
      { org: "RCOG", reference: "Vaginal Birth" }
    ],
    actionableAdvice: "Body size doesn't predict birth ability; position and movement help."
  },
  {
    id: "w37-1",
    week: 37,
    category: "Nutrition",
    region: "Global",
    myth: "Raspberry leaf tea will guarantee easier labor.",
    beliefReason: "Traditional remedy for labor preparation.",
    medicalFact: "Some evidence suggests it may help tone uterus; results are not guaranteed.",
    riskLevel: "Low",
    medicalGuidance: "Can start raspberry leaf tea now if desired; don't expect miracles.",
    sources: [
      { org: "Cochrane", reference: "Raspberry Leaf for Labor" },
      { org: "Journal of Midwifery", reference: "Herbal Preparations" }
    ],
    actionableAdvice: "Try if interested; check with provider about appropriate amounts."
  },
  {
    id: "w37-2",
    week: 37,
    category: "Labor",
    region: "Western",
    myth: "If water breaks, baby must be born within 24 hours.",
    beliefReason: "Historical medical practice.",
    medicalFact: "Timing depends on many factors; monitoring determines appropriate approach.",
    riskLevel: "Medium",
    medicalGuidance: "Contact provider when water breaks; they'll guide timing decisions.",
    sources: [
      { org: "ACOG", reference: "Premature Rupture of Membranes" },
      { org: "NICE", reference: "Intrapartum Care" }
    ],
    actionableAdvice: "Note time, color, and amount when water breaks; call provider promptly."
  },
  {
    id: "w37-3",
    week: 37,
    category: "Activity",
    region: "Middle East",
    myth: "Walking a lot will make labor start.",
    beliefReason: "Movement is thought to bring on contractions.",
    medicalFact: "Walking is healthy but won't induce labor until body is ready.",
    riskLevel: "Low",
    medicalGuidance: "Continue walking for fitness; it won't force labor to start.",
    sources: [
      { org: "ACOG", reference: "Natural Induction" },
      { org: "Cochrane", reference: "Exercise for Labor Induction" }
    ],
    actionableAdvice: "Walk for comfort and preparation; baby comes when ready."
  },
  {
    id: "w38-1",
    week: 38,
    category: "Nutrition",
    region: "South Asia",
    myth: "Eating ghee will make baby slip out easier.",
    beliefReason: "Traditional belief about lubrication.",
    medicalFact: "Internal lubrication during birth is natural; ghee doesn't affect it.",
    riskLevel: "Low",
    medicalGuidance: "Ghee is fine in moderation; it won't affect delivery.",
    sources: [
      { org: "ACOG", reference: "Labor and Delivery" },
      { org: "WHO", reference: "Birthing Practices" }
    ],
    actionableAdvice: "Eat normally; body produces natural lubrication for birth."
  },
  {
    id: "w38-2",
    week: 38,
    category: "Labor",
    region: "Global",
    myth: "Stripping membranes always starts labor.",
    beliefReason: "It's offered as an induction method.",
    medicalFact: "Membrane sweeping may help if cervix is favorable; it doesn't always work.",
    riskLevel: "Low",
    medicalGuidance: "Discuss pros and cons with your provider; it's optional.",
    sources: [
      { org: "ACOG", reference: "Membrane Sweeping" },
      { org: "Cochrane", reference: "Membrane Stripping Review" }
    ],
    actionableAdvice: "Can be uncomfortable; may help bring on labor if body is ready."
  },
  {
    id: "w38-3",
    week: 38,
    category: "Body Changes",
    region: "Western",
    myth: "Losing mucus plug means labor will start within hours.",
    beliefReason: "Mucus plug loss is considered a labor sign.",
    medicalFact: "Mucus plug can regenerate; labor may be days or weeks away.",
    riskLevel: "Low",
    medicalGuidance: "Note when it happens but don't rush to hospital unless other signs present.",
    sources: [
      { org: "ACOG", reference: "Signs of Labor" },
      { org: "NHS", reference: "Show and Labor" }
    ],
    actionableAdvice: "Mucus plug loss is positive but not urgent; wait for regular contractions."
  },
  {
    id: "w39-1",
    week: 39,
    category: "Nutrition",
    region: "East Asia",
    myth: "Eating pineapple now will definitely start labor.",
    beliefReason: "Bromelain in pineapple is thought to soften cervix.",
    medicalFact: "Amount of bromelain in pineapple is too small to affect cervix.",
    riskLevel: "Low",
    medicalGuidance: "Enjoy pineapple if you like it; don't expect it to start labor.",
    sources: [
      { org: "ACOG", reference: "Natural Induction Methods" },
      { org: "Journal of Midwifery", reference: "Pineapple and Labor" }
    ],
    actionableAdvice: "Pineapple is nutritious but won't induce labor."
  },
  {
    id: "w39-2",
    week: 39,
    category: "Labor",
    region: "Global",
    myth: "First babies are always late.",
    beliefReason: "Statistical trend that became generalized.",
    medicalFact: "While first babies average slightly later, many arrive on time or early.",
    riskLevel: "Low",
    medicalGuidance: "Be ready from 37 weeks; don't assume lateness.",
    sources: [
      { org: "ACOG", reference: "Labor Timing" },
      { org: "BMJ", reference: "First Baby Timing Studies" }
    ],
    actionableAdvice: "Have bag packed and plans ready; baby may surprise you."
  },
  {
    id: "w39-3",
    week: 39,
    category: "Activity",
    region: "South Asia",
    myth: "Nipple stimulation will safely induce labor.",
    beliefReason: "Oxytocin release from nipple stimulation.",
    medicalFact: "Can trigger contractions but should only be done under medical guidance.",
    riskLevel: "Medium",
    medicalGuidance: "Discuss with provider before trying; can cause overly strong contractions.",
    sources: [
      { org: "ACOG", reference: "Nipple Stimulation for Induction" },
      { org: "Cochrane", reference: "Breast Stimulation for Induction" }
    ],
    actionableAdvice: "Only try under provider guidance; requires monitoring."
  },
  {
    id: "w40-1",
    week: 40,
    category: "Nutrition",
    region: "Global",
    myth: "You should fast before labor to avoid complications.",
    beliefReason: "Old practice based on anesthesia concerns.",
    medicalFact: "Light eating during early labor is now encouraged for energy.",
    riskLevel: "Medium",
    medicalGuidance: "Eat light, easily digestible foods in early labor.",
    sources: [
      { org: "ACOG", reference: "Oral Intake During Labor" },
      { org: "NICE", reference: "Eating in Labor" }
    ],
    actionableAdvice: "Eat light snacks and drink fluids in early labor; follow hospital guidelines."
  },
  {
    id: "w40-2",
    week: 40,
    category: "Labor",
    region: "Western",
    myth: "Induced labor is more painful than natural labor.",
    beliefReason: "Stories of intense induced contractions.",
    medicalFact: "Pain is individual; induction can be managed with same pain relief options.",
    riskLevel: "Low",
    medicalGuidance: "Discuss pain management options regardless of how labor starts.",
    sources: [
      { org: "ACOG", reference: "Labor Induction" },
      { org: "RCOG", reference: "Pain Relief in Labor" }
    ],
    actionableAdvice: "All pain relief options are available for induced labor; make a birth plan."
  },
  {
    id: "w40-3",
    week: 40,
    category: "Body Changes",
    region: "Middle East",
    myth: "Being past your due date means something is wrong.",
    beliefReason: "Due date feels definitive.",
    medicalFact: "Post-date pregnancies up to 42 weeks are monitored but often normal.",
    riskLevel: "Low",
    medicalGuidance: "Attend monitoring appointments; most babies arrive safely after 40 weeks.",
    sources: [
      { org: "ACOG", reference: "Post-Term Pregnancy" },
      { org: "WHO", reference: "Late Term Pregnancy" }
    ],
    actionableAdvice: "Keep appointments for monitoring; discuss induction timing with provider."
  },
  {
    id: "w41-1",
    week: 41,
    category: "Labor",
    region: "Global",
    myth: "You must be induced at 41 weeks.",
    beliefReason: "Common hospital policy.",
    medicalFact: "Induction between 41-42 weeks is often recommended; discuss options with provider.",
    riskLevel: "Medium",
    medicalGuidance: "Increased monitoring is important; induction timing is individualized.",
    sources: [
      { org: "ACOG", reference: "Post-Term Pregnancy Management" },
      { org: "Cochrane", reference: "Induction Timing" }
    ],
    actionableAdvice: "Discuss risks and benefits of waiting vs. induction with your provider."
  },
  {
    id: "w41-2",
    week: 41,
    category: "Activity",
    region: "South Asia",
    myth: "Climbing stairs will help bring on labor now.",
    beliefReason: "Physical exertion is thought to trigger labor.",
    medicalFact: "No evidence that stairs induce labor; continue normal safe activity.",
    riskLevel: "Low",
    medicalGuidance: "Stay active but don't overexert yourself.",
    sources: [
      { org: "ACOG", reference: "Physical Activity in Late Pregnancy" },
      { org: "NHS", reference: "Overdue Baby" }
    ],
    actionableAdvice: "Movement is good; don't exhaust yourself trying to start labor."
  },
  {
    id: "w41-3",
    week: 41,
    category: "Nutrition",
    region: "Western",
    myth: "Eating curries will start labor.",
    beliefReason: "Spicy food myths persist across cultures.",
    medicalFact: "Spicy food doesn't trigger labor; may cause heartburn.",
    riskLevel: "Low",
    medicalGuidance: "Eat what you enjoy; don't expect food to start labor.",
    sources: [
      { org: "ACOG", reference: "Natural Labor Induction" },
      { org: "BMJ", reference: "Food and Labor Onset" }
    ],
    actionableAdvice: "Stay comfortable and well-nourished while waiting for baby."
  },
  {
    id: "w42-1",
    week: 42,
    category: "Labor",
    region: "Global",
    myth: "Babies born after 42 weeks are always healthier because they're more developed.",
    beliefReason: "More time seems like more development.",
    medicalFact: "Post-term pregnancies have increased risks; 42+ weeks requires careful monitoring.",
    riskLevel: "High",
    medicalGuidance: "Induction is typically recommended by 42 weeks due to increased risks.",
    sources: [
      { org: "ACOG", reference: "Post-Term Pregnancy Risks" },
      { org: "WHO", reference: "Prolonged Pregnancy" }
    ],
    actionableAdvice: "Follow provider recommendations for delivery timing; monitoring is essential."
  },
  {
    id: "w42-2",
    week: 42,
    category: "Activity",
    region: "East Asia",
    myth: "Acupuncture will definitely induce labor.",
    beliefReason: "Traditional practice used for labor induction.",
    medicalFact: "Some evidence suggests acupuncture may help; results vary.",
    riskLevel: "Low",
    medicalGuidance: "Can be tried if interested; ensure practitioner is experienced with pregnancy.",
    sources: [
      { org: "Cochrane", reference: "Acupuncture for Labor Induction" },
      { org: "ACOG", reference: "Complementary Therapies" }
    ],
    actionableAdvice: "Worth trying if interested; medical induction may still be needed."
  },
    {
      id: "w42-3",
      week: 42,
      category: "Body Changes",
      region: "Western",
      myth: "Your body has failed if you haven't gone into labor naturally.",
      beliefReason: "Internalized pressure about 'natural' birth.",
      medicalFact: "Needing induction is not a failure; your body and baby's safety matter most.",
      riskLevel: "Low",
      medicalGuidance: "How labor starts doesn't define your birth experience or motherhood.",
      sources: [
        { org: "ACOG", reference: "Positive Birth Experience" },
        { org: "RCOG", reference: "Mental Health Around Birth" }
      ],
      actionableAdvice: "However baby arrives safely is a success; be kind to yourself."
    },
    {
      id: "w1-4",
      week: 1,
      category: "Emotions",
      region: "Global",
      myth: "You should feel an instant bond with your baby as soon as you find out you're pregnant.",
      beliefReason: "Cultural expectation of immediate maternal instinct.",
      medicalFact: "Bonding is a process that can take time. Feeling detached or simply surprised in the early weeks is very common.",
      riskLevel: "Low",
      medicalGuidance: "Give yourself time to adjust to the news; bonding often grows as the pregnancy progresses.",
      sources: [
        { org: "RCOG", reference: "Maternal Mental Health" },
        { org: "ACOG", reference: "Postpartum and Prenatal Bonding" }
      ],
      actionableAdvice: "Talk to your partner or a friend about your feelings; don't pressure yourself to feel a certain way."
    },
    {
      id: "w5-4",
      week: 5,
      category: "Sleep/Posture",
      region: "Global",
      myth: "Sleeping on your stomach will crush the tiny embryo.",
      beliefReason: "Fear that external pressure directly affects the uterus.",
      medicalFact: "In early pregnancy, the uterus is well-protected deep within the pelvis behind the pubic bone.",
      riskLevel: "Low",
      medicalGuidance: "Sleep in whatever position is comfortable for now; stomach sleeping is safe in the first trimester.",
      sources: [
        { org: "ACOG", reference: "Sleep Positions" },
        { org: "NHS", reference: "Sleeping in Pregnancy" }
      ],
      actionableAdvice: "Enjoy stomach sleeping while you still can; it will naturally become uncomfortable as you grow."
    },
    {
      id: "w10-4",
      week: 10,
      category: "Labor",
      region: "Global",
      myth: "If you've had a C-section before, you can never have a vaginal birth.",
      beliefReason: "Old medical adage 'once a C-section, always a C-section'.",
      medicalFact: "VBAC (Vaginal Birth After Cesarean) is a safe and successful option for many women.",
      riskLevel: "Low",
      medicalGuidance: "Discuss your history with your provider to see if you're a candidate for VBAC.",
      sources: [
        { org: "ACOG", reference: "Vaginal Birth After Cesarean" },
        { org: "NICE", reference: "CS and VBAC Guidelines" }
      ],
      actionableAdvice: "Research VBAC early if this is something you're interested in for your delivery."
    },
    {
      id: "w15-4",
      week: 15,
      category: "Gender Myths",
      region: "South Asia",
      myth: "If your nose gets wider during pregnancy, you are having a boy.",
      beliefReason: "Traditional association of facial changes with baby's sex.",
      medicalFact: "Nasal swelling (pregnancy rhinitis) is caused by increased blood flow and hormones, not baby's sex.",
      riskLevel: "Low",
      medicalGuidance: "Facial changes are normal due to fluid retention and hormones.",
      sources: [
        { org: "AAD", reference: "Pregnancy Skin and Face Changes" },
        { org: "ACOG", reference: "Normal Pregnancy Changes" }
      ],
      actionableAdvice: "Stay hydrated and use a saline spray if nasal congestion is bothersome."
    },
    {
      id: "w20-4",
      week: 20,
      category: "Emotions",
      region: "Global",
      myth: "Prenatal depression isn't real; it's just 'pregnancy hormones'.",
      beliefReason: "Dismissal of mental health issues as normal pregnancy symptoms.",
      medicalFact: "Prenatal depression is a clinical condition affecting 1 in 10 pregnant women.",
      riskLevel: "High",
      medicalGuidance: "Seek professional help if you feel persistently sad, anxious, or hopeless.",
      sources: [
        { org: "ACOG", reference: "Depression During Pregnancy" },
        { org: "WHO", reference: "Maternal Mental Health" }
      ],
      actionableAdvice: "Speak to your doctor if your mood affects your daily life or lasts more than two weeks."
    },
    {
      id: "w25-4",
      week: 25,
      category: "Sleep/Posture",
      region: "Western",
      myth: "Using an electric blanket will 'cook' the baby.",
      beliefReason: "Fear of electromagnetic fields and localized heat.",
      medicalFact: "Modern electric blankets used on low settings are safe, but avoid overheating your core temperature.",
      riskLevel: "Low",
      medicalGuidance: "Use on low setting to warm the bed, then turn off before sleeping.",
      sources: [
        { org: "ACOG", reference: "Hyperthermia in Pregnancy" },
        { org: "WHO", reference: "EMF and Health" }
      ],
      actionableAdvice: "Avoid direct contact for long periods; use as a bed warmer rather than keeping it on all night."
    },
    {
      id: "w30-4",
      week: 30,
      category: "Labor",
      region: "Global",
      myth: "Labor will be exactly like it is in the movies.",
      beliefReason: "Dramatic media portrayals showing water breaking suddenly and immediate intense labor.",
      medicalFact: "Labor usually starts slowly with mild contractions; water breaking first only happens in about 10-15% of cases.",
      riskLevel: "Low",
      medicalGuidance: "Understand the early stages of labor so you don't panic.",
      sources: [
        { org: "ACOG", reference: "How to Tell When Labor Begins" },
        { org: "NHS", reference: "Early Signs of Labor" }
      ],
      actionableAdvice: "Take a childbirth class to learn what to actually expect during the stages of labor."
    },
    {
      id: "w35-4",
      week: 35,
      category: "General",
      region: "Global",
      myth: "You should 'toughen up' your nipples for breastfeeding by rubbing them with a towel.",
      beliefReason: "Old advice aimed at preventing breastfeeding pain.",
      medicalFact: "Nipple toughening is unnecessary and can cause irritation or even trigger contractions.",
      riskLevel: "Low",
      medicalGuidance: "Your body naturally prepares for breastfeeding; focus on learning correct latch techniques.",
      sources: [
        { org: "AAP", reference: "Breastfeeding Preparation" },
        { org: "WHO", reference: "Breastfeeding Guidelines" }
      ],
      actionableAdvice: "Avoid aggressive nipple prep; instead, read about positioning and latching before baby arrives."
    },
    {
      id: "w40-4",
      week: 40,
      category: "Gender Myths",
      region: "Global",
      myth: "Boys always come late, girls come early.",
      beliefReason: "Gender-based timing folklore.",
      medicalFact: "There is no scientific evidence that baby's sex influences the timing of labor.",
      riskLevel: "Low",
      medicalGuidance: "Labor timing is determined by complex biological signals from the baby and mother.",
      sources: [
        { org: "ACOG", reference: "Factors Influencing Labor Onset" },
        { org: "BMJ", reference: "Fetal Sex and Gestational Age Study" }
      ],
      actionableAdvice: "Ignore timing myths; your baby will arrive when they are ready regardless of gender."
    },
    {
      id: "w2-4",
      week: 2,
      category: "General",
      region: "Global",
      myth: "You can tell you're pregnant the minute it happens.",
      beliefReason: "Belief in 'mother's intuition' at the moment of conception.",
      medicalFact: "Conception isn't felt; even implantation usually happens 6-12 days later without notice.",
      riskLevel: "Low",
      medicalGuidance: "Wait for a missed period or at least 12-14 days after ovulation to test.",
      sources: [
        { org: "ACOG", reference: "Early Pregnancy Signs" },
        { org: "NHS", reference: "Symptoms of Pregnancy" }
      ],
      actionableAdvice: "Don't stress over 'feeling' pregnant; your body needs time to build up hCG levels."
    },
    {
      id: "w7-4",
      week: 7,
      category: "Emotions",
      region: "Global",
      myth: "If you aren't happy 24/7, you'll have a miserable baby.",
      beliefReason: "Pressure to maintain a positive environment for the fetus.",
      medicalFact: "Occasional stress or sadness is a normal part of life and doesn't dictate baby's temperament.",
      riskLevel: "Low",
      medicalGuidance: "Healthy emotional processing is better than suppressing 'negative' feelings.",
      sources: [
        { org: "RCOG", reference: "Mental Wellbeing" },
        { org: "ACOG", reference: "Emotional Health in Pregnancy" }
      ],
      actionableAdvice: "Allow yourself to have bad days; it's a normal part of the hormonal transition."
    },
    {
      id: "w12-4",
      week: 12,
      category: "Sleep/Posture",
      region: "Global",
      myth: "You must buy a special mattress for pregnancy.",
      beliefReason: "Marketing of expensive specialized sleep products.",
      medicalFact: "Most women can sleep comfortably on their existing mattress with the help of a few pillows.",
      riskLevel: "Low",
      medicalGuidance: "Support is key; use pillows to support your back and hips as you grow.",
      sources: [
        { org: "ACOG", reference: "Sleep Hygiene" },
        { org: "NHS", reference: "Getting Comfortable" }
      ],
      actionableAdvice: "Save your money for baby essentials; standard pillows are usually sufficient for support."
    },
    {
      id: "w18-4",
      week: 18,
      category: "Labor",
      region: "Global",
      myth: "An epidural will definitely stall your labor.",
      beliefReason: "Common concern that pain relief stops the natural progression of birth.",
      medicalFact: "While an epidural can sometimes slow the second stage of labor (pushing), it doesn't significantly increase C-section rates.",
      riskLevel: "Low",
      medicalGuidance: "Modern epidurals are managed carefully to balance pain relief and labor progress.",
      sources: [
        { org: "ACOG", reference: "Analgesia and Labor Progress" },
        { org: "ASRM", reference: "Pain Management in Childbirth" }
      ],
      actionableAdvice: "Discuss pain management options with your provider during your third trimester."
    },
    {
      id: "w22-4",
      week: 22,
      category: "Gender Myths",
      region: "Western",
      myth: "The 'Ring on a String' test is a 100% accurate way to know the sex.",
      beliefReason: "Popular baby shower game that seems to 'work' by chance.",
      medicalFact: "The direction a ring swings is influenced by the person holding it (ideomotor effect), not the baby.",
      riskLevel: "Low",
      medicalGuidance: "Rely on medical testing for sex determination.",
      sources: [
        { org: "ACOG", reference: "Prenatal Sex Determination" },
        { org: "WHO", reference: "Pregnancy Superstitions" }
      ],
      actionableAdvice: "Keep the ring test for fun, but don't paint the nursery based on it."
    },
    {
      id: "w28-4",
      week: 28,
      category: "Emotions",
      region: "Global",
      myth: "Nesting only happens if you're really excited about the baby.",
      beliefReason: "Assumption that nesting is purely a joyful psychological response.",
      medicalFact: "Nesting is a biological drive seen in many mammals to prepare a safe space.",
      riskLevel: "Low",
      medicalGuidance: "You might feel a strong urge to clean or organize even if you're feeling anxious or tired.",
      sources: [
        { org: "NIH", reference: "Biological Nesting Drives" },
        { org: "ACOG", reference: "Third Trimester Prep" }
      ],
      actionableAdvice: "Channel your nesting energy into safe tasks; avoid heavy lifting or high ladders."
    },
    {
      id: "w33-4",
      week: 33,
      category: "Body Changes",
      region: "Global",
      myth: "Your water will break with a massive 'pop' and a flood in public.",
      beliefReason: "Classic movie trope for dramatic effect.",
      medicalFact: "Most women's water breaks during labor, and for many, it's a slow trickle rather than a gush.",
      riskLevel: "Low",
      medicalGuidance: "If you feel any unusual wetness, contact your provider even if it's not a 'flood'.",
      sources: [
        { org: "ACOG", reference: "Rupture of Membranes" },
        { org: "NHS", reference: "Labor Signs" }
      ],
      actionableAdvice: "Wear a panty liner if you're concerned about leaks, but know that a public gush is rare."
    },
    {
      id: "w38-4",
      week: 38,
      category: "Sleep/Posture",
      region: "Global",
      myth: "You can't sit on the floor during late pregnancy.",
      beliefReason: "Fear of being unable to get back up or harming the baby's position.",
      medicalFact: "Sitting on the floor (especially tailor sitting) can help open the pelvis for birth.",
      riskLevel: "Low",
      medicalGuidance: "Use cushions for support and ensure you have something to hold onto when standing up.",
      sources: [
        { org: "ACOG", reference: "Labor Prep Exercises" },
        { org: "RCOG", reference: "Active Birth Positions" }
      ],
      actionableAdvice: "Try sitting cross-legged on a cushion; it's great for hip flexibility."
    }

];

export function getMythsForWeek(week: number): MythFact[] {
  return mythsFactsData.filter(m => m.week === week);
}

export function getMythsByCategory(category: Category): MythFact[] {
  return mythsFactsData.filter(m => m.category === category);
}

export function getMythsByRegion(region: Region): MythFact[] {
  return mythsFactsData.filter(m => m.region === region);
}

export function searchMyths(query: string): MythFact[] {
  const lowerQuery = query.toLowerCase();
  return mythsFactsData.filter(m => 
    m.myth.toLowerCase().includes(lowerQuery) ||
    m.medicalFact.toLowerCase().includes(lowerQuery) ||
    m.category.toLowerCase().includes(lowerQuery) ||
    m.beliefReason.toLowerCase().includes(lowerQuery)
  );
}

export function getRandomMyth(): MythFact {
  return mythsFactsData[Math.floor(Math.random() * mythsFactsData.length)];
}

export const categories: Category[] = [
  "Nutrition",
  "Activity", 
  "Body Changes",
  "Emotions",
  "Labor",
  "Gender Myths",
  "Sleep/Posture",
  "General"
];

export const regions: Region[] = [
  "Global",
  "South Asia",
  "Middle East",
  "Western",
  "East Asia"
];
