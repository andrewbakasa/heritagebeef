import Link from "next/link";
import prisma from "@/app/libs/prismadb";
import { LayoutDashboard, Users, Landmark, TrendingUp, ChevronRight, HomeIcon } from "lucide-react";
import EnquiriesClientWrapper from "../../private/EnquiresClientWraper";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { redirect } from "next/navigation";

interface UserIdPageProps {
  params: {
    id: string;
  };
}

const EnquiriesPage = async ({ params }: UserIdPageProps) => {
  // Destructure id from params
  const { id } = params;

  // 1. Get the session of the person trying to view the page
  const currentUser = await getCurrentUser();

  // 2. SECURITY CHECK: If not logged in OR viewing someone else's ID, redirect
  // We allow admins to bypass this if they are managing the system
  const isAdmin = currentUser?.roles?.includes("admin");
  
  if (!currentUser || (currentUser.id !== id && !isAdmin)) {
    return redirect("/denied"); // Or redirect("/")
  }
  // 1. Fetch data
  // Corrected: findUnique or findFirst for a single user, and fixed syntax
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  // 2. Handle missing user OR missing email
  if (!user || !user.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F5]">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-[#1A2F23]">No Registry Found</h2>
          <p className="text-gray-500 mt-2">This user does not have a valid email associated with the registry.</p>
        </div>
      </div>
    );
  }

  // Fetch all enquiries matching that user's email
  const enquiries = await prisma.enquiry.findMany({
    where: {
      email: user.email, // Fixed syntax
    },
    include: {
      investments: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Calculate Totals for the Top Dashboard
  const totalPledged = enquiries.reduce((acc, curr) => acc + (curr.pledgeAmount || 0), 0);
  
  const totalPaid = enquiries.reduce((acc, curr) => {
    // Summing up investments related to these enquiries
    const investSum = curr.investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
    return acc + investSum;
  }, 0);

  return (
    <main className="min-h-screen bg-[#F8F7F5] selection:bg-[#C1663E]/20 pb-20">
      {/* NAVIGATION BAR */}
      <nav className="bg-[#1A2F23] sticky top-0 z-50 px-4 py-3 md:px-8 shadow-2xl">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link 
                href="/" 
                className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <HomeIcon className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-3 h-3 text-white/10" />
              <Link 
                href="/admin" 
                className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Admin
              </Link>
            </div>
            
            <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />
            
            <h1 className="text-white font-serif text-lg md:text-xl font-bold tracking-tight">
              Registry <span className="text-[#C1663E] font-sans text-xs italic ml-1">v2.0</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">System Status</span>
                <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                </span>
             </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-8">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#1A2F23]">Investor Registry</h1>
              <p className="text-sm text-gray-500 mt-2 uppercase tracking-[0.2em] font-black text-[10px] flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#C1663E]" />
                Guideline 1 of 2025 — Teams Business Model
              </p>
            </div>

            <div className="flex gap-4 sm:gap-8 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> Total Pledged
                </span>
                <span className="text-xl font-mono font-bold text-[#1A2F23]">
                  ${totalPledged.toLocaleString()}
                </span>
              </div>
              <div className="w-[1px] bg-gray-100" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" /> Amount Paid
                </span>
                <span className="text-xl font-mono font-bold text-green-600">
                  ${totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="w-[1px] bg-gray-100" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Entities
                </span>
                <span className="text-xl font-mono font-bold text-[#1A2F23]">
                  {enquiries.length}
                </span>
              </div>
            </div>
          </div>
          <hr className="border-gray-200/60" />
        </header>

        <div className="relative">
          {/* Passing the serialized enquiries to the Client Wrapper */}
          <EnquiriesClientWrapper initialData={JSON.parse(JSON.stringify(enquiries))}  isAllowedPayment={false}/>
        </div>
      </div>
    </main>
  );
};

export default EnquiriesPage;