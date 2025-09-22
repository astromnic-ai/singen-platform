"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { SolutionNavigation } from "@/components/solutions/solution-navigation"
import { DocumentViewer } from "@/components/solutions/document-viewer"
import { AIChatSidebar } from "@/components/shared/ai-chat-sidebar"
import { Document } from "@/types/solution"

export default function SolutionsPage() {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showAIChat, setShowAIChat] = useState(true)

  return (
    <div className="min-h-screen bg-gray-25">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex h-[calc(100vh-56px)]">
          <SolutionNavigation
            selectedSolution={selectedSolution}
            selectedDocument={selectedDocument}
            onSolutionSelect={setSelectedSolution}
            onDocumentSelect={setSelectedDocument}
          />
          <DocumentViewer selectedDocument={selectedDocument} showAIChat={showAIChat} />
          {showAIChat && (
            <AIChatSidebar 
              placeholder={selectedDocument ? `询问关于《${selectedDocument.name}》的相关问题` : "询问关于这篇文档的相关问题"} 
              onClose={() => setShowAIChat(false)} 
            />
          )}
        </main>
      </div>
    </div>
  )
}
