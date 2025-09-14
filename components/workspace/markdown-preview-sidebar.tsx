"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, FileText, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
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
}

export function MarkdownPreviewSidebar({ 
  isOpen, 
  onClose, 
  attachments, 
  currentAttachmentId,
  onAttachmentChange 
}: MarkdownPreviewSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const currentAttachment = attachments.find(att => att.id === currentAttachmentId) || attachments[0]
  const currentIndex = attachments.findIndex(att => att.id === currentAttachment?.id)

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onAttachmentChange?.(attachments[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < attachments.length - 1) {
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownload}
            className="h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
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
        <div className="p-3 border-b border-gray-100 bg-blue-50">
          <h4 className="font-medium text-sm text-gray-900">{currentAttachment.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{currentAttachment.filename}</p>
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
