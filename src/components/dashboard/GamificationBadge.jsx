import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useLang } from '@/lib/i18n';

// ── Rank definitions ────────────────────────────────────────────────────────
const RANKS = [
  {
    id: 'newcomer',
    emoji: '🌱',
    nameHe: 'צמח ירוק',
    nameEn: 'Green Sprout',
    minScore: 0,
    color: '#6b7280',
    glow: 'rgba(107,114,128,0.3)',
    border: 'rgba(107,114,128,0.3)',
    bg: 'rgba(107,114,128,0.1)',
    descHe: 'מתחיל את מסע האנרגיה הירוקה שלך',
    descEn: 'Starting your green energy journey',
  },
  {
    id: 'saver',
    emoji: '⚡',
    nameHe: 'חוסך אנרגיה',
    nameEn: 'Energy Saver',
    minScore: 200,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.35)',
    border: 'rgba(59,130,246,0.35)',
    bg: 'rgba(59,130,246,0.1)',
    descHe: 'חוסך חשמל ותורם לרשת',
    descEn: 'Saving electricity and contributing to the grid',
  },
  {
    id: 'pioneer',
    emoji: '🚀',
    nameHe: 'חלוץ אנרגיה',
    nameEn: 'Energy Pioneer',
    minScore: 500,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.4)',
    border: 'rgba(139,92,246,0.4)',
    bg: 'rgba(139,92,246,0.12)',
    descHe: 'מוביל שינוי ומזרים אנרגיה לרשת הארצית',
    descEn: 'Leading change and injecting energy to the national grid',
  },
  {
    id: 'guardian',
    emoji: '🛡️',
    nameHe: 'שומר הרשת',
    nameEn: 'Grid Guardian',
    minScore: 1000,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.4)',
    border: 'rgba(245,158,11,0.4)',
    bg: 'rgba(245,158,11,0.1)',
    descHe: 'מייצב את הרשת הארצית בשיאי עומס',
    descEn: 'Stabilizing the national grid during peak demand',
  },
  {
    id: 'champion',
    emoji: '🌟',
    nameHe: 'אלוף האנרגיה הלאומי',
    nameEn: 'National Energy Champion',
    minScore: 2000,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.45)',
    border: 'rgba(16,185,129,0.45)',
    bg: 'rgba(16,185,129,0.12)',
    descHe: 'מוביל לאומי בחיסכון אנרגיה ובשמירת הסביבה',
    descEn: 'National leader in energy saving and environmental protection',
  },
];

