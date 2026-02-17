import React, { useState, useRef, useEffect } from 'react';
// Make sure this path matches your file structure!
import { getAyurBotResponse } from '../services/geminiService';

const AyurBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'bot', content: 'Namaste! I am AyurBot. How can I guide your wellness journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- AUTO SCROLL ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // --- CLEAN TEXT FUNCTION (Removes ** stars) ---
  const formatMessage = (text: string) => {
    // 1. Remove all '**' stars from the text
    const cleanText = text.replace(/\*\*/g, '');

    // 2. Split by new lines to keep paragraphs readable
    return cleanText.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      return <div key={i} className="mb-2">{line}</div>;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const botMsg = await getAyurBotResponse(history, userMsg);
      setMessages(prev => [...prev, { role: 'bot', content: botMsg || "I couldn't process that. Try again?" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] font-sans">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[550px] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">

          {/* HEADER */}
          <header className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg">✨</div>
              <div>
                <h3 className="font-bold text-sm md:text-base">AyurBot Assistant</h3>
                <p className="text-[10px] opacity-80">AI Wellness Guide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </header>

          {/* CHAT AREA */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                  }`}>
                  {/* USE THE CLEAN FORMAT FUNCTION */}
                  {formatMessage(m.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 flex gap-2 items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Ask about herbs, lifestyle..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${loading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 active:scale-95'
                }`}
            >
              ➔
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-300 flex items-center justify-center text-3xl hover:scale-110 transition-transform duration-300"
        >
          ✨
        </button>
      )}
    </div>
  );
};

export default AyurBot;