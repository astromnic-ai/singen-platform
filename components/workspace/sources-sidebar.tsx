"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ExternalLink, FileText, File, Image, Video, Archive, ChevronLeft, ChevronsRight } from "lucide-react"

interface SourceDocument {
  id: string
  title: string
  content: string
  fileType: 'pdf' | 'doc' | 'txt' | 'md' | 'image' | 'video' | 'other'
  url?: string
  preview?: string
  metadata?: {
    size?: string
    lastModified?: string
    author?: string
  }
}

interface SourcesSidebarProps {
  isOpen: boolean
  onClose: () => void
  sources: SourceDocument[]
  title?: string
}

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'pdf':
    case 'doc':
      return <FileText className="w-5 h-5 text-red-600" />
    case 'image':
      return <Image className="w-5 h-5 text-green-600" />
    case 'video':
      return <Video className="w-5 h-5 text-purple-600" />
    case 'md':
    case 'txt':
      return <File className="w-5 h-5 text-blue-600" />
    default:
      return <Archive className="w-5 h-5 text-gray-600" />
  }
}

const getFileTypeLabel = (fileType: string) => {
  const typeMap = {
    'pdf': 'PDF文档',
    'doc': 'Word文档',
    'txt': '文本文件',
    'md': 'Markdown文档',
    'image': '图片文件',
    'video': '视频文件',
    'other': '其他文件'
  }
  return typeMap[fileType as keyof typeof typeMap] || '未知类型'
}

export function SourcesSidebar({ 
  isOpen, 
  onClose, 
  sources, 
  title = "相关文档引用" 
}: SourcesSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

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
          <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
          {sources.length > 0 && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              {sources.length} 个文档
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
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

      {/* 文档列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {sources.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">暂无相关文档</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sources.map((source) => (
              <div
                key={source.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white relative"
              >
                {/* 文档头部信息 */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(source.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                      {source.title}
                    </h4>
                  </div>
                </div>

                {/* 内容预览 */}
                {source.preview && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
                      {source.preview}
                    </p>
                  </div>
                )}

                {/* 元数据 */}
                {source.metadata && (
                  <div className="mb-3 space-y-1">
                    {source.metadata.author && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">作者：</span>
                        {source.metadata.author}
                      </div>
                    )}
                    {source.metadata.lastModified && (
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">修改时间：</span>
                        {source.metadata.lastModified}
                      </div>
                    )}
                  </div>
                )}

                {/* 底部区域：文件类型标签和操作按钮 */}
                <div className="flex items-center justify-between">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                    {getFileTypeLabel(source.fileType)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (source.url) {
                        window.open(source.url, '_blank')
                      }
                    }}
                    disabled={!source.url}
                    className="text-xs h-7"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    查看原文
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
