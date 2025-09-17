"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ExternalLink, Settings } from "lucide-react"

interface ComponentInfoSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function ComponentInfoSidebar({ isCollapsed, onToggleCollapse }: ComponentInfoSidebarProps) {
  const [parameters, setParameters] = useState({
    length: "1200",
    width: "800",
    height: "300",
    direction: "方向1",
    coreSpec: "负载3kg",
    motorModel: "点击1",
  })

  const handleParameterChange = (key: string, value: string) => {
    setParameters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleConfirm = () => {
    console.log("确认参数:", parameters)
    // 这里可以添加参数应用逻辑
  }

  const handleSupplierClick = () => {
    // 跳转到供应商页面
    window.open("https://supplier-example.com", "_blank")
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center justify-start pt-4">
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-10 w-10 p-0">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="mt-4 -rotate-90 text-xs text-gray-500 whitespace-nowrap">组件信息</div>
      </div>
    )
  }

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">组件信息</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {/* 基础信息 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-900">基础信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 组件描述 */}
            <div>
              <Label className="text-xs font-medium text-gray-700">组件描述</Label>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                皮带输送机是一种摩擦驱动以连续方式运输物料的机械设备，主要由机架、输送带、托辊、滚筒、张紧装置、传动装置等组成。适用于各种散状物料或成件物品的输送。
              </p>
            </div>

            {/* 基础规格 */}
            <div>
              <Label className="text-xs font-medium text-gray-700">基础规格</Label>
              <div className="text-sm text-gray-600 mt-1 space-y-1">
                <div className="flex justify-between">
                  <span>输送能力:</span>
                  <span>50-500 t/h</span>
                </div>
                <div className="flex justify-between">
                  <span>输送速度:</span>
                  <span>0.8-2.0 m/s</span>
                </div>
                <div className="flex justify-between">
                  <span>带宽范围:</span>
                  <span>500-2000 mm</span>
                </div>
                <div className="flex justify-between">
                  <span>输送距离:</span>
                  <span>≤100 m</span>
                </div>
              </div>
            </div>

            {/* 供应商信息 */}
            <div>
              <Label className="text-xs font-medium text-gray-700">供应商信息</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">德马工业设备有限公司</div>
                    <div className="text-xs text-gray-500 mt-1">专业输送设备制造商</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSupplierClick} className="h-8 bg-transparent">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    访问
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 可调整参数 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-900">可调整参数</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 尺寸参数 */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="length" className="text-xs font-medium text-gray-700">
                  长度
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="length"
                    type="number"
                    value={parameters.length}
                    onChange={(e) => handleParameterChange("length", e.target.value)}
                    className="pr-10 h-9"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-gray-500">mm</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="width" className="text-xs font-medium text-gray-700">
                  宽度
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="width"
                    type="number"
                    value={parameters.width}
                    onChange={(e) => handleParameterChange("width", e.target.value)}
                    className="pr-10 h-9"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-gray-500">mm</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="height" className="text-xs font-medium text-gray-700">
                  高度
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="height"
                    type="number"
                    value={parameters.height}
                    onChange={(e) => handleParameterChange("height", e.target.value)}
                    className="pr-10 h-9"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-gray-500">mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 选择参数 */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-gray-700">方向选择</Label>
                <Select
                  value={parameters.direction}
                  onValueChange={(value) => handleParameterChange("direction", value)}
                >
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="方向1">方向1</SelectItem>
                    <SelectItem value="方向2">方向2</SelectItem>
                    <SelectItem value="方向3">方向3</SelectItem>
                    <SelectItem value="方向4">方向4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-700">核心规格</Label>
                <Select value={parameters.coreSpec} onValueChange={(value) => handleParameterChange("coreSpec", value)}>
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="负载3kg">负载3kg</SelectItem>
                    <SelectItem value="负载5kg">负载5kg</SelectItem>
                    <SelectItem value="负载10kg">负载10kg</SelectItem>
                    <SelectItem value="负载20kg">负载20kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-700">电机型号</Label>
                <Select
                  value={parameters.motorModel}
                  onValueChange={(value) => handleParameterChange("motorModel", value)}
                >
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="点击1">点击1</SelectItem>
                    <SelectItem value="点击2">点击2</SelectItem>
                    <SelectItem value="点击3">点击3</SelectItem>
                    <SelectItem value="点击4">点击4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 确定按钮 */}
            <div className="pt-4">
              <Button onClick={handleConfirm} className="w-full bg-blue-600 hover:bg-blue-700 h-9">
                确定
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
