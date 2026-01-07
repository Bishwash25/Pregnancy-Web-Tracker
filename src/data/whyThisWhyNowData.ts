export const categoryLabels: Record<string, string> = {
  cardiovascular: "Heart & Circulation",
  musculoskeletal: "Muscles & Joints",
  gastrointestinal: "Digestive System",
  neurological: "Brain & Nerves",
  skin: "Skin & Hair",
  fetal: "Baby Related",
  emotional: "Mood & Emotions",
  respiratory: "Breathing",
  urinary: "Urinary System",
  reproductive: "Reproductive System",
};

export const categoryIcons: Record<string, string> = {
  cardiovascular: "heart",
  musculoskeletal: "bone",
  gastrointestinal: "utensils",
  neurological: "brain",
  skin: "sparkles",
  fetal: "baby",
  emotional: "smile",
  respiratory: "wind",
  urinary: "droplet",
  reproductive: "flower2",
};

export const categoryColors: Record<string, string> = {
  cardiovascular: "bg-red-100 text-red-600 border-red-200",
  musculoskeletal: "bg-orange-100 text-orange-600 border-orange-200",
  gastrointestinal: "bg-amber-100 text-amber-600 border-amber-200",
  neurological: "bg-purple-100 text-purple-600 border-purple-200",
  skin: "bg-pink-100 text-pink-600 border-pink-200",
  fetal: "bg-blue-100 text-blue-600 border-blue-200",
  emotional: "bg-yellow-100 text-yellow-600 border-yellow-200",
  respiratory: "bg-cyan-100 text-cyan-600 border-cyan-200",
  urinary: "bg-teal-100 text-teal-600 border-teal-200",
  reproductive: "bg-rose-100 text-rose-600 border-rose-200",
};

export interface WeekRange {
  explanation: string;
  normalWhen: string[];
  notNormalWhen: string[];
  clinicalReasoning: string;
  sources: string[];
}

export interface SymptomExplanation {
  id: string;
  name: string;
  category: "cardiovascular" | "musculoskeletal" | "gastrointestinal" | "neurological" | "skin" | "fetal" | "emotional" | "respiratory" | "urinary" | "reproductive";
  weekRanges: Record<string, WeekRange>;
}

export interface WhyThisWhyNowData {
  symptoms: SymptomExplanation[];
  medicalDisclaimer: string;
  sources: string[];
}

