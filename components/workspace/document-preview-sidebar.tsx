"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Edit, Download, Maximize } from "lucide-react"

interface DocumentPreviewSidebarProps {
  document: {
    id: string
    name: string
    format: string
    size: string
    content: string
  }
  onClose: () => void
}

export function DocumentPreviewSidebar({ document, onClose }: DocumentPreviewSidebarProps) {
  return (
    <aside className="w-1/2 bg-white border-l border-gray-200 flex flex-col">
      {/* 工具栏 */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{document.name}</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Maximize className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 文档内容 */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900">
                {document.content}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
