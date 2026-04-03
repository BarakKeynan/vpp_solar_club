import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Sun, MapPin, Zap, X, Plus, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { addShares, getPortfolio } from '@/lib/portfolio';

const farms = [
  {
    id: 'negev1',
    name: 'נגב סולאר A',
    location: 'באר שבע',
    capacity: '4.2 MW',
    sharePrice: 142.5,
    change: +3.2,
    totalShares: 10000,
    available: 320,
    yield: '9.8%',
    icon: '☀️',
    history: [130, 134, 136, 138, 135, 139, 142, 142.5],
  },
  {
    id: 'galilee1',
    name: 'גליל אנרגיה',
    location: 'כנרת',
    capacity: '2.8 MW',
    sharePrice: 98.3,
    change: +1.1,
    totalShares: 8000,
    available: 540,
    yield: '8.4%',
    icon: '🌊',
    history: [92, 94, 93, 95, 96, 97, 98, 98.3],
  },
  {
    id: 'arava1',
    name: 'ערבה פאוור',
    location: 'ערד',
    capacity: '6.5 MW',
    sharePrice: 211.0,
    change: -0.8,
    totalShares: 15000,
    available: 890,
    yield: '11.2%',
    icon: '🏜️',
    history: [215, 214, 213, 212, 214, 213, 211, 211],
  },
  {
    id: 'carmel1',
    name: 'כרמל גרין',
    location: 'חיפה',
    capacity: '1.9 MW',
    sharePrice: 76.8,
    change: +5.4,
    totalShares: 5000,
    available: 120,
    yield: '7.6%',
    icon: '🌿',
    history: [66, 68, 70, 71, 72, 74, 76, 76.8],
  },
];

function BuyModal({ farm, onClose }) {
  const [qty, setQty] = useState(1);
  const total = (farm.sharePrice * qty).toFixed(2);

  const handleBuy = () => {
    addShares(farm.id, qty, farm);
    toast.success(`רכשת ${qty} מניות ב-${farm.name} בסך ₪${total}`);
    onClose();
  };

  const histData = farm.history.map((v, i) => ({ i, v }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="bg-card border border-border rounded-3xl p-5 w-full max-w-md space-y-4"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{farm.icon}</span>
            <div>
              <p className="font-black text-foreground">{farm.name}</p>
              <p className="text-xs text-muted-foreground">{farm.location} · {farm.capacity}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        {/* Mini Chart */}
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={histData}>
            <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`₪${v}`, 'מחיר']} />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'מחיר מניה', value: `₪${farm.sharePrice}` },
            { label: 'תשואה שנתית', value: farm.yield },
            { label: 'זמינות', value: farm.available },
          ].map(s => (
            <div key={s.label} className="bg-muted rounded-xl p-2">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-black text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Qty Selector */}
        <div className="bg-muted rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">כמות מניות</p>
            <p className="text-2xl font-black text-foreground mt-1">₪{total}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 rounded-xl bg-card border border-border">
              <Minus className="w-4 h-4 text-foreground" />
            </button>
            <span className="text-xl font-black text-foreground w-8 text-center">{qty}</span>
            <button onClick={() => setQty(q => Math.min(farm.available, q + 1))} className="p-2 rounded-xl bg-card border border-border">
              <Plus className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        <button onClick={handleBuy}
          className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl active:scale-95 transition-all">
          רכוש {qty} מניות · ₪{total}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Marketplace() {
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState('yield');
  const [portfolio, setPortfolio] = useState({});

  useEffect(() => {
    const refresh = () => setPortfolio(getPortfolio());
    refresh();
    window.addEventListener('portfolio_updated', refresh);
    return () => window.removeEventListener('portfolio_updated', refresh);
  }, []);

  const sorted = [...farms].sort((a, b) => {
    if (sort === 'yield') return parseFloat(b.yield) - parseFloat(a.yield);
    if (sort === 'price') return a.sharePrice - b.sharePrice;
    if (sort === 'change') return b.change - a.change;
    return 0;
  });

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        Solar Farm Marketplace
      </motion.h1>

      {/* Market Summary */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-2">
        {[
          { label: 'חוות ברשת', value: '4', color: 'text-foreground' },
          { label: 'תשואה ממוצעת', value: '9.25%', color: 'text-primary' },
          { label: 'מניות זמינות', value: '1,870', color: 'text-secondary' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Sort */}
      <div className="flex bg-muted rounded-xl p-1 gap-1">
        {[{ k: 'yield', l: 'תשואה' }, { k: 'price', l: 'מחיר' }, { k: 'change', l: 'שינוי' }].map(o => (
          <button key={o.k} onClick={() => setSort(o.k)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${sort === o.k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            {o.l}
          </button>
        ))}
      </div>

      {/* Farm Cards */}
      {sorted.map((farm, i) => {
        const up = farm.change >= 0;
        const histData = farm.history.map((v, idx) => ({ i: idx, v }));
        return (
          <motion.div key={farm.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
            className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{farm.icon}</span>
                <div>
                  <p className="text-sm font-bold text-foreground">{farm.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{farm.location}</span>
                    <Zap className="w-3 h-3 text-accent mr-1" />
                    <span className="text-xs text-muted-foreground">{farm.capacity}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-foreground">₪{farm.sharePrice}</p>
                <div className={`flex items-center gap-0.5 justify-end ${up ? 'text-primary' : 'text-destructive'}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-xs font-bold">{up ? '+' : ''}{farm.change}%</span>
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div className="h-12 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={histData}>
                  <Line type="monotone" dataKey="v" stroke={up ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">תשואה</p>
                  <p className="text-sm font-black text-primary">{farm.yield}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">זמינות</p>
                  <p className="text-sm font-bold text-foreground">{farm.available}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {portfolio[farm.id] && (
                  <div className="flex items-center gap-1 bg-primary/15 px-2.5 py-1 rounded-full">
                    <span className="text-xs font-black text-primary">✓ {portfolio[farm.id].qty} מניות</span>
                  </div>
                )}
                <button onClick={() => setSelected(farm)}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-black rounded-xl active:scale-95 transition-all">
                  רכוש מניות
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}

      <AnimatePresence>
        {selected && <BuyModal farm={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}