"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { KnowledgeContent } from "@/components/knowledge/knowledge-content"
import { AIChatSidebar } from "@/components/shared/ai-chat-sidebar"

export default function KnowledgePage() {
  const [showAIChat, setShowAIChat] = useState(true)

  return (
    <div className="min-h-screen bg-gray-25">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex h-[calc(100vh-56px)]">
          <KnowledgeContent showAIChat={showAIChat} />
          {showAIChat && <AIChatSidebar placeholder="询问关于文档的相关问题" onClose={() => setShowAIChat(false)} />}
        </main>
      </div>
    </div>
  )
}
