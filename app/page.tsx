import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { MainContent } from "@/components/home/main-content"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-25">
      <Header />
      <div className="flex">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}
