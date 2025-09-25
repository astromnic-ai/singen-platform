"use client"

import { useState } from "react"
import { ThreeDCanvas } from "./three-d-canvas"
import { ThreeDToolbar } from "./three-d-toolbar"
import { ThreeDChatSidebar } from "./three-d-chat-sidebar"
import { ComponentInfoSidebar } from "./component-info-sidebar"

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

interface ThreeDDesignAreaProps {
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

export function ThreeDDesignArea({
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
}: ThreeDDesignAreaProps) {
  const [isComponentInfoCollapsed, setIsComponentInfoCollapsed] = useState(false)

  return (
    <div className="flex-1 flex min-w-0">
      {/* 主要3D设计区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 智能体介绍 */}
        <div className="p-5 bg-purple-50 border-b">
          <p className="text-purple-800">我是整线3D设计智能体，专注于整体生产线的3D建模和设计工作。</p>
        </div>

        {/* 3D工具栏 */}
        <ThreeDToolbar />

        {/* 3D画布 */}
        <div className="flex-1">
          <ThreeDCanvas />
        </div>
      </div>

      {/* 组件信息侧边栏 */}
      <ComponentInfoSidebar
        isCollapsed={isComponentInfoCollapsed}
        onToggleCollapse={() => setIsComponentInfoCollapsed(!isComponentInfoCollapsed)}
      />

      {/* 右侧对话框 */}
      <ThreeDChatSidebar
        messages={messages}
        onSendMessage={onSendMessage}
        message={message}
        setMessage={setMessage}
        isRunning={isRunning}
        uploadedDocuments={uploadedDocuments}
        onUploadDocuments={onUploadDocuments}
        onRemoveDocument={onRemoveDocument}
        showUploadDialog={showUploadDialog}
        setShowUploadDialog={setShowUploadDialog}
      />
    </div>
  )
}
