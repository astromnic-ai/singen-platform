"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ExternalLink, RotateCcw, ZoomIn, ZoomOut, Move3D, Package } from "lucide-react"

interface ModelViewerProps {
  selectedCategory: string
  selectedModel: string | null
  showAIChat: boolean
}

export function ModelViewer({ selectedCategory, selectedModel, showAIChat }: ModelViewerProps) {
  const [activeTab, setActiveTab] = useState("self-developed")

  const breadcrumbs = [
    { name: "模型库", href: "#" },
    { name: "零部件模型", href: "#" },
    { name: "工艺组件", href: "#" },
  ]

  const components = [
    {
      id: "gripper-1",
      name: "气动夹爪",
      image: "/placeholder.svg?height=120&width=120",
      category: "工艺组件",
    },
    {
      id: "sensor-1",
      name: "位置传感器",
      image: "/placeholder.svg?height=120&width=120",
      category: "工艺组件",
    },
    {
      id: "actuator-1",
      name: "电动执行器",
      image: "/placeholder.svg?height=120&width=120",
      category: "工艺组件",
    },
    {
      id: "valve-1",
      name: "电磁阀",
      image: "/placeholder.svg?height=120&width=120",
      category: "工艺组件",
    },
    {
      id: "cylinder-1",
      name: "气缸",
      image: "/placeholder.svg?height=120&width=120",
      category: "工艺组件",
    },
    {
      id: "motor-1",
      name: "伺服电机",
      image: "/placeholder.svg?height=120&width=120",
      category: "工艺组件",
    },
  ]

  const renderProductionLineView = () => (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <Move3D className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">3D模型预览</p>
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button variant="ghost" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">天窗产线模型</h3>
            <p className="text-gray-600">
              完整的汽车天窗自动化装配产线3D模型，包含上料、预装配、主装配、检测、下料等关键工位。
              支持年产能50万套的生产要求，自动化程度达85%以上。
            </p>
            <div className="flex space-x-2">
              <Badge variant="secondary">自动化产线</Badge>
              <Badge variant="secondary">汽车制造</Badge>
              <Badge variant="secondary">天窗装配</Badge>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              在CAD中打开
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderWorkstationView = () => (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <Move3D className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">工位3D模型预览</p>
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button variant="ghost" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">上下料工位模型</h3>
            <p className="text-gray-600">
              自动化上下料工位设计，配备机械臂、传感器和安全防护装置。 支持多种规格产品的自动上下料操作，节拍时间≤30秒。
            </p>
            <div className="flex space-x-2">
              <Badge variant="secondary">自动化工位</Badge>
              <Badge variant="secondary">机械臂</Badge>
              <Badge variant="secondary">上下料</Badge>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              在CAD中打开
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderComponentsView = () => (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="self-developed">自研</TabsTrigger>
          <TabsTrigger value="purchased">外购</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-4 gap-4">
            {components.map((component) => (
              <Card
                key={component.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white border border-gray-100"
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={component.image || "/placeholder.svg"}
                      alt={component.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-gray-900 text-center">{component.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderContent = () => {
    if (selectedCategory === "components") {
      return renderComponentsView()
    } else if (selectedCategory.includes("station")) {
      return renderWorkstationView()
    } else {
      return renderProductionLineView()
    }
  }

  return (
    <div className={`flex-1 flex flex-col bg-gray-25 ${showAIChat ? "mr-0" : ""}`}>
      {/* 面包屑导航 */}
      <div className="bg-white border-b border-gray-100 p-4">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className={index === breadcrumbs.length - 1 ? "text-gray-900 font-medium" : "text-gray-500"}>
                {crumb.name}
              </span>
              {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            </div>
          ))}
        </nav>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-6 overflow-auto">
        {selectedModel ? (
          renderContent()
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">请选择一个模型分类进行查看</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
