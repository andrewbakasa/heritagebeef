'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, LayoutGrid, Search, Trash2, Loader2, AlertCircle, MoreHorizontal } from "lucide-react";
import { TabId } from "../MainDashBoardClient";
import axios from 'axios';

interface RegistryProps {
  tab: TabId;
  onEdit: (id: string) => void;
  onViewItems?: (id: string) => void;
  onDataLoaded?: (data: any[]) => void;
  displayData?: any[];
}

export const TabRegistry: React.FC<RegistryProps> = ({ tab, onEdit, onViewItems, onDataLoaded, displayData }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpointMap: Record<string, string> = {
        intake: 'cattle',
        pens: 'pens',
        feeding: 'feeding',
        health: 'health'
      };
      const route = endpointMap[tab] || tab;
      const response = await axios.get(`/di/api/${route}`);
      const fetchedData = response.data;
      setData(fetchedData);

      if (onDataLoaded) {
        onDataLoaded(fetchedData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load registry data.");
    } finally {
      setLoading(false);
    }
  }, [tab, onDataLoaded]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getColumns = () => {
    switch (tab) {
      case 'intake':
        return [
          { label: 'Lot ID', key: 'id', mono: true },
          { label: 'Source', key: 'source' },
          { label: 'Head Count', key: 'count' },
          { label: 'Breed', key: 'breed' },
          { label: 'Age M', key: 'age' },
          { label: 'Avg Weight', key: 'weight' },
          { label: 'Status', key: 'status', isBadge: true },
        ];
      case 'pens':
        return [
          { label: 'Pen #', key: 'penNumber', mono: true },
          { label: 'Capacity', key: 'capacity' },
          { label: 'Current', key: 'currentHead' },
          { label: 'Condition', key: 'condition' },
          { label: 'Status', key: 'status', isBadge: true },
        ];
      case 'feeding':
        return [
          { label: 'Time', key: 'time' },
          { label: 'Pen', key: 'penId' },
          { label: 'Ration', key: 'rationType' },
          { label: 'Amount', key: 'amount' },
          { label: 'Operator', key: 'operator' },
        ];
      default:
        return [
          { label: 'ID', key: 'id', mono: true },
          { label: 'Name', key: 'name' },
          { label: 'Description', key: 'description' },
          { label: 'Date', key: 'createdAt' },
        ];
    }
  };

  const columns = getColumns();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#4A6741]" />
        <p className="text-sm font-medium animate-pulse">Syncing with ranch records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-50/50">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="text-sm font-bold">{error}</p>
        <button onClick={fetchData} className="mt-4 text-xs underline font-bold">Try Again</button>
      </div>
    );
  }

  const tableRows = displayData || data;

  return (
    <div className="w-full">
      {/* --- MOBILE VIEW (Card Layout) --- */}
      <div className="block lg:hidden space-y-4 p-4">
        {tableRows.length > 0 ? tableRows.map((row) => (
          <div key={row.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm active:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{columns[0].label}</p>
                <h3 className="text-lg font-mono font-bold text-[#4A6741]">{row[columns[0].key]}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onViewItems?.(row.id)} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl"><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => onEdit(row.dbId || row.id)} className="p-2.5 bg-[#4A6741]/10 text-[#4A6741] rounded-xl"><Edit2 className="w-4 h-4" /></button>
                <button className="p-2.5 bg-red-50 text-red-600 rounded-xl"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {columns.slice(1).map((col) => (
                <div key={col.key}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{col.label}</p>
                  {col.isBadge ? (
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      ['Active', 'Good', 'Full'].includes(row[col.key]) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row[col.key]}
                    </span>
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">{row[col.key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )) : (
            <div className="text-center py-10 text-slate-400">Registry Empty</div>
        )}
      </div>

      {/* --- DESKTOP VIEW (Table Layout) --- */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th key={col.label} className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right uppercase text-[10px] font-black text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {tableRows.length > 0 ? tableRows.map((row) => (
              <tr key={row.id} className="hover:bg-indigo-50/50 transition-colors group cursor-pointer">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-nowrap">
                    {col.isBadge ? (
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        ['Active', 'Good', 'Full'].includes(row[col.key]) 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {row[col.key]}
                      </span>
                    ) : (
                      <span className={`text-sm ${col.mono ? 'font-mono font-bold text-[#4A6741]' : 'text-slate-600'}`}>
                        {row[col.key]}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onViewItems?.(row.id); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><LayoutGrid className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onEdit(row.dbId || row.id); }} className="p-2 text-slate-400 hover:text-[#4A6741] hover:bg-slate-100 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 opacity-20" />
                    <p className="text-sm font-medium uppercase tracking-widest">Registry Empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { Edit2, LayoutGrid, Search, Trash2, Loader2, AlertCircle } from "lucide-react";
// import { TabId } from "../MainDashBoardClient";
// import axios from 'axios'; // Or use native fetch

// interface RegistryProps {
//   tab: TabId;
//   onEdit: (id: string) => void;
//   onViewItems?: (id: string) => void;
//   onDataLoaded?: (data: any[]) => void; // Added this to fix the export issue
//   displayData?: any[]; // <--- Add this
// }

// export const TabRegistry: React.FC<RegistryProps> = ({ tab, onEdit, onViewItems,onDataLoaded, displayData}) => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // 1. Fetching Logic
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       setLoading(true);
  
//         // Map tab names to actual database route endpoints
//         const endpointMap: Record<string, string> = {
//             intake: 'cattle',
//             pens: 'pens',
//             feeding: 'feeding',
//             health: 'health'
//         };
//         const route = endpointMap[tab] || tab;
//         // Use the mapped route in the request
//         const response = await axios.get(`/di/api/${route}`);
//         const fetchedData = response.data;
//         setData(fetchedData);

//         // ADD THIS LINE to send data to the parent
//         if (onDataLoaded) {
//         onDataLoaded(fetchedData);
//         }
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to load registry data.");
//     } finally {
//       setLoading(false);
//     }
//   }, [tab]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // 2. Dynamic Column Mapping based on DB Schema
//   const getColumns = () => {
//     switch (tab) {
//       case 'intake':
//         return [
//           { label: 'Lot ID', key: 'id', mono: true },
//           { label: 'Source', key: 'source' },
//           { label: 'Head Count', key: 'count' },
//           { label: 'Avg Weight', key: 'weight' },
//           { label: 'Status', key: 'status', isBadge: true },
//         ];
//       case 'pens':
//         return [
//           { label: 'Pen #', key: 'penNumber', mono: true },
//           { label: 'Capacity', key: 'capacity' },
//           { label: 'Current', key: 'currentHead' },
//           { label: 'Condition', key: 'condition' },
//           { label: 'Status', key: 'status', isBadge: true },
//         ];
//       case 'feeding':
//         return [
//           { label: 'Time', key: 'time' },
//           { label: 'Pen', key: 'penId' },
//           { label: 'Ration', key: 'rationType' },
//           { label: 'Amount', key: 'amount' },
//           { label: 'Operator', key: 'operator' },
//         ];
//       default:
//         return [
//           { label: 'ID', key: 'id', mono: true },
//           { label: 'Name', key: 'name' },
//           { label: 'Description', key: 'description' },
//           { label: 'Date', key: 'createdAt' },
//         ];
//     }
//   };

//   const columns = getColumns();

//   // --- UI States ---

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-slate-400">
//         <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#4A6741]" />
//         <p className="text-sm font-medium animate-pulse">Syncing with ranch records...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-50/50">
//         <AlertCircle className="w-8 h-8 mb-2" />
//         <p className="text-sm font-bold">{error}</p>
//         <button onClick={fetchData} className="mt-4 text-xs underline font-bold">Try Again</button>
//       </div>
//     );
//   }
// // Use filtered data from parent if provided, otherwise use internal fetched data
//   const tableRows = displayData || data;
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full text-left border-collapse">
//         <thead className="bg-slate-50 border-b border-slate-200">
//           <tr>
//             {columns.map((col) => (
//               <th key={col.label} className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">
//                 {col.label}
//               </th>
//             ))}
//             <th className="px-6 py-4 text-right uppercase text-[10px] font-black text-slate-500">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-slate-100 bg-white">
//           {tableRows.length > 0 ? tableRows.map((row) => (
//             <tr 
//               key={row.id} 
//               className="hover:bg-indigo-50/50 transition-colors group cursor-pointer"
//             >
//               {columns.map((col) => (
//                 <td key={col.key} className="px-6 py-4">
//                   {col.isBadge ? (
//                     <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
//                       ['Active', 'Good', 'Full'].includes(row[col.key]) 
//                         ? 'bg-green-100 text-green-700' 
//                         : 'bg-amber-100 text-amber-700'
//                     }`}>
//                       {row[col.key]}
//                     </span>
//                   ) : (
//                     <span className={`text-sm ${col.mono ? 'font-mono font-bold text-[#4A6741]' : 'text-slate-600'}`}>
//                       {row[col.key]}
//                     </span>
//                   )}
//                 </td>
//               ))}
              
//               <td className="px-6 py-4 text-right">
//                 <div className="flex justify-end items-center gap-2">
//                   <button 
//                     onClick={(e) => { e.stopPropagation(); onViewItems?.(row.id); }}
//                     className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
//                   >
//                     <LayoutGrid className="w-4 h-4" />
//                   </button>
                  
//                   <button 
//                     onClick={(e) => { e.stopPropagation(); onEdit(row.dbId||row.id) ; console.log(row); }}
//                     className="p-2 text-slate-400 hover:text-[#4A6741] hover:bg-slate-100 rounded-lg transition-all"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                   </button>

//                   <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           )) : (
//             <tr>
//               <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400">
//                 <div className="flex flex-col items-center gap-2">
//                   <Search className="w-8 h-8 opacity-20" />
//                   <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Registry Empty</p>
//                 </div>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };