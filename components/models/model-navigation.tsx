"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Factory, Wrench, Package } from "lucide-react"

interface ModelNavigationProps {
  selectedCategory: string
  selectedModel: string | null
  onCategorySelect: (category: string) => void
  onModelSelect: (model: string) => void
}

export function ModelNavigation({
  selectedCategory,
  selectedModel,
  onCategorySelect,
  onModelSelect,
}: ModelNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["production-line"])

  const categories = [
    {
      id: "production-line",
      name: "产线模型",
      icon: Factory,
      subcategories: [
        { id: "sunroof-line", name: "天窗产线" },
        { id: "seat-line", name: "座椅产线" },
        { id: "interior-line", name: "内饰产线" },
        { id: "fixture-line", name: "夹具产线" },
      ],
    },
    {
      id: "workstation",
      name: "工位模型",
      icon: Wrench,
      subcategories: [
        { id: "loading-station", name: "上下料工位" },
        { id: "tightening-station", name: "拧紧工位" },
        { id: "transport-station", name: "传输工位" },
        { id: "oiling-station", name: "涂油工位" },
      ],
    },
    {
      id: "components",
      name: "零部件模型",
      icon: Package,
      subcategories: [
        { id: "process-components", name: "工艺组件" },
        { id: "auxiliary-components", name: "辅助组件" },
        { id: "connectors", name: "连接件" },
      ],
    },
  ]

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
  }

  const handleSubcategoryClick = (subcategoryId: string) => {
    onCategorySelect(subcategoryId)
    onModelSelect(subcategoryId)
  }

  return (
    <aside className="w-80 bg-white/50 backdrop-blur-sm border-r border-gray-100 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">模型分类</h2>
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isExpanded = expandedCategories.includes(category.id)

            return (
              <div key={category.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto text-left hover:bg-gray-50 rounded-lg"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                </Button>

                {isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    {category.subcategories.map((subcategory) => {
                      const isSelected = selectedCategory === subcategory.id

                      return (
                        <Button
                          key={subcategory.id}
                          variant="ghost"
                          className={`w-full justify-start p-2 h-auto text-left rounded-lg transition-all duration-200 ${
                            isSelected ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "hover:bg-gray-50 text-gray-600"
                          }`}
                          onClick={() => handleSubcategoryClick(subcategory.id)}
                        >
                          <span className="text-sm">{subcategory.name}</span>
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
