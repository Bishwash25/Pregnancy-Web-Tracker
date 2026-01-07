import * as pdfjsLib from 'pdfjs-dist';
import { createWorker, OEM } from 'tesseract.js';
import { 
  type ExtractedReportData, 
  type ReportType 
} from '@/data/clinicalRules';

// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

export async function extractTextFromImage(file: File): Promise<string> {
  const worker = await createWorker('eng', OEM.LSTM_ONLY);
  const imageUrl = URL.createObjectURL(file);
  
  try {
    const { data: { text } } = await worker.recognize(imageUrl);
    return text;
  } finally {
    await worker.terminate();
    URL.revokeObjectURL(imageUrl);
  }
}

export function detectReportType(text: string): ReportType {
  const lowerText = text.toLowerCase();
  
  const ultrasoundKeywords = [
    'ultrasound', 'sonography', 'usg', 'fetal', 'gestational age',
    'bpd', 'hc', 'ac', 'fl', 'efw', 'afi', 'placenta', 'amniotic',
    'fhr', 'fetal heart', 'cervical length', 'nuchal'
  ];
  
  const bloodTestKeywords = [
    'hemoglobin', 'hb', 'hgb', 'cbc', 'complete blood count',
    'glucose', 'gtt', 'ogtt', 'hba1c', 'fasting', 'postprandial',
    'blood sugar', 'tsh', 'thyroid', 'platelet', 'wbc', 'rbc'
  ];
  
  const vitalKeywords = [
    'blood pressure', 'bp', 'systolic', 'diastolic', 'mmhg',
    'pulse', 'heart rate', 'weight', 'bmi', 'vital'
  ];
  
  const ultrasoundScore = ultrasoundKeywords.filter(k => lowerText.includes(k)).length;
  const bloodScore = bloodTestKeywords.filter(k => lowerText.includes(k)).length;
  const vitalScore = vitalKeywords.filter(k => lowerText.includes(k)).length;
  
  if (ultrasoundScore >= bloodScore && ultrasoundScore >= vitalScore) {
    return 'ultrasound';
  }
  if (bloodScore >= vitalScore) {
    return 'blood_test';
  }
  return 'vital_signs';
}

interface ExtractionPattern {
  patterns: RegExp[];
  extract: (match: RegExpMatchArray) => any;
}

const extractionPatterns: Record<string, ExtractionPattern> = {
  hemoglobin: {
    patterns: [
      /(?:hemoglobin|hb|hgb)[\s:]*(\d+\.?\d*)\s*(?:g\/dl|gm\/dl|g%)?/i,
      /(?:hb|hgb)\s*[-:]\s*(\d+\.?\d*)/i
    ],
    extract: (match) => ({ value: parseFloat(match[1]), unit: 'g/dL' })
  },
  bloodPressure: {
    patterns: [
      /(?:bp|blood pressure)[\s:]*(\d{2,3})\s*[\/\-]\s*(\d{2,3})/i,
      /(\d{2,3})\s*[\/]\s*(\d{2,3})\s*(?:mmhg|mm\s*hg)/i
    ],
    extract: (match) => ({ 
      systolic: parseInt(match[1]), 
      diastolic: parseInt(match[2]), 
      unit: 'mmHg' 
    })
  },
  fastingGlucose: {
    patterns: [
      /(?:fasting|fbs|fpg)[\s:]*(?:glucose|blood sugar)?[\s:]*(\d+\.?\d*)/i,
      /fasting[\s\S]{0,20}?(\d{2,3})\s*(?:mg\/dl)?/i
    ],
    extract: (match) => parseFloat(match[1])
  },
  postprandialGlucose: {
    patterns: [
      /(?:pp|postprandial|2\s*hr?|2\s*hour)[\s:]*(?:glucose|blood sugar)?[\s:]*(\d+\.?\d*)/i,
      /(?:2|two)\s*h(?:ou)?r[\s\S]{0,20}?(\d{2,3})/i
    ],
    extract: (match) => parseFloat(match[1])
  },
  oneHourGlucose: {
    patterns: [
      /(?:1\s*hr?|1\s*hour|one\s*hour)[\s:]*(?:glucose)?[\s:]*(\d+\.?\d*)/i
    ],
    extract: (match) => parseFloat(match[1])
  },
  fetalHeartRate: {
    patterns: [
      /(?:fhr|fetal heart rate|fetal heart)[\s:]*(\d{2,3})/i,
      /heart rate[\s:]*(\d{2,3})\s*(?:bpm)?/i
    ],
    extract: (match) => parseInt(match[1])
  },
  afi: {
    patterns: [
      /(?:afi|amniotic fluid index)[\s:]*(\d+\.?\d*)/i,
      /amniotic[\s\S]{0,30}?(\d+\.?\d*)\s*(?:cm)?/i
    ],
    extract: (match) => parseFloat(match[1])
  },
  efwPercentile: {
    patterns: [
      /(?:efw|estimated fetal weight)[\s\S]{0,30}?(\d{1,2})(?:th|st|nd|rd)?\s*(?:percentile|%ile)/i,
      /percentile[\s:]*(\d{1,2})/i
    ],
    extract: (match) => parseInt(match[1])
  },
  cervicalLength: {
    patterns: [
      /(?:cervical length|cx length|cervix)[\s:]*(\d+\.?\d*)\s*(?:cm|mm)?/i
    ],
    extract: (match) => {
      const value = parseFloat(match[1]);
      return value > 10 ? value / 10 : value;
    }
  },
  placentaPosition: {
    patterns: [
      /placenta[\s:]*(?:is\s*)?(?:located\s*)?(?:at\s*)?(anterior|posterior|fundal|lateral|low[\s-]?lying|previa)/i
    ],
    extract: (match) => match[1].toLowerCase()
  },
  gestationalAge: {
    patterns: [
      /(?:gestational age|ga)[\s:]*(\d{1,2})\s*(?:weeks?|wks?)\s*(?:and\s*)?(\d)?\s*(?:days?|d)?/i,
      /(\d{1,2})\s*w(?:eeks?)?\s*(?:and\s*)?(\d)?\s*d(?:ays?)?/i
    ],
    extract: (match) => `${match[1]} weeks${match[2] ? ` ${match[2]} days` : ''}`
  }
};

