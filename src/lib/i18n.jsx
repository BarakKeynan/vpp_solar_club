import React, { createContext, useContext, useState } from 'react';

export const translations = {
  he: {
    // Bottom Nav
    nav_home: 'בית',
    nav_schedule: 'תזמון',
    nav_savings: 'חיסכון',
    nav_profile: 'פרופיל',
    nav_more: 'עוד',

    // Dashboard / VPP Home
    vpp_home_title: 'VPP הבית שלי',
    vpp_home_subtitle: 'מערכת אנרגיה ביתית',
    vpp_mode_home: '🏠 VPP Home',
    vpp_mode_club: '☀️ Solar Club',
    autopilot_label: 'טייס אוטומטי – ACTIVE',
    autopilot_subtitle: 'ניהול מסחר אוטונומי מול נגה',
    autopilot_active: 'ACTIVE',
    autopilot_manual: 'ידני',
    autopilot_on_msg: 'מצב אופטימיזציה אקטיבית הופעל – המערכת מנהלת מסחר אוטונומי מול נגה',
    autopilot_off_msg: 'מצב ידני הופעל – אין פעולות אוטומטיות',
    autopilot_auto_trades: 'פעולות אוטומטיות',
    autopilot_surplus: 'רווח עודף שנצבר',
    autopilot_active_msg: 'ברק, המערכת במצב אופטימיזציה אקטיבית.',
    autopilot_managing: 'המערכת מנהלת כעת את המסחר מול נגה באופן אוטונומי.',
    savings_today: 'חיסכון היום',
    savings_month: 'החודש',
    energy_flow: 'זרימת אנרגיה',
    sun: 'שמש',
    battery: 'סוללה',
    house: 'בית',
    ev: 'רכב חשמלי',
    charging: 'טוען',
    grid: 'רשת',
    exporting: 'מייצא',
    charge_battery: 'טען סוללה',
    sell_grid: 'מכור לרשת',
    charge_ev: 'טען רכב',
    production_today: 'ייצור היום',
    consumption: 'צריכה',
    sold_to_grid: 'נמכר לרשת',
    my_solar_farm: 'החווה הסולארית שלי',
    farm_subtitle: 'גלבוע פאוור · 3 יחידות · ROI 10.4%',
    alerts_title: 'הזדמנויות וניהול נכס – נדרש אישור ידני',
    alert_cleaning_title: 'נצילות הפאנלים ירדה ל-85%',
    alert_cleaning_desc: 'זיהינו ירידה עקב לכלוך. ניקוי יחזיר ~8% ייצור.',
    alert_cleaning_action: 'הזמן ניקוי (₪280)',
    alert_farm_title: 'מכסה חדשה בחוות גלבוע',
    alert_farm_desc: 'תשואה 10.4% שנתית. ניתן להוסיף 5 יחידות ייצור לתיק.',
    alert_farm_action: 'בדוק היתכנות',
    alert_inverter_title: 'זוהתה תקלה בממיר',
    alert_inverter_desc: 'ממיר מספר 2 מדווח על תקלת תקשורת. מומלץ לתאם טכנאי.',
    alert_inverter_action: 'תאם טכנאי',

    // Smart Care
    smartcare_title: 'Smart Care AI',
    smartcare_subtitle: 'ניטור ממירים ופאנלים בזמן אמת',
    scan_ai: 'סריקת AI',
    scanning: 'סורק...',
    ai_diagnosis: 'אבחון AI',
    updated: 'עדכון',
    ago: 'לפני',
    scan_prompt: 'לחץ "סריקת AI" לאבחון מלא של המערכת',
    predictive_alerts: 'התראות חזויות',
    active: 'פעילות',
    inverter_health: 'בריאות ממירים',
    fault: '1 תקלה',
    panel_status: 'מצב פאנלים',
    professional_service: 'הזמנת שירות מקצועי',
    overall_efficiency: 'יעילות כוללת',
    avg_panels: 'ממוצע {n} פאנלים',
    env_conditions: 'תנאי סביבה',
    humidity: 'לחות',
    wind_speed: 'רוח {v} קמ"ש',
    book_repair: 'הזמן תיקון ←',
    estimated_loss: 'הפסד מוערך',
    critical: 'קריטי',
    warning: 'אזהרה',
    info: 'מידע',
    book_service: 'הזמן ←',
    output: 'תפוקה',
    temperature: 'טמפרטורה',
    efficiency: 'יעילות',
    ok_status: 'תקין',
    fault_status: 'תקלה',
    microcrack: 'מיקרו-סדקים',
    dust: 'אבק',

    // Booking Modal
    booking_date: 'בחר תאריך',
    booking_time: 'בחר שעה',
    booking_note: 'הערה לטכנאי (אופציונלי)...',
    booking_confirm: 'אשר הזמנה ←',
    booking_confirmed: 'ההזמנה אושרה!',
    booking_followup: 'טכנאי יצור איתך קשר 30 דקות לפני ההגעה',
    close: 'סגור',
    ratings: 'דירוגים',

    // Profile
    profile_title: 'פרופיל טכני וחיבורים',
    active_connections: 'חיבורים פעילים',
    community: 'קהילה וסינדיקט',
    neighborhood: 'שיוך שכונתי',
    syndicate_status: 'סטטוס סינדיקט',
    account_info: 'פרטי חשבון',
    documents: 'מסמכים וחוזים',
    logout: 'התנתק',
    email_label: 'דואל',
    system_type: 'סוג מערכת',
    tariff: 'תעריף חשמל',
    savings_this_month: 'חיסכון החודש',
    production_year: 'ייצור השנה',
    carbon_saved: 'פחמן חסכתי',
    club_shares: 'מניות Solar Club',

    // More
    more_title: 'שירותים נוספים',

    // Marketplace
    marketplace_title: 'Solar Farm Marketplace',
    farms_count: 'חוות ברשת',
    avg_yield: 'תשואה ממוצעת',
    shares_available: 'מניות זמינות',
    sort_yield: 'תשואה',
    sort_price: 'מחיר',
    sort_change: 'שינוי',
    buy_shares: 'רכוש מניות',
    share_price: 'מחיר מניה',
    annual_yield: 'תשואה שנתית',
    availability: 'זמינות',
    shares_count: 'כמות מניות',
    buy_cta: 'רכוש {qty} מניות · ₪{total}',

    // Schedule
    schedule_title: 'תזמון',

    // Savings
    savings_title: 'חיסכון',

    // Settings
    settings_title: 'הגדרות',
  },

  en: {
    // Bottom Nav
    nav_home: 'Home',
    nav_schedule: 'Schedule',
    nav_savings: 'Savings',
    nav_profile: 'Profile',
    nav_more: 'More',

    // Dashboard / VPP Home
    vpp_home_title: 'My VPP Home',
    vpp_home_subtitle: 'Home Energy System',
    vpp_mode_home: '🏠 VPP Home',
    vpp_mode_club: '☀️ Solar Club',
    autopilot_label: 'Auto-Pilot – ACTIVE',
    autopilot_subtitle: 'Autonomous trading with Noga Grid',
    autopilot_active: 'ACTIVE',
    autopilot_manual: 'Manual',
    autopilot_on_msg: 'Active optimization mode enabled – system is managing autonomous trades with Noga',
    autopilot_off_msg: 'Manual mode enabled – no automatic actions',
    autopilot_auto_trades: 'Automated Trades',
    autopilot_surplus: 'Surplus Profit Earned',
    autopilot_active_msg: 'Your system is in active optimization mode.',
    autopilot_managing: 'The system is now autonomously managing trades with Noga.',
    savings_today: "Today's Savings",
    savings_month: 'This Month',
    energy_flow: 'Energy Flow',
    sun: 'Solar',
    battery: 'Battery',
    house: 'Home',
    ev: 'Electric Vehicle',
    charging: 'Charging',
    grid: 'Grid',
    exporting: 'Exporting',
    charge_battery: 'Charge Battery',
    sell_grid: 'Sell to Grid',
    charge_ev: 'Charge EV',
    production_today: "Today's Production",
    consumption: 'Consumption',
    sold_to_grid: 'Sold to Grid',
    my_solar_farm: 'My Solar Farm',
    farm_subtitle: 'Gilboa Power · 3 units · ROI 10.4%',
    alerts_title: 'Opportunities & Asset Management – Manual Approval Required',
    alert_cleaning_title: 'Panel Efficiency Dropped to 85%',
    alert_cleaning_desc: 'We detected a drop due to dirt. Cleaning will restore ~8% output.',
    alert_cleaning_action: 'Book Cleaning (₪280)',
    alert_farm_title: 'New Quota at Gilboa Farm',
    alert_farm_desc: '10.4% annual yield. You can add 5 production units to your portfolio.',
    alert_farm_action: 'Check Feasibility',
    alert_inverter_title: 'Inverter Fault Detected',
    alert_inverter_desc: 'Inverter #2 reports a communication fault. Recommended to schedule a technician.',
    alert_inverter_action: 'Schedule Technician',

    // Smart Care
    smartcare_title: 'Smart Care AI',
    smartcare_subtitle: 'Real-time inverter & panel monitoring',
    scan_ai: 'AI Scan',
    scanning: 'Scanning...',
    ai_diagnosis: 'AI Diagnosis',
    updated: 'Updated',
    ago: 'ago',
    scan_prompt: 'Press "AI Scan" for a full system diagnosis',
    predictive_alerts: 'Predictive Alerts',
    active: 'active',
    inverter_health: 'Inverter Health',
    fault: '1 Fault',
    panel_status: 'Panel Status',
    professional_service: 'Book Professional Service',
    overall_efficiency: 'Overall Efficiency',
    avg_panels: 'Avg. of {n} panels',
    env_conditions: 'Environmental Conditions',
    humidity: 'Humidity',
    wind_speed: 'Wind {v} km/h',
    book_repair: 'Book Repair →',
    estimated_loss: 'Estimated Loss',
    critical: 'Critical',
    warning: 'Warning',
    info: 'Info',
    book_service: 'Book →',
    output: 'Output',
    temperature: 'Temp',
    efficiency: 'Efficiency',
    ok_status: 'OK',
    fault_status: 'Fault',
    microcrack: 'Micro-cracks',
    dust: 'Dust',

    // Booking Modal
    booking_date: 'Select Date',
    booking_time: 'Select Time',
    booking_note: 'Note for technician (optional)...',
    booking_confirm: 'Confirm Booking →',
    booking_confirmed: 'Booking Confirmed!',
    booking_followup: 'The technician will contact you 30 minutes before arrival',
    close: 'Close',
    ratings: 'ratings',

    // Profile
    profile_title: 'Technical Profile & Connections',
    active_connections: 'Active Connections',
    community: 'Community & Syndicate',
    neighborhood: 'Neighborhood',
    syndicate_status: 'Syndicate Status',
    account_info: 'Account Details',
    documents: 'Documents & Contracts',
    logout: 'Log Out',
    email_label: 'Email',
    system_type: 'System Type',
    tariff: 'Electricity Tariff',
    savings_this_month: 'Savings This Month',
    production_year: 'Production This Year',
    carbon_saved: 'Carbon Saved',
    club_shares: 'Solar Club Shares',

    // More
    more_title: 'More Services',

    // Marketplace
    marketplace_title: 'Solar Farm Marketplace',
    farms_count: 'Farms Online',
    avg_yield: 'Avg. Yield',
    shares_available: 'Shares Available',
    sort_yield: 'Yield',
    sort_price: 'Price',
    sort_change: 'Change',
    buy_shares: 'Buy Shares',
    share_price: 'Share Price',
    annual_yield: 'Annual Yield',
    availability: 'Availability',
    shares_count: 'No. of Shares',
    buy_cta: 'Buy {qty} Shares · ₪{total}',

    // Schedule
    schedule_title: 'Schedule',

    // Savings
    savings_title: 'Savings',

    // Settings
    settings_title: 'Settings',
  },
};

const LangContext = createContext({ lang: 'he', setLang: () => {}, t: () => '' });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'he');

  const t = (key, vars = {}) => {
    const str = translations[lang]?.[key] ?? translations['he']?.[key] ?? key;
    return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), str);
  };

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: switchLang, t }}>
      <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}