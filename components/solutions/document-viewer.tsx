"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Maximize, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight } from "lucide-react"

interface DocumentViewerProps {
  selectedDocument: string | null
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

  return (
    <div className={`flex-1 flex flex-col bg-gray-25 ${showAIChat ? "mr-0" : ""}`}>
      {/* 工具栏 */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">第 1 页 / 共 15 页</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Maximize className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 文档预览区域 */}
      <div className="flex-1 p-6 overflow-auto">
        <Card className="max-w-4xl mx-auto bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="aspect-[8.5/11] bg-white border border-gray-200 rounded-lg p-8">
              {/* 模拟文档内容 */}
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">C712-项目技术需求文档</h1>
                  <p className="text-gray-600">天窗自动化产线技术规格说明</p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">1. 项目概述</h2>
                  <p className="text-gray-700 leading-relaxed">
                    本项目旨在设计和实施一条完整的汽车天窗自动化装配产线，
                    包括天窗玻璃安装、密封条装配、电机安装等关键工艺环节。 产线设计需满足年产能50万套的生产要求。
                  </p>

                  <h2 className="text-lg font-semibold text-gray-900">2. 技术要求</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>自动化程度：≥85%</li>
                    <li>生产节拍：≤45秒/件</li>
                    <li>设备可用率：≥95%</li>
                    <li>产品合格率：≥99.5%</li>
                  </ul>

                  <h2 className="text-lg font-semibold text-gray-900">3. 工艺流程</h2>
                  <p className="text-gray-700 leading-relaxed">
                    产线包含以下主要工位：上料工位、预装配工位、主装配工位、
                    检测工位、下料工位。各工位间通过自动化传输系统连接。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 页面导航 */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex items-center justify-center space-x-4">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一页
          </Button>
          <span className="text-sm text-gray-600">1 / 15</span>
          <Button variant="ghost" size="sm">
            下一页
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
