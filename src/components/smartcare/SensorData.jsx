// Simulated real-time sensor data
export const INVERTERS = [
  { id: 'inv1', name: 'ממיר 1 (SolarEdge)', outputKw: 3.8, tempC: 42, efficiency: 97, status: 'ok', voltage: 238, freq: 50.0 },
  { id: 'inv2', name: 'ממיר 2 (Huawei)', outputKw: 1.2, tempC: 61, efficiency: 71, status: 'fault', voltage: 231, freq: 49.8 },
];

export const PANELS = [
  { id: 'p1', name: 'פאנל A', efficiency: 94, issueType: null, lastCleaned: 14 },
  { id: 'p2', name: 'פאנל B', efficiency: 87, issueType: 'dust', lastCleaned: 14 },
  { id: 'p3', name: 'פאנל C', efficiency: 91, issueType: null, lastCleaned: 14 },
  { id: 'p4', name: 'פאנל D', efficiency: 63, issueType: 'microcrack', lastCleaned: 14 },
  { id: 'p5', name: 'פאנל E', efficiency: 88, issueType: 'dust', lastCleaned: 14 },
  { id: 'p6', name: 'פאנל F', efficiency: 96, issueType: null, lastCleaned: 14 },
];

export const WEATHER = { temp: 27, humidity: 58, uv: 8.2, wind: 14, clouds: 12 };

export const AI_ALERTS = [
  {
    id: 'a1',
    severity: 'critical',
    title: 'מיקרו-סדקים בפאנל D',
    detail: 'AI זיהה דפוס ירידת מתח עקבית המצביע על מיקרו-סדקים. יעילות ירדה ל-63%. המשך שימוש עלול להחמיר את הנזק.',
    icon: '⚡',
    panel: 'פאנל D',
    suggestedService: 'repair',
    estimatedLoss: '₪42/חודש',
  },
  {
    id: 'a2',
    severity: 'warning',
    title: 'ממיר 2 – טמפרטורת יתר',
    detail: 'ממיר 2 מדווח על 61°C – מעל הסף הבטוח (55°C). מומלץ בדיקה לפני נזק קבוע.',
    icon: '🌡️',
    panel: 'ממיר 2',
    suggestedService: 'inspect',
    estimatedLoss: '₪18/חודש',
  },
  {
    id: 'a3',
    severity: 'info',
    title: 'צבירת אבק – פאנלים B ו-E',
    detail: 'לא בוצע ניקוי 14 ימים. מדדי הפחתת הקרינה מצביעים על הפסד יעילות של כ-8%.',
    icon: '💨',
    panel: 'פאנלים B, E',
    suggestedService: 'clean',
    estimatedLoss: '₪24/חודש',
  },
];

export const SERVICES = [
  {
    id: 'clean',
    title: 'ניקוי פאנלים מקצועי',
    desc: 'ניקוי עם מים מינרליים ומגב מיוחד. ללא שריטות.',
    price: '₪280',
    time: '2–3 שעות',
    icon: '🧹',
    rating: 4.8,
    reviews: 312,
  },
  {
    id: 'inspect',
    title: 'בדיקת מערכת מלאה',
    desc: 'בדיקת ממירים, חיווט, ומדידות EL למיקרו-סדקים.',
    price: '₪490',
    time: 'יום עסקים',
    icon: '🔍',
    rating: 4.9,
    reviews: 187,
  },
  {
    id: 'repair',
    title: 'תיקון ממיר / פאנל',
    desc: 'תיקון ממירים תקולים, החלפת פאנלים פגועים.',
    price: 'מ-₪350',
    time: 'לפי צורך',
    icon: '🔧',
    rating: 4.7,
    reviews: 95,
  },
];