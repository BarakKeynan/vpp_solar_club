import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';

// Translation keys will be used instead

export default function AIAssistant() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Initialize with welcome message when opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('ai_welcome') }]);
    }
  }, [open, t]);

  // Subscribe to conversation updates
  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
      const last = data.messages?.[data.messages.length - 1];
      if (last?.role === 'assistant') setLoading(false);
    });
    return unsub;
  }, [conversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    setLoading(true);

    // Optimistically show user message
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      let conv = conversation;
      if (!conv) {
        conv = await base44.agents.createConversation({
          agent_name: 'energy_assistant',
          metadata: { name: 'Energy Chat' },
        });
        setConversation(conv);
      }

      await base44.agents.addMessage(conv, { role: 'user', content: userMsg });
    } catch (e) {
      setLoading(false);
    }
  };

  const suggested = [t('ai_suggested_1'), t('ai_suggested_2'), t('ai_suggested_3'), t('ai_suggested_4')];
  const displayMessages = messages.length > 0 ? messages : [];

  return (
    <>
      {/* FAB Button – Upgraded AI Assistant icon */}
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        className="fixed bottom-24 z-40 flex items-center gap-2 rounded-full shadow-xl px-4 py-3"
        style={{
          left: lang === 'he' ? '16px' : undefined,
          right: lang === 'en' ? '16px' : undefined,
          background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #10B981 100%)',
          boxShadow: '0 4px 24px rgba(59,130,246,0.45), 0 0 12px rgba(16,185,129,0.3)',
        }}
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-white" />
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-white/30"
          />
        </div>
        <span className="text-white text-xs font-bold whitespace-nowrap">
          {t('ai_assistant_title')}
        </span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
            />

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
                     {t('ai_assistant_title')}
                   </p>
                   <div className="flex items-center gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                     <p className="text-[10px] text-primary">{t('ai_online')}</p>
                   </div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl bg-muted">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {displayMessages.map((msg, i) => (
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
                       <span className="text-xs text-muted-foreground">{t('ai_thinking')}</span>
                     </div>
                   </div>
                 )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested (only at start) */}
              {displayMessages.length <= 1 && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0">
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
                    placeholder={t('ai_input_placeholder')}
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