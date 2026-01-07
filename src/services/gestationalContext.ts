import { 
  getTrimester, 
  gestationalNorms, 
  type Trimester,
  type ExtractedReportData 
} from '@/data/clinicalRules';

export interface GestationalContext {
  week: number;
  trimester: Trimester;
  trimesterName: string;
  babySize: string;
  keyDevelopments: string[];
  typicalSymptoms: string[];
  normalFetalHeartRate: { min: number; max: number };
  expectedMovements: string;
  weekDescription: string;
}

export function getGestationalContext(week: number): GestationalContext {
  const clampedWeek = Math.min(Math.max(week, 4), 42);
  const trimester = getTrimester(clampedWeek);
  const norms = gestationalNorms[clampedWeek] || gestationalNorms[20];
  
  const trimesterNames: Record<Trimester, string> = {
    first: 'First Trimester (Weeks 1-12)',
    second: 'Second Trimester (Weeks 13-27)',
    third: 'Third Trimester (Weeks 28-40+)'
  };
  
  const weekDescriptions: Record<Trimester, string> = {
    first: `During the first trimester at week ${clampedWeek}, your baby's major organs are forming. Nausea, fatigue, and breast tenderness are common.`,
    second: `At week ${clampedWeek} in the second trimester, your energy typically increases and you may start feeling baby movements. The baby is growing rapidly.`,
    third: `In the third trimester at week ${clampedWeek}, your baby is gaining weight and preparing for birth. You may experience more discomfort as the baby grows.`
  };
  
  return {
    week: clampedWeek,
    trimester,
    trimesterName: trimesterNames[trimester],
    babySize: norms.babySize,
    keyDevelopments: norms.keyDevelopments,
    typicalSymptoms: norms.typicalSymptoms,
    normalFetalHeartRate: norms.normalValues.fetalHeartRate,
    expectedMovements: norms.normalValues.expectedMovements,
    weekDescription: weekDescriptions[trimester]
  };
}

export interface ClinicalContextForAI {
  gestationalWeek: number;
  trimester: string;
  weekContext: string;
  normalRanges: {
    hemoglobin: string;
    bloodPressure: string;
    glucose: string;
    fetalHeartRate: string;
    afi: string;
  };
  developmentContext: string;
}

export function buildClinicalContextForAI(week: number): ClinicalContextForAI {
  const context = getGestationalContext(week);
  const trimester = getTrimester(week);
  
  const hemoglobinNorms: Record<Trimester, string> = {
    first: '≥ 11.0 g/dL',
    second: '≥ 10.5 g/dL',
    third: '≥ 11.0 g/dL'
  };
  
  return {
    gestationalWeek: week,
    trimester: context.trimesterName,
    weekContext: context.weekDescription,
    normalRanges: {
      hemoglobin: hemoglobinNorms[trimester],
      bloodPressure: '< 140/90 mmHg (≥ 160/110 is urgent)',
      glucose: 'Fasting < 92, 1-hr < 180, 2-hr < 153 mg/dL',
      fetalHeartRate: `${context.normalFetalHeartRate.min}-${context.normalFetalHeartRate.max} bpm`,
      afi: '8-24 cm (< 5 cm is urgent)'
    },
    developmentContext: `At ${week} weeks, your baby is about the size of a ${context.babySize}. ` +
      `Key developments: ${context.keyDevelopments.join(', ')}. ` +
      `Expected movements: ${context.expectedMovements}.`
  };
}

export function formatExtractedDataForAI(
  extractedData: ExtractedReportData, 
  week: number
): string {
  const lines: string[] = [];
  
  lines.push(`Report Type: ${extractedData.reportType.replace('_', ' ')}`);
  
  if (extractedData.gestationalAgeReported) {
    lines.push(`Gestational Age (from report): ${extractedData.gestationalAgeReported}`);
  }
  
  if (extractedData.values.hemoglobin) {
    lines.push(`Hemoglobin: ${extractedData.values.hemoglobin.value} ${extractedData.values.hemoglobin.unit}`);
  }
  
  if (extractedData.values.bloodPressure) {
    const bp = extractedData.values.bloodPressure;
    lines.push(`Blood Pressure: ${bp.systolic}/${bp.diastolic} ${bp.unit}`);
  }
  
  if (extractedData.values.glucose) {
    const g = extractedData.values.glucose;
    if (g.fasting) lines.push(`Fasting Glucose: ${g.fasting} ${g.unit}`);
    if (g.oneHour) lines.push(`1-Hour Glucose: ${g.oneHour} ${g.unit}`);
    if (g.twoHour) lines.push(`2-Hour Glucose: ${g.twoHour} ${g.unit}`);
  }
  
  if (extractedData.values.ultrasound) {
    const us = extractedData.values.ultrasound;
    if (us.fhr) lines.push(`Fetal Heart Rate: ${us.fhr} bpm`);
    if (us.afi) lines.push(`Amniotic Fluid Index: ${us.afi} cm`);
    if (us.efwPercentile) lines.push(`EFW Percentile: ${us.efwPercentile}th percentile`);
    if (us.placentaPosition) lines.push(`Placenta Position: ${us.placentaPosition}`);
    if (us.cervicalLength) lines.push(`Cervical Length: ${us.cervicalLength} cm`);
  }
  
  return lines.join('\n');
}

export function getWeekFromReportedGA(gaString: string): number | null {
  const match = gaString.match(/(\d{1,2})\s*(?:weeks?|wks?)/i);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
}

export function shouldShowUrgentAlert(extractedData: ExtractedReportData): {
  urgent: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  
  if (extractedData.values.bloodPressure) {
    const { systolic, diastolic } = extractedData.values.bloodPressure;
    if (systolic >= 160 || diastolic >= 110) {
      reasons.push('Blood pressure is very high and may need immediate attention');
    }
  }
  
  if (extractedData.values.ultrasound?.afi && extractedData.values.ultrasound.afi < 5) {
    reasons.push('Amniotic fluid level is critically low');
  }
  
  if (extractedData.values.hemoglobin && extractedData.values.hemoglobin.value < 7) {
    reasons.push('Hemoglobin level is very low');
  }
  
  return {
    urgent: reasons.length > 0,
    reasons
  };
}