export const whyThisWhyNowData: WhyThisWhyNowData = {
  medicalDisclaimer: "This feature provides educational explanations and does not replace professional medical care. Always consult your healthcare provider for personalized advice.",
  sources: [
    "American College of Obstetricians and Gynecologists (ACOG)",
    "World Health Organization (WHO)",
    "National Institute for Health and Care Excellence (NICE)",
    "Williams Obstetrics, 26th Edition",
    "Mayo Clinic Pregnancy Guide"
  ],
  symptoms: [
    {
      id: "mild_breathlessness",
      name: "Mild Breathlessness",
      category: "cardiovascular",
      weekRanges: {
        "1-13": {
          explanation: "In early pregnancy, hormonal changes (particularly progesterone) begin affecting your respiratory system. Progesterone stimulates the breathing center in your brain, making you breathe more deeply even before your belly grows.",
          normalWhen: [
            "Occurs during physical activity",
            "Resolves with rest within minutes",
            "No associated chest pain or dizziness"
          ],
          notNormalWhen: [
            "Sudden onset at rest",
            "Associated with chest pain",
            "Accompanied by rapid heartbeat above 120 bpm"
          ],
          clinicalReasoning: "Progesterone increases respiratory sensitivity to CO2, causing deeper breathing even before blood volume increases significantly.",
          sources: ["ACOG Practice Bulletin", "Williams Obstetrics"]
        },
        "14-27": {
          explanation: "During mid-pregnancy, cardiac output increases by approximately 30-40% to meet fetal oxygen demands. This causes increased respiratory drive, leading to mild breathlessness during exertion. Your diaphragm also begins to shift upward as the uterus expands.",
          normalWhen: [
            "Occurs during physical activity",
            "Resolves with rest",
            "No chest pain or dizziness",
            "You can still complete sentences while talking"
          ],
          notNormalWhen: [
            "Sudden onset at rest",
            "Associated with chest pain",
            "Accompanied by fainting or blue lips",
            "Cannot complete sentences"
          ],
          clinicalReasoning: "Increased blood volume and oxygen demand stimulate the respiratory center. The growing uterus begins to push against the diaphragm.",
          sources: ["ACOG Practice Bulletin", "Williams Obstetrics"]
        },
        "28-42": {
          explanation: "In late pregnancy, the enlarged uterus pushes the diaphragm up by about 4 cm, reducing lung capacity. Combined with increased blood volume (up to 50% more than pre-pregnancy), your body works harder to oxygenate both you and your baby.",
          normalWhen: [
            "Occurs during activity or climbing stairs",
            "Improves when sitting upright",
            "Resolves with rest",
            "Better after baby 'drops' near term"
          ],
          notNormalWhen: [
            "Severe breathlessness at rest",
            "Worsening rapidly",
            "Associated with chest pain or leg swelling",
            "Blue discoloration of lips or fingers"
          ],
          clinicalReasoning: "Mechanical compression of the diaphragm plus peak blood volume creates the highest respiratory demand of pregnancy.",
          sources: ["ACOG Practice Bulletin", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "palpitations",
      name: "Heart Palpitations",
      category: "cardiovascular",
      weekRanges: {
        "1-13": {
          explanation: "Early pregnancy hormones (hCG, progesterone) begin affecting your cardiovascular system. Your heart starts to work harder to support the developing placenta and embryo, sometimes causing awareness of your heartbeat.",
          normalWhen: [
            "Brief episodes lasting seconds to minutes",
            "Occurs with position changes",
            "No associated chest pain",
            "Heart rate below 100 bpm at rest"
          ],
          notNormalWhen: [
            "Sustained rapid heart rate above 120 bpm",
            "Associated with chest pain or pressure",
            "Accompanied by fainting",
            "Irregular rhythm patterns"
          ],
          clinicalReasoning: "Cardiovascular adaptation begins early with increased heart rate and stroke volume to support placental development.",
          sources: ["ACOG Committee Opinion", "Circulation Journal"]
        },
        "14-27": {
          explanation: "Your heart rate increases by 10-20 beats per minute to pump the expanding blood volume. Your heart is now pumping about 1.5 liters more blood per minute than before pregnancy. This increased workload can cause occasional palpitations.",
          normalWhen: [
            "Brief flutter sensations",
            "Related to caffeine, stress, or position changes",
            "No chest pain or breathlessness",
            "Resolves spontaneously"
          ],
          notNormalWhen: [
            "Persistent rapid heart rate",
            "Chest pain or tightness",
            "Fainting or near-fainting",
            "Severe breathlessness"
          ],
          clinicalReasoning: "Peak cardiovascular adaptation occurs mid-pregnancy with cardiac output increasing 30-50%.",
          sources: ["ACOG Committee Opinion", "Williams Obstetrics"]
        },
        "28-42": {
          explanation: "Cardiac output peaks in late pregnancy at 40-50% above pre-pregnancy levels. The enlarged uterus can compress major blood vessels when lying flat, causing palpitations. Position changes and the physical demands of late pregnancy contribute to awareness of heart activity.",
          normalWhen: [
            "Occur when lying flat (resolves with position change)",
            "Brief episodes with exertion",
            "No associated symptoms",
            "Regular rhythm"
          ],
          notNormalWhen: [
            "Persistent irregular heartbeat",
            "Chest pain or pressure",
            "Swelling of face or difficulty breathing",
            "Fainting episodes"
          ],
          clinicalReasoning: "Supine hypotensive syndrome and peak cardiovascular demand make late pregnancy the most demanding period for the heart.",
          sources: ["ACOG Committee Opinion", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "swollen_feet",
      name: "Swollen Feet and Ankles",
      category: "cardiovascular",
      weekRanges: {
        "14-27": {
          explanation: "As blood volume increases and the growing uterus puts pressure on pelvic veins, fluid begins to accumulate in your lower extremities. This is called dependent edema and is very common in pregnancy.",
          normalWhen: [
            "Swelling is worse at end of day",
            "Improves overnight or with elevation",
            "Both feet equally affected",
            "No pain or redness"
          ],
          notNormalWhen: [
            "Sudden onset swelling",
            "One leg significantly more swollen",
            "Associated with pain, redness, or warmth",
            "Swelling of face and hands"
          ],
          clinicalReasoning: "Increased blood volume and venous compression lead to fluid redistribution to dependent areas.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        },
        "28-42": {
          explanation: "In late pregnancy, the enlarged uterus significantly compresses the inferior vena cava (the main vein returning blood from your legs), leading to more pronounced swelling. Hot weather, prolonged standing, and high salt intake can worsen this.",
          normalWhen: [
            "Gradual increase over days/weeks",
            "Improves with rest and elevation",
            "Symmetrical swelling",
            "No associated headache or vision changes"
          ],
          notNormalWhen: [
            "Sudden severe swelling over hours",
            "Swelling of face, especially around eyes",
            "Associated with headache or visual changes",
            "One-sided leg swelling with pain"
          ],
          clinicalReasoning: "Peak venous compression and fluid retention occur in the third trimester. Sudden swelling may indicate preeclampsia.",
          sources: ["ACOG Practice Bulletin", "Preeclampsia Foundation"]
        }
      }
    },
    {
      id: "varicose_veins",
      name: "Varicose Veins",
      category: "cardiovascular",
      weekRanges: {
        "14-42": {
          explanation: "Pregnancy hormones relax vein walls, while increased blood volume and uterine pressure on pelvic veins cause blood to pool in leg veins. This stretches the vein walls, making them visible and sometimes uncomfortable.",
          normalWhen: [
            "Visible blue or purple veins",
            "Mild aching or heaviness",
            "Improve with elevation",
            "No skin changes or ulcers"
          ],
          notNormalWhen: [
            "Severe pain in the vein",
            "Red, warm, hard areas over veins",
            "Skin breakdown or ulceration",
            "Sudden swelling of one leg"
          ],
          clinicalReasoning: "Progesterone relaxes smooth muscle in vein walls, combined with mechanical compression from the growing uterus.",
          sources: ["ACOG Guidelines", "Vascular Medicine Journal"]
        }
      }
    },
    {
      id: "lower_back_pain",
      name: "Lower Back Pain",
      category: "musculoskeletal",
      weekRanges: {
        "1-13": {
          explanation: "Early pregnancy hormones, particularly relaxin, begin softening ligaments throughout your body. This, combined with slight postural changes as your center of gravity shifts, can cause mild lower back discomfort.",
          normalWhen: [
            "Dull, aching sensation",
            "Relieved by rest or position change",
            "No radiating pain down legs",
            "No associated bleeding"
          ],
          notNormalWhen: [
            "Severe, cramping pain",
            "Associated with vaginal bleeding",
            "Pain radiating down one leg",
            "Fever or difficulty urinating"
          ],
          clinicalReasoning: "Relaxin hormone begins ligament laxity in preparation for delivery, affecting spinal support structures.",
          sources: ["ACOG Practice Bulletin", "Spine Journal"]
        },
        "14-27": {
          explanation: "As your belly grows, your center of gravity shifts forward, increasing the curve of your lower spine (lordosis). This puts extra strain on back muscles and ligaments. The hormone relaxin continues to soften joints and ligaments.",
          normalWhen: [
            "Aching that improves with rest",
            "Related to activity or posture",
            "Responds to heat, massage, or stretching",
            "No numbness or weakness in legs"
          ],
          notNormalWhen: [
            "Severe pain limiting daily activities",
            "Numbness or weakness in legs",
            "Loss of bladder or bowel control",
            "Pain with fever"
          ],
          clinicalReasoning: "Biomechanical stress from weight gain and postural changes peak in mid to late pregnancy.",
          sources: ["ACOG Practice Bulletin", "Williams Obstetrics"]
        },
        "28-42": {
          explanation: "Your lower back bears the maximum strain as your baby reaches full size. The increased lordosis, weight of the baby, and loosened joints all contribute. Many women find relief only when lying down or using support belts.",
          normalWhen: [
            "Worsens with standing or walking",
            "Improves with rest and support",
            "No radiating symptoms",
            "Manageable with comfort measures"
          ],
          notNormalWhen: [
            "Severe constant pain",
            "Regular rhythmic pain (may be contractions)",
            "Numbness in genital area",
            "Difficulty controlling bladder/bowel"
          ],
          clinicalReasoning: "Maximum mechanical stress on the lumbar spine occurs in late pregnancy. Rhythmic pain may indicate preterm labor.",
          sources: ["ACOG Practice Bulletin", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "pelvic_pain",
      name: "Pelvic Pain / Pelvic Girdle Pain",
      category: "musculoskeletal",
      weekRanges: {
        "14-27": {
          explanation: "The hormone relaxin loosens the ligaments connecting your pelvic bones, preparing for delivery. This can cause instability and pain in the pubic symphysis (front) or sacroiliac joints (back of pelvis).",
          normalWhen: [
            "Pain with walking, climbing stairs, or turning in bed",
            "Improves with rest",
            "No associated bleeding",
            "Manageable with activity modification"
          ],
          notNormalWhen: [
            "Severe pain preventing walking",
            "Associated with vaginal bleeding or fluid",
            "Fever or chills",
            "Pain only on one side with nausea"
          ],
          clinicalReasoning: "Symphysis pubis dysfunction affects up to 25% of pregnant women due to relaxin-induced ligament laxity.",
          sources: ["ACOG Guidelines", "British Journal of Obstetrics"]
        },
        "28-42": {
          explanation: "Pelvic joint loosening peaks in late pregnancy. The weight of the baby pressing on the pelvis and the further softening of ligaments can make everyday movements challenging. This prepares your pelvis to widen during delivery.",
          normalWhen: [
            "Gradual worsening over pregnancy",
            "Improves with rest and pelvic support",
            "Both sides of pelvis affected",
            "No regular pattern to pain"
          ],
          notNormalWhen: [
            "Sudden severe pain",
            "Regular, rhythmic pelvic pressure (contractions)",
            "Associated with fluid leakage or bleeding",
            "Unable to bear weight on legs"
          ],
          clinicalReasoning: "Peak relaxin levels and maximum fetal weight create the greatest pelvic stress in late pregnancy.",
          sources: ["ACOG Practice Bulletin", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "round_ligament_pain",
      name: "Round Ligament Pain",
      category: "musculoskeletal",
      weekRanges: {
        "14-27": {
          explanation: "The round ligaments support your uterus and stretch from your groin to the sides of your uterus. As your uterus grows rapidly during the second trimester, these ligaments stretch, causing sharp or stabbing pains in your lower abdomen or groin.",
          normalWhen: [
            "Sharp, brief pain with sudden movements",
            "Pain on one or both sides of lower abdomen",
            "Triggered by coughing, sneezing, or standing quickly",
            "Resolves within seconds to minutes"
          ],
          notNormalWhen: [
            "Constant, severe pain",
            "Associated with vaginal bleeding",
            "Pain with fever or chills",
            "Pain with burning urination"
          ],
          clinicalReasoning: "Round ligaments stretch from their pre-pregnancy length of 10-12 cm to accommodate the growing uterus.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        },
        "28-42": {
          explanation: "Round ligament pain may continue but often decreases as the ligaments adapt to their stretched state. However, the weight of the full-term baby can still cause occasional sharp pains with sudden movements.",
          normalWhen: [
            "Less frequent than mid-pregnancy",
            "Brief and related to movement",
            "No associated symptoms",
            "Resolves spontaneously"
          ],
          notNormalWhen: [
            "Regular, rhythmic pain (may be contractions)",
            "Constant severe pain",
            "Associated with bleeding or fluid leakage",
            "Pain not relieved by rest"
          ],
          clinicalReasoning: "Ligaments have adapted but maximum stretch and fetal weight can still cause intermittent pain.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "sciatica",
      name: "Sciatica",
      category: "musculoskeletal",
      weekRanges: {
        "20-42": {
          explanation: "The growing uterus or the baby's head can press directly on the sciatic nerve. This causes shooting pain, tingling, or numbness that starts in your lower back or buttocks and runs down the back of your leg.",
          normalWhen: [
            "Intermittent shooting pain down one leg",
            "Aggravated by sitting or standing for long periods",
            "Relieved by changing position or stretching",
            "No loss of bladder/bowel control"
          ],
          notNormalWhen: [
            "Severe weakness in the leg or foot (foot drop)",
            "Loss of bladder or bowel control",
            "Numbness in the 'saddle' area (groin/buttocks)",
            "Severe unremitting pain"
          ],
          clinicalReasoning: "Mechanical compression of the sciatic nerve plexus by the fetus or uterus against the pelvic wall.",
          sources: ["ACOG Practice Bulletin", "Spine Journal"]
        }
      }
    },
    {
      id: "leg_cramps",
      name: "Leg Cramps",
      category: "musculoskeletal",
      weekRanges: {
        "14-42": {
          explanation: "Leg cramps, especially at night, become common in the second and third trimesters. The exact cause is unclear but may involve compressed blood vessels, fatigue, and changes in calcium and magnesium levels.",
          normalWhen: [
            "Occur at night or after prolonged standing",
            "Resolve with stretching or massage",
            "Affect calf muscles typically",
            "No persistent swelling or redness"
          ],
          notNormalWhen: [
            "Persistent pain after cramp resolves",
            "Swelling, redness, or warmth in leg",
            "One leg significantly more affected",
            "Pain when flexing foot toward shin"
          ],
          clinicalReasoning: "Venous compression and possible electrolyte changes contribute to muscle cramping.",
          sources: ["ACOG Guidelines", "Cochrane Review"]
        }
      }
    },
    {
      id: "carpal_tunnel",
      name: "Carpal Tunnel Syndrome",
      category: "musculoskeletal",
      weekRanges: {
        "28-42": {
          explanation: "Fluid retention in late pregnancy can compress the median nerve as it passes through the carpal tunnel in your wrist. This causes numbness, tingling, and weakness in your hands, especially at night.",
          normalWhen: [
            "Numbness/tingling in thumb, index, and middle fingers",
            "Worse at night or upon waking",
            "Improves with shaking hands or wrist splints",
            "Both hands may be affected"
          ],
          notNormalWhen: [
            "Severe weakness affecting grip",
            "Symptoms in feet as well as hands",
            "Associated with swelling of face",
            "Persistent numbness not improving after delivery"
          ],
          clinicalReasoning: "Pregnancy-related fluid retention increases pressure in the carpal tunnel, compressing the median nerve.",
          sources: ["ACOG Guidelines", "Journal of Hand Surgery"]
        }
      }
    },
    {
      id: "heartburn",
      name: "Heartburn / Acid Reflux",
      category: "gastrointestinal",
      weekRanges: {
        "1-13": {
          explanation: "Progesterone relaxes the lower esophageal sphincter (the valve between your esophagus and stomach), allowing stomach acid to flow back up. Early pregnancy nausea can also contribute to acid reflux.",
          normalWhen: [
            "Burning sensation after meals",
            "Worse when lying down",
            "Relieved by antacids",
            "No difficulty swallowing"
          ],
          notNormalWhen: [
            "Severe pain radiating to back or jaw",
            "Difficulty swallowing",
            "Vomiting blood or dark material",
            "Unintended weight loss"
          ],
          clinicalReasoning: "Progesterone reduces lower esophageal sphincter pressure by up to 50% in early pregnancy.",
          sources: ["ACOG Guidelines", "Gastroenterology Journal"]
        },
        "14-27": {
          explanation: "The growing uterus begins pushing upward on the stomach, while progesterone continues to relax the esophageal sphincter. This double effect makes heartburn increasingly common.",
          normalWhen: [
            "Burning after meals or when bending",
            "Responds to dietary changes",
            "Relieved by safe antacids",
            "No associated weight loss"
          ],
          notNormalWhen: [
            "Severe chest pain",
            "Difficulty swallowing solid foods",
            "Persistent vomiting",
            "Symptoms not responding to treatment"
          ],
          clinicalReasoning: "Mechanical compression from the growing uterus adds to hormone-induced sphincter relaxation.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        },
        "28-42": {
          explanation: "Heartburn typically peaks in the third trimester as the large uterus maximally displaces the stomach. Many women find relief only when sleeping propped up. Symptoms often improve dramatically after delivery.",
          normalWhen: [
            "Frequent but manageable symptoms",
            "Improves with elevation and small meals",
            "Responds to medication",
            "No alarm symptoms"
          ],
          notNormalWhen: [
            "Severe pain not relieved by medication",
            "Vomiting blood",
            "Black tarry stools",
            "Severe difficulty swallowing"
          ],
          clinicalReasoning: "Maximum gastric displacement and compression occur in late pregnancy, often improving when the baby 'drops.'",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "gum_bleeding",
      name: "Bleeding Gums",
      category: "gastrointestinal",
      weekRanges: {
        "1-42": {
          explanation: "Hormonal changes make your gums more sensitive, puffy, and prone to bleeding when brushing or flossing. This is known as pregnancy gingivitis.",
          normalWhen: [
            "Small amount of blood when brushing",
            "Gums appear slightly redder",
            "Resolves with good oral hygiene",
            "No loose teeth"
          ],
          notNormalWhen: [
            "Severe pain or swelling",
            "Pus or abscess formation",
            "Loose teeth",
            "Bleeding that doesn't stop"
          ],
          clinicalReasoning: "Progesterone and estrogen increase blood flow to gum tissue and its sensitivity to plaque bacteria.",
          sources: ["American Dental Association", "ACOG Guidelines"]
        }
      }
    },
    {
      id: "constipation",
      name: "Constipation",
      category: "gastrointestinal",
      weekRanges: {
        "1-42": {
          explanation: "Progesterone slows intestinal motility (movement), allowing more water absorption and harder stools. Iron supplements commonly prescribed in pregnancy can worsen this. The growing uterus also puts pressure on the intestines.",
          normalWhen: [
            "Bowel movements less than every 2-3 days",
            "Responds to fiber and fluids",
            "No severe abdominal pain",
            "No blood in stool"
          ],
          notNormalWhen: [
            "No bowel movement for over a week",
            "Severe abdominal pain",
            "Blood in stool or on toilet paper",
            "Vomiting with inability to pass gas"
          ],
          clinicalReasoning: "Progesterone reduces gastrointestinal motility by up to 30%, leading to increased water absorption and harder stools.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "hemorrhoids",
      name: "Hemorrhoids",
      category: "gastrointestinal",
      weekRanges: {
        "14-42": {
          explanation: "Increased blood volume, pressure from the growing uterus on pelvic veins, and constipation all contribute to hemorrhoids (swollen veins in the rectal area). Straining during bowel movements makes them worse.",
          normalWhen: [
            "Mild discomfort or itching",
            "Small amount of bright red blood on toilet paper",
            "Respond to topical treatments",
            "Improve with stool softeners"
          ],
          notNormalWhen: [
            "Large amount of bleeding",
            "Severe, constant pain",
            "Hemorrhoid that cannot be pushed back",
            "Signs of infection (fever, pus)"
          ],
          clinicalReasoning: "Venous congestion from uterine compression and increased straining from constipation cause rectal vein dilation.",
          sources: ["ACOG Guidelines", "Colorectal Disease Journal"]
        }
      }
    },
    {
      id: "nausea_vomiting",
      name: "Nausea and Vomiting",
      category: "gastrointestinal",
      weekRanges: {
        "1-13": {
          explanation: "Morning sickness affects up to 80% of pregnant women and is caused by rapidly rising hCG (human chorionic gonadotropin) and estrogen levels. Despite the name, it can occur at any time of day. It usually peaks around weeks 8-10.",
          normalWhen: [
            "Occurs mainly in morning but can be any time",
            "Can keep fluids down most of the time",
            "Able to eat some food daily",
            "No weight loss or dehydration"
          ],
          notNormalWhen: [
            "Cannot keep any fluids down for 24 hours",
            "Severe weight loss (more than 5% of body weight)",
            "Dark urine or dizziness from dehydration",
            "Blood in vomit"
          ],
          clinicalReasoning: "hCG levels peak around 8-10 weeks, correlating with peak nausea symptoms. Higher hCG (twins, molar pregnancy) often means worse symptoms.",
          sources: ["ACOG Practice Bulletin", "Hyperemesis Foundation"]
        },
        "14-27": {
          explanation: "For most women, nausea improves significantly by week 14-16 as hCG levels stabilize. If nausea continues, it's usually milder than the first trimester.",
          normalWhen: [
            "Mild, intermittent nausea",
            "Triggered by certain smells or foods",
            "Not affecting nutrition or hydration",
            "Manageable with dietary changes"
          ],
          notNormalWhen: [
            "Persistent vomiting after 20 weeks",
            "New onset severe nausea in second trimester",
            "Associated with abdominal pain or headache",
            "Inability to maintain weight"
          ],
          clinicalReasoning: "Stabilizing hormone levels typically reduce nausea. Persistent severe symptoms may indicate other conditions.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "bloating_gas",
      name: "Bloating and Gas",
      category: "gastrointestinal",
      weekRanges: {
        "1-42": {
          explanation: "Progesterone slows digestion, allowing more time for gas to build up in your intestines. The growing uterus also displaces intestines and can trap gas. This is one of the earliest and longest-lasting pregnancy symptoms.",
          normalWhen: [
            "Uncomfortable but not painful",
            "Improves with movement or passing gas",
            "Related to certain foods",
            "No associated vomiting or severe pain"
          ],
          notNormalWhen: [
            "Severe abdominal pain",
            "Unable to pass gas or have bowel movements",
            "Vomiting with abdominal distension",
            "Associated with fever"
          ],
          clinicalReasoning: "Slowed intestinal transit allows increased bacterial fermentation of food, producing more gas.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "increased_appetite",
      name: "Increased Appetite",
      category: "gastrointestinal",
      weekRanges: {
        "14-42": {
          explanation: "After first-trimester nausea resolves, many women experience increased appetite as their body demands more calories to support fetal growth. In the second trimester, you need about 340 extra calories daily; in the third, about 450 extra.",
          normalWhen: [
            "Gradual increase in appetite",
            "Satisfied with regular meals plus snacks",
            "Weight gain following expected patterns",
            "Cravings for normal foods"
          ],
          notNormalWhen: [
            "Extreme hunger not satisfied by eating",
            "Craving non-food items (pica)",
            "Excessive weight gain",
            "Excessive thirst with frequent urination"
          ],
          clinicalReasoning: "Fetal growth and increased maternal metabolism require additional caloric intake, regulated by hormonal hunger signals.",
          sources: ["ACOG Guidelines", "Academy of Nutrition and Dietetics"]
        }
      }
    },
    {
      id: "headache",
      name: "Headaches",
      category: "neurological",
      weekRanges: {
        "1-13": {
          explanation: "Hormonal changes, increased blood volume, and changes in circulation can trigger headaches in early pregnancy. Caffeine withdrawal (if you've reduced intake), dehydration, fatigue, and stress also contribute.",
          normalWhen: [
            "Mild to moderate, tension-type headaches",
            "Respond to rest and hydration",
            "No vision changes or fever",
            "Similar to pre-pregnancy headaches"
          ],
          notNormalWhen: [
            "Severe, 'worst headache of my life'",
            "Associated with vision changes or vomiting",
            "High fever or stiff neck",
            "New type of headache different from usual"
          ],
          clinicalReasoning: "Vascular changes and hormonal shifts trigger headaches in early pregnancy, usually improving by second trimester.",
          sources: ["ACOG Guidelines", "Headache Journal"]
        },
        "14-27": {
          explanation: "Headaches often improve in the second trimester as hormones stabilize. However, increased blood volume and changes in blood pressure can still cause occasional headaches.",
          normalWhen: [
            "Occasional, mild headaches",
            "Related to triggers like missed meals or poor sleep",
            "Respond to safe treatments",
            "No associated symptoms"
          ],
          notNormalWhen: [
            "Persistent severe headaches",
            "Associated with vision changes",
            "Accompanied by swelling of hands and face",
            "Not responding to usual treatments"
          ],
          clinicalReasoning: "Stabilized hormones typically reduce headache frequency. New severe headaches may indicate developing preeclampsia.",
          sources: ["ACOG Practice Bulletin", "Williams Obstetrics"]
        },
        "28-42": {
          explanation: "Headaches in late pregnancy require careful evaluation as they can be a sign of preeclampsia. However, tension headaches from stress, poor posture, and fatigue remain common.",
          normalWhen: [
            "Mild, tension-type headaches",
            "Related to fatigue or stress",
            "No associated swelling or visual changes",
            "Blood pressure normal"
          ],
          notNormalWhen: [
            "Severe, persistent headache",
            "Associated with high blood pressure",
            "Visual disturbances (spots, flashing lights)",
            "Upper abdominal pain and swelling"
          ],
          clinicalReasoning: "Headaches after 20 weeks, especially with hypertension, may indicate preeclampsia and require immediate evaluation.",
          sources: ["ACOG Practice Bulletin", "Preeclampsia Foundation"]
        }
      }
    },
    {
      id: "dizziness",
      name: "Dizziness and Lightheadedness",
      category: "neurological",
      weekRanges: {
        "1-13": {
          explanation: "In early pregnancy, blood vessels relax and dilate due to progesterone, which can cause blood pressure to drop. This, combined with increasing blood volume demands, can cause dizziness, especially when standing quickly.",
          normalWhen: [
            "Brief dizziness when standing",
            "Resolves within seconds to minutes",
            "No loss of consciousness",
            "Improves with sitting or lying down"
          ],
          notNormalWhen: [
            "Fainting episodes",
            "Associated with severe vomiting and dehydration",
            "Persistent dizziness not improving",
            "Associated with vaginal bleeding"
          ],
          clinicalReasoning: "Progesterone-induced vasodilation causes blood pressure to drop before blood volume fully compensates.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        },
        "14-27": {
          explanation: "Blood pressure typically reaches its lowest point in mid-pregnancy before gradually rising. The growing uterus can also compress blood vessels when lying on your back, reducing blood return to the heart.",
          normalWhen: [
            "Dizziness with position changes",
            "Resolves quickly",
            "No fainting",
            "Improves by avoiding lying flat on back"
          ],
          notNormalWhen: [
            "Fainting",
            "Associated with chest pain or palpitations",
            "Severe dizziness with exertion",
            "Visual changes or severe headache"
          ],
          clinicalReasoning: "Mid-pregnancy blood pressure nadir combined with aortocaval compression can reduce cerebral perfusion.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        },
        "28-42": {
          explanation: "Lying flat on your back can compress the vena cava, dramatically reducing blood flow to your heart and brain (supine hypotensive syndrome). Side-lying, especially on the left, prevents this. Dehydration and anemia can worsen dizziness.",
          normalWhen: [
            "Dizziness when lying flat, resolving with position change",
            "Brief lightheadedness with standing",
            "Improves with left-side lying",
            "No fainting"
          ],
          notNormalWhen: [
            "Fainting episodes",
            "Dizziness with severe headache or vision changes",
            "Dizziness with vaginal bleeding",
            "Persistent symptoms not improving"
          ],
          clinicalReasoning: "Maximum uterine size creates greatest risk for aortocaval compression in late pregnancy.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "forgetfulness",
      name: "Pregnancy Brain / Forgetfulness",
      category: "neurological",
      weekRanges: {
        "1-42": {
          explanation: "'Pregnancy brain' or 'momnesia' is real! Hormonal changes, sleep deprivation, and the cognitive demands of preparing for a baby can affect memory and concentration. Studies show subtle changes in brain structure during pregnancy that reverse after delivery.",
          normalWhen: [
            "Occasional forgetfulness of minor things",
            "Difficulty concentrating",
            "Losing train of thought",
            "Does not affect safety or daily functioning"
          ],
          notNormalWhen: [
            "Severe confusion or disorientation",
            "Memory loss affecting safety",
            "Associated with severe headaches",
            "Inability to recognize familiar people or places"
          ],
          clinicalReasoning: "Brain changes during pregnancy involve gray matter reductions in areas related to social cognition, likely preparing for maternal bonding.",
          sources: ["Nature Neuroscience", "Psychology Today"]
        }
      }
    },
    {
      id: "vivid_dreams",
      name: "Vivid Dreams",
      category: "neurological",
      weekRanges: {
        "1-42": {
          explanation: "Many women report highly vivid, bizarre, or disturbing dreams during pregnancy. This is often due to fragmented sleep (remembering dreams more often when waking), hormonal changes, and subconscious processing of pregnancy anxieties.",
          normalWhen: [
            "Dreams feel very real or emotional",
            "Waking up remembering dreams clearly",
            "Recurring themes about the baby",
            "No lasting distress upon waking"
          ],
          notNormalWhen: [
            "Nightmares causing severe anxiety or panic attacks",
            "Inability to sleep due to fear of dreaming",
            "Confusion between dreams and reality",
            "Persistent signs of depression"
          ],
          clinicalReasoning: "Increased progesterone and frequent awakenings during REM sleep cycles enhance dream recall and intensity.",
          sources: ["Sleep Medicine Reviews", "American Pregnancy Association"]
        }
      }
    },
    {
      id: "insomnia",
      name: "Sleep Problems / Insomnia",
      category: "neurological",
      weekRanges: {
        "1-13": {
          explanation: "Despite feeling exhausted, many women have trouble sleeping in early pregnancy. Rising progesterone causes daytime drowsiness but can fragment nighttime sleep. Frequent urination, nausea, and anxiety also disrupt sleep.",
          normalWhen: [
            "Difficulty falling or staying asleep",
            "Frequent waking to urinate",
            "Vivid dreams",
            "Able to function during the day"
          ],
          notNormalWhen: [
            "Severe insomnia affecting daily function",
            "Persistent anxiety or depression",
            "Excessive daytime sleepiness despite sleeping",
            "Loud snoring with gasping"
          ],
          clinicalReasoning: "Progesterone has sedative effects but also disrupts sleep architecture, fragmenting nighttime sleep.",
          sources: ["Sleep Medicine Reviews", "ACOG Guidelines"]
        },
        "28-42": {
          explanation: "Late pregnancy insomnia is extremely common. Physical discomfort, frequent urination, baby movements, heartburn, anxiety about delivery, and difficulty finding a comfortable position all contribute.",
          normalWhen: [
            "Difficulty getting comfortable",
            "Multiple nighttime awakenings",
            "Less total sleep than pre-pregnancy",
            "Manageable with sleep strategies"
          ],
          notNormalWhen: [
            "Severe depression or anxiety",
            "Loud snoring with breathing pauses",
            "Excessive leg movements disrupting sleep",
            "Unable to sleep at all for days"
          ],
          clinicalReasoning: "Mechanical discomfort, hormonal changes, and anticipatory anxiety peak in late pregnancy, severely affecting sleep quality.",
          sources: ["Sleep Medicine Reviews", "Williams Obstetrics"]
        }
      }
    },
    {
      id: "stretch_marks",
      name: "Stretch Marks",
      category: "skin",
      weekRanges: {
        "14-42": {
          explanation: "Stretch marks (striae gravidarum) occur when skin stretches faster than it can accommodate. Genetic factors, hormones, and the degree of stretching all contribute. They typically appear on the abdomen, breasts, hips, and thighs.",
          normalWhen: [
            "Pink, red, or purple lines that fade to silver",
            "Appear gradually",
            "May itch slightly",
            "No pain or open areas"
          ],
          notNormalWhen: [
            "Severe itching affecting daily life",
            "Open sores or bleeding",
            "Signs of infection (redness, warmth, pus)",
            "Accompanied by a widespread itchy rash"
          ],
          clinicalReasoning: "Collagen fiber disruption occurs when mechanical stretching exceeds skin elasticity, influenced by hormones and genetics.",
          sources: ["ACOG Guidelines", "Dermatology Clinics"]
        }
      }
    },
    {
      id: "melasma",
      name: "Melasma / Mask of Pregnancy",
      category: "skin",
      weekRanges: {
        "1-42": {
          explanation: "Melasma causes dark, blotchy patches on your face (forehead, cheeks, upper lip) due to hormonal stimulation of pigment-producing cells. Sun exposure makes it worse.",
          normalWhen: [
            "Brownish patches on face",
            "Dark line on abdomen (linea nigra)",
            "Darkening of nipples/areolas",
            "No pain or itching"
          ],
          notNormalWhen: [
            "Lesions that change shape or bleed",
            "Rapidly growing moles",
            "Itching or pain in pigmented areas",
            "Asymmetrical spots"
          ],
          clinicalReasoning: "Estrogen and progesterone stimulate melanocytes, increasing melanin production, especially in sun-exposed areas.",
          sources: ["American Academy of Dermatology", "ACOG Guidelines"]
        }
      }
    },
    {
      id: "pregnancy_rhinitis",
      name: "Pregnancy Rhinitis",
      category: "respiratory",
      weekRanges: {
        "1-42": {
          explanation: "Estrogen and placental growth hormone cause the mucous membranes in your nose to swell and produce more mucus. This leads to congestion and stuffiness, even without a cold or infection.",
          normalWhen: [
            "Chronic stuffy nose",
            "Mild runny nose",
            "No fever or body aches",
            "Clear mucus"
          ],
          notNormalWhen: [
            "High fever",
            "Green or yellow mucus with facial pain (sinus infection)",
            "Severe headache",
            "Difficulty breathing"
          ],
          clinicalReasoning: "Hormonally induced vasodilation and edema in the nasal mucosa increase resistance to airflow.",
          sources: ["American Journal of Rhinology", "ACOG Guidelines"]
        }
      }
    },
    {
      id: "braxton_hicks",
      name: "Braxton Hicks Contractions",
      category: "reproductive",
      weekRanges: {
        "20-42": {
          explanation: "These are 'practice' contractions where your uterus tightens for 30-60 seconds. They prepare your uterine muscles for labor but do not open the cervix. They are often triggered by movement, dehydration, or a full bladder.",
          normalWhen: [
            "Irregular, unpredictable timing",
            "Not increasing in intensity",
            "Stopped by changing position or drinking water",
            "Feel like a tight band across abdomen"
          ],
          notNormalWhen: [
            "Regular pattern (e.g., every 10 mins)",
            "Increasing in pain/intensity",
            "Associated with bleeding or fluid leak",
            "Lower back pain that comes and goes rhythmically"
          ],
          clinicalReasoning: "Sporadic uterine activity that increases myometrial tone without causing cervical dilation.",
          sources: ["ACOG Guidelines", "Williams Obstetrics"]
        }
      }
    }
  ]
};

export const getSymptomCategories = () => {
  return Object.keys(categoryLabels);
};

export const getAllSymptomsByCategory = (category?: string) => {
  if (!category) return whyThisWhyNowData.symptoms;
  return whyThisWhyNowData.symptoms.filter(s => s.category === category);
};

export const getExplanationForSymptom = (symptomId: string, week: number) => {
  const symptom = whyThisWhyNowData.symptoms.find(s => s.id === symptomId);
  if (!symptom) return null;

  const rangeKey = Object.keys(symptom.weekRanges).find(range => {
    const [start, end] = range.split('-').map(Number);
    return week >= start && week <= end;
  });

  if (!rangeKey) return null;

  return {
    symptom,
    weekRange: symptom.weekRanges[rangeKey],
    matchedRange: rangeKey
  };
};

export const searchSymptoms = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return whyThisWhyNowData.symptoms.filter(s =>
    s.name.toLowerCase().includes(lowercaseQuery) ||
    s.category.toLowerCase().includes(lowercaseQuery) ||
    Object.values(s.weekRanges).some(range =>
      range.explanation.toLowerCase().includes(lowercaseQuery)
    )
  );
};
