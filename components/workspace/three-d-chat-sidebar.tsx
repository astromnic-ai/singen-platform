"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Send, FileText, X } from "lucide-react"
import { UploadDialog } from "./upload-dialog"
import { Bot } from "@/components/ui/bot"

interface ChatMessage {
  type: "user" | "agent"
  content: string
}

interface UploadedDocument {
  id: string
  name: string
  format: string
  size: string
}

interface ThreeDChatSidebarProps {
  messages: ChatMessage[]
  onSendMessage: () => void
  message: string
  setMessage: (message: string) => void
  isRunning: boolean
  uploadedDocuments: UploadedDocument[]
  onUploadDocuments: (files: File[]) => void
  onRemoveDocument: (id: string) => void
  showUploadDialog: boolean
  setShowUploadDialog: (show: boolean) => void
}

export function ThreeDChatSidebar({
  messages,
  onSendMessage,
  message,
  setMessage,
  isRunning,
  uploadedDocuments,
  onUploadDocuments,
  onRemoveDocument,
  showUploadDialog,
  setShowUploadDialog,
}: ThreeDChatSidebarProps) {
  return (
    <aside className="w-80 min-w-72 max-w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">设计助手</h3>
        <p className="text-sm text-gray-500 mt-1">与AI对话，获取3D设计建议</p>
      </div>

      {/* 对话历史 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm">开始与3D设计助手对话</p>
              <p className="text-xs text-gray-400 mt-1">询问设计建议或操作指导</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-100">
        {/* 已上传文档展示 */}
        {uploadedDocuments.length > 0 && (
          <div className="mb-4 space-y-2">
            {uploadedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                    <FileText className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 truncate">{doc.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDocument(doc.id)}
                  className="h-4 w-4 p-0 flex-shrink-0 ml-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="询问3D设计相关问题..."
            className="min-h-[80px] resize-none rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSendMessage()
              }
            }}
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => setShowUploadDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              上传
            </Button>
            <Button
              onClick={onSendMessage}
              disabled={!message.trim() || isRunning}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  发送中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  发送
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <UploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} onUpload={onUploadDocuments} />
    </aside>
  )
}
