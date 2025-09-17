"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Maximize, Grid3X3, Eye } from "lucide-react"

export function ThreeDCanvas() {
  const [viewMode, setViewMode] = useState("perspective")

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 3D视图控制器 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* 视图模式切换 */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Button
          variant={viewMode === "perspective" ? "default" : "outline"}
          size="sm"
          className="bg-white/80 backdrop-blur-sm"
          onClick={() => setViewMode("perspective")}
        >
          透视图
        </Button>
        <Button
          variant={viewMode === "top" ? "default" : "outline"}
          size="sm"
          className="bg-white/80 backdrop-blur-sm"
          onClick={() => setViewMode("top")}
        >
          俯视图
        </Button>
        <Button
          variant={viewMode === "side" ? "default" : "outline"}
          size="sm"
          className="bg-white/80 backdrop-blur-sm"
          onClick={() => setViewMode("side")}
        >
          侧视图
        </Button>
      </div>

      {/* 网格显示控制 */}
      <div className="absolute bottom-4 left-4 z-10 flex space-x-2">
        <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
          <Grid3X3 className="w-4 h-4 mr-2" />
          显示网格
        </Button>
        <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
          <Eye className="w-4 h-4 mr-2" />
          显示轴线
        </Button>
      </div>

      {/* 主要3D内容区域 */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          {/* 3D场景占位符 */}
          <div className="w-96 h-64 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
            <div className="text-center">
              <Move3D className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg font-medium">3D设计画布</p>
              <p className="text-gray-400 text-sm mt-2">导入组件开始设计</p>
            </div>
          </div>

          {/* 快速操作提示 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">快速开始</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• 点击"导入组件"添加3D模型</p>
              <p>• 使用"智能排布"自动布局</p>
              <p>• 通过"局部调整"精细调节</p>
            </div>
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600">
          坐标: (0, 0, 0) | 缩放: 100% | 组件: 0
        </div>
      </div>
    </div>
  )
}
