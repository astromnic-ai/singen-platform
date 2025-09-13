"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, FolderPlus, FileText, Folder, Calendar, Tag } from "lucide-react"

interface KnowledgeContentProps {
  showAIChat: boolean
}

export function KnowledgeContent({ showAIChat }: KnowledgeContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const knowledgeItems = [
    {
      id: "folder-1",
      type: "folder",
      name: "工艺知识库",
      tags: ["工艺", "标准"],
      uploadTime: "2024-01-15",
      itemCount: 25,
    },
    {
      id: "doc-1",
      type: "document",
      name: "汽车装配工艺规范",
      tags: ["汽车", "装配", "工艺"],
      uploadTime: "2024-01-14",
      fileType: "PDF",
    },
    {
      id: "doc-2",
      type: "document",
      name: "机械臂操作手册",
      tags: ["机械臂", "操作", "手册"],
      uploadTime: "2024-01-13",
      fileType: "DOCX",
    },
    {
      id: "doc-3",
      type: "document",
      name: "质量检测标准",
      tags: ["质量", "检测", "标准"],
      uploadTime: "2024-01-12",
      fileType: "PDF",
    },
    {
      id: "doc-4",
      type: "document",
      name: "安全操作规程",
      tags: ["安全", "操作", "规程"],
      uploadTime: "2024-01-11",
      fileType: "DOCX",
    },
    {
      id: "doc-5",
      type: "document",
      name: "设备维护指南",
      tags: ["设备", "维护", "指南"],
      uploadTime: "2024-01-10",
      fileType: "PDF",
    },
    {
      id: "folder-2",
      type: "folder",
      name: "技术资料",
      tags: ["技术", "资料"],
      uploadTime: "2024-01-09",
      itemCount: 18,
    },
    {
      id: "doc-6",
      type: "document",
      name: "产线设计原则",
      tags: ["产线", "设计", "原则"],
      uploadTime: "2024-01-08",
      fileType: "PPTX",
    },
  ]

  const filteredItems = knowledgeItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className={`flex-1 flex flex-col bg-gray-25 ${showAIChat ? "mr-0" : ""}`}>
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-medium text-gray-900">知识库</h1>
            <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              上传文件
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
              <FolderPlus className="w-4 h-4 mr-2" />
              新建文件夹
            </Button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索项目名称和标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white border border-gray-100 rounded-xl"
            >
              <CardContent className="p-5">
                <div className="flex items-start space-x-3 mb-4">
                  {item.type === "folder" ? (
                    <Folder className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 truncate">{item.name}</h3>
                    {item.type === "folder" && <p className="text-xs text-gray-500 mt-1">{item.itemCount} 个项目</p>}
                    {item.type === "document" && <p className="text-xs text-gray-500 mt-1">{item.fileType}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.uploadTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
