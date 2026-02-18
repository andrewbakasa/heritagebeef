import React from 'react';
import { ShieldPlus, Calendar } from 'lucide-react';

export const MedicalLogForm: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border-2 border-ranch-terracotta/10">
      <div className="flex items-center gap-3 mb-6">
        <ShieldPlus className="w-6 h-6 text-ranch-terracotta" />
        <h2 className="font-serif text-xl font-bold">Medical Treatment</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Animal Tag ID" className="p-3 border rounded-xl border-ranch-cream-dark text-sm" />
        <input type="text" placeholder="Treatment / Vaccine Name" className="p-3 border rounded-xl border-ranch-cream-dark text-sm" />
        <div className="relative">
          <input type="number" placeholder="Withdrawal Days" className="w-full p-3 border rounded-xl border-ranch-cream-dark text-sm pr-10" />
          <Calendar className="absolute right-3 top-3 w-4 h-4 text-ranch-slate opacity-40" />
        </div>
        <input type="text" placeholder="Administered By" className="p-3 border rounded-xl border-ranch-cream-dark text-sm" />
        <textarea placeholder="Notes (Injection site, dosage details...)" className="md:col-span-2 p-3 border rounded-xl border-ranch-cream-dark text-sm h-24" />
      </div>
      <button className="w-full mt-6 bg-ranch-terracotta text-white py-4 rounded-xl font-bold hover:opacity-90">
        Record Treatment
      </button>
    </div>
  );
};