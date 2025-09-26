"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ArrowRight } from "lucide-react"
import { UploadDialog } from "@/components/workspace/upload-dialog"
import Link from "next/link"

export function MainContent() {
  const [selectedAgent, setSelectedAgent] = useState("process-analysis")
  const [message, setMessage] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  const agents = [
    {
      id: "process-analysis",
      name: "工艺需求分析",
      icon: "📋",
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
      selectedColor: "bg-blue-100 border-blue-300 text-blue-800 shadow-md",
    },
    {
      id: "component-selection",
      name: "组件智能选型",
      icon: "🔧",
      color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
      selectedColor: "bg-green-100 border-green-300 text-green-800 shadow-md",
    },
    {
      id: "3d-design",
      name: "整线3D设计",
      icon: "🏭",
      color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
      selectedColor: "bg-purple-100 border-purple-300 text-purple-800 shadow-md",
    },
    {
      id: "cost-calculation",
      name: "部件成本核算",
      icon: "💰",
      color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
      selectedColor: "bg-orange-100 border-orange-300 text-orange-800 shadow-md",
    },
  ]

  const selectedAgentData = agents.find((agent) => agent.id === selectedAgent)
  const selectedAgentName = selectedAgentData?.name || "工艺需求分析"

  return (
    <main className="flex-1 bg-gray-25 min-h-[calc(100vh-56px)] py-12">
      <div className="max-w-5xl mx-auto px-8">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">SINGEN星匠多智能体设计</h1>
          <p className="text-lg text-gray-600 font-light">
            Hi，我是<span className="text-blue-600 font-medium">{selectedAgentName}</span>，让我帮助你开始今天的创造！
          </p>
        </div>

        {/* 对话框区域 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-10 w-[2/3]">
          <div className="p-8">
            <div className="relative mb-6">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder=""
                className="min-h-[140px] resize-none border-0 shadow-none text-base bg-gray-50/50 rounded-xl p-6 focus:bg-white focus:ring-1 focus:ring-blue-200"
              />
              {!message && (
                <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
                  请输入技术需求，或上传需求文档，让智能体帮你进行分析
                </div>
              )}
            </div>

            {/* 工具栏 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadDialog(true)}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传文档
                </Button>
              </div>
              <Link href={`/workspace?agent=${selectedAgent}&message=${encodeURIComponent(message || "")}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 shadow-sm">
                  开始对话
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 业务环节选择标题 */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">选择业务环节</h2>
        </div>

        {/* 智能体选择卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all duration-200 border-2 rounded-xl ${
                selectedAgent === agent.id ? agent.selectedColor : `${agent.color} border-gray-150`
              }`}
              onClick={() => setSelectedAgent(agent.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-3">{agent.icon}</div>
                <div className="font-medium text-sm leading-tight">{agent.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <UploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />
    </main>
  )
}
