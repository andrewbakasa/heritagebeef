'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Truck, Wheat, ShieldPlus, Gavel, 
  History, Plus, BarChart3, ChevronRight, Warehouse, 
  Menu, X, LogOut, Shield, LayoutGrid, ArrowLeft, 
  Search, Filter, MoreVertical, Edit2, Trash2,
  Loader2,
  Download
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// --- Components ---
import { CattleIntakeForm } from './_components/Forms/CattleIntakeForm';
import { PenForm } from './_components/Forms/PenForm';
import { TabRegistry } from './_components/TableRegistry';
import { exportToExcel } from './lib/exportExcel';

export type TabId = 'overview' | 'intake' | 'pens' | 'feeding' | 'health' | 'sales' | 'inventory';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Command Center' },
  { id: 'intake', label: 'Cattle', icon: Truck, description: 'Herd Registry' },
  { id: 'pens', label: 'Pens', icon: LayoutGrid, description: 'Lot Management' },
  { id: 'feeding', label: 'Feeding', icon: Wheat, description: 'Daily Rations' },
  { id: 'health', label: 'Medical', icon: ShieldPlus, description: 'Vet Logs' },
  { id: 'inventory', label: 'Silos', icon: Warehouse, description: 'Stock Levels' },
] as const;

export default function FeedlotDashboard({ currentUser }: { currentUser: any }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [registryData, setRegistryData] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const filteredData = useMemo(() => {
    if (!searchTerm) return registryData;
    return registryData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [registryData, searchTerm]);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await exportToExcel(filteredData, `feedlot_${activeTab}_filtered`);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => { 
    setView('list'); 
    setEditingId(null);
    setSearchTerm('');
  }, [activeTab]);

  const isAdmin = currentUser?.isAdmin || currentUser?.roles?.includes('admin');

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
         
          <div 
            onClick={() => { router.push("/") }} 
            className="bg-[#4A6741] p-2 rounded-xl cursor-pointer hover:bg-[#3d5535] transition-colors"
            role="button"
            title="Go to Home" // <--- Add this
            tabIndex={0}
          >
            <Wheat className="w-6 h-6 text-[#E6C9A2]" />
          </div>
          <div>
            <span className="block font-serif text-xl font-bold uppercase tracking-tight text-white">Precision</span>
            <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Feedlot System</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
              ? 'bg-[#4A6741] text-white shadow-lg' 
              : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#E6C9A2]' : ''}`} />
            <div className="text-left">
              <p className="text-sm font-bold">{item.label}</p>
              <p className="text-[10px] opacity-60">{item.description}</p>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-black/20 space-y-2">
        {isAdmin && (
          <button 
            onClick={() => router.push('/admin')} 
            className="w-full flex items-center gap-3 px-4 py-3 text-[#E6C9A2] bg-white/5 rounded-xl text-sm font-bold border border-white/5 hover:bg-white/10 transition-colors"
          >
            <Shield className="w-4 h-4" /> Admin Console
          </button>
        )}
        <button 
          onClick={() => signOut()} 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400/70 text-sm font-bold hover:bg-red-500/5 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  const handleFormSuccess = () => {
    setEditingId(null);
    setView('list');
    router.refresh();
  };

  const handleEditRequest = (id: string) => {
    setEditingId(id);
    setView('form');
  };

  const handleFormCancel = () => {
    setEditingId(null);
    setView('list');
  };

  return (
    <div className="flex h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-72 bg-[#1A1A1A] flex-col border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* --- MOBILE DRAWER (RESTORED) --- */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <aside className={`absolute inset-y-0 left-0 w-80 bg-[#1A1A1A] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-4 right-4">
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <SidebarContent />
        </aside>
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-serif font-bold capitalize leading-none">
                {activeTab} {view === 'form' ? 'Entry' : 'Registry'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold leading-none">{currentUser?.name || 'Manager'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mt-1">Active Session</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#4A6741] text-[#E6C9A2] flex items-center justify-center font-bold shadow-inner border border-black/10">
              {currentUser?.name?.substring(0,2).toUpperCase() || 'JD'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' ? (
              <OverviewSection onNavigate={(tab) => { setActiveTab(tab); setView('form'); }} />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {view === 'form' && (
                      <button onClick={() => setView('list')} className="p-2 hover:bg-white border border-slate-200 rounded-xl transition-all shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                    )}
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                      {view === 'list' ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List` : `New ${activeTab.replace(/^\w/, (c) => c.toUpperCase())}`}
                    </h2>
                  </div>

                  {view === 'list' && (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleDownload}
                        disabled={isExporting || filteredData.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export Excel
                      </button>

                      <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4A6741] transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search records..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] outline-none w-full md:w-64 transition-all" 
                        />
                      </div>
                      
                      <button onClick={() => setView('form')} className="flex items-center gap-2 bg-[#4A6741] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-[#4A6741]/20 hover:bg-[#3d5535] transition-all">
                        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add New</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {view === 'form' ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-2 overflow-hidden">
                       {activeTab === 'intake' && <CattleIntakeForm initialId={editingId} onCancel={handleFormCancel} onSuccess={handleFormSuccess} />}
                       {activeTab === 'pens' && <PenForm initialId={editingId} onCancel={handleFormCancel} onSuccess={handleFormSuccess} />}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <TabRegistry 
                        tab={activeTab} 
                        onEdit={handleEditRequest}
                        onViewItems={(id) => console.log("Viewing sub-items for:", id)} 
                        onDataLoaded={setRegistryData}
                        displayData={filteredData} // Ensures the table filters in real-time
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// StatCard and OverviewSection remain exactly as they were
function OverviewSection({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Herd" value="1,240" sub="Head in Pens" icon={BarChart3} />
        <StatCard label="Avg Weight" value="442 kg" sub="+12kg this week" icon={History} />
        <StatCard label="Silo Level" value="84%" sub="12 days remaining" icon={Warehouse} />
        <StatCard label="ROI Est." value="$342/hd" sub="Market price linked" icon={Gavel} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <h4 className="text-2xl font-serif font-bold text-slate-800">{value}</h4>
          <p className="text-[10px] font-medium text-slate-500 mt-1">{sub}</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#4A6741]/10 transition-colors">
          <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#4A6741]" />
        </div>
      </div>
    </div>
  );
}
// 'use client';

// import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
// // ... other imports remain exactly the same
// import { 
//   LayoutDashboard, Truck, Wheat, ShieldPlus, Gavel, 
//   History, Plus, BarChart3, ChevronRight, Warehouse, 
//   Menu, X, LogOut, Shield, LayoutGrid, ArrowLeft, 
//   Search, Filter, MoreVertical, Edit2, Trash2,
//   Loader2,
//   Download
// } from 'lucide-react';
// import { signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// // --- Components ---
// import { CattleIntakeForm } from './_components/Forms/CattleIntakeForm';
// import { PenForm } from './_components/Forms/PenForm';
// import { TabRegistry } from './_components/TableRegistry';
// import { exportToExcel } from './lib/exportExcel';

// export type TabId = 'overview' | 'intake' | 'pens' | 'feeding' | 'health' | 'sales' | 'inventory';

// const navItems = [
//   { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Command Center' },
//   { id: 'intake', label: 'Cattle', icon: Truck, description: 'Herd Registry' },
//   { id: 'pens', label: 'Pens', icon: LayoutGrid, description: 'Lot Management' },
//   { id: 'feeding', label: 'Feeding', icon: Wheat, description: 'Daily Rations' },
//   { id: 'health', label: 'Medical', icon: ShieldPlus, description: 'Vet Logs' },
//   { id: 'inventory', label: 'Silos', icon: Warehouse, description: 'Stock Levels' },
// ] as const;

// export default function FeedlotDashboard({ currentUser }: { currentUser: any }) {
//   const [activeTab, setActiveTab] = useState<TabId>('overview');
//   const [view, setView] = useState<'list' | 'form'>('list');
//   const [registryData, setRegistryData] = useState<any[]>([]); 
//   const [searchTerm, setSearchTerm] = useState(''); // New search state
//   const [isExporting, setIsExporting] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const router = useRouter();

//   // --- Search Logic ---
//   // This filters the registryData based on the search term across all object keys
//   const filteredData = useMemo(() => {
//     if (!searchTerm) return registryData;
    
//     return registryData.filter((item) =>
//       Object.values(item).some((val) =>
//         String(val).toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [registryData, searchTerm]);

//   const handleDownload = async () => {
//     setIsExporting(true);
//     try {
//       // Exporting filteredData instead of registryData so search results are respected
//       await exportToExcel(filteredData, `feedlot_${activeTab}_filtered`);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   useEffect(() => { 
//     setView('list'); 
//     setEditingId(null);
//     setSearchTerm(''); // Clear search when switching tabs
//   }, [activeTab]);

//   const isAdmin = currentUser?.isAdmin || currentUser?.roles?.includes('admin');

//   // SidebarContent function remains the same...
//   const SidebarContent = () => (
//     <>
//       <div className="p-8 border-b border-white/5">
//         <div className="flex items-center gap-3">
//           <div className="bg-[#4A6741] p-2 rounded-xl">
//             <Wheat className="w-6 h-6 text-[#E6C9A2]" />
//           </div>
//           <div>
//             <span className="block font-serif text-xl font-bold uppercase tracking-tight text-white">Precision</span>
//             <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Feedlot System</span>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
//         {navItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => {
//               setActiveTab(item.id);
//               setIsMobileMenuOpen(false);
//             }}
//             className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
//               activeTab === item.id 
//               ? 'bg-[#4A6741] text-white shadow-lg' 
//               : 'text-white/50 hover:bg-white/5 hover:text-white'
//             }`}
//           >
//             <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#E6C9A2]' : ''}`} />
//             <div className="text-left">
//               <p className="text-sm font-bold">{item.label}</p>
//               <p className="text-[10px] opacity-60">{item.description}</p>
//             </div>
//           </button>
//         ))}
//       </nav>

//       <div className="p-4 bg-black/20 space-y-2">
//         {isAdmin && (
//           <button 
//             onClick={() => router.push('/admin')} 
//             className="w-full flex items-center gap-3 px-4 py-3 text-[#E6C9A2] bg-white/5 rounded-xl text-sm font-bold border border-white/5 hover:bg-white/10 transition-colors"
//           >
//             <Shield className="w-4 h-4" /> Admin Console
//           </button>
//         )}
//         <button 
//           onClick={() => signOut()} 
//           className="w-full flex items-center gap-3 px-4 py-3 text-red-400/70 text-sm font-bold hover:bg-red-500/5 rounded-xl transition-colors"
//         >
//           <LogOut className="w-4 h-4" /> Sign Out
//         </button>
//       </div>
//     </>
//   );

//   const handleFormSuccess = () => {
//     setEditingId(null);
//     setView('list');
//     router.refresh();
//   };

//   const handleEditRequest = (id: string) => {
//     setEditingId(id);
//     setView('form');
//   };

//   const handleFormCancel = () => {
//     setEditingId(null);
//     setView('list');
//   };

//   return (
//     <div className="flex h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans overflow-hidden">
//       {/* Sidebar logic remains same */}
//       <aside className="hidden lg:flex w-72 bg-[#1A1A1A] flex-col border-r border-slate-800">
//         <SidebarContent />
//       </aside>

//       {/* Main content area */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600">
//               <Menu className="w-6 h-6" />
//             </button>
//             <div>
//               <h1 className="text-xl lg:text-2xl font-serif font-bold capitalize leading-none">
//                 {activeTab} {view === 'form' ? 'Entry' : 'Registry'}
//               </h1>
//             </div>
//           </div>
//           {/* User profile section remains same */}
//           <div className="flex items-center gap-4">
//             <div className="hidden md:block text-right">
//               <p className="text-sm font-bold leading-none">{currentUser?.name || 'Manager'}</p>
//               <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mt-1">Active Session</p>
//             </div>
//             <div className="h-10 w-10 rounded-xl bg-[#4A6741] text-[#E6C9A2] flex items-center justify-center font-bold shadow-inner border border-black/10">
//               {currentUser?.name?.substring(0,2).toUpperCase() || 'JD'}
//             </div>
//           </div>
//         </header>

//         <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-[#F8F9FA]">
//           <div className="max-w-7xl mx-auto">
//             {activeTab === 'overview' ? (
//               <OverviewSection onNavigate={(tab) => { setActiveTab(tab); setView('form'); }} />
//             ) : (
//               <div className="space-y-6">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     {view === 'form' && (
//                       <button onClick={() => setView('list')} className="p-2 hover:bg-white border border-slate-200 rounded-xl transition-all shadow-sm">
//                         <ArrowLeft className="w-5 h-5 text-slate-600" />
//                       </button>
//                     )}
//                     <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
//                       {view === 'list' ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List` : `New ${activeTab.replace(/^\w/, (c) => c.toUpperCase())}`}
//                     </h2>
//                   </div>

//                   {view === 'list' && (
//                     <div className="flex items-center gap-3">
//                       <button 
//                         onClick={handleDownload}
//                         disabled={isExporting || filteredData.length === 0}
//                         className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
//                       >
//                         {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
//                         Export Excel
//                       </button>

//                       <div className="relative group">
//                         <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4A6741] transition-colors" />
//                         <input 
//                           type="text" 
//                           placeholder="Search records..." 
//                           value={searchTerm} // Controlled component
//                           onChange={(e) => setSearchTerm(e.target.value)} // Update search term
//                           className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] outline-none w-full md:w-64 transition-all" 
//                         />
//                       </div>
                      
//                       <button onClick={() => setView('form')} className="flex items-center gap-2 bg-[#4A6741] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-[#4A6741]/20 hover:bg-[#3d5535] transition-all">
//                         <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add New</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                   {view === 'form' ? (
//                     <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-2 overflow-hidden">
//                        {activeTab === 'intake' && <CattleIntakeForm initialId={editingId} onCancel={handleFormCancel} onSuccess={handleFormSuccess} />}
//                        {activeTab === 'pens' && <PenForm initialId={editingId} onCancel={handleFormCancel} onSuccess={handleFormSuccess} />}
//                     </div>
//                   ) : (
//                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//                       <TabRegistry 
//                         tab={activeTab} 
//                         onEdit={handleEditRequest}
//                         onViewItems={(id) => console.log("Viewing sub-items for:", id)} 
//                         onDataLoaded={setRegistryData}
//                         displayData={filteredData}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // StatCard and OverviewSection functions remain the same...
// function OverviewSection({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <StatCard label="Total Herd" value="1,240" sub="Head in Pens" icon={BarChart3} />
//         <StatCard label="Avg Weight" value="442 kg" sub="+12kg this week" icon={History} />
//         <StatCard label="Silo Level" value="84%" sub="12 days remaining" icon={Warehouse} />
//         <StatCard label="ROI Est." value="$342/hd" sub="Market price linked" icon={Gavel} />
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value, sub, icon: Icon }: any) {
//   return (
//     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
//       <div className="flex justify-between items-start">
//         <div>
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//           <h4 className="text-2xl font-serif font-bold text-slate-800">{value}</h4>
//           <p className="text-[10px] font-medium text-slate-500 mt-1">{sub}</p>
//         </div>
//         <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#4A6741]/10 transition-colors">
//           <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#4A6741]" />
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { 
//   LayoutDashboard, Truck, Wheat, ShieldPlus, Gavel, 
//   History, Plus, BarChart3, ChevronRight, Warehouse, 
//   Menu, X, LogOut, Shield, LayoutGrid, ArrowLeft, 
//   Search, Filter, MoreVertical, Edit2, Trash2,
//   Loader2,
//   Download
// } from 'lucide-react';
// import { signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// // --- Components ---
// import { CattleIntakeForm } from './_components/Forms/CattleIntakeForm';
// import { PenForm } from './_components/Forms/PenForm';
// import { TabRegistry } from './_components/TableRegistry';
// import { exportToExcel } from './lib/exportExcel';

// // --- Types ---
// export type TabId = 'overview' | 'intake' | 'pens' | 'feeding' | 'health' | 'sales' | 'inventory';

// const navItems = [
//   { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Command Center' },
//   { id: 'intake', label: 'Cattle', icon: Truck, description: 'Herd Registry' },
//   { id: 'pens', label: 'Pens', icon: LayoutGrid, description: 'Lot Management' },
//   { id: 'feeding', label: 'Feeding', icon: Wheat, description: 'Daily Rations' },
//   { id: 'health', label: 'Medical', icon: ShieldPlus, description: 'Vet Logs' },
//   { id: 'inventory', label: 'Silos', icon: Warehouse, description: 'Stock Levels' },
// ] as const;

// export default function FeedlotDashboard({ currentUser }: { currentUser: any }) {
//   const [activeTab, setActiveTab] = useState<TabId>('overview');
//   const [view, setView] = useState<'list' | 'form'>('list');
//   const [registryData, setRegistryData] = useState<any[]>([]); // Data for export
//   const [isExporting, setIsExporting] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null); // New state for editing
//   const router = useRouter();

//  const handleDownload = async () => {
//     setIsExporting(true);
//     try {
//       await exportToExcel(registryData, `feedlot_${activeTab}`);
//     } finally {
//       setIsExporting(false);
//     }
//   };
//   // Reset view and clear editing ID when switching tabs
//   useEffect(() => { 
//     setView('list'); 
//     setEditingId(null);
//   }, [activeTab]);

//   const isAdmin = currentUser?.isAdmin || currentUser?.roles?.includes('admin');

//   // Shared Sidebar Content to avoid duplication
//   const SidebarContent = () => (
//     <>
//       <div className="p-8 border-b border-white/5">
//         <div className="flex items-center gap-3">
//           <div className="bg-[#4A6741] p-2 rounded-xl">
//             <Wheat className="w-6 h-6 text-[#E6C9A2]" />
//           </div>
//           <div>
//             <span className="block font-serif text-xl font-bold uppercase tracking-tight text-white">Precision</span>
//             <span className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Feedlot System</span>
//           </div>
//         </div>
//       </div>

//       <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
//         {navItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => {
//               setActiveTab(item.id);
//               setIsMobileMenuOpen(false);
//             }}
//             className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
//               activeTab === item.id 
//               ? 'bg-[#4A6741] text-white shadow-lg' 
//               : 'text-white/50 hover:bg-white/5 hover:text-white'
//             }`}
//           >
//             <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#E6C9A2]' : ''}`} />
//             <div className="text-left">
//               <p className="text-sm font-bold">{item.label}</p>
//               <p className="text-[10px] opacity-60">{item.description}</p>
//             </div>
//           </button>
//         ))}
//       </nav>

//       <div className="p-4 bg-black/20 space-y-2">
//         {isAdmin && (
//           <button 
//             onClick={() => router.push('/admin')} 
//             className="w-full flex items-center gap-3 px-4 py-3 text-[#E6C9A2] bg-white/5 rounded-xl text-sm font-bold border border-white/5 hover:bg-white/10 transition-colors"
//           >
//             <Shield className="w-4 h-4" /> Admin Console
//           </button>
//         )}
//         <button 
//           onClick={() => signOut()} 
//           className="w-full flex items-center gap-3 px-4 py-3 text-red-400/70 text-sm font-bold hover:bg-red-500/5 rounded-xl transition-colors"
//         >
//           <LogOut className="w-4 h-4" /> Sign Out
//         </button>
//       </div>
//     </>
//   );

 
//   const handleFormSuccess = () => {
//     setEditingId(null);
//     setView('list');
//     // Optional: add a toast notification here
//     router.refresh(); // Refresh data from server
//   };
//   // --- Handlers ---
//   const handleEditRequest = (id: string) => {
//     setEditingId(id); // Set the ID to be edited
//     setView('form');  // Switch to form view
//   };

//   const handleFormCancel = () => {
//     setEditingId(null);
//     setView('list');
//   };
//   return (
//     <div className="flex h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans overflow-hidden">
      
//       {/* --- DESKTOP SIDEBAR --- */}
//       <aside className="hidden lg:flex w-72 bg-[#1A1A1A] flex-col border-r border-slate-800">
//         <SidebarContent />
//       </aside>

//       {/* --- MOBILE DRAWER --- */}
//       <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         {/* Backdrop */}
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        
//         {/* Drawer Panel */}
//         <aside className={`absolute inset-y-0 left-0 w-80 bg-[#1A1A1A] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//           <div className="absolute top-4 right-4 lg:hidden">
//             <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white">
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//           <SidebarContent />
//         </aside>
//       </div>

//       {/* --- MAIN CONTENT --- */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
//         {/* Header */}
//         <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)} 
//               className="lg:hidden p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600"
//             >
//               <Menu className="w-6 h-6" />
//             </button>
//             <div>
//               <h1 className="text-xl lg:text-2xl font-serif font-bold capitalize leading-none">
//                 {activeTab} {view === 'form' ? 'Entry' : 'Registry'}
//               </h1>
//               <p className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                 Real-time Cattle Management
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="hidden md:block text-right">
//               <p className="text-sm font-bold leading-none">{currentUser?.name || 'Manager'}</p>
//               <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mt-1">Active Session</p>
//             </div>
//             <div className="h-10 w-10 rounded-xl bg-[#4A6741] text-[#E6C9A2] flex items-center justify-center font-bold shadow-inner border border-black/10">
//               {currentUser?.name?.substring(0,2).toUpperCase() || 'JD'}
//             </div>
//           </div>
//         </header>

//         {/* Scrollable Body */}
//         <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-[#F8F9FA]">
//           <div className="max-w-7xl mx-auto">
            
//             {activeTab === 'overview' ? (
//               <OverviewSection onNavigate={(tab) => { setActiveTab(tab); setView('form'); }} />
//             ) : (
//               <div className="space-y-6">
//                 {/* Dynamic Toolbar */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center gap-3">
//                     {view === 'form' && (
//                       <button 
//                         onClick={() => setView('list')} 
//                         className="p-2 hover:bg-white border border-slate-200 rounded-xl transition-all shadow-sm"
//                       >
//                         <ArrowLeft className="w-5 h-5 text-slate-600" />
//                       </button>
//                     )}
//                     <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
//                       {view === 'list' ? `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List` : `New ${activeTab.replace(/^\w/, (c) => c.toUpperCase())}`}
//                     </h2>
//                   </div>

//                   {view === 'list' && (
//                     <div className="flex items-center gap-3">

                     
//                     <button 
//                       onClick={handleDownload}
//                       disabled={isExporting || registryData.length === 0}
//                       className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
//                     >
//                       {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
//                       Export Excel
//                     </button>
                 

//                       <div className="relative group">
//                         <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4A6741] transition-colors" />
//                         <input 
//                           type="text" 
//                           placeholder="Search records..." 
//                           className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741] outline-none w-full md:w-64 transition-all" 
//                         />
//                       </div>
//                       <button 
//                         onClick={() => setView('form')} 
//                         className="flex items-center gap-2 bg-[#4A6741] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-[#4A6741]/20 hover:bg-[#3d5535] active:scale-95 transition-all"
//                       >
//                         <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add New</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Content Fade-in Container */}
//                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//                   {view === 'form' ? (
//                     <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-2 overflow-hidden">
//                        {activeTab === 'intake' && <CattleIntakeForm 
//                                                   initialId={editingId} 
//                                                   onCancel={handleFormCancel} 
//                                                   onSuccess={handleFormSuccess} 
//                                                 />
//                         }
//                        {activeTab === 'pens' && <PenForm 
//                                                   initialId={editingId} 
//                                                   onCancel={handleFormCancel} 
//                                                   onSuccess={handleFormSuccess} 
//                                                 />
//                         }
//                     </div>
//                   ) : (
//                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//                       <TabRegistry 
//                         tab={activeTab} 
//                         onEdit={handleEditRequest}
//                         onViewItems={(id) => console.log("Viewing sub-items for:", id)} 
//                         onDataLoaded={setRegistryData} // <--- ADD THIS LINE
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// function OverviewSection({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <StatCard label="Total Herd" value="1,240" sub="Head in Pens" icon={BarChart3} />
//         <StatCard label="Avg Weight" value="442 kg" sub="+12kg this week" icon={History} />
//         <StatCard label="Silo Level" value="84%" sub="12 days remaining" icon={Warehouse} />
//         <StatCard label="ROI Est." value="$342/hd" sub="Market price linked" icon={Gavel} />
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//           <h3 className="font-bold mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <button onClick={() => onNavigate('intake')} className="p-4 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
//               <Plus className="w-5 h-5 text-[#4A6741]" />
//               <span className="text-xs font-bold">New Intake</span>
//             </button>
//             <button onClick={() => onNavigate('pens')} className="p-4 border border-dashed border-slate-300 rounded-xl hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
//               <LayoutGrid className="w-5 h-5 text-[#4A6741]" />
//               <span className="text-xs font-bold">Configure Pen</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// function StatCard({ label, value, sub, icon: Icon }: any) {
//   return (
//     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
//       <div className="flex justify-between items-start">
//         <div>
//           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//           <h4 className="text-2xl font-serif font-bold text-slate-800">{value}</h4>
//           <p className="text-[10px] font-medium text-slate-500 mt-1">{sub}</p>
//         </div>
//         <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#4A6741]/10 transition-colors">
//           <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#4A6741]" />
//         </div>
//       </div>
//     </div>
//   );
// }