function extractValue(text: string, patternConfig: ExtractionPattern): any {
  for (const pattern of patternConfig.patterns) {
    const match = text.match(pattern);
    if (match) {
      return patternConfig.extract(match);
    }
  }
  return null;
}

export function parseReportText(text: string): ExtractedReportData {
  const reportType = detectReportType(text);
  
  const extractedData: ExtractedReportData = {
    reportType,
    values: {}
  };
  
  const hemoglobin = extractValue(text, extractionPatterns.hemoglobin);
  if (hemoglobin) {
    extractedData.values.hemoglobin = hemoglobin;
  }
  
  const bp = extractValue(text, extractionPatterns.bloodPressure);
  if (bp) {
    extractedData.values.bloodPressure = bp;
  }
  
  const fastingGlucose = extractValue(text, extractionPatterns.fastingGlucose);
  const oneHourGlucose = extractValue(text, extractionPatterns.oneHourGlucose);
  const twoHourGlucose = extractValue(text, extractionPatterns.postprandialGlucose);
  
  if (fastingGlucose || oneHourGlucose || twoHourGlucose) {
    extractedData.values.glucose = {
      fasting: fastingGlucose,
      oneHour: oneHourGlucose,
      twoHour: twoHourGlucose,
      unit: 'mg/dL'
    };
  }
  
  const fhr = extractValue(text, extractionPatterns.fetalHeartRate);
  const afi = extractValue(text, extractionPatterns.afi);
  const efwPercentile = extractValue(text, extractionPatterns.efwPercentile);
  const cervicalLength = extractValue(text, extractionPatterns.cervicalLength);
  const placentaPosition = extractValue(text, extractionPatterns.placentaPosition);
  const gestationalAge = extractValue(text, extractionPatterns.gestationalAge);
  
  if (fhr || afi || efwPercentile || cervicalLength || placentaPosition || gestationalAge) {
    extractedData.values.ultrasound = {
      fhr,
      afi,
      efwPercentile,
      cervicalLength,
      placentaPosition,
      gestationalAge
    };
  }
  
  if (gestationalAge) {
    extractedData.gestationalAgeReported = gestationalAge;
  }
  
  const datePatterns = [
    /(?:date|dated?)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      extractedData.reportDate = match[1];
      break;
    }
  }
  
  return extractedData;
}

export async function processReport(file: File): Promise<{
  rawText: string;
  extractedData: ExtractedReportData;
  confidence: number;
}> {
  const isPDF = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');
  
  let rawText: string;
  let confidence = 1.0;
  
  if (isPDF) {
    rawText = await extractTextFromPDF(file);
  } else if (isImage) {
    rawText = await extractTextFromImage(file);
    confidence = 0.85;
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or image file.');
  }
  
  const extractedData = parseReportText(rawText);
  
  const hasValues = Object.keys(extractedData.values).length > 0;
  if (!hasValues) {
    confidence *= 0.5;
  }
  
  return {
    rawText,
    extractedData,
    confidence
  };
}

export function sanitizeForPrivacy(text: string): string {
  let sanitized = text;
  
  sanitized = sanitized.replace(/(?:dr\.?|doctor)\s+[a-z]+\s+[a-z]+/gi, '[PROVIDER]');
  sanitized = sanitized.replace(/(?:patient|name)[\s:]+[a-z]+\s+[a-z]+/gi, '[PATIENT]');
  sanitized = sanitized.replace(/(?:mrn|uhid|patient id|id)[\s:]+[\w\-]+/gi, '[ID]');
  sanitized = sanitized.replace(/(?:phone|mobile|contact)[\s:]+[\d\-\+\s]+/gi, '[PHONE]');
  
  return sanitized;
}
