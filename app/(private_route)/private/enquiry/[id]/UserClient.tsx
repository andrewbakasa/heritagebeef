"use client";

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, TrendingUp, Save, X, Mail, 
  History, Info, LayoutDashboard, CheckCircle2, 
  AlertCircle, Plus, ArrowUpRight, CreditCard, Loader2, Download, ArrowLeft
} from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { TransactionForm } from '../../_components/TranscationForm';
import { useRouter } from 'next/navigation';

export default function ClientRegistryPage({ 
  selectedInquiry, 
  onUpdate 
}: { 
  selectedInquiry: any; 
  onUpdate: (id: string, notes: string) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [notes, setNotes] = useState(selectedInquiry.admin_notes || '');
  const [showTxForm, setShowTxForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  const stats = useMemo(() => {
    const totalInvested = selectedInquiry.investments?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
    const totalPaid = selectedInquiry.payments?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
    const pledge = selectedInquiry.pledgeAmount || 0;
    const balance = totalInvested - totalPaid;
    const progress = pledge > 0 ? Math.min((totalInvested / pledge) * 100, 100) : 0;
    return { totalInvested, totalPaid, balance, progress, pledge };
  }, [selectedInquiry]);

  const historyTimeline = useMemo(() => {
    const items = [
      ...(selectedInquiry.investments?.map((i: any) => ({ ...i, type: 'Investment' })) || []),
      ...(selectedInquiry.payments?.map((p: any) => ({ ...p, type: 'Payment' })) || [])
    ];
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selectedInquiry]);

  const exportToExcel = async () => {
    setIsExporting(true);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Investment Ledger');
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Reference ID', key: 'id', width: 30 },
    ];
    historyTimeline.forEach(item => {
      worksheet.addRow({
        date: new Date(item.createdAt).toLocaleDateString(),
        type: item.type,
        amount: item.amount,
        id: item.id
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Ledger_${selectedInquiry.last_name}.xlsx`);
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#F8F7F5] overflow-hidden">
      
      {/* MOBILE TOP NAV (Hidden on Desktop) */}
      <div className="md:hidden bg-[#1A2F23] p-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-white/70 p-2"><ArrowLeft className="w-5 h-5"/></button>
        <h2 className="text-white font-serif font-bold text-sm truncate max-w-[200px]">
          {selectedInquiry.first_name} {selectedInquiry.last_name}
        </h2>
        <button onClick={exportToExcel} className="bg-[#C1663E] p-2 rounded-lg text-white">
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* LEFT PANEL: Branding & Global Stats (Desktop Sidebar) */}
      <div className="hidden md:flex w-full md:w-80 lg:w-96 bg-[#1A2F23] text-white p-8 flex-col justify-between relative shrink-0">
        <div className="absolute -bottom-10 -left-10 opacity-5 pointer-events-none">
          <DollarSign className="w-64 h-64" />
        </div>

        <div className="relative z-10 space-y-6">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Registry
          </button>
          
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedInquiry.category.map((cat: string) => (
                <span key={cat} className="bg-[#C1663E] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{cat}</span>
              ))}
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold leading-tight uppercase tracking-tight">
              {selectedInquiry.first_name}<br />{selectedInquiry.last_name}
            </h1>
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.3em] mt-3">
              ID: {selectedInquiry.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10">
             <p className="text-[9px] font-black text-white/30 uppercase mb-4 tracking-[0.2em]">Pledge Progress</p>
             <div className="flex justify-between items-end mb-2">
                <span className="text-xl font-black text-[#C1663E]">{Math.round(stats.progress)}%</span>
                <span className="text-[10px] text-white/40">${stats.totalInvested.toLocaleString()} / ${stats.pledge.toLocaleString()}</span>
             </div>
             <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#C1663E] h-full transition-all duration-1000" style={{ width: `${stats.progress}%` }} />
             </div>
          </div>
          
          <button 
            disabled={isExporting}
            onClick={exportToExcel}
            className="w-full bg-white text-[#1A2F23] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export Ledger
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Content Area */}
      <main className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 custom-scrollbar pb-24 md:pb-12">
        
        {/* Mobile Stats Carousel - Scrollable horizontally on small screens */}
        <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto pb-2 md:pb-0 snap-x hide-scrollbar">
          <div className="min-w-[80%] md:min-w-0 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm snap-center">
              <TrendingUp className="w-5 h-5 text-green-600 mb-3" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Total Invested</p>
              <p className="text-2xl font-bold text-[#1A2F23]">${stats.totalInvested.toLocaleString()}</p>
          </div>
          <div className="min-w-[80%] md:min-w-0 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm snap-center">
              <CreditCard className="w-5 h-5 text-blue-500 mb-3" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Settled Paid</p>
              <p className="text-2xl font-bold text-blue-600">${stats.totalPaid.toLocaleString()}</p>
          </div>
          <div className={`min-w-[80%] md:min-w-0 p-6 rounded-[2rem] border snap-center ${stats.balance > 0 ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-green-50 border-green-100 text-green-900'}`}>
              <CheckCircle2 className="w-5 h-5 mb-3 opacity-60" />
              <p className="text-[9px] font-black uppercase tracking-wider opacity-60">Balance Due</p>
              <p className="text-2xl font-bold">${stats.balance.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-10">
            
            {/* Activity History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                      <History className="w-3 h-3" /> Financial History
                    </h3>
                    <button 
                      onClick={() => setShowTxForm(true)} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#1A2F23] text-white rounded-xl text-[10px] font-bold"
                    >
                      <Plus className="w-3 h-3" /> New Entry
                    </button>
                </div>
                
                <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm space-y-2 max-h-[500px] overflow-y-auto">
                    {historyTimeline.length === 0 && (
                      <div className="text-center py-20">
                        <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Transaction History</p>
                      </div>
                    )}
                    {historyTimeline.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${item.type === 'Payment' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-600'}`}>
                                    {item.type === 'Payment' ? <CreditCard className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">{item.type}</p>
                                    <p className="text-[9px] text-gray-400 font-mono">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-mono font-bold text-sm ${item.type === 'Payment' ? 'text-blue-600' : 'text-green-700'}`}>
                                {item.type === 'Payment' ? '−' : '+'}${item.amount.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes & Operational Context */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 flex items-center gap-2">
                  <Info className="w-3 h-3" /> Governance & Notes
                </h3>
                <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-sm space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Client Email</p>
                          <p className="text-xs font-bold text-gray-800 truncate">{selectedInquiry.email}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                          <p className="text-[9px] font-black text-[#C1663E] uppercase tracking-[0.2em] px-1">Shareholder Registry Notes</p>
                          <textarea 
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="w-full h-40 bg-[#F8F7F5] border-none rounded-2xl p-4 text-xs focus:ring-2 focus:ring-[#C1663E]/20 outline-none resize-none placeholder:text-gray-300"
                              placeholder="Internal documentation regarding asset distribution..."
                          />
                      </div>
                    </div>
                    
                    <button 
                        onClick={() => { setIsSaving(true); onUpdate(selectedInquiry.id, notes).finally(() => setIsSaving(false)); }}
                        className="w-full bg-[#1A2F23] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#2a4d39] transition-all"
                    >
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Commit Notes
                    </button>
                </div>
            </div>
        </div>
      </main>

      {/* MOBILE FAB: Floating Add Button */}
      <button 
        onClick={() => setShowTxForm(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#1A2F23] text-white rounded-full shadow-2xl flex items-center justify-center z-[60] active:scale-90 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* TRANSACTION MODAL */}
      {showTxForm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1A2F23]/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <TransactionForm 
            enquiryId={selectedInquiry.id} 
            onClose={() => setShowTxForm(false)}
            onSuccess={() => window.location.reload()}
          />
        </div>
      )}
    </div>
  );
}