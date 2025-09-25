"use client"

import { useState } from "react"
import { Move3D } from "lucide-react"
import GlbViewer from "./glb-viewer"

export function ThreeDCanvas() {
  const [glbUrl, setGlbUrl] = useState("/models/CCFB25008-01-02-007.glb")

  return (
    <div className="relative w-full h-full">
      {/* 主要3D内容区域 */}
      <div className="h-full">
        {glbUrl ? (
          <GlbViewer glbUrl={glbUrl} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
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
                  <p>•点击"导入组件"添加3D模型</p>
                  <p>•使用"智能排布"自动布局</p>
                  <p>•通过"局部调整"精细调节</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
