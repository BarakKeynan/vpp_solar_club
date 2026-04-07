import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';

const SUGGESTED = {
  he: [
    'מה מצב הסוללה שלי?',
    'מתי הכי כדאי למכור לרשת?',
    'מה ה-ROI הצפוי השנה?',
    'איך לשפר את יעילות הפאנלים?',
  ],
  en: [
    'What is my battery status?',
    'When is best to sell to the grid?',
    'What is my expected ROI this year?',
    'How to improve panel efficiency?',
  ],
};

export default function AIAssistant() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: lang === 'he'
          ? 'שלום! אני העוזר האנרגטי החכם שלך 🌞\nאוכל לענות על שאלות בנושאי אנרגיה סולארית, ביצועי המערכת שלך, מגמות שוק ועוד.\nבמה אוכל לעזור?'
          : 'Hello! I\'m your smart energy AI assistant 🌞\nI can answer questions about solar energy, your system performance, market trends and more.\nHow can I help?',
      }]);
    }
  }, [open, lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert AI solar energy assistant embedded in a home energy management app called VPP Home. 
You help users with questions about:
- Solar energy and panel performance
- Battery storage optimization
- Grid selling strategies
- Market price trends (SMP)
- ROI calculations and financial performance
- Maintenance recommendations
- General energy saving tips

Conversation so far:
${history}

User: ${userMsg}

Respond in ${lang === 'he' ? 'Hebrew' : 'English'}. Be concise, helpful, and use relevant numbers when appropriate. Use markdown for formatting.`,
    });

    setMessages(prev => [...prev, { role: 'assistant', content: result }]);
    setLoading(false);
  };

  const suggested = SUGGESTED[lang] || SUGGESTED.he;

  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        className="fixed bottom-24 left-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-xl flex items-center justify-center"
        style={{ boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}
      >
        <Bot className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto rounded-t-3xl overflow-hidden flex flex-col"
              style={{ height: '80vh', background: 'hsl(222 47% 6%)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0"
                style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(59,130,246,0.1))' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">
                      {lang === 'he' ? 'עוזר אנרגיה AI' : 'Energy AI Assistant'}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <p className="text-[10px] text-primary">{lang === 'he' ? 'מחובר' : 'Online'}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl bg-muted">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-card border border-border text-foreground rounded-bl-sm'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          className="prose prose-sm prose-invert max-w-none text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                          components={{
                            p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="my-1 ml-3 list-disc">{children}</ul>,
                            li: ({ children }) => <li className="my-0.5">{children}</li>,
                            strong: ({ children }) => <strong className="text-primary font-bold">{children}</strong>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground">{lang === 'he' ? 'חושב...' : 'Thinking...'}</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested (only when empty) */}
              {messages.length <= 1 && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
                  {suggested.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary whitespace-nowrap active:scale-95 transition-transform">
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-4 pb-6 pt-2 border-t border-border shrink-0">
                <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder={lang === 'he' ? 'שאל שאלה על האנרגיה שלך...' : 'Ask about your energy system...'}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="p-1.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}