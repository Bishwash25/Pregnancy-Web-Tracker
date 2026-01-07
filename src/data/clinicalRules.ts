export type ReportType = 'ultrasound' | 'blood_test' | 'vital_signs';
export type RiskLevel = 'normal' | 'mild' | 'urgent';
export type Trimester = 'first' | 'second' | 'third';

export interface ClinicalThreshold {
  parameter: string;
  unit: string;
  normalRange: { min?: number; max?: number };
  mildDeviation?: { min?: number; max?: number };
  urgentRange?: { min?: number; max?: number };
  trimesterSpecific?: {
    first?: { min?: number; max?: number };
    second?: { min?: number; max?: number };
    third?: { min?: number; max?: number };
  };
  source: string;
}

export const hemoglobinThresholds: ClinicalThreshold = {
  parameter: 'Hemoglobin',
  unit: 'g/dL',
  normalRange: { min: 11.0 },
  trimesterSpecific: {
    first: { min: 11.0 },
    second: { min: 10.5 },
    third: { min: 11.0 }
  },
  source: 'WHO/ACOG Guidelines'
};

export const bloodPressureThresholds = {
  systolic: {
    parameter: 'Systolic Blood Pressure',
    unit: 'mmHg',
    normalRange: { max: 140 },
    mildDeviation: { min: 140, max: 160 },
    urgentRange: { min: 160 },
    source: 'ACOG Guidelines'
  },
  diastolic: {
    parameter: 'Diastolic Blood Pressure',
    unit: 'mmHg',
    normalRange: { max: 90 },
    mildDeviation: { min: 90, max: 110 },
    urgentRange: { min: 110 },
    source: 'ACOG Guidelines'
  }
};

export const glucoseThresholds = {
  fasting: {
    parameter: 'Fasting Glucose',
    unit: 'mg/dL',
    normalRange: { max: 92 },
    source: 'ACOG GDM Screening (24-28 weeks)'
  },
  oneHour: {
    parameter: '1-Hour Glucose',
    unit: 'mg/dL',
    normalRange: { max: 180 },
    source: 'ACOG GDM Screening (24-28 weeks)'
  },
  twoHour: {
    parameter: '2-Hour Glucose',
    unit: 'mg/dL',
    normalRange: { max: 153 },
    source: 'ACOG GDM Screening (24-28 weeks)'
  }
};

export const ultrasoundThresholds = {
  fetalHeartRate: {
    parameter: 'Fetal Heart Rate',
    unit: 'bpm',
    normalRange: { min: 110, max: 160 },
    source: 'ACOG Guidelines'
  },
  amnioticFluidIndex: {
    parameter: 'Amniotic Fluid Index (AFI)',
    unit: 'cm',
    normalRange: { min: 8, max: 24 },
    urgentRange: { max: 5 },
    source: 'ACOG Guidelines'
  },
  efwPercentile: {
    parameter: 'Estimated Fetal Weight Percentile',
    unit: '%',
    normalRange: { min: 10, max: 90 },
    source: 'ACOG Guidelines'
  },
  cervicalLength: {
    parameter: 'Cervical Length',
    unit: 'cm',
    normalRange: { min: 2.5 },
    source: 'ACOG Guidelines (mid-pregnancy)'
  }
};

