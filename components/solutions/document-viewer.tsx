"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Maximize, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Document } from "@/types/solution"
import dynamic from "next/dynamic"

// 动态导入预览组件，禁用 SSR
const PDFViewer = dynamic(() => import("./components/pdf-viewer"), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
})

const PPTViewer = dynamic(() => import("./components/ppt-viewer"), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
})

const ExcelViewer = dynamic(() => import("./components/excel-viewer"), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
})

const WordViewer = dynamic(() => import("./components/word-viewer"), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
})

interface DocumentViewerProps {
  selectedDocument: Document | null
  showAIChat: boolean
}

export function DocumentViewer({ selectedDocument, showAIChat }: DocumentViewerProps) {
  if (!selectedDocument) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gray-25 ${showAIChat ? "mr-0" : ""}`}>
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">请选择一个文档进行预览</p>
        </div>
      </div>
    )
  }

  // 根据文档类型渲染对应的预览组件
  const renderDocumentViewer = () => {
    switch (selectedDocument.type) {
      case 'pdf':
        return <PDFViewer fileUrl={selectedDocument.url} />
      case 'pptx':
        return <PPTViewer fileUrl={selectedDocument.url} />
      case 'excel':
        return <ExcelViewer fileUrl={selectedDocument.url} />
      case 'docx':
        return <WordViewer fileUrl={selectedDocument.url} />
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">不支持的文档类型: {selectedDocument.type}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={`flex-1 flex flex-col bg-gray-25 ${showAIChat ? "mr-0" : ""}`}>
      {/* 文档信息栏 */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <div>
              <span className="text-sm font-medium text-gray-900">{selectedDocument.name}</span>
              <span className="text-xs text-gray-500 ml-2">{selectedDocument.type.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3"
              onClick={() => selectedDocument.url && window.open(selectedDocument.url, '_blank')}
              disabled={!selectedDocument.url}
            >
              <Download className="w-4 h-4 mr-1" />
              下载
            </Button>
          </div>
        </div>
      </div>

      {/* 文档预览区域 */}
      <div className="flex-1 overflow-hidden">
        {renderDocumentViewer()}
      </div>
    </div>
  )
}
