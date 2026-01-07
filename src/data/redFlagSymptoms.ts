export type SeverityLevel = "Normal" | "Monitor" | "Emergency";

export interface SymptomRule {
    id: string;
    label: string; // User facing text
    severity: SeverityLevel;
    action: string;
    medicalReason: string;
    trimesters?: number[]; // [1, 2, 3] or specific
    requiresImmediate: boolean;
    normalInfo?: string; // Guidance for mild/normal variants
}

export interface ClinicalRuleSet {
    universal: SymptomRule[];
    trimester1: SymptomRule[];
    trimester2: SymptomRule[];
    trimester3: SymptomRule[];
    fetalMovementStrick: {
        minKicks: number;
        windowHours: number;
        severity: SeverityLevel;
        action: string;
        medicalReason: string;
        normalInfo?: string;
    };
}

export const redFlagRules: ClinicalRuleSet = {
    // 🔴 LAYER 3: “CONSULT DOCTOR NOW” — RULE ENGINE - UNIVERSAL
    universal: [
        {
            id: "heavy_bleeding",
            label: "Heavy vaginal bleeding",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Potential life-threatening maternal or fetal conditions (e.g., hemorrhage)",
            requiresImmediate: true,
            normalInfo: "Light spotting in early pregnancy can be normal, but monitor and report changes."
        },
        {
            id: "mild_bleeding",
            label: "Mild spotting or light bleeding",
            severity: "Normal",
            action: "Reassure",
            medicalReason: "Common in implantation or hormonal changes",
            requiresImmediate: false
        },
        {
            id: "severe_abdominal_pain",
            label: "Severe abdominal pain",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Potential ectopic pregnancy, miscarriage, or placental complications",
            requiresImmediate: true,
            normalInfo: "Mild cramping, stretching sensations, or round ligament pain can be normal in pregnancy."
        },
        {
            id: "loss_consciousness",
            label: "Fainting or loss of consciousness",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Potential hemodynamic instability",
            requiresImmediate: true
        },
        {
            id: "chest_pain",
            label: "Chest pain",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Cardiac or pulmonary emergency risk",
            requiresImmediate: true
        },
        {
            id: "breathing_difficulty",
            label: "Difficulty breathing",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Respiratory distress risk",
            requiresImmediate: true
        },
        {
            id: "high_fever",
            label: "Fever above 38°C (100.4°F)",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Infection risk, sepsis concern",
            requiresImmediate: true
        },
        {
            id: "seizure",
            label: "Seizure / Fit",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Eclampsia risk",
            requiresImmediate: true
        }
    ],

    // ✅ FIRST TRIMESTER (Weeks 1–12)
    trimester1: [
        {
            id: "t1_bleeding_pain",
            label: "Vaginal bleeding with pain",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Risk of ectopic pregnancy or miscarriage",
            requiresImmediate: true,
            normalInfo: "Very light spotting without pain can occur early and may be harmless."
        },
        {
            id: "t1_one_sided_pain",
            label: "Severe one-sided pelvic pain",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "High suspicion of ectopic pregnancy",
            requiresImmediate: true
        },
        {
            id: "t1_vomiting",
            label: "Persistent vomiting (>24h) unable to keep fluids down",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Hyperemesis gravidarum, dehydration risk",
            requiresImmediate: true
        },
        {
            id: "t1_nausea",
            label: "Mild nausea or vomiting",
            severity: "Normal",
            action: "Reassure",
            medicalReason: "Hormonal changes are common in first trimester",
            requiresImmediate: false
        }
    ],

    // ✅ SECOND TRIMESTER (Weeks 13–27)
    trimester2: [
        {
            id: "t2_bleeding",
            label: "Any vaginal bleeding",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Placenta previa or abruption risk",
            requiresImmediate: true
        },
        {
            id: "t2_swelling",
            label: "Sudden swelling of face or hands",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Pre-eclampsia warning sign",
            requiresImmediate: true,
            normalInfo: "Mild swelling of feet or ankles is normal due to fluid retention."
        },
        {
            id: "t2_mild_swelling",
            label: "Mild swelling in feet or hands",
            severity: "Normal",
            action: "Reassure",
            medicalReason: "Common during pregnancy due to increased blood volume",
            requiresImmediate: false
        },
        {
            id: "t2_headache",
            label: "Mild headache",
            severity: "Normal",
            action: "Reassure",
            medicalReason: "Hormonal changes, dehydration, or posture-related headaches",
            requiresImmediate: false
        },
        {
            id: "t2_headache_vision",
            label: "Severe headache with vision changes",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Pre-eclampsia neurological symptom",
            requiresImmediate: true
        },
        {
            id: "t2_uti_symptoms",
            label: "Burning urination with fever",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Pyelonephritis (Kidney infection) risk",
            requiresImmediate: true
        },
        {
            id: "t2_cramping",
            label: "Severe abdominal cramping",
            severity: "Monitor",
            action: "Consult Doctor Now",
            medicalReason: "Risk of preterm labor",
            requiresImmediate: true
        }
    ],

    // ✅ THIRD TRIMESTER (Weeks 28–42)
    trimester3: [
        {
            id: "t3_movement",
            label: "Reduced or no fetal movement",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Fetal distress / Stillbirth risk",
            requiresImmediate: true,
            normalInfo: "Fetal movement patterns vary; occasional dips are normal. Track daily counts."
        },
        {
            id: "t3_regular_movement",
            label: "Normal fetal movement",
            severity: "Normal",
            action: "Reassure",
            medicalReason: "Indicates healthy fetal activity",
            requiresImmediate: false
        },
        {
            id: "t3_bleeding",
            label: "Vaginal bleeding",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Placental abruption / Previa / Vasa previa",
            requiresImmediate: true
        },
        {
            id: "t3_fluid",
            label: "Leaking fluid / Water breaking",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "PROM (Premature Rupture of Membranes)",
            requiresImmediate: true
        },
        {
            id: "t3_contractions",
            label: "Regular contractions (<37 weeks)",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Preterm labor",
            requiresImmediate: true
        },
        {
            id: "t3_mild_contractions",
            label: "Occasional Braxton Hicks contractions",
            severity: "Normal",
            action: "Reassure",
            medicalReason: "Common practice contractions in late pregnancy, not labor",
            requiresImmediate: false
        },
        {
            id: "t3_preeclampsia",
            label: "Severe headache / Blurred vision / Sudden swelling",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "Severe Pre-eclampsia",
            requiresImmediate: true
        },
        {
            id: "t3_epigastric",
            label: "Upper right abdominal pain",
            severity: "Emergency",
            action: "Consult Doctor Now",
            medicalReason: "HELLP Syndrome / Liver involvement",
            requiresImmediate: true
        }
    ],

    // 🔹 LAYER 4: FETAL MOVEMENT AI
    fetalMovementStrick: {
        minKicks: 10,
        windowHours: 2,
        severity: "Emergency",
        action: "Consult Doctor Now",
        medicalReason: "Reduced movement is associated with fetal distress and stillbirth",
        normalInfo: "Regular fetal movement counts above threshold indicate healthy activity."
    }
};

export const redFlagGeneralInfo = {
    disclaimer: "This tool does not replace medical advice. If you feel something is wrong, seek medical care immediately.",
    sources: ["ACOG Emergency Warning Signs", "WHO ANC Danger Signs", "NICE Maternity Safety Indicators"]
};
