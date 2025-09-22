"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronRight, FileText, Presentation, Table, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Solution, Document, TreeNode } from "@/types/solution"
import { useToast } from "@/hooks/use-toast"

interface SolutionNavigationProps {
  selectedSolution: string | null
  selectedDocument: Document | null
  onSolutionSelect: (solution: string) => void
  onDocumentSelect: (document: Document) => void
}

export function SolutionNavigation({
  selectedSolution,
  selectedDocument,
  onSolutionSelect,
  onDocumentSelect,
}: SolutionNavigationProps) {
  const [expandedSolutions, setExpandedSolutions] = useState<string[]>([])
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const { toast } = useToast()

  // 获取文档图标
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText
      case 'pptx':
        return Presentation
      case 'excel':
        return Table
      case 'docx':
        return FileText
      default:
        return FileText
    }
  }

  // 从后端获取方案列表
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/solutions')
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.message || '获取方案列表失败')
        }
        
        if (result.success) {
          setSolutions(result.data)
        } else {
          throw new Error(result.message || '获取方案列表失败')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取方案列表失败')
      } finally {
        setLoading(false)
      }
    }

    fetchSolutions()
  }, [])

  const toggleSolution = (solutionId: string) => {
    if (expandedSolutions.includes(solutionId)) {
      setExpandedSolutions(expandedSolutions.filter((id) => id !== solutionId))
    } else {
      setExpandedSolutions([...expandedSolutions, solutionId])
      onSolutionSelect(solutionId)
    }
  }

  const handleDocumentClick = (document: Document) => {
    onDocumentSelect(document)
  }

  const isSupportedFileType = (fileType: string) => {
    return ['pdf', 'pptx', 'excel', 'docx'].includes(fileType)
  }

  const handleTreeFileClick = (node: TreeNode) => {
    if (node.kind !== 'file') return
    const fileType = (node.fileType || '').toLowerCase()
    if (isSupportedFileType(fileType) && node.url) {
      onDocumentSelect({
        id: node.id,
        name: node.name,
        type: fileType as Document['type'],
        url: node.url,
      })
    } else {
      toast({
        title: '暂不支持展示',
        description: `${node.name}（${node.fileType}）暂不支持在线预览`,
      })
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    )
  }

  const renderTree = (nodes: TreeNode[], depth = 0) => {
    return (
      <div className="space-y-0.5">
        {nodes.map((node) => {
          if (node.kind === 'folder') {
            const isOpen = expandedFolders.includes(node.id)
            return (
              <div key={node.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto text-left hover:bg-gray-50 rounded-lg truncate"
                  onClick={() => toggleFolder(node.id)}
                  style={{ paddingLeft: Math.min(depth * 12, 28) }}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-900 truncate">{node.name}</span>
                  </div>
                </Button>
                {isOpen && node.children?.length ? renderTree(node.children, depth + 1) : null}
              </div>
            )
          }
          // file
          const Icon = getDocumentIcon((node.fileType || '').toLowerCase())
          const isSelected = selectedDocument?.id === node.id
          return (
            <Card
              key={node.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50 border-gray-100'
              }`}
              onClick={() => handleTreeFileClick(node)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`text-sm font-medium cursor-pointer ${isSelected ? 'text-blue-900' : 'text-gray-900'} truncate`}
                          // style={{ paddingLeft: Math.min(depth * 12, 28) }}
                        >
                          {node.name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{node.name}</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                      {(node.fileType || '').toUpperCase()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <aside className="w-80 bg-white/50 backdrop-blur-sm border-r border-gray-100 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">方案列表</h2>
        
        {/* 加载状态 */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <div className="ml-6 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 方案列表 */}
        {!loading && !error && (
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
                      {/* 优先渲染树结构，如无则回退到扁平文档列表 */}
                      {solution.tree && solution.tree.length > 0 ? (
                        renderTree(solution.tree, 0)
                      ) : (
                        solution.documents.map((document) => {
                          const Icon = getDocumentIcon(document.type)
                          const isSelected = selectedDocument?.id === document.id
                          return (
                            <Card
                              key={document.id}
                              className={`cursor-pointer transition-all duration-200 ${
                                isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50 border-gray-100'
                              }`}
                              onClick={() => handleDocumentClick(document)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center space-x-3 min-w-0">
                                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                                  <div className="flex-1 min-w-0">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className={`text-sm font-medium cursor-pointer ${isSelected ? 'text-blue-900' : 'text-gray-900'} truncate`}>
                                          {document.name}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{document.name}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <div className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                                      {document.type.toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
