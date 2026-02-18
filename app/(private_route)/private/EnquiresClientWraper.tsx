"use client";

import React, { useState, useMemo } from 'react';
import { List, Search, ArrowUpRight, ExternalLink, Filter, Wallet, TrendingUp, Landmark } from 'lucide-react';
import { ClientInvestDetails } from './InvestorClient';
import { useRouter } from 'next/navigation';

export default function EnquiriesClientWrapper({ initialData }: { initialData: any[] }) {
  const [enquiries, setEnquiries] = useState(initialData);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // --- CALCULATIONS ---
  // Calculates totals based on the currently filtered enquiries
  const totals = useMemo(() => {
    return enquiries.reduce((acc, enquiry) => {
      const pledge = enquiry.pledgeAmount || 0;
      const liveInv = enquiry.investments?.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0) || 0;
      
      return {
        totalPledged: acc.totalPledged + pledge,
        totalInvested: acc.totalInvested + liveInv
      };
    }, { totalPledged: 0, totalInvested: 0 });
  }, [enquiries]);

  // Filter logic for search
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => 
      `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enquiries, searchQuery]);

  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          admin_notes: notes,
          performedBy: "Admin User" 
        }),
      });

      if (res.ok) {
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, admin_notes: notes } : e));
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. FINANCIAL DASHBOARD SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-[#C1663E]">
            <Landmark className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Global Pledges</p>
            <h2 className="text-2xl font-bold text-[#1A2F23] font-mono">
              ${totals.totalPledged.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="bg-[#1A2F23] p-6 rounded-[2.5rem] shadow-xl flex items-center gap-5 border border-white/5">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-green-400">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Live Capital In</p>
            <h2 className="text-2xl font-bold text-white font-mono">
              ${totals.totalInvested.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      {/* 1. TOP ACTION BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, email or company..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#C1663E]/20 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors">
             <Filter className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* 2. ENQUIRY GRID */}
      <div className="grid gap-3">
        {filteredEnquiries.map((enquiry) => {
          const totalInv = enquiry.investments?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0;
          const pledge = enquiry.pledgeAmount || 0;
          const isComplete = pledge > 0 && totalInv >= pledge;

          return (
            <div 
              key={enquiry.id}
              onClick={() => setSelectedInquiry(enquiry)}
              className={`group flex flex-col md:flex-row items-center justify-between p-4 bg-white border rounded-[2rem] transition-all cursor-pointer hover:border-[#C1663E]/30 hover:shadow-xl hover:shadow-gray-200/50 ${
                selectedInquiry?.id === enquiry.id ? 'border-[#C1663E] bg-indigo-50/30' : 'border-gray-100'
              }`}
            >
              {/* Profile & Identity */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#1A2F23]'
                }`}>
                  {enquiry.first_name[0]}{enquiry.last_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#1A2F23] group-hover:text-[#C1663E] transition-colors">
                      {enquiry.first_name} {enquiry.last_name}
                    </h3>
                    {isComplete && <div className="w-2 h-2 rounded-full bg-green-500" title="Pledge Fulfilled" />}
                  </div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">
                    {enquiry.company || 'Private Portfolio'}
                  </p>
                </div>
              </div>

              {/* Financial Summary Snippet */}
              <div className="hidden lg:flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Total Pledged</p>
                  <p className="text-sm font-mono font-bold text-gray-700">${pledge.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Live Investment</p>
                  <p className="text-sm font-mono font-bold text-green-600">${totalInv.toLocaleString()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/private/enquiry/${enquiry.id}`);
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> 
                  Full Report
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInquiry(enquiry);
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A2F23] hover:bg-[#233f2f] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-900/10"
                >
                  <Wallet className="w-3.5 h-3.5" /> 
                  Quick Ledger
                </button>
              </div>
            </div>
          );
        })}

        {filteredEnquiries.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No records found matching your search.</p>
          </div>
        )}
      </div>

      {/* Sidebar logic remains the same */}
      {selectedInquiry && (
        <>
          <div className="fixed inset-0 bg-[#1A2F23]/40 backdrop-blur-sm z-[90] animate-in fade-in duration-300" onClick={() => setSelectedInquiry(null)} />
          <ClientInvestDetails 
            selectedInquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
            onUpdate={handleUpdateNotes}
          />
        </>
      )}
    </div>
  );
}