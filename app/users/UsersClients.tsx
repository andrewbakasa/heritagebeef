'use client';

import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter, redirect } from "next/navigation";
import { User, Shield, UserCog, ChevronLeft, ChevronRight, Search as SearchIcon, Users } from "lucide-react";
import { toast } from "sonner";

import { SafeUser } from "../types";
import Heading from "../components/Heading";
import Search from "../components/Search";
import Container from "../components/Container";
import Link from "next/link";
import { Hint } from "../components/hint";
import Avatar from "@/app/components/Avatar";
import { cn } from "@/lib/utils";
import { updatePagSize } from "@/actions/update-user-pagesize";
import { useAction } from "@/hooks/use-action";
import Footer from "@/components/beef/Footer";
import Navbar from "@/components/beef/Navbar";

interface UsersClientProps {
  users: SafeUser[],
  currentUser?: SafeUser | null,
}

const DEFAULT_PAGE_SIZE = 12;
type PageSizeOption = '4' | '8' | '12' | '16' | '24';

// --- Improved User Card ---
const UserCard = ({ user, isCurrentUser }: { user: SafeUser, isCurrentUser: boolean }) => {
  return (
    <Link
      href={`/user/${user.id}`}
      className={cn(
        "group relative flex flex-col p-5 border rounded-2xl transition-all duration-300 bg-white hover:shadow-xl hover:-translate-y-1",
        isCurrentUser 
          ? "border-ranch-terracotta bg-rose-50/30 ring-1 ring-ranch-terracotta/20" 
          : "border-gray-100 hover:border-ranch-forest-light"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="relative">
          <Avatar classList="h-12 w-12 border-2 border-white shadow-md" src={user.image} />
          {isCurrentUser && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600 border border-white"></span>
            </span>
          )}
        </div>
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          user.isAdmin ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"
        )}>
          {user.isAdmin ? <Shield className="h-5 w-5" /> : <UserCog className="h-5 w-5" />}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-gray-900 group-hover:text-ranch-forest-dark transition-colors truncate">
          {user.name || "Anonymous User"}
        </h3>
        <p className="text-xs text-gray-500 font-medium truncate mb-3">
          {user.email}
        </p>
        
        <div className="flex flex-wrap gap-1.5 pt-2">
          {user.roles?.map((role, index) => (
            <span 
              key={index} 
              className={cn(
                "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md",
                role.toLowerCase() === 'admin' 
                  ? "bg-red-100 text-red-700" 
                  : "bg-ranch-forest-light/10 text-ranch-forest-dark"
              )}
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

// --- Modern Pagination Controls ---
const PaginationControls = ({ fList, itemOffset, pageSize, handlePageSizeChange, handlePageClick, showPageSize }: any) => {
  if (fList.length === 0) return null;
  const currentPage = Math.floor(itemOffset / pageSize) + 1;
  const totalPages = Math.ceil(fList.length / pageSize);

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white/50 backdrop-blur-sm p-2 rounded-xl border border-gray-100">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
        Page {currentPage} of {totalPages}
      </div>

      {showPageSize && (
        <select
          className="bg-transparent text-sm font-bold text-ranch-forest-dark outline-none cursor-pointer border-r border-gray-200 pr-4"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(e.target.value)}
        >
          {[4, 8, 12, 16, 24].map(size => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
      )}

      <div className="flex items-center gap-1">
        <button 
          onClick={() => handlePageClick({ selected: currentPage - 2 })}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-ranch-forest-dark" />
        </button>
        <button 
          onClick={() => handlePageClick({ selected: currentPage })}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-ranch-forest-dark" />
        </button>
      </div>
    </div>
  );
};

const UsersClient: React.FC<UsersClientProps> = ({ users, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fList, setFList] = useState(users); 
  const [pageSize, setPageSize] = useState<number>(currentUser?.pageSize || DEFAULT_PAGE_SIZE); 
  const [itemOffset, setItemOffset] = useState(0); 

  const { execute } = useAction(updatePagSize, {
    onSuccess: (data) => toast.success(`Preference saved: ${data.pageSize} items`),
  });

  useEffect(() => {
    const results = users.filter(u => 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFList(results);
    setItemOffset(0); 
  }, [searchTerm, users]);

  const paginatedUsers = useMemo(() => {
    return fList.slice(itemOffset, itemOffset + pageSize);
  }, [fList, itemOffset, pageSize]);

  const handlePageSizeChange = (size: string) => {
    const num = parseInt(size);
    setPageSize(num);
    setItemOffset(0);
    if (currentUser) execute({ id: currentUser.id, pageSize: num });
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setItemOffset(selected * pageSize);
  };

  if (!currentUser) return redirect('/denied');
  const isAllowedAccess = currentUser?.roles.some(r => ['admin', 'manager'].includes(r.toLowerCase()));
  if (!isAllowedAccess) return redirect('/denied'); 

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar currentUser={currentUser} forceScrolled={true}/>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="relative mb-10 p-8 rounded-3xl bg-ranch-forest-dark text-black overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Users size={180} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-serif font-black mb-2">User Directory</h1>
              <p className="text-ranch-forest-light font-medium max-w-md">
                Managing {fList.length} registered members of the Heritage Beef network.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-ranch-terracotta transition-colors" />
                
                <input 
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border-2 border-gray-400/30 text-black placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-ranch-terracotta w-full sm:w-64 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <PaginationControls 
                fList={fList} itemOffset={itemOffset} pageSize={pageSize} 
                handlePageSizeChange={handlePageSizeChange} handlePageClick={handlePageClick} showPageSize={true} 
              />
            </div>
          </div>
        </div>

        {/* Grid Section */}
        {fList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedUsers.map((user) => (
              <UserCard key={user.id} user={user} isCurrentUser={currentUser.id === user.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No users found</h3>
            <p className="text-gray-500">We couldnt find any results for {searchTerm}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );   
}
  
export default UsersClient;

// 'use client';
// import { useCallback, useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { SafeUser } from "../types";
// import Heading from "../components/Heading";
// import Search from "../components/Search";
// import Container from "../components/Container";
// import Link from "next/link";
// import { Hint } from "../components/hint";
// import { User, Shield, UserCog, ChevronLeft, ChevronRight } from "lucide-react";
// import { redirect } from "next/navigation";
// import { useWindowSize } from "@/hooks/use-screenWidth";
// import Avatar from "@/app/components/Avatar";
// import { cn } from "@/lib/utils";
// import { updatePagSize } from "@/actions/update-user-pagesize";
// import { useAction } from "@/hooks/use-action";
// import { toast } from "sonner";
// import Footer from "@/components/beef/Footer";
// import Navbar from "@/components/beef/Navbar";

// // NOTE: Added Pagination component for better separation and cleaner main render
// interface UsersClientProps {
//   users: SafeUser[],
//   currentUser?: SafeUser | null,
// }

// // --- Pagination Constants ---
// const DEFAULT_PAGE_SIZE = 12;
// type PageSizeOption = '4' | '8' | '12' | '16' | '24';
// const INDIGO_PRIMARY = 'text-indigo-600';
// const INDIGO_HOVER_BG = 'hover:bg-indigo-50';
// const GRAY_ACCENT = 'text-gray-500';

// // --- User Card Component (Unchanged) ---
// const UserCard = ({ user, isCurrentUser }: { user: SafeUser, isCurrentUser: boolean }) => {
//     const AdminIcon = user.isAdmin ? (
//       <Hint description="Admin User" side="top" sideOffset={10}>
//         <Shield className="h-5 w-5 text-red-500 fill-red-100" />
//       </Hint>
//     ) : (
//       <Hint description="Standard User" side="top" sideOffset={10}>
//           <UserCog className="h-5 w-5 text-gray-400" />
//       </Hint>
//     );

//     return (
//       <Link
//         key={user.id}
//         href={`/user/${user.id}`}
//         className={cn(
//           "flex flex-col p-3 border rounded-xl shadow-sm transition hover:shadow-lg hover:border-blue-500 cursor-pointer bg-white",
//           isCurrentUser ? "border-[3px] border-rose-600 bg-rose-50/50" : "border-neutral-200"
//         )}
//       >
//         <div className="flex justify-between items-start mb-2">
//             <div className="relative">
//                 <Avatar classList="border-2 border-neutral-300 h-10 w-10" src={user.image} />
//                 {isCurrentUser && (
//                     <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-600 ring-2 ring-white" title="This is you"></div>
//                 )}
//             </div>
//             {AdminIcon}
//         </div>
//         <div className="space-y-0.5">
//             <p className="text-base font-semibold text-neutral-800 truncate">
//                 {user.name}
//             </p>
//             <p className="text-xs text-neutral-500 truncate">
//                 {user.email}
//             </p>
//             {user.roles && user.roles.length > 0 && (
//                 <div className="flex flex-wrap pt-1 gap-1">
//                     {user.roles.map((role, index) => (
//                         <span key={index} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
//                             {role.charAt(0).toUpperCase() + role.slice(1)}
//                         </span>
//                     ))}
//                 </div>
//             )}
//         </div>
//       </Link>
//     );
// };

// // --- Pagination Controls Component (Extracted for Cleanliness) ---
// interface PaginationControlsProps {
//   fList: SafeUser[];
//   itemOffset: number;
//   pageSize: number;
//   handlePageSizeChange: (newPageSize: PageSizeOption) => void;
//   handlePageClick: ({ selected }: { selected: number }) => void;
//   showPageSize: boolean;
// }

// const PaginationControls: React.FC<PaginationControlsProps> = ({
//   fList,
//   itemOffset,
//   pageSize,
//   handlePageSizeChange,
//   handlePageClick,
//   showPageSize,
// }) => {
//   if (fList.length === 0) return null;

//   const currentPageIndex = Math.floor(itemOffset / pageSize);
//   const startRange = itemOffset + 1;
//   const endRange = Math.min(itemOffset + pageSize, fList.length);
//   const paginationSummary = `${startRange}-${endRange} of ${fList.length}`;
//   const pageCount = Math.ceil(fList.length / pageSize);

//   return (
//     <div className="flex items-center space-x-2">
//       <div className={cn("text-sm sm:mr-2", INDIGO_PRIMARY, "font-semibold", GRAY_ACCENT)}>
//         {paginationSummary}
//       </div>

//       {showPageSize && (
//         <select
//           className={cn('h-9 px-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 cursor-pointer', INDIGO_PRIMARY)}
//           value={pageSize}
//           key={'pagesize-selector'}
//           onChange={(e) => handlePageSizeChange(e.target.value as PageSizeOption)}
//         > 
//           <option value="4">4 per page</option>
//           <option value="8">8 per page</option>
//           <option value="12">12 per page</option>
//           <option value="16">16 per page</option>
//           <option value="24">24 per page</option>
//         </select>
//       )}

//       {/* Previous button */}
//       <button 
//         key="prev"
//         onClick={() => handlePageClick({ selected: currentPageIndex - 1 })} 
//         disabled={itemOffset === 0}
//         className={cn("p-1 rounded-full disabled:text-gray-400 disabled:hover:bg-transparent", `text-gray-600 ${INDIGO_HOVER_BG}`)}
//       >
//         <ChevronLeft className="w-5 h-5" />
//       </button>
      
//       {/* Next button */}
//       <button 
//         key="next"
//         onClick={() => handlePageClick({ selected: currentPageIndex + 1 })}
//         disabled={endRange >= fList.length}
//         className={cn("p-1 rounded-full disabled:text-gray-400 disabled:hover:bg-transparent", `text-gray-600 ${INDIGO_HOVER_BG}`)}
//       >
//         <ChevronRight className="w-5 h-5" />
//       </button>
//     </div>
//   );
// };




// // --- Main Client Component ---
// const UsersClient: React.FC<UsersClientProps> = ({
//   users,
//   currentUser
// }) => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
  
//   const [fList, setFList] = useState(users); 
//   const [pageSize, setPageSize] = useState<number>(
//     currentUser && currentUser.pageSize ? currentUser.pageSize : DEFAULT_PAGE_SIZE
//   ); 
//   const [itemOffset, setItemOffset] = useState(0); 

//   const { execute } = useAction(updatePagSize, {
//     onSuccess: (data) => {
//       toast.success(`PageSize for ${data?.email} updated to ${data.pageSize}`);
//     },
//     onError: (error) => {
//       toast.error(error);
//     },
//   });

//   // --- FILTERING LOGIC ---
//   useEffect(() => {
//     let results = users;
//     if (searchTerm !== "") {
//       const lowerSearchTerm = searchTerm.toLowerCase().trim();
//       results = users.filter((user) =>
//         user?.email?.toLowerCase().includes(lowerSearchTerm) ||
//         user?.name?.toLowerCase().includes(lowerSearchTerm)
//       );
//     }
//     setFList(results);
//     setItemOffset(0); 
//   }, [searchTerm, users]);

//   // --- PAGINATION CALCULATIONS ---
//   const paginatedUsers = useMemo(() => {
//     const endpoint = Math.min(itemOffset + pageSize, fList.length);
//     return fList.slice(itemOffset, endpoint);
//   }, [fList, itemOffset, pageSize]);

//   // Reset offset if the current offset is invalid after filtering or size change
//   useEffect(() => {
//     if (itemOffset >= fList.length && fList.length > 0) {
//       setItemOffset(0);
//     } else if (fList.length === 0 && itemOffset !== 0) {
//       setItemOffset(0);
//     }
//   }, [fList.length, pageSize, itemOffset]);

//   // --- PAGINATION HANDLERS ---
//   const handlePageSizeChange = useCallback((newPageSize: PageSizeOption) => {
//     const numericPageSize = parseInt(newPageSize, 10);
//     setPageSize(numericPageSize);
//     setItemOffset(0); 
    
//     if (currentUser) {
//       execute({ id: currentUser.id, pageSize: numericPageSize });
//     }
//   }, [currentUser, execute]);

//   const handlePageClick = useCallback(({ selected }: { selected: number }) => {
//     const newOffset = (selected * pageSize) % fList.length;
//     setItemOffset(newOffset);
//   }, [pageSize, fList.length]);

//   // --- ACCESS CONTROL ---
//   if (!currentUser) return redirect('/denied');
  
//   const allowedRoles: String[] = ['admin', 'manager'];
//   const isAllowedAccess = currentUser?.roles.some(role => 
//     allowedRoles.some(allowed => allowed.toLowerCase() === role.toLowerCase())
//   );

//   if (!isAllowedAccess) return redirect('/denied'); 

//   const title_ = `Users (${fList.length} of ${users.length})`;

//   // return (
//   //   <Container>
      
//   //     {/* NEW IMPROVED HEADER: 
//   //       - Flexbox for alignment on large screens.
//   //       - Flex-wrap on the combined controls group (Search + Pagination) 
//   //         to stack gracefully on small screens.
//   //       - pt-4 pb-6 border-b remains for structure.
//   //     */}
//   //     <div className="pt-4 pb-6 flex flex-col xl:flex-row justify-between items-start xl:items-end border-b">
        
//   //       {/* Title/Subtitle */}
//   //       <div className="mb-4 xl:mb-0">
//   //         <Heading
//   //           title={title_}
//   //           subtitle="View and manage the accounts of registered users."
//   //         />
//   //       </div>

//   //       {/* Search and Pagination Controls Group */}
//   //       <div className="flex flex-wrap items-end w-full xl:w-auto gap-4">
//   //         {/* Search Bar (Full width on smaller screens, auto-width on large) */}
//   //         <div className="w-full sm:w-80 xl:w-auto order-1"> 
//   //           <Search 
//   //             setSearchTerm={setSearchTerm}               
//   //             placeholderText={"Filter by Name or Email..."}
//   //             searchTerm={searchTerm} 
//   //           /> 
//   //         </div>

//   //         {/* Desktop Pagination Controls (Order 2 on smaller screens, always visible for MD+) */}
//   //         <div className="flex items-center order-2 w-full sm:w-auto justify-start xl:justify-end">
//   //           <PaginationControls 
//   //             fList={fList} 
//   //             itemOffset={itemOffset} 
//   //             pageSize={pageSize} 
//   //             handlePageSizeChange={handlePageSizeChange} 
//   //             handlePageClick={handlePageClick}
//   //             showPageSize={true} // Always show page size on desktop/header
//   //           />
//   //         </div>

//   //       </div>
//   //     </div>
      
//   //     {/* User Grid */}
//   //     <div className="space-y-4 pt-6 pb-20">
//   //       <div className="flex items-center font-semibold text-lg text-neutral-700">
//   //         <User className="h-5 w-5 mr-2" /> 
//   //         {fList.length > 0 ? 'Active User Accounts' : 'No Users Found'}
//   //       </div>
        
//   //       {/* Responsive Grid: 1 column (sm), 2 (md), 3 (lg), 4 (xl) */}
//   //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
//   //         {paginatedUsers.map((user) => (
//   //           <UserCard 
//   //             key={user.id} 
//   //             user={user} 
//   //             isCurrentUser={currentUser.id === user.id} 
//   //           />
//   //         ))}

//   //         {/* Empty State Handling */}
//   //         {fList.length === 0 && searchTerm !== '' && (
//   //           <div className="col-span-full p-10 text-center bg-white rounded-xl shadow-inner">
//   //             <p className="text-xl font-bold mb-2 text-neutral-700">
//   //               No users match search term: {searchTerm}
//   //             </p>
//   //             <p className="text-gray-500">
//   //               Try adjusting your search query.
//   //             </p>
//   //           </div>
//   //         )}
//   //       </div>
        
//   //       {/* Desktop Footer Pagination (Optional: for pages that scroll heavily) */}
//   //       {/* This div is now only visible on large screens and acts as a secondary/bottom control set */}
//   //       <div className="mt-8 flex justify-center items-center p-4 bg-gray-50 rounded-xl shadow-inner hidden lg:flex">
//   //            <PaginationControls 
//   //             fList={fList} 
//   //             itemOffset={itemOffset} 
//   //             pageSize={pageSize} 
//   //             handlePageSizeChange={handlePageSizeChange} 
//   //             handlePageClick={handlePageClick}
//   //             showPageSize={true}
//   //           />
//   //       </div>

//   //     </div>

//   //     {/* MOBILE FOOTER PAGINATION: Sticky at bottom, hidden on medium/large screens */}
//   //     <div className="fixed bottom-0 left-0 w-full lg:hidden bg-white border-t border-gray-200 p-2 z-50 shadow-2xl">
//   //         <div className="flex justify-center">
//   //             <PaginationControls 
//   //               fList={fList} 
//   //               itemOffset={itemOffset} 
//   //               pageSize={pageSize} 
//   //               handlePageSizeChange={handlePageSizeChange} 
//   //               handlePageClick={handlePageClick}
//   //               showPageSize={false} // Hide page size selector on mobile footer for simplicity
//   //             />
//   //         </div>
//   //     </div>
//   //   </Container>
//   // );
// return (
//     <Container>
//         {/* Now passing the currentUser prop down to Navbar */}
//         <Navbar currentUser={currentUser}/>
//         <main>
//         <div className="mt-10 pb-6 flex flex-col xl:flex-row justify-between items-start xl:items-end border-b">
          
//           {/* Title/Subtitle */}
//           <div className="mb-4 xl:mb-0">
//             <Heading
//               title={title_}
//               subtitle="View and manage the accounts of registered users."
//             />
//           </div>

//           {/* Search and Pagination Controls Group */}
//           <div className="flex flex-wrap items-end w-full xl:w-auto gap-4">
//             {/* Search Bar (Full width on smaller screens, auto-width on large) */}
//             <div className="w-full sm:w-80 xl:w-auto order-1"> 
//               <Search 
//                 setSearchTerm={setSearchTerm}               
//                 placeholderText={"Filter by Name or Email..."}
//                 searchTerm={searchTerm} 
//               /> 
//             </div>

//             {/* Desktop Pagination Controls (Order 2 on smaller screens, always visible for MD+) */}
//             <div className="flex items-center order-2 w-full sm:w-auto justify-start xl:justify-end">
//               <PaginationControls 
//                 fList={fList} 
//                 itemOffset={itemOffset} 
//                 pageSize={pageSize} 
//                 handlePageSizeChange={handlePageSizeChange} 
//                 handlePageClick={handlePageClick}
//                 showPageSize={true} // Always show page size on desktop/header
//               />
//             </div>

//           </div>
//         </div>
        
//         {/* User Grid */}
//         <div className="space-y-4 pt-6 pb-20">
//           <div className="flex items-center font-semibold text-lg text-neutral-700">
//             <User className="h-5 w-5 mr-2" /> 
//             {fList.length > 0 ? 'Active User Accounts' : 'No Users Found'}
//           </div>
          
//           {/* Responsive Grid: 1 column (sm), 2 (md), 3 (lg), 4 (xl) */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            
//             {paginatedUsers.map((user) => (
//               <UserCard 
//                 key={user.id} 
//                 user={user} 
//                 isCurrentUser={currentUser.id === user.id} 
//               />
//             ))}

//             {/* Empty State Handling */}
//             {fList.length === 0 && searchTerm !== '' && (
//               <div className="col-span-full p-10 text-center bg-white rounded-xl shadow-inner">
//                 <p className="text-xl font-bold mb-2 text-neutral-700">
//                   No users match search term: {searchTerm}
//                 </p>
//                 <p className="text-gray-500">
//                   Try adjusting your search query.
//                 </p>
//               </div>
//             )}
//           </div>
          
//           {/* Desktop Footer Pagination (Optional: for pages that scroll heavily) */}
//           {/* This div is now only visible on large screens and acts as a secondary/bottom control set */}
//           <div className="mt-8 flex justify-center items-center p-4 bg-gray-50 rounded-xl shadow-inner hidden lg:flex">
//               <PaginationControls 
//                 fList={fList} 
//                 itemOffset={itemOffset} 
//                 pageSize={pageSize} 
//                 handlePageSizeChange={handlePageSizeChange} 
//                 handlePageClick={handlePageClick}
//                 showPageSize={true}
//               />
//           </div>

//         </div>

//         {/* MOBILE FOOTER PAGINATION: Sticky at bottom, hidden on medium/large screens */}
//         <div className="fixed bottom-0 left-0 w-full lg:hidden bg-white border-t border-gray-200 p-2 z-50 shadow-2xl">
//             <div className="flex justify-center">
//                 <PaginationControls 
//                   fList={fList} 
//                   itemOffset={itemOffset} 
//                   pageSize={pageSize} 
//                   handlePageSizeChange={handlePageSizeChange} 
//                   handlePageClick={handlePageClick}
//                   showPageSize={false} // Hide page size selector on mobile footer for simplicity
//                 />
//             </div>
//         </div>
//         </main>
//         <Footer /> 
//     </Container>
//   );   
// }
  
// export default UsersClient;