import React, { useState, useEffect } from 'react';
import { 
  Mail, MailOpen, Trash2, Clock, CheckCircle, 
  Search, Filter, MoreVertical, ExternalLink 
} from 'lucide-react';
import { toast } from 'sonner';

interface Enquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  category: string[];
  isRead: boolean;
  createdAt: string;
}

const EnquiryDashboard = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from /api/enquiries (GET)
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('/api/enquiries');
        const data = await res.json();
        setEnquiries(data);
      } catch (err) {
        toast.error("Failed to load enquiries");
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    // Logic to update status via PATCH /api/enquiries/[id]
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, isRead: !currentStatus } : e));
    toast.success("Status updated");
  };

  const deleteEnquiry = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    setEnquiries(prev => prev.filter(e => e.id !== id));
    toast.success("Enquiry moved to trash");
  };

  const filteredEnquiries = enquiries.filter(e => 
    `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-ranch-cream/30 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-ranch-charcoal">Enquiry Inbox</h1>
            <p className="text-ranch-slate text-sm">Manage partnership and investment inquiries</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ranch-slate" />
              <input 
                type="text"
                placeholder="Search inquiries..."
                className="pl-10 pr-4 py-2 rounded-xl border border-ranch-cream-dark bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ranch-forest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-ranch-cream-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ranch-cream/50 border-b border-ranch-cream-dark">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-ranch-slate">Sender</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-ranch-slate">Inquiry Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-ranch-slate">Message Preview</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-ranch-slate">Received</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-ranch-slate text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ranch-cream-dark">
                {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center text-ranch-slate">Loading enquiries...</td></tr>
                ) : filteredEnquiries.map((enquiry) => (
                  <tr 
                    key={enquiry.id} 
                    className={`hover:bg-ranch-cream/20 transition-colors ${!enquiry.isRead ? 'bg-ranch-forest/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-ranch-charcoal">
                        {enquiry.first_name} {enquiry.last_name}
                      </div>
                      <div className="text-xs text-ranch-slate">{enquiry.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-ranch-cream text-ranch-terracotta text-[10px] font-bold uppercase tracking-wider">
                        {enquiry.category[0] || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-ranch-slate line-clamp-1 max-w-xs">
                        {enquiry.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-ranch-slate whitespace-nowrap">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => toggleReadStatus(enquiry.id, enquiry.isRead)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-ranch-slate hover:text-ranch-forest"
                          title={enquiry.isRead ? "Mark as unread" : "Mark as read"}
                        >
                          {enquiry.isRead ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => deleteEnquiry(enquiry.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-ranch-slate hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDashboard;