
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Brain, Send, User, Bot, Sparkles, Loader2, Info } from 'lucide-react';
import { PatientData } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiAssistant: React.FC<{ patient: PatientData }> = ({ patient }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '您好，我是 LZRYEK AI 临床助手。您可以就复杂的儿科急救病例、指南细节或合并症处理向我提问。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages, { role: 'user', content: userMsg }].map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: `你是一个资深的儿科重症监护专家（PICC），精通 2025 AHA/AAP 儿科高级生命支持（PALS）指南。
          当前患者信息：年龄 ${patient.age} 岁，体重 ${patient.weight} kg。
          你的职责是为临床医生提供基于证据的决策支持、鉴别诊断参考和复杂的病理生理学解释。
          请保持回答简洁、专业、临床导向。如果是紧急情况，请优先提醒遵循 PALS 核心算法。`,
          temperature: 0.7,
        },
      });

      const aiText = response.text || '抱歉，我无法生成回复。';
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: '连接专家库失败，请检查网络或稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-320px)] bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">AI 临床决策助手</h3>
            <p className="text-[10px] font-bold text-slate-400">Gemini 3 Pro Powered</p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-1.5 mb-1 opacity-60">
                {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                <span className="text-[9px] font-black uppercase tracking-widest">{m.role === 'user' ? '您' : 'LZRYEK AI'}</span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-[10px] font-black text-slate-400 uppercase">思考中...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="咨询专家建议..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-3 opacity-40 justify-center">
          <Info className="w-3 h-3" />
          <span className="text-[9px] font-bold">AI 生成内容仅供参考，临床决策须由执业医师最终负责。</span>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
