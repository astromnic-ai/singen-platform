"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronRight, FileText, Presentation, Table } from "lucide-react"

interface SolutionNavigationProps {
  selectedSolution: string | null
  selectedDocument: string | null
  onSolutionSelect: (solution: string) => void
  onDocumentSelect: (document: string) => void
}

export function SolutionNavigation({
  selectedSolution,
  selectedDocument,
  onSolutionSelect,
  onDocumentSelect,
}: SolutionNavigationProps) {
  const [expandedSolutions, setExpandedSolutions] = useState<string[]>([])

  const solutions = [
    {
      id: "C712",
      name: "C712-天窗自动化产线方案",
      documents: [
        {
          id: "C712-req",
          name: "C712-项目技术需求文档",
          type: "docx",
          icon: FileText,
        },
        {
          id: "C712-design",
          name: "C712-项目技术设计方案",
          type: "pptx",
          icon: Presentation,
        },
        {
          id: "C712-assembly",
          name: "C712-项目产线装配方案",
          type: "pptx",
          icon: Presentation,
        },
        {
          id: "C712-bom",
          name: "C712-项目BOM清单",
          type: "excel",
          icon: Table,
        },
      ],
    },
    {
      id: "A508",
      name: "A508-座椅装配线方案",
      documents: [
        {
          id: "A508-req",
          name: "A508-项目技术需求文档",
          type: "docx",
          icon: FileText,
        },
        {
          id: "A508-design",
          name: "A508-项目技术设计方案",
          type: "pptx",
          icon: Presentation,
        },
      ],
    },
    {
      id: "B203",
      name: "B203-内饰自动化方案",
      documents: [
        {
          id: "B203-req",
          name: "B203-项目技术需求文档",
          type: "docx",
          icon: FileText,
        },
        {
          id: "B203-design",
          name: "B203-项目技术设计方案",
          type: "pptx",
          icon: Presentation,
        },
        {
          id: "B203-bom",
          name: "B203-项目BOM清单",
          type: "excel",
          icon: Table,
        },
      ],
    },
  ]

  const toggleSolution = (solutionId: string) => {
    if (expandedSolutions.includes(solutionId)) {
      setExpandedSolutions(expandedSolutions.filter((id) => id !== solutionId))
    } else {
      setExpandedSolutions([...expandedSolutions, solutionId])
      onSolutionSelect(solutionId)
    }
  }

  const handleDocumentClick = (documentId: string) => {
    onDocumentSelect(documentId)
  }

  return (
    <aside className="w-80 bg-white/50 backdrop-blur-sm border-r border-gray-100 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">方案列表</h2>
        <div className="space-y-2">
          {solutions.map((solution) => {
            const isExpanded = expandedSolutions.includes(solution.id)

            return (
              <div key={solution.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto text-left hover:bg-gray-50 rounded-lg"
                  onClick={() => toggleSolution(solution.id)}
                >
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="font-medium text-sm">{solution.name}</span>
                  </div>
                </Button>

                {isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {solution.documents.map((document) => {
                      const Icon = document.icon
                      const isSelected = selectedDocument === document.id

                      return (
                        <Card
                          key={document.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected ? "bg-blue-50 border-blue-200 shadow-sm" : "hover:bg-gray-50 border-gray-100"
                          }`}
                          onClick={() => handleDocumentClick(document.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                              <div className="flex-1">
                                <div
                                  className={`text-sm font-medium ${isSelected ? "text-blue-900" : "text-gray-900"}`}
                                >
                                  {document.name}
                                </div>
                                <div className={`text-xs ${isSelected ? "text-blue-600" : "text-gray-500"}`}>
                                  {document.type.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
