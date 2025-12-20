import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ApiResponse } from '../types';
import { Send, Sparkles, X, Bot, User, Loader2, Key, ExternalLink, AlertCircle } from 'lucide-react';

interface AiInsightsProps {
  data: ApiResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AiInsights: React.FC<AiInsightsProps> = ({ data, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am the Xandeum Network Assistant. I can help you understand the platform, check network status, or explain how to stake XAND. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Check for API Key on open
  useEffect(() => {
    if (isOpen) {
      checkKey();
    }
  }, [isOpen]);

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } else {
      // Fallback for environments where process.env is accessible
      setHasKey(!!process.env.API_KEY);
    }
  };

  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Proceed to app after triggering selection
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Use process.env.API_KEY as per global guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare context summary
      const onlineCount = data?.summary.online_ip_nodes || 0;
      const pnodeCount = data?.summary.unique_pnodes || 0;
      const offlineCount = data?.summary.offline_ip_nodes || 0;
      const nodeContext = data?.merged_pnodes.slice(0, 40).map(n => ({
        addr: n.address,
        ip: n.source_ip,
        ver: n.version,
      })) || [];

      const systemInstruction = `
        You are an expert AI Assistant for the Xandeum Network.
        
        **Platform Overview:**
        - Xandeum: Scalable storage layer for Solana.
        - pNodes: Storage providers hosting "Pods".
        - XAND: Native utility/governance token.
        - Staking: Users delegate XAND to pNodes for rewards.
        - Era: Deep South Era (Foundational storage layer phase).
        
        **Current Network State:**
        - Online Hosts: ${onlineCount} | pNodes: ${pnodeCount} | Offline: ${offlineCount}
        
        **Node Sample:**
        ${JSON.stringify(nodeContext)}

        **Instructions:**
        1. Explain staking and platform concepts.
        2. Use provided stats for status queries.
        3. Be concise and friendly.
        4. No financial advice.
      `;

      // Use gemini-3-flash-preview as per model selection rules
      const chat: Chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const resultStream = await chat.sendMessageStream({ message: userMsg });
      
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text; // Access as property, not method
        if (text) {
          fullResponse += text;
          setMessages(prev => {
            const newArr = [...prev];
            newArr[newArr.length - 1].text = fullResponse;
            return newArr;
          });
        }
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      
      const errorMessage = error?.message || "";
      if (errorMessage.includes("Requested entity was not found")) {
        setHasKey(false);
        setMessages(prev => [...prev, { role: 'model', text: "Access to Gemini was lost. Please reconnect your API key." }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "I encountered an error. This usually happens if the API key lacks permission or if there's a quota limit. Please check your credentials." }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 border-l border-slate-200 dark:border-slate-800 flex flex-col font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Sparkles size={18} className="text-teal-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Insights</h3>
            <p className="text-xs text-slate-400">Gemini 3 Flash Active</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {!hasKey ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900 space-y-6">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center">
            <Key size={32} className="text-teal-400" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white">Connect to Gemini</h4>
            <p className="text-slate-400 text-sm">
              AI Insights requires a paid Gemini API key from a Google Cloud project with billing enabled.
            </p>
          </div>
          <button 
            onClick={handleOpenSelectKey}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2"
          >
            Select API Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-teal-400 flex items-center gap-1 transition-colors"
          >
            Learn about Gemini API billing <ExternalLink size={10} />
          </a>
        </div>
      ) : (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-slate-700' 
                    : 'bg-gradient-to-br from-teal-500 to-emerald-600'
                }`}>
                  {msg.role === 'user' 
                    ? <User size={14} className="text-slate-300" /> 
                    : <Bot size={14} className="text-white" />
                  }
                </div>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tr-sm'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 shadow-sm rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-white" />
                 </div>
                 <div className="bg-slate-950 p-3 rounded-2xl rounded-tl-sm border border-slate-800 shadow-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-teal-500" />
                    <span className="text-xs text-slate-400">Thinking...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about staking, nodes, or Xandeum..."
                className="w-full bg-slate-900 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none text-sm border border-slate-800 placeholder-slate-500"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-center mt-2 flex items-center justify-center gap-1">
               <span className="text-[10px] text-slate-500 uppercase tracking-tighter">AI Context Active</span>
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AiInsights;