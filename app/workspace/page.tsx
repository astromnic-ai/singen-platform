"use client"

import { WorkspaceHeader } from "@/components/workspace/workspace-header"
import { AgentSidebar } from "@/components/workspace/agent-sidebar"
import { ChatArea } from "@/components/workspace/chat-area"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function WorkspacePage() {
  const searchParams = useSearchParams()
  const agentParam = searchParams.get('agent')
  const messageParam = searchParams.get('message')
  
  const [selectedAgent, setSelectedAgent] = useState("process-analysis")
  const [projectName, setProjectName] = useState("未命名文件")
  const [conversationHistory, setConversationHistory] = useState<Record<string, any[]>>({})
  const [selectedConversation, setSelectedConversation] = useState<string>()

  // 根据URL参数自动选择智能体
  useEffect(() => {
    if (agentParam) {
      // 验证智能体ID是否有效
      const validAgents = ['process-analysis', 'component-selection', '3d-design', 'cost-calculation']
      if (validAgents.includes(agentParam)) {
        setSelectedAgent(agentParam)
      }
    }
  }, [agentParam])

  const handleAgentSelect = (agent: string) => {
    setSelectedAgent(agent)
    setSelectedConversation(undefined) // 切换智能体时清除选中的对话
  }

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId)
  }

  const handleNewConversation = () => {
    setSelectedConversation(undefined) // 开始新对话
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkspaceHeader projectName={projectName} onProjectNameChange={setProjectName} />
      <div className="flex h-[calc(100vh-64px)]">
        <AgentSidebar 
          selectedAgent={selectedAgent} 
          onAgentSelect={handleAgentSelect}
          conversationHistory={conversationHistory}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
        />
        <ChatArea 
          selectedAgent={selectedAgent} 
          onRunClick={() => {}} 
          showProcessSidebar={false}
          onConversationHistoryChange={setConversationHistory}
          selectedConversation={selectedConversation}
          onConversationChange={setSelectedConversation}
          initialMessage={messageParam || undefined}
        />
      </div>
    </div>
  )
}
