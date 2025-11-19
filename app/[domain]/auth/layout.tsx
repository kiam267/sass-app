export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen  from-background to-background/95 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
