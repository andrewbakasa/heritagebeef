"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import {
  ArrowLeft, RefreshCw, Search, Mail, Phone, Clock,
  Eye, UserCheck, XCircle, X, Save, 
  Beef, HardHat, Calculator, Warehouse,
  ChevronRight, Layers, Filter, Inbox, Tag, Download,
  DollarSign, Calendar, Building2, Briefcase,
  LayoutDashboard, TrendingUp, CreditCard,
  HomeIcon
} from 'lucide-react';

import { useAction } from '@/hooks/use-action';
import { updatePagSize } from '@/actions/update-user-pagesize';
import { RenderPaginationButtons } from '@/components/beef/RenderPagination';
import { useIsMobile } from '@/hooks/use-mobile';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { SafeUser } from '@/app/types';
import Link from 'next/link';

// --- Types & Config ---
type AdminTab = 'inquiries' | 'stockfeeds' | 'animals' | 'costing' | 'assets';
type PageSizeOption = '1' | '2' | '3' | '4' | '8' | '16' | '24' | '32' | '48' | '60';

interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  company?: string | null;
  category: string[]; 
  message: string;
  status: string;
  isRead: boolean;
  active: boolean;
  pledgeAmount?: number | null;
  paymentStructure?: string | null;
  targetPaymentDate?: string | null;
  admin_notes?: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active: { label: 'Active', color: 'text-blue-700', bg: 'bg-blue-50', icon: Clock },
  reviewed: { label: 'Reviewed', color: 'text-amber-700', bg: 'bg-amber-50', icon: Eye },
  contacted: { label: 'Contacted', color: 'text-green-700', bg: 'bg-green-50', icon: UserCheck },
  closed: { label: 'Closed', color: 'text-gray-500', bg: 'bg-gray-100', icon: XCircle },
};


interface AdminClientPageProps {
  currentUser?: SafeUser|null|undefined; 
}

