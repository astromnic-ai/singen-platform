"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Download, FileText, ChevronLeft, ChevronRight, ChevronsRight, Edit3, Eye, Save, RotateCcw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownAttachment {
  id: string
  title: string
  filename: string
  content?: string
}

interface MarkdownPreviewSidebarProps {
  isOpen: boolean
  onClose: () => void
  attachments: MarkdownAttachment[]
  currentAttachmentId?: string
  onAttachmentChange?: (id: string) => void
  onContentSave?: (id: string, content: string) => void
}

export function MarkdownPreviewSidebar({ 
  isOpen, 
  onClose, 
  attachments, 
  currentAttachmentId,
  onAttachmentChange,
  onContentSave
}: MarkdownPreviewSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")
  
  const currentAttachment = attachments.find(att => att.id === currentAttachmentId) || attachments[0]
  const currentIndex = attachments.findIndex(att => att.id === currentAttachment?.id)

  // 进入编辑模式时初始化编辑内容
  const handleStartEdit = () => {
    if (currentAttachment?.content) {
      setEditContent(currentAttachment.content)
      setIsEditing(true)
    }
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditContent("")
  }

  // 保存编辑
  const handleSaveEdit = () => {
    if (currentAttachment && onContentSave) {
      onContentSave(currentAttachment.id, editContent)
    }
    setIsEditing(false)
    setEditContent("")
  }

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing) return

      // Ctrl/Cmd + S 保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSaveEdit()
      }
      
      // Escape 取消编辑
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancelEdit()
      }
    }

    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing, editContent, currentAttachment])

  // 当切换附件时，如果正在编辑，退出编辑模式
  useEffect(() => {
    if (isEditing) {
      setIsEditing(false)
      setEditContent("")
    }
  }, [currentAttachmentId])

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // 如果正在编辑，先退出编辑模式
      if (isEditing) {
        setIsEditing(false)
        setEditContent("")
      }
      onAttachmentChange?.(attachments[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < attachments.length - 1) {
      // 如果正在编辑，先退出编辑模式
      if (isEditing) {
        setIsEditing(false)
        setEditContent("")
      }
      onAttachmentChange?.(attachments[currentIndex + 1].id)
    }
  }

  const handleDownload = () => {
    if (!currentAttachment || !currentAttachment.content) return
    
    const blob = new Blob([currentAttachment.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = currentAttachment.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center justify-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCollapsed(false)} 
          className="h-10 w-10 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <aside className="w-96 bg-white border-l border-gray-200 flex flex-col max-h-full">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900 text-sm">附件预览</h3>
          {attachments.length > 1 && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              {currentIndex + 1}/{attachments.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {attachments.length > 1 && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNext}
                disabled={currentIndex === attachments.length - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
          {/* 编辑模式切换按钮 */}
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSaveEdit}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                title="保存"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                title="取消"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleStartEdit}
                className="h-8 w-8 p-0"
                title="编辑"
                disabled={!currentAttachment?.content}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownload}
                className="h-8 w-8 p-0"
                title="下载"
              >
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCollapsed(true)} 
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 附件标题 */}
      {currentAttachment && (
        <div className={`p-3 border-b border-gray-100 ${isEditing ? 'bg-amber-50' : 'bg-blue-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm text-gray-900">{currentAttachment.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{currentAttachment.filename}</p>
            </div>
            {isEditing && (
              <div className="flex items-center space-x-1">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-700 font-medium">编辑模式</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 多个附件时的标签页 */}
      {attachments.length > 1 && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {attachments.map((attachment) => (
              <button
                key={attachment.id}
                onClick={() => onAttachmentChange?.(attachment.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap ${
                  attachment.id === currentAttachment?.id
                    ? "border-blue-500 text-blue-600 bg-white"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {attachment.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Markdown内容 */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentAttachment && currentAttachment.content ? (
          isEditing ? (
            /* 编辑模式 */
            <div className="h-full flex flex-col space-y-4">
              <div className="flex-1">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="在此编辑 Markdown 内容..."
                  className="h-full min-h-[400px] font-mono text-sm resize-none border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                />
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>支持 Markdown 语法 • Ctrl+S 保存 • Esc 取消</span>
                <span>{editContent.length} 字符</span>
              </div>
            </div>
          ) : (
            /* 预览模式 */
            <div className="prose prose-sm max-w-none prose-table:table-auto prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-50 prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-gray-300 text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-50">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {children}
                    </td>
                  ),
                  tr: ({ children }) => (
                    <tr className="even:bg-gray-50">
                      {children}
                    </tr>
                  )
                }}
              >
                {currentAttachment.content}
              </ReactMarkdown>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">暂无附件</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
