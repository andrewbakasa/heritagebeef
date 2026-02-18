import React from 'react';
import { Warehouse, Plus, AlertTriangle } from 'lucide-react';

export const FeedInventoryManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-ranch-cream-dark">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-ranch-cream rounded-lg"><Warehouse className="w-5 h-5 text-ranch-forest" /></div>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-full">LOW STOCK</span>
          </div>
          <h4 className="text-xs font-bold text-ranch-slate uppercase">Corn Silage</h4>
          <div className="text-2xl font-serif font-bold">1,250 <span className="text-sm font-sans font-normal opacity-50">kg</span></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ranch-cream-dark overflow-hidden">
        <div className="p-4 border-b border-ranch-cream-dark flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider">Inventory Transactions</h3>
          <button className="text-xs font-bold flex items-center gap-1 text-ranch-forest"><Plus className="w-4 h-4" /> Log Purchase</button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-ranch-cream/50 text-[10px] font-black uppercase text-ranch-slate">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Item</th>
              <th className="p-4 text-right">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ranch-cream-dark">
            <tr>
              <td className="p-4 text-xs">Feb 21, 2026</td>
              <td className="p-4"><span className="text-green-600 font-bold text-[10px]">PURCHASE</span></td>
              <td className="p-4">Alfalfa Pellets</td>
              <td className="p-4 text-right font-mono">+5,000 kg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};