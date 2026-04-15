import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Zap, Wrench, ArrowLeftRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { toast } from 'sonner';

const tasks = {
  he: [
    {
      id: 'storage',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      color: '#10b981',
      type: 'storage',
      label: 'אחסון (ארביטראז׳)',
      title: 'פרוק 65% מהסוללה (18:00–21:00)',
      reason: 'מחיר MCP שיאי של ₪1.12. תחזית מחר בהירה — מחר תוכל לטעון מחדש בזול.',
      action: 'אשר פריקה',
    },
    {
      id: 'maintenance',
      icon: <Wrench className="w-4 h-4 text-amber-400" />,
      color: '#f59e0b',
      type: 'maintenance',
      label: 'תחזוקה (יעילות)',
      title: 'אובדן תפוקה של 8% זוהה',
      reason: 'אי-התאמה לקרינה המקומית. מומלץ לתזמן ניקוי פאנלים.',
      action: 'הזמן טכנאי',
    },
    {
      id: 'market',
      icon: <ArrowLeftRight className="w-4 h-4 text-blue-400" />,
      color: '#3b82f6',
      type: 'market',
      label: 'שוק (ספק)',
      title: 'עבור לCellcom Energy (תכנית לילה)',
      reason: 'חיסכון צפוי ₪140 לחודש. נדרש POA דיגיטלי לנוגה.',
      action: 'הפעל מעבר',
    },
  ],
  en: [
    {
      id: 'storage',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      color: '#10b981',
      type: 'storage',
      label: 'Storage (Arbitrage)',
      title: 'Discharge 65% of battery (18:00–21:00)',
      reason: 'Peak MCP of ₪1.12/kWh. Tomorrow\'s forecast is clear — recharge cheaply tomorrow.',
      action: 'Approve Discharge',
    },
    {
      id: 'maintenance',
      icon: <Wrench className="w-4 h-4 text-amber-400" />,
      color: '#f59e0b',
      type: 'maintenance',
      label: 'Maintenance (Efficiency)',
      title: '8% yield loss detected',
      reason: 'Mismatch with local irradiance found. Recommend: Schedule panel cleaning.',
      action: 'Book Technician',
    },
    {
      id: 'market',
      icon: <ArrowLeftRight className="w-4 h-4 text-blue-400" />,
      color: '#3b82f6',
      type: 'market',
      label: 'Market (Supplier)',
      title: 'Switch to Cellcom Energy (Night Plan)',
      reason: 'Save ₪140/mo. Digital POA for Noga mobility required.',
      action: 'Trigger Switch',
    },
  ],
};

