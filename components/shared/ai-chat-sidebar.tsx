"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { X, Send, ChevronLeft, ChevronRight } from "lucide-react"

interface AIChatSidebarProps {
  placeholder: string
  onClose: () => void
}

export function AIChatSidebar({ placeholder, onClose }: AIChatSidebarProps) {
  const [message, setMessage] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; content: string }>>([
    {
      type: "ai",
      content: "您好！我是AI助手，可以帮您解答关于文档的相关问题。请随时提问！",
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return

    setMessages((prev) => [
      ...prev,
      { type: "user", content: message },
      { type: "ai", content: "我已经收到您的问题，正在分析文档内容为您提供答案..." },
    ])
    setMessage("")
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-100 flex flex-col items-center justify-center">
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(false)} className="h-10 w-10 p-0">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <aside className="w-96 bg-white border-l border-gray-100 flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">AI 助手</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(true)} className="h-8 w-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 对话历史 */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <Card key={index} className={`${msg.type === "user" ? "ml-8 bg-blue-50" : "mr-8 bg-gray-50"} border-0`}>
            <CardContent className="p-3">
              <div className="flex items-start space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-600 text-white"
                  }`}
                >
                  {msg.type === "user" ? "U" : "AI"}
                </div>
                <p className="text-sm text-gray-900 flex-1">{msg.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-100">
        <div className="space-y-3">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] resize-none rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              发送
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
