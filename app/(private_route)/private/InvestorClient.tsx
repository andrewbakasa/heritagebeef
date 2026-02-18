"use client";

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, Save, X, Mail, 
  History, Info, LayoutDashboard, CheckCircle2, 
  AlertCircle, Plus, ArrowUpRight, CreditCard, Loader2 
} from 'lucide-react';
import { TransactionForm } from './_components/TranscationForm';
//import { TransactionForm } from './TransactionForm'; // The component we just built

// --- Types ---
interface Investment {
  id: string;
  amount: number;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  createdAt: string;
}

interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string | null;
  category: string[];
  message: string;
  pledgeAmount?: number | null;
  admin_notes?: string | null;
  operationalSynergy?: string | null;
  investments?: Investment[];
  payments?: Payment[];
}

export const ClientInvestDetails = ({ 
  selectedInquiry, 
  onClose, 
  onUpdate 
}: { 
  selectedInquiry: Inquiry; 
  onClose: () => void;
  onUpdate: (id: string, notes: string) => Promise<void>;
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [notes, setNotes] = useState(selectedInquiry.admin_notes || '');
  const [showTxForm, setShowTxForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Calculate Aggregates
  const stats = useMemo(() => {
    const totalInvested = selectedInquiry.investments?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const totalPaid = selectedInquiry.payments?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const pledge = selectedInquiry.pledgeAmount || 0;
    const balance = totalInvested - totalPaid;
    const progress = pledge > 0 ? Math.min((totalInvested / pledge) * 100, 100) : 0;

    return { totalInvested, totalPaid, balance, progress, pledge };
  }, [selectedInquiry]);

  // 2. Merge and sort history items
  const historyTimeline = useMemo(() => {
    const items = [
      ...(selectedInquiry.investments?.map(i => ({ ...i, type: 'Investment' })) || []),
      ...(selectedInquiry.payments?.map(p => ({ ...p, type: 'Payment' })) || [])
    ];
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selectedInquiry]);

  const handleCommitNotes = async () => {
    setIsSaving(true);
    await onUpdate(selectedInquiry.id, notes);
    setIsSaving(false);
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-[100] w-full max-w-lg bg-[#F8F7F5] shadow-2xl animate-in slide-in-from-right duration-300 border-l border-gray-200 flex flex-col">
      
      {/* Header: Brand Identity */}
      <div className="bg-[#1A2F23] p-6 text-white shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <DollarSign className="w-24 h-24" />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex flex-wrap gap-2">
            {selectedInquiry.category.map(cat => (
              <span key={cat} className="bg-[#C1663E] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
                {cat}
              </span>
            ))}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        </div>
        
        <h2 className="text-2xl font-serif font-bold mt-4">{selectedInquiry.first_name} {selectedInquiry.last_name}</h2>
        <p className="text-white/50 text-[10px] font-mono uppercase tracking-widest mt-1">
          {selectedInquiry.company || 'Private Portfolio'}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
        
        {/* Section 1: Live Financial Ledger Card */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Investment Ledger</h4>
            <button 
              onClick={() => setShowTxForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A2F23] text-white rounded-xl text-[10px] font-bold hover:bg-[#2a4a38] transition-all shadow-md active:scale-95"
            >
              <Plus className="w-3 h-3" /> New Entry
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Invested</p>
              <p className="text-lg font-bold text-[#1A2F23]">${stats.totalInvested.toLocaleString()}</p>
              <div className="w-full bg-gray-100 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full transition-all duration-1000" style={{ width: `${stats.progress}%` }} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Paid</p>
              <p className="text-lg font-bold text-blue-600">${stats.totalPaid.toLocaleString()}</p>
              <p className="text-[8px] text-gray-400 mt-2">Verified Receipts</p>
            </div>

            <div className={`p-4 rounded-2xl border shadow-sm ${stats.balance > 0 ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Balance</p>
              <p className={`text-lg font-bold ${stats.balance > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                ${stats.balance.toLocaleString()}
              </p>
              {stats.balance <= 0 && <CheckCircle2 className="w-3 h-3 text-green-600 mt-2" />}
            </div>
          </div>
        </section>

        {/* Section 2: Details/History Tabs */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex bg-gray-50/50 p-1">
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase transition-all rounded-2xl ${
                activeTab === 'details' ? 'bg-white shadow-sm text-[#1A2F23]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Info className="w-3.5 h-3.5" /> Context
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase transition-all rounded-2xl ${
                activeTab === 'history' ? 'bg-white shadow-sm text-[#1A2F23]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Timeline
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'details' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-gray-400 font-black uppercase">Direct Contact</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{selectedInquiry.email}</p>
                  </div>
                </div>

                {selectedInquiry.operationalSynergy && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Market Synergy</p>
                      <p className="text-sm font-medium text-gray-700 leading-snug">{selectedInquiry.operationalSynergy}</p>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-[#FDFCFB] rounded-2xl border border-orange-100/50">
                    <p className="text-[10px] text-orange-800/60 font-black uppercase mb-2">Lead Message</p>
                    <p className="text-sm text-gray-600 italic leading-relaxed">{selectedInquiry.message}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {historyTimeline.length > 0 ? historyTimeline.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-white transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.type === 'Payment' ? 'bg-blue-50 text-blue-600' : 'bg-[#1A2F23]/5 text-[#1A2F23]'}`}>
                        {item.type === 'Payment' ? <CreditCard className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{item.type}</p>
                        <p className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-mono font-bold ${item.type === 'Payment' ? 'text-blue-600' : 'text-[#1A2F23]'}`}>
                      {item.type === 'Payment' ? '-' : '+'}${item.amount.toLocaleString()}
                    </p>
                  </div>
                )) : (
                    <div className="text-center py-8">
                        <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-[10px] text-gray-400 font-bold uppercase">No records found</p>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Compliance Notes */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Internal Compliance Notes</h4>
          <textarea 
            className="w-full p-5 bg-white border border-gray-200 rounded-3xl text-sm h-32 outline-none focus:ring-4 focus:ring-[#C1663E]/5 focus:border-[#C1663E]/30 transition-all resize-none shadow-inner"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document shareholder review, risk assessment or verbal commitments..."
          />
          <button 
            disabled={isSaving}
            onClick={handleCommitNotes}
            className="w-full bg-[#1A2F23] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#233f2f] hover:translate-y-[-2px] disabled:opacity-50 transition-all shadow-xl shadow-green-900/10"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Commit to Registry
          </button>
        </section>
      </div>

      {/* Transaction Modal Overlay */}
      {showTxForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#1A2F23]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <TransactionForm 
            enquiryId={selectedInquiry.id} 
            onClose={() => setShowTxForm(false)}
            onSuccess={() => window.location.reload()} // Simplified refresh for data consistency
          />
        </div>
      )}
    </aside>
  );
};