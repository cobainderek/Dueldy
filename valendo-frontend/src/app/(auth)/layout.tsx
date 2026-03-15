export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background cyber-grid scanlines">
      {/* Large ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-neon-cyan/[0.07] blur-[120px]" />
        <div className="animate-float-delayed absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-neon-magenta/[0.07] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-cyan/[0.03] blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {children}
      </div>
    </div>
  );
}