const AdminClientPage: React.FC<AdminClientPageProps> = ({ currentUser }) => {
  const router = useRouter();
  const isMobile = useIsMobile();
   
  // App State
  const [activeTab, setActiveTab] = useState<AdminTab>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'unread' | 'contacted'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  // --- Pagination State ---
  const [itemOffset, setItemOffset] = useState(0);
  const [pageSize, setPageSize] = useState<number>(currentUser?.pageSize || 8);
  const [pageCount, setPageCount] = useState(0);

  // --- Page Size Persistence Action ---
  const { execute } = useAction(updatePagSize, {
    onSuccess: (data) => {
      toast.success(`Page size updated to ${data.pageSize}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // --- Unique Categories Extraction ---
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    inquiries.forEach(inq => {
      if (Array.isArray(inq.category)) {
        inq.category.forEach(c => cats.add(c));
      }
    });
    return ['All Categories', ...Array.from(cats).sort()];
  }, [inquiries]);

  // --- Advanced Filter Logic ---
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      const search = searchQuery.toLowerCase();
      
      const matchesSearch = 
        (item.first_name + " " + item.last_name).toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.company?.toLowerCase().includes(search) ||
        (Array.isArray(item.category) && item.category.some(c => c?.toLowerCase().includes(search)));
      
      const matchesStatus = 
        activeStatusFilter === 'all' || 
        (activeStatusFilter === 'unread' && !item.isRead) ||
        (activeStatusFilter === 'contacted' && item.status === 'contacted');

      const matchesCategory = 
        selectedCategory === 'All Categories' || 
        (Array.isArray(item.category) && item.category.includes(selectedCategory));

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [inquiries, searchQuery, activeStatusFilter, selectedCategory]);

  // --- TOTAL CALCULATIONS ---
  const totalInvestment = useMemo(() => {
    return filteredInquiries.reduce((acc, curr) => acc + (curr.pledgeAmount || 0), 0);
  }, [filteredInquiries]);

  const totalPaymentCount = useMemo(() => {
    return filteredInquiries.filter(i => (i.pledgeAmount || 0) > 0).length;
  }, [filteredInquiries]);

  // --- PAGINATION CALCULATION ---
  const fListPage = useMemo(() => {
    if (!filteredInquiries || filteredInquiries.length === 0 || pageSize <= 0) {
      return [];
    }
    const endpoint = Math.min(itemOffset + pageSize, filteredInquiries.length);
    return filteredInquiries.slice(itemOffset, endpoint);
  }, [filteredInquiries, itemOffset, pageSize]);

  useEffect(() => {
    if (filteredInquiries && pageSize > 0) {
      const newPageCount = Math.ceil(filteredInquiries.length / pageSize);
      setPageCount(newPageCount);

      const maxPossibleOffset = Math.max(0, filteredInquiries.length - pageSize);
      if (itemOffset > maxPossibleOffset && filteredInquiries.length > 0) {
        setItemOffset(maxPossibleOffset - (maxPossibleOffset % pageSize));
      } else if (filteredInquiries.length === 0) {
        setItemOffset(0);
      }
    } else {
      setPageSize(currentUser?.pageSize || 8);
      setPageCount(0);
      setItemOffset(0);
    }
  }, [filteredInquiries, pageSize, itemOffset, currentUser?.pageSize]);

  const handlePageSizeChange = useCallback(
    (newPageSize: PageSizeOption) => {
      const numericPageSize = parseInt(newPageSize, 10);
      setPageSize(numericPageSize);
      setItemOffset(0);
      console.log ("currentUser",currentUser)
      if (currentUser) {
        execute({
          id: currentUser.id,
          pageSize: numericPageSize,
        });
      }
    },
    [currentUser, execute]
  );

  const handlePageClick = useCallback(
    (event: { selected: number }) => {
      const newSelectedPage = event.selected;
      const rawOffset = newSelectedPage * pageSize;
      const maxValidOffset = Math.max(0, filteredInquiries.length - pageSize);
      const newOffset = Math.min(rawOffset, maxValidOffset);
      setItemOffset(newOffset);
    },
    [pageSize, filteredInquiries.length]
  );

  // --- API Actions ---
  const fetchInquiries = useCallback(async (showRefresh = false) => {
    showRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const response = await fetch('/api/enquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      const data = await response.json();
      setInquiries(data);    
    } catch (err: any) {
      toast.error('Sync Error', { description: err.message });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const handleUpdate = useCallback(async (id: string, updates: Partial<Inquiry>) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error('Database update failed');
      const updated = await response.json();
      
      setInquiries(prev => prev.map(i => i.id === id ? updated : i));
      if (selectedInquiry?.id === id) setSelectedInquiry(updated);
      toast.success('Record Updated');
    } catch (err) {
      console.log(err)
      toast.error('Save Failed', { description: "Check server logs" });
    }
  }, [selectedInquiry]);

  const handleRowClick = useCallback((inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setEditingNotes(inquiry.admin_notes || '');
    if (!inquiry.isRead) {
      handleUpdate(inquiry.id, { isRead: true, status: 'reviewed' });
    }
  }, [handleUpdate]);

  const exportToExcel = async () => {
    if (filteredInquiries.length === 0) return toast.error("Nothing to export");
    setIsExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Registry Export');

      sheet.columns = [
        { header: 'Date', key: 'createdAt', width: 15 },
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Company', key: 'company', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Categories', key: 'cat', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Pledge Amount', key: 'pledge', width: 15 },
        { header: 'Structure', key: 'structure', width: 15 },
        { header: 'Target Date', key: 'tDate', width: 15 },
        { header: 'Message', key: 'msg', width: 50 },
        { header: 'Admin Notes', key: 'admin_notes', width: 50 },
      ];

      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A2F23' } };

      filteredInquiries.forEach(i => {
        sheet.addRow({
          createdAt: new Date(i.createdAt).toLocaleDateString(),
          name: `${i.first_name} ${i.last_name}`,
          company: i.company || 'N/A',
          email: i.email,
          cat: i.category?.join(', '),
          status: i.status,
          pledge: i.pledgeAmount ? i.pledgeAmount.toLocaleString() : '—',
          structure: i.paymentStructure || '—',
          tDate: i.targetPaymentDate ? new Date(i.targetPaymentDate).toLocaleDateString() : '—',
          msg: i.message,
          admin_notes: i.admin_notes
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Registry_Export_${Date.now()}.xlsx`);
      toast.success("Export successful");
    } catch (e) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: AdminTab, label: string, icon: any }) => (
    <button
      onClick={() => { setActiveTab(id); setSelectedInquiry(null); }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
        activeTab === id ? 'bg-[#C1663E] text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F5] selection:bg-[#C1663E]/20">
      <header className="bg-[#1A2F23] sticky top-0 z-50 px-4 py-3 md:px-6 md:py-4 shadow-xl">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-4">
          <div className="flex justify-between items-center">
            
            <div className="flex items-center gap-2">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                >
                  <HomeIcon   className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Home</span>
                </Link>
                <Link 
                  href="/private" 
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Portal</span>
                </Link>
                <span className="text-white/20 hidden sm:inline">/</span>
                <h1 className="text-white font-serif text-lg md:text-xl font-bold tracking-tight">
                  Registry <span className="text-[#C1663E]">v2.0</span>
                </h1>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={exportToExcel} disabled={isExporting} className="text-white/60 hover:text-white flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase">
                <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline">Export Excel</span>
              </button>
              <button onClick={() => fetchInquiries(true)} className="text-white/60 hover:text-white flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync</span>
              </button>
            </div>
          </div>

          <nav className="flex bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar gap-1">
            <TabButton id="inquiries" label="Enquiries" icon={Mail} />
            <TabButton id="animals" label="Animals" icon={Beef} />
            <TabButton id="stockfeeds" label="Feeds" icon={Layers} />
            <TabButton id="costing" label="Costing" icon={Calculator} />
            <TabButton id="assets" label="Assets" icon={Warehouse} />
          </nav>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 animate-in fade-in duration-500">
        {activeTab === 'inquiries' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className={`flex-grow transition-all duration-300 ${selectedInquiry ? 'lg:w-3/5' : 'w-full'}`}>
              
              {/* --- SUMMARY DASHBOARD --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Investment</p>
                    <p className="text-xl font-bold text-gray-900">${totalInvestment.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payments</p>
                    <p className="text-xl font-bold text-gray-900">{totalPaymentCount} <span className="text-xs text-gray-400 font-normal">Entries</span></p>
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Industry Categories</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all ${
                        selectedCategory === cat 
                        ? 'bg-[#1A2F23] text-white border-[#1A2F23] shadow-lg scale-105' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#C1663E]/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch md:items-center justify-between">
                <div className="flex bg-gray-200/50 p-1 rounded-lg">
                  {['all', 'unread', 'contacted'].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setActiveStatusFilter(f as any)}
                      className={`px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md capitalize transition-all ${activeStatusFilter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-[#C1663E]/20"
                    placeholder="Search name, email, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100 hidden md:table-header-group">
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Contact Detail</th>
                      <th className="px-6 py-4">Financials</th>
                      <th className="px-6 py-4">Inquiry Excerpt</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {fListPage.map(inquiry => {
                      const Config = statusConfig[inquiry.status] || statusConfig.active;
                      return (
                        <tr 
                          key={inquiry.id} 
                          onClick={() => handleRowClick(inquiry)}
                          className={`group cursor-pointer transition-colors block md:table-row ${selectedInquiry?.id === inquiry.id ? 'bg-[#FDF7F4]' : 'hover:bg-gray-50/50'}`}
                        >
                          <td className="px-4 py-4 md:px-6 md:py-5 flex md:table-cell justify-between items-center">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${Config.bg} ${Config.color}`}>
                              <Config.icon className="w-3 h-3" />
                              {Config.label}
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#C1663E] md:hidden" />
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-5 block md:table-cell">
                            <p className={`text-sm ${!inquiry.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                              {inquiry.first_name} {inquiry.last_name}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {inquiry.company && (
                                <span className="text-[10px] text-[#1A2F23] font-bold flex items-center gap-1 mr-2">
                                  <Building2 className="w-3 h-3"/> {inquiry.company}
                                </span>
                              )}
                              {inquiry.category?.map(cat => (
                                <span key={cat} className="px-1.5 py-0.5 rounded bg-amber-50 text-[#C1663E] text-[9px] font-bold uppercase border border-amber-100">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 md:px-6 md:py-5 block md:table-cell">
                             {inquiry.pledgeAmount ? (
                               <div className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md inline-flex items-center gap-1">
                                 <DollarSign className="w-3 h-3"/> {inquiry.pledgeAmount.toLocaleString()}
                               </div>
                             ) : (
                               <span className="text-gray-300 text-[10px]">---</span>
                             )}
                          </td>
                          <td className="px-4 pb-4 md:px-6 md:py-5 block md:table-cell">
                            <p className="text-xs text-gray-500 line-clamp-1 italic">{inquiry.message}</p>
                          </td>
                          <td className="hidden md:table-cell px-6 py-5 text-right">
                            <ChevronRight className="w-4 h-4 ml-auto text-[#C1663E] opacity-0 group-hover:opacity-100 transition-all" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION UI */}
              <div className="mt-8 flex justify-center">
                {filteredInquiries.length > 0 && !loading && (
                  <RenderPaginationButtons
                    pageSize={pageSize}
                    handlePageSizeChange={handlePageSizeChange}
                    handlePageClick={handlePageClick}
                    pageCount={pageCount}
                    currentPage={Math.floor(itemOffset / pageSize)}
                  />
                )}
              </div>
            </div>

            {/* Detailed Side Panel */}
            {selectedInquiry && (
              <aside className="fixed inset-0 z-[60] lg:relative lg:inset-auto lg:w-2/5 w-full animate-in slide-in-from-right duration-300">
                <div className="bg-white h-full lg:h-auto rounded-none lg:rounded-2xl border-l lg:border border-gray-200 shadow-2xl overflow-y-auto sticky top-0 lg:top-28">
                  <div className="bg-[#1A2F23] p-6 text-white relative">
                    <button onClick={() => setSelectedInquiry(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5"/></button>
                    <div className="flex flex-wrap gap-2 mb-4 mt-2">
                       {selectedInquiry.category?.map(cat => (
                         <div key={cat} className="flex items-center gap-1.5 bg-[#C1663E] px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider">
                           <Tag className="w-3 h-3"/> {cat}
                         </div>
                       ))}
                    </div>
                    <h2 className="text-2xl font-serif font-bold leading-tight">{selectedInquiry.first_name} {selectedInquiry.last_name}</h2>
                    {selectedInquiry.company && (
                       <p className="text-white/60 text-xs mt-1 font-mono uppercase tracking-widest">{selectedInquiry.company}</p>
                    )}
                    <div className="flex gap-3 mt-6">
                      <a href={`mailto:${selectedInquiry.email}`} className="flex-1 bg-white/10 py-3 rounded-xl flex justify-center hover:bg-white/20 transition-all border border-white/10 text-[10px] font-bold gap-2 items-center"><Mail className="w-4 h-4"/> Email</a>
                      {selectedInquiry.phone_number && (
                        <a href={`tel:${selectedInquiry.phone_number}`} className="flex-1 bg-white/10 py-3 rounded-xl flex justify-center hover:bg-white/20 transition-all border border-white/10 text-[10px] font-bold gap-2 items-center"><Phone className="w-4 h-4"/> Call</a>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {(selectedInquiry.pledgeAmount || selectedInquiry.paymentStructure) && (
                      <section className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-2 gap-4 shadow-inner">
                        <div className="space-y-1">
                          <h4 className="text-[9px] font-black text-gray-400 uppercase">Pledge Amount</h4>
                          <div className="text-lg font-bold text-[#1A2F23] flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600"/> 
                            {selectedInquiry.pledgeAmount?.toLocaleString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[9px] font-black text-gray-400 uppercase">Target Date</h4>
                          <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#C1663E]"/> 
                            {selectedInquiry.targetPaymentDate ? new Date(selectedInquiry.targetPaymentDate).toLocaleDateString() : 'TBD'}
                          </div>
                        </div>
                      </section>
                    )}

                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Original Message</h4>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-700 leading-relaxed shadow-inner max-h-60 overflow-y-auto whitespace-pre-wrap">
                        {selectedInquiry.message}
                      </div>
                    </section>
                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Internal Response Log</h4>
                      <textarea 
                        className="w-full p-4 bg-[#FDFCFB] border border-gray-200 rounded-2xl text-sm h-32 outline-none focus:ring-4 focus:ring-[#C1663E]/5 focus:border-[#C1663E]/30 transition-all resize-none"
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Log follow-ups..."
                      />
                    </section>
                    <button 
                      onClick={() => handleUpdate(selectedInquiry.id, { admin_notes: editingNotes })}
                      className="w-full bg-[#1A2F23] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#233f2f] shadow-lg active:scale-[0.98] transition-all"
                    >
                      <Save className="w-4 h-4" /> Commit Changes
                    </button>
                  </div>
                </div>
              </aside>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
             <HardHat className="w-12 h-12 text-gray-300 mb-4 animate-pulse"/>
             <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm">{activeTab} Interface Pending</h3>
             <p className="text-gray-400 text-xs mt-1 font-mono">Mobile-first schema in sync.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminClientPage;