"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SelectInputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SelectInputDialog({ open, onOpenChange }: SelectInputDialogProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const agentOutputs = [
    {
      id: "req-analysis-1",
      agent: "需求分析智能体",
      title: "汽车装配线需求分析报告",
      description: "包含详细的技术规范和设计要求",
      type: "文档",
    },
    {
      id: "component-1",
      agent: "组件选型智能体",
      title: "推荐组件清单",
      description: "已筛选的最优组件配置方案",
      type: "清单",
    },
    {
      id: "workstation-1",
      agent: "工位设计智能体",
      title: "工位布局设计图",
      description: "3D工位布局和操作流程图",
      type: "图纸",
    },
  ]

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleConfirm = () => {
    console.log("选择的输入:", selectedItems)
    setSelectedItems([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>选择输入素材</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {agentOutputs.map((output) => (
            <Card key={output.id} className="cursor-pointer hover:bg-gray-50">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedItems.includes(output.id)}
                    onCheckedChange={() => handleItemToggle(output.id)}
                  />
                  <div className="flex-1">
                    <CardTitle className="text-sm">{output.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">{output.agent}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{output.type}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pl-9">
                <p className="text-sm text-gray-600">{output.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-gray-600">已选择 {selectedItems.length} 项</span>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleConfirm} disabled={selectedItems.length === 0}>
              确认选择
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
