"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Plus } from "lucide-react"

interface CustomImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Component {
  id: string
  name: string
  image: string
  tags: string[]
  category: string
  subCategory: string
}

export function CustomImportDialog({ open, onOpenChange }: CustomImportDialogProps) {
  const [selectedPrimaryTab, setSelectedPrimaryTab] = useState("功能")
  const [selectedSecondaryTab, setSelectedSecondaryTab] = useState("传送")
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])

  const primaryTabs = ["设计主题", "行业", "功能", "作用件", "零部件"]

  const secondaryTabs = {
    功能: ["可调距离", "卷料", "打标", "加工组装", "定位", "紧固夹紧", "检测", "传送", "上下料", "翻转"],
    设计主题: ["现代工业", "传统制造", "智能化", "绿色环保"],
    行业: ["汽车制造", "电子制造", "机械加工", "食品包装"],
    作用件: ["驱动件", "传动件", "支撑件", "连接件"],
    零部件: ["标准件", "非标件", "电气件", "气动件"],
  }

  const components: Component[] = [
    {
      id: "conveyor-1",
      name: "皮带输送机",
      image: "/placeholder.svg?height=120&width=120&text=皮带输送机",
      tags: ["传送", "自动化"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-2",
      name: "链式输送机",
      image: "/placeholder.svg?height=120&width=120&text=链式输送机",
      tags: ["传送", "重载"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-3",
      name: "滚筒输送机",
      image: "/placeholder.svg?height=120&width=120&text=滚筒输送机",
      tags: ["传送", "高效"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-4",
      name: "螺旋输送机",
      image: "/placeholder.svg?height=120&width=120&text=螺旋输送机",
      tags: ["传送", "粉料"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-5",
      name: "气动输送机",
      image: "/placeholder.svg?height=120&width=120&text=气动输送机",
      tags: ["传送", "气动"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-6",
      name: "振动输送机",
      image: "/placeholder.svg?height=120&width=120&text=振动输送机",
      tags: ["传送", "振动"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-7",
      name: "柔性输送机",
      image: "/placeholder.svg?height=120&width=120&text=柔性输送机",
      tags: ["传送", "柔性"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-8",
      name: "转弯输送机",
      image: "/placeholder.svg?height=120&width=120&text=转弯输送机",
      tags: ["传送", "转弯"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-9",
      name: "提升输送机",
      image: "/placeholder.svg?height=120&width=120&text=提升输送机",
      tags: ["传送", "提升"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-10",
      name: "分拣输送机",
      image: "/placeholder.svg?height=120&width=120&text=分拣输送机",
      tags: ["传送", "分拣"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-11",
      name: "倾斜输送机",
      image: "/placeholder.svg?height=120&width=120&text=倾斜输送机",
      tags: ["传送", "倾斜"],
      category: "功能",
      subCategory: "传送",
    },
    {
      id: "conveyor-12",
      name: "模块化输送机",
      image: "/placeholder.svg?height=120&width=120&text=模块化输送机",
      tags: ["传送", "模块化"],
      category: "功能",
      subCategory: "传送",
    },
  ]

  const filteredComponents = components.filter(
    (component) => component.category === selectedPrimaryTab && component.subCategory === selectedSecondaryTab,
  )

  const toggleComponentSelection = (componentId: string) => {
    setSelectedComponents((prev) =>
      prev.includes(componentId) ? prev.filter((id) => id !== componentId) : [...prev, componentId],
    )
  }

  const handleConfirm = () => {
    console.log("选择的组件:", selectedComponents)
    onOpenChange(false)
    setSelectedComponents([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">自定义导入组件</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[calc(90vh-120px)]">
          {/* 一级标签 */}
          <div className="px-6 py-4 border-b">
            <div className="flex space-x-1">
              {primaryTabs.map((tab) => (
                <Button
                  key={tab}
                  variant={selectedPrimaryTab === tab ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setSelectedPrimaryTab(tab)
                    setSelectedSecondaryTab(secondaryTabs[tab as keyof typeof secondaryTabs][0])
                  }}
                  className={`rounded-lg ${
                    selectedPrimaryTab === tab
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          {/* 二级标签 */}
          <div className="px-6 py-3 border-b bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {secondaryTabs[selectedPrimaryTab as keyof typeof secondaryTabs]?.map((subTab) => (
                <Button
                  key={subTab}
                  variant={selectedSecondaryTab === subTab ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSecondaryTab(subTab)}
                  className={`rounded-full text-xs ${
                    selectedSecondaryTab === subTab
                      ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                      : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  {subTab}
                </Button>
              ))}
            </div>
          </div>

          {/* 组件展示区域 */}
          <div className="flex-1 p-6">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-6 gap-4 pr-4">
                {filteredComponents.map((component) => (
                  <div
                    key={component.id}
                    className={`relative cursor-pointer group transition-all duration-200 ${
                      selectedComponents.includes(component.id)
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => toggleComponentSelection(component.id)}
                  >
                    <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
                      {/* 选择指示器 */}
                      {selectedComponents.includes(component.id) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center z-10">
                          <Plus className="w-3 h-3 text-white rotate-45" />
                        </div>
                      )}

                      {/* 组件图片 */}
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={component.image || "/placeholder.svg"}
                          alt={component.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* 组件信息 */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900 text-center leading-tight">
                          {component.name}
                        </h4>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {component.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* 底部操作栏 */}
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">已选择 {selectedComponents.length} 个组件</div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={selectedComponents.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                确认导入 ({selectedComponents.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
