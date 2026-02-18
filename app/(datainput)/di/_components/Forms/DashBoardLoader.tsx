// app/dashboard/_components/DashboardLoader.tsx
export default function DashboardLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-ranch-cream/30">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-ranch-forest border-t-transparent"></div>
        <div className="space-y-1">
          <p className="font-serif text-sm font-bold text-ranch-charcoal animate-pulse uppercase tracking-widest">
            Syncing Herd Data
          </p>
          <p className="text-[10px] text-ranch-slate uppercase font-medium">Precision Feedlot v2.1</p>
        </div>
      </div>
    </div>
  );
}