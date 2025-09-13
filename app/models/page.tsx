"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { ModelNavigation } from "@/components/models/model-navigation"
import { ModelViewer } from "@/components/models/model-viewer"
import { AIChatSidebar } from "@/components/shared/ai-chat-sidebar"

export default function ModelsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("production-line")
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [showAIChat, setShowAIChat] = useState(true)

  return (
    <div className="min-h-screen bg-gray-25">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex h-[calc(100vh-56px)]">
          <ModelNavigation
            selectedCategory={selectedCategory}
            selectedModel={selectedModel}
            onCategorySelect={setSelectedCategory}
            onModelSelect={setSelectedModel}
          />
          <ModelViewer selectedCategory={selectedCategory} selectedModel={selectedModel} showAIChat={showAIChat} />
          {showAIChat && <AIChatSidebar placeholder="询问模型的相关问题" onClose={() => setShowAIChat(false)} />}
        </main>
      </div>
    </div>
  )
}
