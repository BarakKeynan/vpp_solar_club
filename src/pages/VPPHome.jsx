// --- רכיב וואטסאפ אישי עם הנייד שלך ---
function WhatsAppSection({ lang }) {
  const phoneNumber = "972506770772"; 
  const message = lang === 'he' 
    ? "היי ברק, הגעתי מהאתר של ה-Solar Club. אשמח לעזרתך באופטימיזציה של המערכת שלי כדי להפיק ממנה יותר. אני רוצה להצטרף לקהילה! ☀️"
    : "Hi Barak, I'm reaching out from the Solar Club site. I'd love your help optimizing my system to get more out of it. I'm in! ☀️";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mx-1 mt-6">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" 
         className="group flex items-center justify-between p-5 rounded-2xl border border-primary/20 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all shadow-xl shadow-primary/5">
        <div className="flex items-center gap-4 text-right">
          <div className="relative">
             <div className="absolute inset-0 bg-green-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="bg-green-500 p-3 rounded-xl relative">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.603 6.02L0 24l6.134-1.61c1.765.961 3.757 1.468 5.79 1.469h.005c6.633 0 12.046-5.414 12.046-12.05 0-3.21-1.248-6.228-3.511-8.493z"/></svg>
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-foreground">ייעוץ אישי עם ברק</span>
            <span className="text-[10px] text-primary font-medium">בוא נראה כמה אפשר לחסוך לך</span>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-green-500" />
      </a>
    </motion.div>
  );
}

// --- טופס השארת פרטים מורחב לאפיון ליד ---
function ContactForm({ lang }) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
      className="mx-1 bg-card/60 border border-border/50 rounded-2xl p-6 space-y-4 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3 text-right">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">הצטרפות למועדון ה-VPP</h3>
      </div>
      
      <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" className="space-y-3 text-right">
        <div className="grid grid-cols-2 gap-3">
          <input type="text" name="name" required placeholder="שם מלא" 
            className="w-full bg-background/40 border border-border/40 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/30 outline-none text-right" />
          <input type="tel" name="phone" required placeholder="נייד" 
            className="w-full bg-background/40 border border-border/40 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/30 outline-none text-right" />
        </div>
        
        <input type="email" name="email" required placeholder="מייל ליצירת קשר" 
          className="w-full bg-background/40 border border-border/40 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/30 outline-none text-right" />
        
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground pr-1">סוג ממיר קיים:</label>
          <select name="inverter_type" required className="w-full bg-background/40 border border-border/40 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/30 outline-none text-right appearance-none">
            <option value="solaredge">SolarEdge (נתמך)</option>
            <option value="other">אחר / לא ידוע</option>
          </select>
        </div>

        <textarea name="battery_status" rows="2" placeholder="יש לך סוללה? (אם כן, ציין נפח קוט''ש)" 
          className="w-full bg-background/40 border border-border/40 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-primary/30 outline-none resize-none text-right"></textarea>
        
        <button type="submit" className="w-full py-4 rounded-xl font-black text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          שלח בקשת הצטרפות
        </button>
      </form>
    </motion.div>
  );
}
