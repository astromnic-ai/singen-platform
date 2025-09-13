"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Upload,
  Send,
  FileText,
  Eye,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Database,
  Calculator,
  Cable as Cube,
  Settings,
  FileSearch,
} from "lucide-react"
import { UploadDialog } from "./upload-dialog"
import { DocumentReferenceSidebar } from "./document-reference-sidebar"
import { DocumentPreviewSidebar } from "./document-preview-sidebar"
import { ComponentParametersModal } from "./component-parameters-modal"
import { Bot } from "@/components/ui/bot"

interface ChatAreaProps {
  selectedAgent: string
  onRunClick: () => void
  showProcessSidebar: boolean
}

interface UploadedDocument {
  id: string
  name: string
  format: string
  size: string
}

interface OutputDocument {
  id: string
  name: string
  format: string
  size: string
  content: string
}

interface ChatMessage {
  type: "user" | "agent"
  content: string
  hasReferences?: boolean
  hasThinking?: boolean
  hasOutput?: boolean
  hasCostAnalysis?: boolean
  hasComponentOptions?: boolean
  isComponentQuestion?: boolean
}

interface AgentChatState {
  messages: ChatMessage[]
  uploadedDocuments: UploadedDocument[]
}

type SidebarType = "reference" | "preview" | null

export function ChatArea({ selectedAgent, onRunClick, showProcessSidebar }: ChatAreaProps) {
  const [message, setMessage] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)
  const [previewDocument, setPreviewDocument] = useState<OutputDocument | null>(null)
  const [showParametersModal, setShowParametersModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [conversationStep, setConversationStep] = useState(0)

  // 为每个智能体维护独立的聊天状态
  const [agentChatStates, setAgentChatStates] = useState<Record<string, AgentChatState>>({
    "process-analysis": { messages: [], uploadedDocuments: [] },
    "component-selection": { messages: [], uploadedDocuments: [] },
    "3d-design": { messages: [], uploadedDocuments: [] },
    "cost-calculation": { messages: [], uploadedDocuments: [] },
  })

  // 当前智能体的状态
  const currentChatState = agentChatStates[selectedAgent] || { messages: [], uploadedDocuments: [] }

  const agentDescriptions = {
    "process-analysis": "我是工艺需求分析智能体，专门负责分析工艺需求，制定明确的技术规范。",
    "component-selection": "我是组件智能选型智能体，可以根据您的需求智能推荐和选择最合适的组件。",
    "3d-design": "我是整线3D设计智能体，专注于整体生产线的3D建模和设计工作。",
    "cost-calculation": "我是部件成本核算智能体，可以为您计算和分析各种部件的成本。",
  }

  const outputDocuments: OutputDocument[] = [
    {
      id: "process-analysis-doc",
      name: "工艺需求分析文档",
      format: "markdown",
      size: "2.3MB",
      content: `# 工艺需求分析文档

## 1. 项目概述
本项目旨在对汽车天窗装配工艺进行全面分析，制定详细的技术规范和操作标准。

## 2. 工艺流程分析
### 2.1 主要工艺环节
- 天窗玻璃预处理
- 密封条安装
- 电机组件装配
- 功能测试验证

### 2.2 关键控制点
- 玻璃安装精度：±0.5mm
- 密封条压缩率：15-20%
- 电机扭矩：8-12Nm

## 3. 技术要求
### 3.1 设备要求
- 自动化程度：≥85%
- 生产节拍：≤45秒/件
- 设备可用率：≥95%

### 3.2 质量标准
- 产品合格率：≥99.5%
- 密封性能：IPX7级别
- 使用寿命：≥10万次开合

## 4. 风险评估
### 4.1 技术风险
- 玻璃破损风险：中等
- 密封失效风险：低
- 电机故障风险：低

### 4.2 应对措施
- 建立完善的质量检测体系
- 制定标准化操作流程
- 定期设备维护保养

## 5. 结论与建议
基于以上分析，建议采用模块化设计方案，确保工艺稳定性和产品质量。`,
    },
    {
      id: "questions-list",
      name: "待确认问题清单",
      format: "markdown",
      size: "1.1MB",
      content: `# 待确认问题清单

## 1. 技术规格确认
### 1.1 天窗规格
- [ ] 天窗尺寸规格是否已确定？
- [ ] 玻璃厚度要求是多少？
- [ ] 是否需要防夹功能？

### 1.2 生产要求
- [ ] 年产能目标是否为50万套？
- [ ] 生产班次安排如何？
- [ ] 是否需要24小时连续生产？

## 2. 设备配置确认
### 2.1 自动化设备
- [ ] 机械臂型号和规格
- [ ] 视觉检测系统要求
- [ ] 传输系统配置

### 2.2 检测设备
- [ ] 密封性检测方法
- [ ] 功能测试项目
- [ ] 数据采集要求

## 3. 质量标准确认
### 3.1 检验标准
- [ ] 外观质量标准
- [ ] 功能性能要求
- [ ] 可靠性测试标准

### 3.2 验收标准
- [ ] 设备验收标准
- [ ] 产品验收标准
- [ ] 文档交付要求

## 4. 项目管理确认
### 4.1 时间节点
- [ ] 设计完成时间
- [ ] 设备到货时间
- [ ] 调试完成时间

### 4.2 责任分工
- [ ] 技术负责人确认
- [ ] 质量负责人确认
- [ ] 项目经理确认

## 5. 其他事项
- [ ] 培训计划安排
- [ ] 备件清单确认
- [ ] 维护保养计划`,
    },
  ]

  // 更新当前智能体的消息
  const updateCurrentMessages = (newMessages: ChatMessage[]) => {
    setAgentChatStates((prev) => ({
      ...prev,
      [selectedAgent]: {
        ...prev[selectedAgent],
        messages: newMessages,
      },
    }))
  }

  // 更新当前智能体的上传文档
  const updateCurrentUploadedDocuments = (newDocuments: UploadedDocument[]) => {
    setAgentChatStates((prev) => ({
      ...prev,
      [selectedAgent]: {
        ...prev[selectedAgent],
        uploadedDocuments: newDocuments,
      },
    }))
  }

  const getComponentSelectionResponse = (userMessage: string, step: number) => {
    const lowerMessage = userMessage.toLowerCase()

    if (
      step === 0 &&
      (lowerMessage.includes("移栽机械手") || lowerMessage.includes("pcb") || lowerMessage.includes("smt"))
    ) {
      setConversationStep(1)
      return {
        type: "agent" as const,
        content: "已匹配移栽机械手组件，请问 PCB 板移栽时负载及取料方式如何？",
        isComponentQuestion: true,
      }
    } else if (step === 1 && (lowerMessage.includes("3kg") || lowerMessage.includes("夹爪"))) {
      setConversationStep(2)
      return {
        type: "agent" as const,
        content:
          "已为您找到匹配的方案。推荐行星轮移栽机械手机构，该机构可在 90 度旋转移栽时保持 PCB 板姿态不变，适配 3kg 内负载与夹爪取料，可匹配 SMT 分料工位需求。需要为您展示详情吗？",
        hasComponentOptions: true,
      }
    }

    return {
      type: "agent" as const,
      content: "我是组件智能选型智能体，已经收到您的需求，正在分析处理中。",
    }
  }

  const handleRun = () => {
    if (!message.trim()) return

    const newMessages = [...currentChatState.messages, { type: "user" as const, content: message }]
    updateCurrentMessages(newMessages)
    const currentMessage = message
    setMessage("")
    setIsRunning(true)
    onRunClick()

    // 模拟AI响应
    setTimeout(() => {
      let agentResponse: ChatMessage

      if (selectedAgent === "process-analysis") {
        agentResponse = {
          type: "agent",
          content: "我已经为您完成了《工艺需求分析文档》以及《待确认问题清单》的编写。请查阅附件",
          hasReferences: true,
          hasThinking: true,
          hasOutput: true,
        }
      } else if (selectedAgent === "cost-calculation" && currentMessage.includes("评估附件中零部件的价格")) {
        agentResponse = {
          type: "agent",
          content: "我已经完成了对附件中零部件的价格评估分析。",
          hasCostAnalysis: true,
        }
      } else if (selectedAgent === "component-selection") {
        agentResponse = getComponentSelectionResponse(currentMessage, conversationStep)
      } else {
        agentResponse = {
          type: "agent",
          content: `我是${agentDescriptions[selectedAgent as keyof typeof agentDescriptions].split("，")[0]}，已经收到您的需求，正在分析处理中。`,
        }
      }

      updateCurrentMessages([...newMessages, agentResponse])
      setIsRunning(false)
    }, 1000)
  }

  const handleDocumentUpload = (files: File[]) => {
    const newDocs = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      format: file.name.split(".").pop()?.toUpperCase() || "FILE",
      size: (file.size / (1024 * 1024)).toFixed(1) + "MB",
    }))
    updateCurrentUploadedDocuments([...currentChatState.uploadedDocuments, ...newDocs])
  }

  const handlePreviewDocument = (doc: OutputDocument) => {
    setPreviewDocument(doc)
    setActiveSidebar("preview")
  }

  const handleShowReferences = () => {
    setActiveSidebar("reference")
  }

  const handleCloseSidebar = () => {
    setActiveSidebar(null)
    setPreviewDocument(null)
  }

  const removeUploadedDocument = (id: string) => {
    updateCurrentUploadedDocuments(currentChatState.uploadedDocuments.filter((doc) => doc.id !== id))
  }

  const handleCopyDocument = (docName: string) => {
    navigator.clipboard.writeText(`已复制文档：${docName}`)
    // 这里可以添加toast提示
  }

  const handleCopyCostAnalysis = () => {
    const costData = `零部件成本分析
原材料费用: ¥23.59
表面处理费用: ¥0.00
热处理费用: ¥0.00
加工价格费用: ¥86.77
零件单价: ¥110.36`
    navigator.clipboard.writeText(costData)
  }

  const getAgentButton = () => {
    switch (selectedAgent) {
      case "process-analysis":
        return (
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
            <Database className="w-4 h-4 mr-2" />
            工艺知识库管理
          </Button>
        )
      case "cost-calculation":
        return (
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
            <Calculator className="w-4 h-4 mr-2" />
            零部件批量报价
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className={`flex-1 flex ${activeSidebar ? "mr-0" : ""}`}>
      <div className="flex-1 flex flex-col">
        {/* 智能体介绍 */}
        <div className="p-6 bg-blue-50 border-b flex items-center justify-between">
          <p className="text-blue-800">{agentDescriptions[selectedAgent as keyof typeof agentDescriptions]}</p>
          {getAgentButton()}
        </div>

        {/* 对话区域 */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentChatState.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>开始与AI智能体对话，获取专业的设计建议</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentChatState.messages.map((msg, index) => (
                <div key={index}>
                  <Card className={msg.type === "user" ? "ml-12" : "mr-12"}>
                    <CardContent className="p-4">
                      <div
                        className={`flex items-start space-x-3 ${
                          msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            msg.type === "user" ? "bg-blue-600" : "bg-gray-600"
                          }`}
                        >
                          <span className="text-white text-sm">{msg.type === "user" ? "U" : "AI"}</span>
                        </div>
                        <div className="flex-1">
                          {/* 相关文档引用 */}
                          {msg.hasReferences && (
                            <div className="mb-4">
                              <button
                                onClick={handleShowReferences}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                📄 共找到 5 段相关工艺说明 &gt;
                              </button>
                            </div>
                          )}

                          {/* 深度思考模块 */}
                          {msg.hasThinking && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                              <div className="flex items-center mb-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-sm font-medium text-gray-700">深度思考</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                正在分析上传的工艺文档，提取关键技术要求和规范标准...
                                <br />
                                识别工艺流程中的关键控制点和质量要求...
                                <br />
                                生成标准化的工艺需求分析文档和问题清单...
                              </p>
                            </div>
                          )}

                          <p className="text-gray-900">{msg.content}</p>

                          {/* 组件选项 */}
                          {msg.hasComponentOptions && (
                            <div className="mt-4">
                              <hr className="border-gray-200 mb-4" />
                              <div className="space-y-3">
                                <button className="flex items-center space-x-3 text-left hover:bg-gray-50 p-2 rounded-lg w-full transition-colors">
                                  <Cube className="w-5 h-5 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-900">查看3D模型</span>
                                </button>
                                <button
                                  onClick={() => setShowParametersModal(true)}
                                  className="flex items-center space-x-3 text-left hover:bg-gray-50 p-2 rounded-lg w-full transition-colors"
                                >
                                  <Settings className="w-5 h-5 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-900">查看相关参数</span>
                                </button>
                                <button className="flex items-center space-x-3 text-left hover:bg-gray-50 p-2 rounded-lg w-full transition-colors">
                                  <FileSearch className="w-5 h-5 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-900">查看设计方案</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 成本分析内容 */}
                          {msg.hasCostAnalysis && (
                            <div className="mt-4 space-y-4">
                              {/* 3D图片展示 */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">零部件3D视图</h4>
                                <div className="flex justify-center">
                                  <img
                                    src="/3d-part-example.png"
                                    alt="零部件3D图"
                                    className="max-w-sm h-auto rounded-lg shadow-sm"
                                  />
                                </div>
                              </div>

                              {/* 零部件描述 */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">零部件描述</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  该零件是带多规格孔（含精密销孔）的小型固定件，结构含圆角设计，表面精度分区域控制（销孔更精密），需配合切割模板加工且有明确油漆颜色要求，核心用途是为设备组件提供定位与固定，适配中等精度的机械装配场景。
                                </p>
                              </div>

                              {/* 成本分析表格 */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">成本分析</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-3 font-medium text-gray-900">特征</th>
                                        <th className="text-right py-2 px-3 font-medium text-gray-900">原材料费用</th>
                                        <th className="text-right py-2 px-3 font-medium text-gray-900">表面处理费用</th>
                                        <th className="text-right py-2 px-3 font-medium text-gray-900">热处理费用</th>
                                        <th className="text-right py-2 px-3 font-medium text-gray-900">加工价格费用</th>
                                        <th className="text-right py-2 px-3 font-medium text-gray-900 bg-blue-50">
                                          零件单价
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="py-2 px-3 text-gray-700">价格</td>
                                        <td className="text-right py-2 px-3 text-gray-900">¥23.59</td>
                                        <td className="text-right py-2 px-3 text-gray-900">¥0.00</td>
                                        <td className="text-right py-2 px-3 text-gray-900">¥0.00</td>
                                        <td className="text-right py-2 px-3 text-gray-900">¥86.77</td>
                                        <td className="text-right py-2 px-3 font-semibold text-blue-600 bg-blue-50">
                                          ¥110.36
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* 操作按钮 */}
                              <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="sm" onClick={handleCopyCostAnalysis} className="h-8 px-2">
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <ThumbsUp className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <ThumbsDown className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* 输出文档卡片 */}
                          {msg.hasOutput && (
                            <div className="mt-4">
                              <div className="flex space-x-3 mb-3">
                                {outputDocuments.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border flex-1"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <FileText className="w-5 h-5 text-blue-600" />
                                      <div>
                                        <div className="font-medium text-sm text-gray-900">{doc.name}</div>
                                        <div className="text-xs text-gray-500">
                                          {doc.format} {doc.size}
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handlePreviewDocument(doc)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              {/* 操作按钮 */}
                              <div className="flex items-center space-x-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyDocument("工艺需求分析文档")}
                                  className="h-8 px-2"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <ThumbsUp className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <ThumbsDown className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <div className="p-6 border-t bg-white">
          {/* 已上传文档展示 - 优化样式 */}
          {currentChatState.uploadedDocuments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {currentChatState.uploadedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg border"
                  style={{
                    height: "32px",
                    width: "320px",
                    padding: "0 12px",
                  }}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-900 truncate">{doc.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadedDocument(doc.id)}
                    className="h-5 w-5 p-0 flex-shrink-0 ml-2"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-4">
            <div className="flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  currentChatState.uploadedDocuments.length > 0
                    ? "询问关于这篇文章的任何问题"
                    : "请输入您的设计需求或问题..."
                }
                className="min-h-[100px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleRun()
                  }
                }}
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowUploadDialog(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    上传文档
                  </Button>
                </div>
                <Button
                  onClick={handleRun}
                  disabled={!message.trim() || isRunning}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      运行中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      运行
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <UploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} onUpload={handleDocumentUpload} />
        <ComponentParametersModal open={showParametersModal} onOpenChange={setShowParametersModal} />
      </div>

      {/* 侧边栏 */}
      {activeSidebar === "reference" && <DocumentReferenceSidebar onClose={handleCloseSidebar} />}
      {activeSidebar === "preview" && previewDocument && (
        <DocumentPreviewSidebar document={previewDocument} onClose={handleCloseSidebar} />
      )}
    </div>
  )
}
