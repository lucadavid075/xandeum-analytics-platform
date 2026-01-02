
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
    { 
      role: 'model', 
      text: 'Hello! I am the Xandeum Network pNode Assistant. The network is currently in the Main Era (Real-world sedApps). I can help you understand our new BFT implementation, info.wiki launch, pNode rewards, and the Bonn milestone (v1.2). How can I help you today?' }
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
      setHasKey(!!process.env.API_KEY);
    }
  };

  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare context summary
      const onlineCount = data?.summary.online_ip_nodes || 0;
      const pnodeCount = data?.summary.unique_pnodes || 0;
      const offlineCount = data?.summary.offline_ip_nodes || 0;
      const nodeContext = data?.merged_pnodes.slice(0, 30).map(n => ({
        addr: n.address,
        ip: n.source_ip,
        ver: n.version,
      })) || [];

      const systemInstruction = `
        You are an expert AI Assistant for the Xandeum Network.
        
        **Current Context: MAIN ERA (v1.2 Bonn)**
        - Status: Real-world use by Storage-Enabled dApps (sedApps).
        - Name Origin: Named after the German river Main.
        - Transition: Ready for real-world use by storage-enabled decentralized applications (sedApps).
        - Major Features: 
          1. info.wiki launch (fully decentralized Wikipedia demo app).
          2. Basic implementation of Byzantine Fault Tolerance (BFT).
          3. Trust anchoring to the Solana blockchain.
        - Milestone Goal: "Evict & Replace".
        
        **Platform Knowledge:**
        - Xandeum: Scalable storage layer for Solana.
        - pNodes: Storage providers hosting "Pods".
        - XAND: Native utility/governance token.
        - Latest Version: 1.2 (Bonn).
        
        **Real-time Network Data:**
        - Online Hosts: ${onlineCount}
        - Total pNodes: ${pnodeCount}
        - Offline Hosts: ${offlineCount}
        
        **Sample of Registry Data:**
        ${JSON.stringify(nodeContext)}

        **Instructions:**
        1. Explain the Main Era as the phase enabling real-world use by sedApps (Storage-Enabled dApps) like info.wiki.
        2. Highlight BFT and Solana trust anchoring as key security features of this era.
        3. Discuss "Evict & Replace" as the primary goal of the Bonn milestone.
        4. Be concise, technical where needed, but always friendly.
        5. No financial advice regarding XAND token price.
      `;

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
        const text = c.text;
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
        setMessages(prev => [...prev, { role: 'model', text: "I encountered an error. Please ensure your API key is properly configured." }]);
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
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Sparkles size={18} className="text-teal-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Xandeum Assistant</h3>
            <p className="text-xs text-slate-400">Main Era Mode</p>
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
              The AI Assistant needs an API key to provide insights.
            </p>
          </div>
          <button 
            onClick={handleOpenSelectKey}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-lg"
          >
            Select API Key
          </button>
        </div>
      ) : (
        <>
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
                    <span className="text-xs text-slate-400">Processing Xandeum Network...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about pnode, staking, innovation era, rewards..."
                className="w-full bg-slate-900 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none text-sm border border-slate-800"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AiInsights;