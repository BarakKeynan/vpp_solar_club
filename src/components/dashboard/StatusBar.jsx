import React from 'react';
import { Wifi, ShieldCheck } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Wifi className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">מחובר לרשת</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-sm font-semibold text-primary">98%</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-primary/60" />
        <span className="text-xs text-muted-foreground">מאובטח</span>
      </div>
    </div>
  );
}