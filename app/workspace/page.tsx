"use client"

import { WorkspaceHeader } from "@/components/workspace/workspace-header"
import { AgentSidebar } from "@/components/workspace/agent-sidebar"
import { ChatArea } from "@/components/workspace/chat-area"
import { useState } from "react"

export default function WorkspacePage() {
  const [selectedAgent, setSelectedAgent] = useState("process-analysis")
  const [projectName, setProjectName] = useState("未命名文件")
  const [conversationHistory, setConversationHistory] = useState<Record<string, any[]>>({})

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkspaceHeader projectName={projectName} onProjectNameChange={setProjectName} />
      <div className="flex h-[calc(100vh-64px)]">
        <AgentSidebar 
          selectedAgent={selectedAgent} 
          onAgentSelect={setSelectedAgent}
          conversationHistory={conversationHistory}
        />
        <ChatArea 
          selectedAgent={selectedAgent} 
          onRunClick={() => {}} 
          showProcessSidebar={false}
          onConversationHistoryChange={setConversationHistory}
        />
      </div>
    </div>
  )
}
