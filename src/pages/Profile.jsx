import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Receipt, Zap, Sun, Battery, Edit2, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setDisplayName(u?.full_name || '');
    });
  }, []);

  const stats = [
    { label: 'אנרגיה שיוצרה', value: '420 kWh', icon: Sun },
    { label: 'אגירה כוללת', value: '280 kWh', icon: Battery },
    { label: 'נמכר לרשת', value: '140 kWh', icon: Zap },
  ];

  return (
    <div className="px-4 pt-6 space-y-5">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-bold">פרופיל</h1>
        <p className="text-sm text-muted-foreground mt-1">הפרטים שלך</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border-2 border-primary/40">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-8 text-sm bg-muted border-border"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false);
                    toast.success('השם עודכן');
                  }}
                  className="h-8 w-8"
                >
                  <Check className="w-4 h-4 text-primary" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{user?.full_name || 'משתמש'}</h2>
                <button onClick={() => setEditing(true)}>
                  <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{user?.email || 'טוען...'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Electricity Account */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-accent/20">
            <Receipt className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-sm">חשבון חשמל</h3>
            <p className="text-xs text-muted-foreground">חברת החשמל • תעריף ביתי</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground">מספר מונה</p>
            <p className="text-sm font-bold mt-1">41-2893-7742</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground">תעריף נוכחי</p>
            <p className="text-sm font-bold mt-1">0.58 ₪/kWh</p>
          </div>
        </div>
      </motion.div>

      {/* Energy Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-sm font-bold">סטטיסטיקות החודש</h3>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
            <span className="text-sm font-bold">{stat.value}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}