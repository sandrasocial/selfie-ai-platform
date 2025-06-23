export default function StaticLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* You can add a shared navigation here if needed */}
      {children}
    </div>
  )
}
