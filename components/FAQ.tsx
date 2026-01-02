
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, ExternalLink, MessageCircle, Database, Zap } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  icon: React.ReactNode;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      icon: <Database className="text-purple-400" size={20} />,
      question: "How do I set up a Xandeum pNode? Do I need to be a developer?",
      answer: (
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            Setting up a pNode is designed to be accessible to everyone, regardless of technical background. <strong className="text-white">You do not need to be a developer</strong> or have coding skills to contribute to the network.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The process involves running a simple installation script on your hardware. We have prepared a step-by-step guide that walks you through every single command needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a 
              href="https://docs.xandeum.network/xandeum-pnode-setup-guide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg hover:bg-teal-500/20 transition-all font-medium text-sm w-fit"
            >
              <BookOpen size={16} />
              Read the Setup Guide
              <ExternalLink size={12} />
            </a>
            <a 
              href="https://discord.gg/uqRSmmM5m" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20 rounded-lg hover:bg-[#5865F2]/20 transition-all font-medium text-sm w-fit"
            >
              <MessageCircle size={16} />
              Join Discord for Support
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )
    },
    {
      icon: <Zap className="text-amber-400" size={20} />,
      question: "How do I know my reward for running a pNode? What is STOINC?",
      answer: (
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            Rewards on the Xandeum network are driven by the <strong className="text-amber-400">STOINC (Storage Income)</strong> mechanism. STOINC represents a revolutionary way to earn programmatic yield based on the actual physical storage you provide to the network.
          </p>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-3 border-b border-slate-800 pb-2">Key Factors Explained:</h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold min-w-[12px]">1.</span>
                <div>
                  <strong className="text-slate-100 block mb-1">Number of pNodes</strong> 
                  Owning more pNodes multiplies your rewards. For example, two pNodes providing 50GB each earn twice as much as one pNode providing 100GB.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold min-w-[12px]">2.</span>
                <div>
                  <strong className="text-slate-100 block mb-1">Storage Space</strong>
                  More storage capacity directly increases rewards (e.g., twice the space = twice the rewards).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold min-w-[12px]">3.</span>
                <div>
                  <strong className="text-slate-100 block mb-1">Performance Score</strong>
                  A score (0 to 1) based on your pNode’s reliability and performance.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold min-w-[12px]">4.</span>
                <div>
                  <strong className="text-slate-100 block mb-1">Stake</strong>
                  The amount of XAND you stake influences rewards proportionally.
                </div>
              </li>
            </ul>
          </div>
          <a 
            href="https://www.xandeum.network/stoinc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-all font-medium text-sm w-fit mt-2"
          >
            <Zap size={16} />
            View STOINC & Rewards Overview
            <ExternalLink size={12} />
          </a>
        </div>
      )
    },
    {
      icon: <HelpCircle className="text-teal-400" size={20} />,
      question: "Which Innovation Era is Xandeum currently in?",
      answer: (
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            Xandeum is currently in the <strong className="text-teal-400">Main Era (Innovation Era 3)</strong>. The primary goal of this era is to <strong className="text-white">provide support for real storage-enabled dApps (sedApps)</strong>.
          </p>
          <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-teal-500">
             <p className="text-slate-300 text-sm leading-relaxed">
               Within the Main Era, the network is currently at the <strong className="text-teal-300">"Bonn"</strong> milestone. While the era focuses on sedApps, the specific goal of the Bonn milestone is <span className="italic text-white">"Evict & Replace"</span>—ensuring the network can robustly handle node churn while maintaining data integrity.
             </p>
          </div>
          <p className="text-slate-400 text-sm">
            Other key features of this era include the launch of the decentralized <code>info.wiki</code> application, basic Byzantine Fault Tolerance (BFT), and Trust Anchoring to the Solana blockchain.
          </p>
          <a 
            href="https://www.xandeum.network/innovation-eras" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all font-medium text-sm w-fit"
          >
            View Full Roadmap & Eras
            <ExternalLink size={12} />
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <HelpCircle className="text-cyan-400" size={28} /> 
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 max-w-2xl">
          Everything you need to know about running a pNode, earning rewards, and understanding the Xandeum network.
        </p>
      </div>

      <div className="grid gap-4 max-w-4xl">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`bg-slate-900 rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.1)]' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg transition-colors ${
                    isOpen ? 'bg-teal-500/20' : 'bg-slate-800'
                  }`}>
                    {faq.icon}
                  </div>
                  <span className={`font-bold text-lg ${isOpen ? 'text-teal-400' : 'text-slate-200'}`}>
                    {faq.question}
                  </span>
                </div>
                {isOpen ? <ChevronUp className="text-teal-400" /> : <ChevronDown className="text-slate-500" />}
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 pl-[5.5rem] pr-6 border-t border-slate-800/50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
