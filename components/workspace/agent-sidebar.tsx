"use client"

import { Button } from "@/components/ui/button"
import { Search, Package, Wrench, Calculator } from "lucide-react"

interface AgentSidebarProps {
  selectedAgent: string
  onAgentSelect: (agent: string) => void
}

export function AgentSidebar({ selectedAgent, onAgentSelect }: AgentSidebarProps) {
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

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">AI 智能体</h3>
      <div className="space-y-2">
        {agents.map((agent) => {
          const Icon = agent.icon
          const isSelected = selectedAgent === agent.id

          return (
            <Button
              key={agent.id}
              variant={isSelected ? "default" : "ghost"}
              className={`w-full justify-start p-3 h-auto ${isSelected ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              onClick={() => onAgentSelect(agent.id)}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{agent.name}</div>
                  <div className={`text-xs mt-1 ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                    {agent.description}
                  </div>
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