// ── Circular national contribution meter ────────────────────────────────────
function NationalMeter({ score, maxScore = 2000 }) {
  const pct = Math.min(score / maxScore, 1);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - pct * circumference;
  const rank = RANKS.slice().reverse().find(r => score >= r.minScore) || RANKS[0];

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] font-black text-white/35 uppercase tracking-widest">
        מדד תרומה לאומית
      </p>
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full blur-xl"
          style={{ background: rank.glow }}
        />
        <svg className="absolute inset-0 -rotate-90" width="112" height="112" viewBox="0 0 112 112">
          {/* Track */}
          <circle cx="56" cy="56" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
          {/* Progress */}
          <motion.circle
            cx="56" cy="56" r={radius}
            fill="none"
            stroke={rank.color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${rank.color})` }}
          />
        </svg>
        <div className="relative text-center z-10">
          <p className="text-3xl">{rank.emoji}</p>
          <motion.p
            key={score}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-black"
            style={{ color: rank.color }}
          >
            {score}
          </motion.p>
          <p className="text-[8px] text-white/30">נקודות</p>
        </div>
      </div>
    </div>
  );
}

// ── Rank progress bar ───────────────────────────────────────────────────────
function RankProgress({ score }) {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const currentRankIdx = RANKS.slice().reverse().findIndex(r => score >= r.minScore);
  const currentRank = RANKS.slice().reverse()[currentRankIdx] || RANKS[0];
  const nextRank = RANKS[RANKS.indexOf(currentRank) + 1];

  const from = currentRank.minScore;
  const to = nextRank ? nextRank.minScore : currentRank.minScore;
  const pct = nextRank ? Math.min((score - from) / (to - from), 1) : 1;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/30">
          {nextRank
            ? `${to - score} ${isHe ? 'נקודות לדרגה הבאה' : 'pts to next rank'}`
            : (isHe ? '🏆 דרגה מקסימלית!' : '🏆 Max rank!')}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-sm">{currentRank.emoji}</span>
          <span className="text-xs font-black" style={{ color: currentRank.color }}>
            {isHe ? currentRank.nameHe : currentRank.nameEn}
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank?.color || currentRank.color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      {nextRank && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm">{nextRank.emoji}</span>
            <span className="text-[10px] text-white/30">{isHe ? nextRank.nameHe : nextRank.nameEn}</span>
          </div>
          <span className="text-[10px] text-white/20">{nextRank.minScore} pts</span>
        </div>
      )}
    </div>
  );
}

// ── All ranks timeline ──────────────────────────────────────────────────────
function RankTimeline({ score }) {
  const { lang } = useLang();
  const isHe = lang === 'he';
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-white/35 uppercase tracking-widest text-right">
        {isHe ? 'מסלול הדרגות' : 'Rank Path'}
      </p>
      {RANKS.map((rank, i) => {
        const unlocked = score >= rank.minScore;
        return (
          <motion.div
            key={rank.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
            style={{
              background: unlocked ? rank.bg : 'rgba(255,255,255,0.02)',
              border: `1px solid ${unlocked ? rank.border : 'rgba(255,255,255,0.06)'}`,
              opacity: unlocked ? 1 : 0.5,
            }}
          >
            <div className="text-right flex-1">
              <p className="text-xs font-black" style={{ color: unlocked ? rank.color : 'rgba(255,255,255,0.3)' }}>
                {isHe ? rank.nameHe : rank.nameEn}
              </p>
              <p className="text-[10px] text-white/35 mt-0.5">
                {isHe ? rank.descHe : rank.descEn}
              </p>
            </div>
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <span className="text-xl">{rank.emoji}</span>
              <span className="text-[9px] font-bold" style={{ color: unlocked ? rank.color : 'rgba(255,255,255,0.2)' }}>
                {rank.minScore}+
              </span>
            </div>
            {unlocked && (
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: rank.color, boxShadow: `0 0 6px ${rank.color}` }} />
            )}
            {!unlocked && <div className="w-1.5 h-1.5 flex-shrink-0" />}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main exported component ─────────────────────────────────────────────────
export default function GamificationBadge() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [open, setOpen] = useState(false);

  // Simulated score — in production derived from actual savings + grid injections
  const score = 720;
  const rank = RANKS.slice().reverse().find(r => score >= r.minScore) || RANKS[0];

  // Contribution breakdown
  const contributions = [
    { labelHe: 'חיסכון אישי החודש', labelEn: 'Personal saving this month', value: '₪4,230', pts: 423, color: '#10b981' },
    { labelHe: 'הזרמה לרשת', labelEn: 'Grid injection', value: '9.8 kWh', pts: 196, color: '#3b82f6' },
    { labelHe: 'ייצוב בשיא עומס', labelEn: 'Peak stabilization', value: '3 אירועים', pts: 101, color: '#f59e0b' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
        style={{
          background: open
            ? rank.bg
            : 'rgba(255,255,255,0.02)',
          border: `1px solid ${open ? rank.border : 'rgba(255,255,255,0.08)'}`,
          boxShadow: open ? `0 0 28px ${rank.glow}` : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-xl blur-md"
              style={{ background: rank.glow }}
            />
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: rank.bg, border: `1px solid ${rank.border}` }}>
              {rank.emoji}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white leading-tight">
              {isHe ? rank.nameHe : rank.nameEn}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: rank.color }}>
              {score} {isHe ? 'נקודות תרומה' : 'contribution points'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: rank.bg, color: rank.color }}>
            {isHe ? 'דרגה שלי' : 'My Rank'}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-4">

              {/* Meter + current rank description */}
              <div className="flex items-center gap-4">
                <NationalMeter score={score} />
                <div className="flex-1 space-y-2">
                  <div className="rounded-xl p-3"
                    style={{ background: rank.bg, border: `1px solid ${rank.border}` }}>
                    <p className="text-base font-black text-white text-right">{rank.emoji} {isHe ? rank.nameHe : rank.nameEn}</p>
                    <p className="text-[10px] text-white/55 mt-1 text-right leading-relaxed">
                      {isHe ? rank.descHe : rank.descEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress to next rank */}
              <div className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <RankProgress score={score} />
              </div>

              {/* Points breakdown */}
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-[10px] font-black text-white/35 uppercase tracking-widest text-right">
                    {isHe ? 'מקורות הנקודות' : 'Points Breakdown'}
                  </p>
                </div>
                {contributions.map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black" style={{ color: c.color }}>+{c.pts}</span>
                      <Zap className="w-3 h-3" style={{ color: c.color }} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">{isHe ? c.labelHe : c.labelEn}</p>
                      <p className="text-[10px] text-white/35">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rank timeline */}
              <RankTimeline score={score} />

              <p className="text-[9px] text-white/20 text-center">
                {isHe ? 'נקודות מחושבות לפי חיסכון, הזרמה וייצוב רשת · מתעדכן יומית' : 'Points from savings, injection & grid events · Updated daily'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}