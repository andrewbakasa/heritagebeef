"use client";

import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, CreditCard, X, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

type TransactionType = 'investment' | 'payment';

export const TransactionForm = ({ 
  enquiryId, 
  onSuccess, 
  onClose,
  isAllowedPayment 
}: { 
  enquiryId: string; 
  onSuccess: () => void; 
  onClose: () => void;
  isAllowedPayment: boolean; // Optional prop to control access
}) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('investment');
  const [loading, setLoading] = useState(false);
  //toast.message(isAllowedPayment)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'payment' && !isAllowedPayment) return; // Guard clause
    setLoading(true);
    
    try {
      const response = await fetch(`/api/enquiries/${enquiryId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: parseFloat(amount), 
          type 
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl max-w-sm w-full animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Add Transaction</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4"/></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Toggle between Investment and Payment */}
        <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
          {(['investment', 'payment'] as TransactionType[]).map((t) => {
            const isDisabled = t === 'payment' && !isAllowedPayment;
            
            return (
              <button
                key={t}
                type="button"
                disabled={isDisabled}
                onClick={() => setType(t)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1 ${
                  type === t 
                    ? 'bg-[#1A2F23] text-white shadow-lg' 
                    : isDisabled 
                      ? 'text-gray-300 cursor-not-allowed opacity-60' 
                      : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isDisabled && <Lock className="w-3 h-3" />}
                {t}
              </button>
            );
          })}
        </div>

        {/* Amount Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <input
            autoFocus
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-12 pr-4 py-4 bg-[#F8F7F5] border-none rounded-2xl text-xl font-bold text-[#1A2F23] focus:ring-2 focus:ring-[#C1663E]/20 outline-none placeholder:text-gray-300"
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={loading || !amount}
          className="w-full bg-[#C1663E] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#a85935] disabled:opacity-50 transition-all shadow-lg shadow-orange-900/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              {type === 'investment' ? <ArrowUpRight className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
              Post {type}
            </>
          )}
        </button>
      </form>
    </div>
  );
};