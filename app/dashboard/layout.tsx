import DashboardNavigation from '@/components/dashboard/DashboardNavigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavigation />
      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  )
}