export const gestationalNorms: Record<number, {
  babySize: string;
  keyDevelopments: string[];
  typicalSymptoms: string[];
  normalValues: {
    fetalHeartRate: { min: number; max: number };
    expectedMovements: string;
  };
}> = {
  4: {
    babySize: 'poppy seed',
    keyDevelopments: ['Implantation occurring', 'Amniotic sac forming'],
    typicalSymptoms: ['Missed period', 'Mild cramping'],
    normalValues: { fetalHeartRate: { min: 80, max: 100 }, expectedMovements: 'Not detectable' }
  },
  5: {
    babySize: 'sesame seed',
    keyDevelopments: ['Heart begins to beat', 'Neural tube forming'],
    typicalSymptoms: ['Nausea', 'Breast tenderness'],
    normalValues: { fetalHeartRate: { min: 90, max: 110 }, expectedMovements: 'Not detectable' }
  },
  6: {
    babySize: 'lentil',
    keyDevelopments: ['Heart dividing into chambers', 'Facial features forming'],
    typicalSymptoms: ['Morning sickness', 'Fatigue'],
    normalValues: { fetalHeartRate: { min: 100, max: 120 }, expectedMovements: 'Not detectable' }
  },
  7: {
    babySize: 'blueberry',
    keyDevelopments: ['Brain developing rapidly', 'Limb buds forming'],
    typicalSymptoms: ['Frequent urination', 'Food aversions'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Not detectable' }
  },
  8: {
    babySize: 'kidney bean',
    keyDevelopments: ['Fingers and toes forming', 'Eyelids developing'],
    typicalSymptoms: ['Bloating', 'Mood changes'],
    normalValues: { fetalHeartRate: { min: 140, max: 170 }, expectedMovements: 'Not detectable' }
  },
  9: {
    babySize: 'grape',
    keyDevelopments: ['All essential organs begun', 'Muscles developing'],
    typicalSymptoms: ['Heightened sense of smell', 'Mild cramping'],
    normalValues: { fetalHeartRate: { min: 140, max: 170 }, expectedMovements: 'Not detectable' }
  },
  10: {
    babySize: 'kumquat',
    keyDevelopments: ['Bones hardening', 'Vital organs functioning'],
    typicalSymptoms: ['Round ligament pain', 'Visible veins'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Not detectable' }
  },
  11: {
    babySize: 'fig',
    keyDevelopments: ['Hair follicles forming', 'Genitals developing'],
    typicalSymptoms: ['Leg cramps', 'Growing appetite'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Not detectable' }
  },
  12: {
    babySize: 'lime',
    keyDevelopments: ['Reflexes developing', 'Digestive system practicing'],
    typicalSymptoms: ['Nausea decreasing', 'Energy returning'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Not detectable' }
  },
  13: {
    babySize: 'peach',
    keyDevelopments: ['Fingerprints forming', 'Vocal cords developing'],
    typicalSymptoms: ['Increased energy', 'Visible baby bump'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Possible fluttering' }
  },
  14: {
    babySize: 'lemon',
    keyDevelopments: ['Facial muscles working', 'Kidneys producing urine'],
    typicalSymptoms: ['Reduced nausea', 'Nasal congestion'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Possible fluttering' }
  },
  15: {
    babySize: 'apple',
    keyDevelopments: ['Bones becoming visible on ultrasound', 'Taste buds forming'],
    typicalSymptoms: ['Growing appetite', 'Skin changes'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Possible fluttering' }
  },
  16: {
    babySize: 'avocado',
    keyDevelopments: ['Eyes moving', 'Limbs coordinating'],
    typicalSymptoms: ['Quickening (first movements)', 'Backaches'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Flutters beginning' }
  },
  17: {
    babySize: 'turnip',
    keyDevelopments: ['Skeleton hardening', 'Sweat glands developing'],
    typicalSymptoms: ['Round ligament pain', 'Sciatic nerve pain'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Flutters common' }
  },
  18: {
    babySize: 'bell pepper',
    keyDevelopments: ['Ears in final position', 'Myelin coating nerves'],
    typicalSymptoms: ['Increased appetite', 'Dizziness'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Noticeable movements' }
  },
  19: {
    babySize: 'tomato',
    keyDevelopments: ['Vernix coating skin', 'Sensory development'],
    typicalSymptoms: ['Hip pain', 'Skin stretching'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Regular movements' }
  },
  20: {
    babySize: 'banana',
    keyDevelopments: ['Halfway point', 'Swallowing amniotic fluid'],
    typicalSymptoms: ['Shortness of breath', 'Leg cramps'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Regular movements' }
  },
  21: {
    babySize: 'carrot',
    keyDevelopments: ['Eyelids and eyebrows formed', 'Coordinated movements'],
    typicalSymptoms: ['Varicose veins', 'Stretch marks'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: 'Regular movements' }
  },
  22: {
    babySize: 'papaya',
    keyDevelopments: ['Eyes formed but iris lacks color', 'Lips more distinct'],
    typicalSymptoms: ['Swelling', 'Braxton Hicks beginning'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/day' }
  },
  23: {
    babySize: 'mango',
    keyDevelopments: ['Hearing developed', 'Rapid weight gain'],
    typicalSymptoms: ['Swollen ankles', 'Gum sensitivity'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/day' }
  },
  24: {
    babySize: 'ear of corn',
    keyDevelopments: ['Lungs developing surfactant', 'Viability milestone'],
    typicalSymptoms: ['Glucose screening time', 'Linea nigra'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/day' }
  },
  25: {
    babySize: 'rutabaga',
    keyDevelopments: ['Fat deposits forming', 'Nostrils opening'],
    typicalSymptoms: ['Hemorrhoids', 'Heartburn'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/day' }
  },
  26: {
    babySize: 'scallion',
    keyDevelopments: ['Eyes opening', 'Brain waves active'],
    typicalSymptoms: ['Trouble sleeping', 'Back pain'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/day' }
  },
  27: {
    babySize: 'cauliflower',
    keyDevelopments: ['Regular sleep-wake cycles', 'Hiccups common'],
    typicalSymptoms: ['Restless legs', 'Pelvic pressure'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/day' }
  },
  28: {
    babySize: 'eggplant',
    keyDevelopments: ['Third trimester begins', 'REM sleep occurring'],
    typicalSymptoms: ['Shortness of breath', 'Frequent urination'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  29: {
    babySize: 'butternut squash',
    keyDevelopments: ['Bones fully developed', 'Storing calcium and iron'],
    typicalSymptoms: ['Constipation', 'Hemorrhoids'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  30: {
    babySize: 'cabbage',
    keyDevelopments: ['Brain controlling body temperature', 'Gaining weight rapidly'],
    typicalSymptoms: ['Mood swings', 'Fatigue returning'],
    normalValues: { fetalHeartRate: { min: 120, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  31: {
    babySize: 'coconut',
    keyDevelopments: ['Processing sensory information', 'Tracking light'],
    typicalSymptoms: ['Leaky breasts', 'Braxton Hicks'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  32: {
    babySize: 'squash',
    keyDevelopments: ['Toenails grown', 'Practicing breathing'],
    typicalSymptoms: ['Heartburn', 'Shortness of breath'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  33: {
    babySize: 'pineapple',
    keyDevelopments: ['Bones hardening', 'Skull remaining soft'],
    typicalSymptoms: ['Heat intolerance', 'Clumsiness'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  34: {
    babySize: 'cantaloupe',
    keyDevelopments: ['Vernix thickening', 'Central nervous system maturing'],
    typicalSymptoms: ['Vision changes', 'Fatigue'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  35: {
    babySize: 'honeydew melon',
    keyDevelopments: ['Kidneys fully developed', 'Liver processing waste'],
    typicalSymptoms: ['Frequent urination', 'Pelvic pressure'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  36: {
    babySize: 'romaine lettuce',
    keyDevelopments: ['Shedding lanugo', 'Immune system ready'],
    typicalSymptoms: ['Lightning crotch', 'Nesting instinct'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  37: {
    babySize: 'winter melon',
    keyDevelopments: ['Full term begins', 'Head engaging in pelvis'],
    typicalSymptoms: ['Easier breathing', 'Increased discharge'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  38: {
    babySize: 'leek',
    keyDevelopments: ['Organ function mature', 'Meconium forming'],
    typicalSymptoms: ['Cervical changes', 'Bloody show possible'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  39: {
    babySize: 'mini watermelon',
    keyDevelopments: ['Brain and lungs continue developing', 'Fat accumulating'],
    typicalSymptoms: ['Irregular contractions', 'Nesting'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  40: {
    babySize: 'small pumpkin',
    keyDevelopments: ['Due date week', 'Ready for birth'],
    typicalSymptoms: ['Cervical dilation', 'Contractions'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  41: {
    babySize: 'small pumpkin',
    keyDevelopments: ['Late term', 'Monitoring recommended'],
    typicalSymptoms: ['Labor signs', 'Increased monitoring'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  },
  42: {
    babySize: 'small pumpkin',
    keyDevelopments: ['Post-term', 'Induction likely discussed'],
    typicalSymptoms: ['Increased monitoring', 'Possible induction'],
    normalValues: { fetalHeartRate: { min: 110, max: 160 }, expectedMovements: '10+ movements/2hr' }
  }
};

export function getTrimester(week: number): Trimester {
  if (week <= 12) return 'first';
  if (week <= 27) return 'second';
  return 'third';
}

export function getHemoglobinNormal(week: number): number {
  const trimester = getTrimester(week);
  return hemoglobinThresholds.trimesterSpecific?.[trimester]?.min || 11.0;
}

export function evaluateHemoglobin(value: number, week: number): { level: RiskLevel; message: string } {
  const normalMin = getHemoglobinNormal(week);
  const trimester = getTrimester(week);
  
  if (value >= normalMin) {
    return { level: 'normal', message: `Hemoglobin is within the normal range for the ${trimester} trimester.` };
  } else if (value >= normalMin - 1) {
    return { level: 'mild', message: `Hemoglobin is slightly below the expected range (${normalMin} g/dL) for the ${trimester} trimester.` };
  }
  return { level: 'urgent', message: `Hemoglobin is significantly below normal for the ${trimester} trimester. Medical review recommended.` };
}

export function evaluateBloodPressure(systolic: number, diastolic: number): { level: RiskLevel; message: string } {
  if (systolic >= 160 || diastolic >= 110) {
    return { level: 'urgent', message: 'Blood pressure is in the urgent range. Please contact your healthcare provider today.' };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { level: 'mild', message: 'Blood pressure is elevated and may need evaluation at your next appointment.' };
  }
  return { level: 'normal', message: 'Blood pressure is within the normal range for pregnancy.' };
}

export function evaluateGlucose(fasting?: number, oneHour?: number, twoHour?: number): { level: RiskLevel; message: string } {
  const abnormalCount = [
    fasting && fasting >= 92,
    oneHour && oneHour >= 180,
    twoHour && twoHour >= 153
  ].filter(Boolean).length;
  
  if (abnormalCount >= 2) {
    return { level: 'urgent', message: 'Multiple glucose values are above threshold. Follow-up with your healthcare provider is important.' };
  }
  if (abnormalCount === 1) {
    return { level: 'mild', message: 'One glucose value is slightly elevated. Your provider may recommend monitoring.' };
  }
  return { level: 'normal', message: 'Glucose values are within the normal screening range.' };
}

export function evaluateAFI(value: number): { level: RiskLevel; message: string } {
  if (value < 5) {
    return { level: 'urgent', message: 'Amniotic fluid index is low. Please contact your healthcare provider promptly.' };
  }
  if (value < 8 || value > 24) {
    return { level: 'mild', message: 'Amniotic fluid index is outside the typical range. Monitoring may be recommended.' };
  }
  return { level: 'normal', message: 'Amniotic fluid index is within the normal range.' };
}

export function evaluateFetalHeartRate(value: number): { level: RiskLevel; message: string } {
  if (value < 110 || value > 160) {
    return { level: 'mild', message: 'Fetal heart rate is outside the typical range. Your provider may want to investigate further.' };
  }
  return { level: 'normal', message: 'Fetal heart rate is within the normal range.' };
}

export function evaluateCervicalLength(value: number, week: number): { level: RiskLevel; message: string } {
  if (week < 24 && value < 2.5) {
    return { level: 'urgent', message: 'Cervical length is short for this stage of pregnancy. Please discuss with your provider.' };
  }
  if (value < 2.5) {
    return { level: 'mild', message: 'Cervical length may need monitoring. Discuss with your healthcare provider.' };
  }
  return { level: 'normal', message: 'Cervical length is within the normal range.' };
}

export interface ExtractedReportData {
  reportType: ReportType;
  gestationalAgeReported?: string;
  values: {
    hemoglobin?: { value: number; unit: string };
    bloodPressure?: { systolic: number; diastolic: number; unit: string };
    glucose?: { fasting?: number; oneHour?: number; twoHour?: number; unit: string };
    ultrasound?: {
      fhr?: number;
      afi?: number;
      efwPercentile?: number;
      placentaPosition?: string;
      cervicalLength?: number;
      gestationalAge?: string;
    };
  };
  reportDate?: string;
}

export const FORBIDDEN_OUTPUT_PATTERNS = [
  /you have\s+[a-z]+/i,
  /diagnosed\s+with/i,
  /you are diagnosed/i,
  /take\s+\d+\s*mg/i,
  /take\s+\d+\s*ml/i,
  /start medication/i,
  /prescribe/i,
  /this means you have/i,
  /you suffer from/i,
  /your condition is/i
];

export function validateAIOutput(output: string): { isValid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  for (const pattern of FORBIDDEN_OUTPUT_PATTERNS) {
    if (pattern.test(output)) {
      violations.push(`Contains forbidden phrase matching: ${pattern.source}`);
    }
  }
  
  if (!output.toLowerCase().includes('week')) {
    violations.push('Output should reference gestational week');
  }
  
  return {
    isValid: violations.length === 0,
    violations
  };
}

export const SAFE_ESCALATION_MESSAGE = "These findings may require prompt medical review. Please contact your healthcare provider today.";

export const DISCLAIMER = "This explanation is for pregnancy education only and does not replace medical advice. Always consult your healthcare provider for personalized guidance. Note: Complete medical records and history are required for a definitive clinical assessment.";
