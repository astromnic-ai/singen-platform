"use client"

import { Button } from "@/components/ui/button"
import { Search, Package, Wrench, Calculator, MessageSquare, Plus } from "lucide-react"
import { useEffect, useState } from "react"

interface ChatHistoryItem {
  id: string
  title: string
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  createdAt: string
  updatedAt: string
}

interface AgentSidebarProps {
  selectedAgent: string
  onAgentSelect: (agent: string) => void
  conversationHistory?: Record<string, any[]>
  selectedConversation?: string
  onConversationSelect?: (conversationId: string) => void
  onNewConversation?: () => void
}

export function AgentSidebar({ 
  selectedAgent, 
  onAgentSelect, 
  conversationHistory = {},
  selectedConversation,
  onConversationSelect,
  onNewConversation
}: AgentSidebarProps) {
  const [chatHistory, setChatHistory] = useState<Record<string, ChatHistoryItem[]>>({})
  const [expandedAgent, setExpandedAgent] = useState<string | null>(selectedAgent)

  // 获取历史聊天记录
  useEffect(() => {
    const fetchChatHistory = async (agent: string) => {
      try {
        const response = await fetch(`/api/chat?agent=${agent}`)
        if (response.ok) {
          const data = await response.json()
          setChatHistory(prev => ({
            ...prev,
            [agent]: data.history || []
          }))
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error)
      }
    }

    // 获取所有智能体的历史记录
    const agentIds = ['process-analysis', 'component-selection', 'cost-calculation']
    agentIds.forEach(fetchChatHistory)
  }, [])

  // 当conversationHistory变化时刷新历史记录（用于检测新对话的创建）
  useEffect(() => {
    const refreshHistory = async () => {
      try {
        const response = await fetch(`/api/chat?agent=${selectedAgent}`)
        if (response.ok) {
          const data = await response.json()
          setChatHistory(prev => ({
            ...prev,
            [selectedAgent]: data.history || []
          }))
        }
      } catch (error) {
        console.error('Failed to refresh chat history:', error)
      }
    }

    // 当对话历史有变化时刷新当前智能体的历史记录
    if (conversationHistory && Object.keys(conversationHistory).length > 0) {
      refreshHistory()
    }
  }, [conversationHistory, selectedAgent])

  // 当选择智能体时展开对应的历史记录
  useEffect(() => {
    setExpandedAgent(selectedAgent)
  }, [selectedAgent])
  const agents = [
    {
      id: "process-analysis",
      name: "工艺需求分析",
      icon: Search,
      description: "分析工艺需求，制定技术规范",
    },
    {
      id: "component-selection",
      name: "组件智能选型",
      icon: Package,
      description: "智能推荐和选择合适的组件",
    },
    {
      id: "3d-design",
      name: "整线3D设计",
      icon: Wrench,
      description: "整体生产线3D建模设计",
    },
    {
      id: "cost-calculation",
      name: "部件成本核算",
      icon: Calculator,
      description: "计算和分析部件成本",
    },
  ]

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 顶部新建对话按钮 */}
      <div className="p-3 border-b border-gray-100">
        <Button 
          onClick={onNewConversation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          新建对话
        </Button>
      </div>

      {/* 智能体列表和历史记录 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">AI 智能体</h3>
          <div className="space-y-1">
            {agents.map((agent) => {
              const Icon = agent.icon
              const isSelected = selectedAgent === agent.id
              const isExpanded = expandedAgent === agent.id
              const agentHistory = chatHistory[agent.id] || []

              return (
                <div key={agent.id} className="space-y-1">
                  {/* 智能体主按钮 */}
                  <Button
                    variant={isSelected ? "default" : "ghost"}
                    className={`w-full justify-start p-3 h-auto ${
                      isSelected ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onAgentSelect(agent.id)
                      setExpandedAgent(isExpanded ? null : agent.id)
                    }}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{agent.name}</div>
                        <div className={`text-xs mt-1 ${
                          isSelected ? "text-blue-100" : "text-gray-500"
                        }`}>
                          {agent.description}
                        </div>
                      </div>
                    </div>
                  </Button>

                  {/* 历史聊天记录 - 整线3D设计不显示历史记录 */}
                  {isExpanded && agentHistory.length > 0 && agent.id !== '3d-design' && (
                    <div className="ml-6 space-y-1 border-l border-gray-100 pl-2 pt-1">
                      <div className="text-xs text-gray-500 mb-2 px-2 font-medium">历史会话</div>
                      {agentHistory.map((conversation) => (
                        <button
                          key={conversation.id}
                          onClick={() => onConversationSelect?.(conversation.id)}
                          className={`w-full text-left p-2 rounded-lg text-sm transition-all duration-200 ${
                            selectedConversation === conversation.id
                              ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                              : "hover:bg-gray-50 text-gray-700 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <MessageSquare className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              selectedConversation === conversation.id ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium text-sm leading-tight">
                                {conversation.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatTime(conversation.updatedAt)}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* 空状态提示 - 整线3D设计不显示 */}
                  {isExpanded && agentHistory.length === 0 && agent.id !== '3d-design' && (
                    <div className="ml-6 px-2 py-3 text-xs text-gray-400 text-center border-l border-gray-100 pl-2">
                      暂无历史会话
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