// Technician Booking Modal
function TechnicianModal({ onClose, isHe }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date || !time) { toast.error(isHe ? 'נא למלא תאריך ושעה' : 'Please fill date and time'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success(isHe ? '✅ הזמנה נשלחה ל-CRM של ספק התחזוקה!' : '✅ Booking sent to maintenance CRM!');
    onClose();
  };

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400";
  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full rounded-t-3xl p-6 space-y-4"
        style={{ background: '#0D1420', border: '1px solid rgba(245,158,11,0.3)', borderBottom: 'none' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-center -mt-2 mb-2">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>
        <h2 className="text-lg font-black text-white text-center">
          🔧 {isHe ? 'הזמנת טכנאי — ניקוי פאנלים' : 'Technician Booking — Panel Cleaning'}
        </h2>
        <p className="text-xs text-white/40 text-center">
          {isHe ? 'הטופס מסונכרן עם CRM ספק התחזוקה' : 'Form syncs with maintenance provider CRM'}
        </p>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} style={inputStyle} />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputCls} style={inputStyle} />
        <textarea value={note} onChange={e => setNote(e.target.value)}
          placeholder={isHe ? 'הערה לטכנאי (אופציונלי)...' : 'Note for technician (optional)...'}
          className={`${inputCls} resize-none`} style={inputStyle} rows={3} />
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-sm text-black flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '📅'}
          {isHe ? 'שלח הזמנה' : 'Send Booking'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// POA Modal
function POAModal({ onClose, isHe }) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = React.useRef(null);
  const [drawing, setDrawing] = useState(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };
  const startDraw = (e) => { const ctx = canvasRef.current.getContext('2d'); const p = getPos(e, canvasRef.current); ctx.beginPath(); ctx.moveTo(p.x, p.y); setDrawing(true); };
  const draw = (e) => { if (!drawing) return; e.preventDefault(); const ctx = canvasRef.current.getContext('2d'); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#3b82f6'; const p = getPos(e, canvasRef.current); ctx.lineTo(p.x, p.y); ctx.stroke(); setSigned(true); };
  const stopDraw = () => setDrawing(false);

  const handleSubmit = async () => {
    if (!signed) { toast.error(isHe ? 'נא לחתום על הייפוי כח' : 'Please sign the POA'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    toast.success(isHe ? '📄 ייפוי כח נשלח לנוגה! המעבר ייכנס לתוקף תוך 60 יום.' : '📄 POA sent to Noga! Switch effective in ~60 days.');
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full rounded-t-3xl p-6 space-y-4"
        style={{ background: '#0D1420', border: '1px solid rgba(59,130,246,0.3)', borderBottom: 'none' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-center -mt-2 mb-2">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>
        <h2 className="text-lg font-black text-white text-center">
          📄 {isHe ? 'ייפוי כח דיגיטלי — נוגה' : 'Digital POA — Noga Mobility'}
        </h2>
        <div className="rounded-xl p-4 space-y-1" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <p className="text-xs text-white/70">{isHe ? 'ספק יעד: Cellcom Energy (תכנית לילה)' : 'Target Provider: Cellcom Energy (Night Plan)'}</p>
          <p className="text-xs text-white/70">{isHe ? 'תאריך כניסה לתוקף: ~60 יום מהיום' : 'Effective Date: ~60 days from today'}</p>
          <p className="text-xs text-white/70">{isHe ? 'חיסכון צפוי: ₪140/חודש' : 'Expected Saving: ₪140/month'}</p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-2 text-center">{isHe ? 'חתום לאישור' : 'Sign to approve'}</p>
          <div className="relative rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.3)' }}>
            {!signed && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><p className="text-white/10 text-lg font-black">{isHe ? 'חתימה' : 'Signature'}</p></div>}
            <canvas ref={canvasRef} width={340} height={100} className="w-full touch-none"
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : '📤'}
          {isHe ? 'שלח ייפוי כח לנוגה' : 'Submit POA to Noga'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function UnifiedAIAdvisory() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [approved, setApproved] = useState(false);
  const [showTech, setShowTech] = useState(false);
  const [showPOA, setShowPOA] = useState(false);
  const [approving, setApproving] = useState(false);
  const { lang } = useLang();
  const isHe = lang === 'he';
  const taskList = isHe ? tasks.he : tasks.en;

  const handleApprove = async () => {
    if (!selected) return;
    const task = taskList.find(t => t.id === selected);
    if (task.type === 'maintenance') { setShowTech(true); return; }
    if (task.type === 'market') { setShowPOA(true); return; }
    // storage
    setApproving(true);
    await new Promise(r => setTimeout(r, 1500));
    setApproving(false);
    setApproved(true);
    toast.success(isHe ? '⚡ פריקת הסוללה תופעל ב-18:00!' : '⚡ Battery discharge scheduled for 18:00!');
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        {/* Collapsed Glowing Card */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full rounded-2xl p-4 flex items-center justify-between transition-all active:scale-[0.98]"
          style={{
            background: expanded
              ? 'rgba(16,185,129,0.08)'
              : 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))',
            border: `1px solid ${expanded ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.3)'}`,
            boxShadow: expanded ? 'none' : '0 0 20px rgba(16,185,129,0.12)',
          }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-emerald-400/30" />
              <div className="relative w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-400">
                {isHe ? 'אסטרטגיה היום: אופטימיזציה פעילה' : "Today's Strategy: Optimization Active"}
              </p>
              <p className="text-base font-black text-white">
                {isHe ? 'בונוס צפוי: ₪184' : 'Projected Bonus: ₪184'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
              {isHe ? '3 משימות' : '3 Tasks'}
            </span>
            {expanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </div>
        </button>

        {/* Expanded State */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="pt-3 space-y-3">
                {/* Task Radio List */}
                {taskList.map((task, i) => (
                  <motion.button key={task.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    onClick={() => setSelected(task.id === selected ? null : task.id)}
                    className="w-full rounded-2xl p-4 text-right transition-all active:scale-[0.98]"
                    style={{
                      background: selected === task.id
                        ? `${task.color}10`
                        : 'rgba(255,255,255,0.025)',
                      border: `1px solid ${selected === task.id ? `${task.color}50` : 'rgba(255,255,255,0.08)'}`,
                      backdropFilter: 'blur(10px)',
                    }}>
                    <div className="flex items-start gap-3">
                      {/* Radio */}
                      <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected === task.id ? 'border-current' : 'border-white/25'
                      }`} style={{ borderColor: selected === task.id ? task.color : undefined }}>
                        {selected === task.id && (
                          <div className="w-2 h-2 rounded-full" style={{ background: task.color }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {task.icon}
                          <span className="text-[10px] font-bold text-white/50">{task.label}</span>
                        </div>
                        <p className="text-sm font-black text-white">{task.title}</p>
                        <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{task.reason}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}

                {/* Approve Button */}
                <AnimatePresence>
                  {selected && !approved && (
                    <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      onClick={handleApprove} disabled={approving}
                      className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                        color: 'black',
                      }}>
                      {approving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <CheckCircle2 className="w-4 h-4" />}
                      {isHe ? 'אשר והפעל תהליך' : 'Approve & Trigger Process'}
                    </motion.button>
                  )}
                  {approved && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2 py-3 rounded-2xl"
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <p className="text-sm font-bold text-emerald-400">
                        {isHe ? 'הפעולה אושרה!' : 'Action Approved!'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showTech && <TechnicianModal onClose={() => setShowTech(false)} isHe={isHe} />}
        {showPOA && <POAModal onClose={() => setShowPOA(false)} isHe={isHe} />}
      </AnimatePresence>
    </>
  );
}