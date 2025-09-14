'use client'

import dynamic from 'next/dynamic'

// load DashboardContent with SSR disabled
const DashboardContent = dynamic(() => import('./DashboardContent'), { ssr: false })

export default function DashboardPage() {
  return <DashboardContent />
}
